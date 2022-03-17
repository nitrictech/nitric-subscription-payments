require("dotenv").config();

export const stripeWebhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET_LIVE ??
  process.env.STRIPE_WEBHOOK_SECRET ??
  "";

export const stripeSecret =
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "";
