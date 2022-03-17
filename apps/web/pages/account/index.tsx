import Spinner from "@/components/Spinner";
import Layout from "components/Layout";
import fetcher from "lib/fetcher";
import { useUser } from "lib/useUser";
import Link from "next/link";
import { userInfo } from "os";
import { useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const { subscription, user } = useUser();

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url } = await fetcher("/apis/main/payments/create-portal-link", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          return_url: window.location.href,
        }),
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className='bg-gradient-to-r from-sky-500 to-indigo-400'>
        <div className='max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
          <h1 className='text-3xl font-extrabold text-white sm:text-center sm:text-5xl'>
            Account
          </h1>
          <p className='mt-5 text-xl text-slate-100 sm:text-center sm:text-2xl max-w-2xl m-auto'>
            We partnered with Stripe for a simplified billing.
          </p>
          <h2 className='mt-10 text-2xl font-extrabold text-white sm:text-center sm:text-4xl'>
            {subscription ? "Your Plan" : "Currently no plan"}
          </h2>
          <div>
            {subscription ? (
              <div className='bg-white rounded-lg shadow-lg p-6 px-16 mt-4 max-w-10 text-center gap-2 flex flex-col'>
                <h3 className='text-2xl font-semibold'>
                  Currently on the {subscription.product.name} plan.
                </h3>
                <p className='pb-4 sm:pb-0'>
                  Manage your subscription on Stripe.
                </p>
                <button
                  type='button'
                  disabled={loading}
                  onClick={redirectToCustomerPortal}
                  className='flex items-center justify-center mt-8 w-full rounded-md py-2 text-sm font-semibold text-white text-center transition-all hover:scale-95 bg-slate-700'
                >
                  {loading && <Spinner />}
                  Open customer portal
                </button>
              </div>
            ) : (
              <Link href='/' passHref>
                <button
                  type='button'
                  className='flex items-center p-8 justify-center mt-8 w-full rounded-md py-2 text-sm font-semibold text-white text-center transition-all hover:scale-95 bg-slate-700'
                >
                  Pick a plan
                </button>
              </Link>
            )}
          </div>
          <h2 className='mt-10 text-2xl font-extrabold text-white sm:text-center sm:text-4xl'>
            Your Details
          </h2>
          <div className='mt-5 flex text-white flex-col gap-4 text-center'>
            <p className='text-lg text-slate-100'>
              <span className='font-semibold'>email:</span> {user?.email}
            </p>
            <p className='text-lg text-slate-100'>
              <span className='font-semibold'>name:</span> {user?.name}
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
