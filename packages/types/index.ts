import Stripe from "stripe";

interface BillingDetails {
  billingAddress?: Stripe.Address;
  paymentMethod?: Stripe.PaymentMethod[Stripe.PaymentMethod.Type];
}
export interface User {
  id: string;
  accountId: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  stripeCustomerId?: string | null;
  billing?: BillingDetails;
}

export interface Price {
  id: string;
  priceId: string;
  productId: string;
  active?: boolean;
  description?: string;
  unitAmount?: number;
  currency?: string;
  type?: "one_time" | "recurring";
  interval?: "day" | "week" | "month" | "year";
  intervalCount?: number;
  trialPeriodDays?: number;
  metadata?: Record<string, any>;
}
export interface Product {
  id: string;
  productId: string;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, any>;
}

export interface Subscription {
  subscriptionId: string;
  userId: string;
  priceId: string;
  status?:
    | "trialing"
    | "active"
    | "canceled"
    | "incomplete"
    | "incomplete_expired"
    | "past_due"
    | "unpaid";
  metadata?: Record<string, any>;
  quantity?: number;
  cancelAtPeriodEnd?: boolean;
  created: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  endedAt?: Date;
  cancelAt?: Date;
  canceledAt?: Date;
  trialStart?: Date;
  trialEnd?: Date;
  product?: Product;
  price?: Price;
}
