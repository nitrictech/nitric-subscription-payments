import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { NitricAdapter } from "@nitric/next-auth-adapter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      checks: "state",
    }),
  ],
  adapter: NitricAdapter(),
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token, user }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          // id: token.id as string,
          // role: token.role as string,
        },
      };

      return sess;
    },
  },
});
