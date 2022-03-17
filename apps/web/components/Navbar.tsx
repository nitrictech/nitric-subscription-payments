import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useUser } from "lib/useUser";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className='bg-slate-50 shadow-lg'>
      <a href='#skip' className='sr-only focus:not-sr-only'>
        Skip to content
      </a>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='flex justify-between align-center flex-row py-4 md:py-6 relative'>
          <div className='flex flex-1 items-center'>
            <Link href='/'>
              <a aria-label='Logo'>{/* <Logo /> */}</a>
            </Link>
            <nav className='space-x-8 ml-6 hidden lg:block'>
              <Link href='/'>
                <a className='font-semibold hover:text-indigo-900'>Pricing</a>
              </Link>
              <Link href='/account'>
                <a className='font-semibold hover:text-indigo-900'>Account</a>
              </Link>
            </nav>
          </div>

          <div className='flex flex-1 justify-end space-x-4'>
            {user ? (
              <>
                <Link href='/account' passHref>
                  <a className='flex ring-indigo-400 ring-2 rounded-full'>
                    <Image
                      className='rounded-full'
                      src={user.image}
                      alt=''
                      height={30}
                      width={30}
                    />
                  </a>
                </Link>

                <button onClick={() => signOut()}>
                  <a className='font-semibold hover:text-indigo-900'>
                    Sign out
                  </a>
                </button>
              </>
            ) : (
              <Link href='/api/auth/signin'>
                <a className='font-semibold hover:text-indigo-900'>Sign in</a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
