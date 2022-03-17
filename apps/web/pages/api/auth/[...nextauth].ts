import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user || !token.id) {
        // call nitric API to create customer
        const result = await fetch(
          `${process.env.API_BASE_URL}/apis/main/users`,
          {
            body: JSON.stringify(user),
            method: "POST",
          }
        ).then((res) => res.json());

        token.id = result.id;
        token.accountId = result.accountId;
      }

      return token;
    },
    async session({ session, token }) {
      const sess = {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
        },
      };

      return sess;
    },
  },
});
