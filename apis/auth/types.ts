import type {
  AdapterUser,
  AdapterSession,
  VerificationToken as NextVerificationToken,
} from "next-auth/adapters";
import type { Account as NextAccount } from "next-auth";

export type Account = NextAccount;

export type User = AdapterUser;

export type Session = AdapterSession;

export type VerificationToken = NextVerificationToken;
