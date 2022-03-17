import { Stripe } from "stripe";
import {
  mainApi,
  pricesCol,
  productsCol,
  subscriptionsCol,
  usersCol,
} from "../common/resources";
import { stripe } from "../common/utils";
import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange,
  createOrRetrieveCustomer,
} from "../common/payment-utils";
import { User } from "types";
import uuid from "short-uuid";
import { stripeWebhookSecret } from "../common/constants";

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// handles product, price, subscription and checkout stripe events
mainApi.post("/payments/webhooks", async (ctx) => {
  const buf = Buffer.from(ctx.req.data);
  const sig = ctx.req.headers["stripe-signature"];
  let event: Stripe.Event;

  try {
    if (!sig || !stripeWebhookSecret) {
      console.log("no sig or webhook secret");
      return;
    }
    event = stripe.webhooks.constructEvent(buf, sig, stripeWebhookSecret);
  } catch (err: any) {
    console.log(`Error message: ${err.message}`);
    ctx.res.status = 400;
    ctx.res.body = `Webhook Error: ${err.message}`;
    return ctx;
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case "product.created":
        case "product.updated":
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case "price.created":
        case "price.updated":
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer as string,
            event.type === "customer.subscription.created"
          );
          break;
        case "checkout.session.completed":
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error) {
      console.log(error);
      ctx.res.status = 400;
      ctx.res.body = 'Webhook error: "Webhook handler failed. View logs."';
      return ctx;
    }
  }

  ctx.res.json({ received: true });
});

// creates a stripe checkout session by creating or retrieving the stripe customer
mainApi.post("/payments/create-checkout-session", async (ctx) => {
  const {
    price,
    userId,
    email,
    quantity = 1,
    metadata = {},
    success_url,
    cancel_url,
  } = ctx.req.json();

  console.log("checkout for user " + userId);

  try {
    const customer = await createOrRetrieveCustomer({
      id: userId || "",
      email: email || "",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.priceId,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url,
      cancel_url,
    });

    return ctx.res.json({ sessionId: session.id });
  } catch (e) {
    console.log(e);
    ctx.res.status = 400;
    ctx.res.body = "Error creating checkout session";
    return ctx;
  }
});

// creates a portal link for the stripe customer to management their subscription
mainApi.post("/payments/create-portal-link", async (ctx) => {
  const { userId, email, return_url } = ctx.req.json();

  console.log("portal link for user " + userId);

  try {
    const customer = await createOrRetrieveCustomer({
      id: userId || "",
      email: email || "",
    });

    if (!customer) throw Error("Could not get customer");

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url,
    });

    return ctx.res.json({ url });
  } catch (e) {
    console.log(e);
    ctx.res.status = 400;
    ctx.res.body = "Error creating portal url";
    return ctx;
  }
});

// creates or updates a user, used in a next auth callback
mainApi.post("/users", async (ctx) => {
  const data = ctx.req.json() as User;

  const { id: accountId, ...userData } = data;

  const result = await usersCol
    .query()
    .where("accountId", "==", accountId)
    .limit(1)
    .fetch();

  if (!result.documents.length) {
    const id = uuid.generate();

    const newUser = {
      accountId,
      ...userData,
    };

    await usersCol.doc(id).set(newUser);

    return ctx.res.json(newUser);
  }

  const existingUser = result.documents[0];
  const updatedUser = {
    ...existingUser.content,
    ...userData,
  };

  await usersCol.doc(existingUser.id).set(updatedUser);

  console.log("updated user " + existingUser.id);

  return ctx.res.json({
    ...updatedUser,
    id: existingUser.id,
  });
});

// gets all active or trialing subscriptions for a user
mainApi.get("/users/:id/subscriptions", async (ctx) => {
  const { id } = ctx.req.params;

  const subs = await subscriptionsCol.query().where("userId", "==", id).fetch();

  // get prices
  const subsWithProductAndPrice = await Promise.all(
    subs.documents.map(async (s) => {
      const { priceId } = s.content;

      const priceResult = await pricesCol
        .query()
        .where("priceId", "==", priceId)
        .fetch();

      const price = {
        ...priceResult.documents[0].content,
        id: priceResult.documents[0].id,
      };

      const productResult = await productsCol
        .query()
        .where("productId", "==", price.productId)
        .fetch();

      const product = {
        ...productResult.documents[0].content,
        id: productResult.documents[0].id,
      };

      return {
        ...s.content,
        price,
        product,
      };
    })
  );

  return ctx.res.json(
    subsWithProductAndPrice.filter((s) =>
      ["active", "trialing"].includes(s.status)
    )
  );
});

// gets all active products and their prices
mainApi.get("/products", async (ctx) => {
  const products = await productsCol
    .query()
    .where("active", "==", true)
    .fetch();

  // get price

  const productsWithPrice = await Promise.all(
    products.documents.map(async (d) => {
      const prices = await pricesCol
        .query()
        .where("productId", "==", d.content.productId)
        .fetch();

      return {
        ...d.content,
        id: d.id,
        prices: prices.documents.map((p) => ({ ...p.content, id: p.id })),
      };
    })
  );

  ctx.res.json(productsWithPrice);
  return ctx;
});
