import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  return (
    <nav>
      <a href='#skip' className='sr-only focus:not-sr-only'>
        Skip to content
      </a>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='flex justify-between align-center flex-row py-4 md:py-6 relative'>
          <div className='flex flex-1 items-center'>
            <Link href='/'>
              <a aria-label='Logo'>{/* <Logo /> */}</a>
            </Link>
            <nav className='space-x-2 ml-6 hidden lg:block'>
              <Link href='/'>
                <a>Pricing</a>
              </Link>
              <Link href='/account'>
                <a>Account</a>
              </Link>
            </nav>
          </div>

          <div className='flex flex-1 justify-end space-x-8'>
            {session ? (
              <button onClick={() => signOut()}>
                <a>Sign out</a>
              </button>
            ) : (
              <Link href='/api/auth/signin'>
                <a>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
