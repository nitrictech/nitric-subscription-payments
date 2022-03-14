import Layout from "components/Layout";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession();

  return (
    <Layout>
      {session ? (
        <>
          Signed in as {session.user.email} <br />
          {JSON.stringify(session, null, "\t")}
          status: {status}
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          <h1>Pricing Plans</h1>
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </Layout>
  );
}
