import { FC, useState } from "react";
import classNames from "classnames";
import type { Price } from "types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "lib/useUser";
import fetcher from "lib/fetcher";
import { getStripe } from "lib/stripe";
import Spinner from "./Spinner";

type BillingInterval = "month" | "year";

interface Props {
  products: any;
}

const Pricing: FC<Props> = ({ products }) => {
  const router = useRouter();
  const { user, subscription } = useUser();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.priceId);
    if (!user) {
      return router.push("/api/auth/signin");
    }

    if (subscription) {
      return router.push("/account");
    }

    try {
      const { sessionId } = await fetcher(
        "/apis/main/payments/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            price,
            userId: user.id,
            email: user.email,
            success_url: `${window.location.href}/account`,
            cancel_url: window.location.href,
          }),
        }
      );
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  return (
    <section className='bg-gradient-to-r from-sky-500 to-indigo-400'>
      <div className='max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8'>
        {!products.length ? (
          <p className='text-white'>
            No subscription products found. Create them in your{" "}
            <a
              className='text-slate-100 underline'
              href='https://dashboard.stripe.com/products'
              rel='noopener noreferrer'
              target='_blank'
            >
              Stripe Dashboard
            </a>
          </p>
        ) : (
          <>
            <div className='sm:flex sm:flex-col sm:align-center'>
              <h1 className='text-4xl font-extrabold text-white sm:text-center sm:text-6xl'>
                Pricing Plans
              </h1>
              <p className='mt-8 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto'>
                Get full access to 100+ APIs, plus any updates we release in the
                future. Pro plans unlock additional features.
              </p>
              <div className='relative self-center mt-6 bg-slate-50 rounded-lg p-0.5 flex sm:mt-8 border border-slate-100 shadow-lg'>
                <button
                  onClick={() => setBillingInterval("month")}
                  type='button'
                  className={`${
                    billingInterval === "month"
                      ? "relative w-1/2 bg-slate-700 border-slate-800 shadow-sm text-white"
                      : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setBillingInterval("year")}
                  type='button'
                  className={`${
                    billingInterval === "year"
                      ? "relative w-1/2 bg-slate-700 border-slate-800 shadow-sm text-white"
                      : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly billing
                </button>
              </div>
            </div>
            <div className='mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-auto'>
              {products.map((product) => {
                const price = product?.prices?.find(
                  (price) => price.interval === billingInterval
                );
                if (!price) return null;
                const priceString = new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: price.currency,
                  minimumFractionDigits: 0,
                }).format((price?.unitAmount || 0) / 100);

                const userHasSubscription =
                  product.name === subscription?.product?.name;

                return (
                  <div
                    key={product.id}
                    className={classNames(
                      "transition-colors rounded-lg shadow-lg divide-y divide-zinc-400 bg-slate-50",
                      {
                        "border-4 border-opacity-80 border-indigo-700":
                          userHasSubscription,
                      }
                    )}
                  >
                    <div className='p-6 text-center'>
                      <h2 className='text-2xl leading-6 font-bold text-slate-900'>
                        {product.name}
                      </h2>
                      <p className='mt-4 text-slate-700'>
                        {product.description}
                      </p>
                      <p className='mt-8'>
                        <span className='text-5xl font-extrabold text-slate-900'>
                          {priceString}
                        </span>
                        <span className='text-base font-medium text-slate-700'>
                          /{billingInterval}
                        </span>
                      </p>
                      <button
                        type='button'
                        disabled={priceIdLoading === price.priceId}
                        onClick={() => handleCheckout(price)}
                        className='flex items-center justify-center mt-8 w-full rounded-md py-2 text-sm font-semibold text-white text-center transition-all hover:scale-95 bg-slate-700'
                      >
                        {priceIdLoading === price.priceId && <Spinner />}
                        {userHasSubscription ? "Manage" : "Subscribe"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <p className='mt-24 text-s uppercase text-white text-center font-bold tracking-[0.35em]'>
                Brought to you by
              </p>
              <div className='flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-8 sm:grid-cols-5'>
                <div className='flex items-center justify-start'>
                  <a href='https://nextjs.org' aria-label='Next.js Link'>
                    <img
                      src='/nextjs.svg'
                      alt='Next.js Logo'
                      className='h-12 text-white'
                    />
                  </a>
                </div>
                <div className='flex items-center justify-start'>
                  <a href='https://vercel.com' aria-label='Vercel.com Link'>
                    <img
                      src='/vercel.svg'
                      alt='Vercel.com Logo'
                      className='h-6 text-white'
                    />
                  </a>
                </div>
                <div className='flex items-center justify-start'>
                  <a href='https://stripe.com' aria-label='stripe.com Link'>
                    <img
                      src='/stripe.svg'
                      alt='stripe.com Logo'
                      className='h-12 text-white'
                    />
                  </a>
                </div>
                <div className='flex items-center justify-start'>
                  <a href='https://nitric.io' aria-label='nitric.io Link'>
                    <img
                      src='/nitric-white.svg'
                      alt='nitric.io Logo'
                      className='h-8 text-white'
                    />
                  </a>
                </div>
                <div className='flex items-center justify-start'>
                  <a href='https://github.com' aria-label='github.com Link'>
                    <img
                      src='/github.svg'
                      alt='github.com Logo'
                      className='h-8 text-white'
                    />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Pricing;
