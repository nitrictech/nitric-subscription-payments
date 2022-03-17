import { stripe, toDateTime } from "./utils";
import { Stripe } from "stripe";
import uuid from "short-uuid";
import {
  pricesCol,
  subscriptionsCol,
  usersCol,
  productsCol,
} from "./resources";
import { User } from "types";

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    productId: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: {
      ...product.metadata,
    },
  };

  console.log("upserting", JSON.stringify(productData, null, "\t"));

  const existing = await productsCol
    .query()
    .where("productId", "==", product.id)
    .limit(1)
    .fetch();

  const id = existing.documents.length
    ? existing.documents[0].id
    : uuid.generate();

  await productsCol.doc(id).set(productData);
  console.log(`Product inserted/updated: ${product.id}`);
};

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData = {
    priceId: price.id,
    productId: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? "",
    type: price.type,
    unitAmount: price.unit_amount ?? undefined,
    interval: price.recurring?.interval,
    intervalCount: price.recurring?.interval_count,
    trialPeriodDays: price.recurring?.trial_period_days,
    metadata: price.metadata,
  };

  console.log("upserting", JSON.stringify(priceData, null, "\t"));

  const existing = await pricesCol
    .query()
    .where("priceId", "==", price.id)
    .limit(1)
    .fetch();

  const id = existing.documents.length
    ? existing.documents[0].id
    : uuid.generate();

  await pricesCol.doc(id).set(priceData);

  console.log(`Product inserted/updated: ${price.id}`);
};

export const createOrRetrieveCustomer = async (
  data: Pick<User, "id" | "email">
) => {
  const user = await usersCol.doc(data.id).get();

  if (!user.stripeCustomerId) {
    // no stripe customer reference, let's add one.
    const customerData: { metadata: { userId: string }; email?: string } = {
      metadata: {
        userId: data.id,
      },
      email: data.email || "",
    };

    const customer = await stripe.customers.create(customerData);
    // update user doc to include customerId
    await usersCol.doc(data.id).set({
      ...user,
      stripeCustomerId: customer.id,
    });
    console.log(`New customer created and inserted for ${data.id}.`);
    return customer.id;
  }
  if (data) return user.stripeCustomerId;
};

export const copyBillingDetailsToCustomer = async (
  user: User,
  paymentMethod: Stripe.PaymentMethod
) => {
  const stripeCustomerId = paymentMethod.customer as string;
  const { name, phone, address } = paymentMethod.billing_details;

  if (!name || !phone || !address) return;

  await stripe.customers.update(stripeCustomerId, { name, phone, address });

  const { id, ...userWithoutId } = user;

  await usersCol.doc(user.id).set({
    ...userWithoutId,
    billing: {
      billingAddress: address,
      paymentMethod: paymentMethod[paymentMethod.type],
    },
  });
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const users = await usersCol
    .query()
    .where("stripeCustomerId", "==", customerId)
    .limit(1)
    .fetch();

  if (!users.documents.length) throw Error("No customer matching checkout id");

  const user = {
    ...users.documents[0].content,
    id: users.documents[0].id,
  };

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData = {
    subscriptionId: subscription.id,
    userId: user.id,
    metadata: subscription.metadata,
    status: subscription.status,
    priceId: subscription.items.data[0].price.id,
    // @ts-ignore
    quantity: subscription.quantity,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelAt: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceledAt: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    currentPeriodStart: toDateTime(subscription.current_period_start),
    currentPeriodEnd: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    endedAt: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trialStart: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trialEnd: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null,
  };

  const existing = await subscriptionsCol
    .query()
    .where("subscriptionId", "==", subscription.id)
    .limit(1)
    .fetch();

  const id = existing.documents.length
    ? existing.documents[0].id
    : uuid.generate();

  await subscriptionsCol.doc(id).set(subscriptionData);
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${user.id}]`
  );

  if (createAction && subscription.default_payment_method && user) {
    await copyBillingDetailsToCustomer(
      user,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
  }
};
