import Stripe from "stripe";
import { stripeSecret } from "./constants";

export const stripe = new Stripe(stripeSecret, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: "2020-08-27",
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: "Nitric Subscription Starter",
    version: "0.1.0",
  },
});

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z"); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
