import { NextSeo, NextSeoProps } from "next-seo";
import Navbar from "components/Navbar";
import Footer from "components/Footer";

interface Props {
  children: React.ReactNode;
  meta?: NextSeoProps;
}

export default function Layout({ children, meta }: Props) {
  return (
    <>
      <NextSeo
        title='Nitric Next.js Subscription Starter'
        description='Brought to you by Nitric, Next.js, NextAuth, and Stripe.'
        {...meta}
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
