import "../styles/globals.css";
// pages/_app.js
import { SessionProvider } from "next-auth/react";
import { UserContextProvider } from "lib/useUser";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </SessionProvider>
  );
}
