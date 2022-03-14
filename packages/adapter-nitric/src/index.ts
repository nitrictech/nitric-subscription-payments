import { Account } from "next-auth";

import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import fetcher, { stripUndefined } from "./utils";

export interface NitricAdapterOptions {
  urls?: {
    users: string;
    accounts: string;
    sessions: string;
    verificationTokens: string;
  };
}

export const defaultUrls: Required<Required<NitricAdapterOptions>["urls"]> = {
  users: "/apis/auth/users",
  accounts: "/apis/auth/accounts",
  sessions: "/apis/auth/sessions",
  verificationTokens: "/apis/auth/verification_tokens",
};

export function NitricAdapter(options?: NitricAdapterOptions): Adapter {
  const { urls = defaultUrls } = options || {};

  return {
    async createUser(data) {
      const user = await fetcher<AdapterUser>(urls.users, {
        body: JSON.stringify(stripUndefined(data)),
        method: "POST",
      });

      return user;
    },
    async getUser(id) {
      const user = await fetcher<AdapterUser>(`${urls.users}?id=${id}`);
      if (!user) return null;
      return user;
    },
    async getUserByEmail(email) {
      const user = await fetcher<AdapterUser>(`${urls.users}?email=${email}`);
      if (!user) return null;
      return user;
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const account = await fetcher<Account>(
        `${urls.accounts}?provider=${provider}&provider_account_id=${providerAccountId}`
      );
      if (!account) return null;
      const user = await fetcher<AdapterUser>(
        `${urls.users}?id=${account.userId}`
      );
      if (!user) return null;
      return user;
    },
    async updateUser(data) {
      const user = await fetcher<AdapterUser>(`${urls.users}/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(stripUndefined(data)),
      });

      return user;
    },
    async deleteUser(id) {
      await fetcher(`${urls.users}/${id}`, { method: "DELETE" });
    },
    linkAccount: async (data) => {
      const account = await fetcher<Account>(urls.accounts, {
        body: JSON.stringify(stripUndefined(data)),
        method: "POST",
      });

      return account;
    },
    async unlinkAccount(provider_providerAccountId) {
      await fetcher(urls.accounts, {
        method: "DELETE",
        body: JSON.stringify(provider_providerAccountId),
      });
    },
    async getSessionAndUser(sessionToken) {
      const session = await fetcher<AdapterSession>(
        `${urls.sessions}/${sessionToken}`
      );
      if (!session) return null;
      const user = await fetcher(`${urls.users}?id=${session.userId}`);
      if (!user) return null;
      return {
        user,
        session: {
          ...session,
          expires: new Date(session.expires),
        },
      };
    },
    async createSession(data) {
      const session = await fetcher(urls.sessions, {
        method: "POST",
        body: JSON.stringify(stripUndefined(data)),
      });

      return {
        ...session,
        expires: new Date(session.expires),
      };
    },
    async updateSession(data) {
      const updatedSession = await fetcher(`${urls.sessions}/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(stripUndefined(data)),
      });

      return {
        ...updatedSession,
        expires: new Date(updatedSession.expires),
      };
    },
    async deleteSession(sessionToken) {
      await fetcher(`${urls.sessions}/${sessionToken}`, {
        method: "DELETE",
      });
    },
    async createVerificationToken(data) {
      await fetcher(urls.verificationTokens, {
        method: "POST",
        body: JSON.stringify(stripUndefined(data)),
      });
      return data;
    },
    async useVerificationToken({ identifier, token }) {
      const verificationToken = await fetcher(
        `${urls.verificationTokens}?identifier=${identifier}&token=${token}`
      );

      if (!verificationToken) return null;

      return verificationToken;
    },
  };
}
