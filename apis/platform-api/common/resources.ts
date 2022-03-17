import { api, collection } from "@nitric/sdk";
import { User, Product, Price, Subscription } from "types";

export const usersCol = collection<Omit<User, "id">>("users").for(
  "reading",
  "writing",
  "deleting"
);

export const subscriptionsCol = collection<Omit<Subscription, "id">>(
  "subscriptions"
).for("reading", "writing", "deleting");

export const productsCol = collection<Omit<Product, "id">>("products").for(
  "reading",
  "writing",
  "deleting"
);

export const pricesCol = collection<Omit<Price, "id">>("prices").for(
  "reading",
  "writing",
  "deleting"
);

export const mainApi = api("main");
