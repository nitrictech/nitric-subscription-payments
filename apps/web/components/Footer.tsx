import Link from "next/link";

export default function Footer() {
  return (
    <footer className='mx-auto max-w-[1920px] px-6 '>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-slate-600 py-12 transition-colors duration-150'>
        <div className='col-span-1 lg:col-span-2'>
          <Link href='/'>
            <span>Company</span>
          </Link>
        </div>
        <div className='col-span-1 lg:col-span-2'>
          <ul className='flex flex-initial flex-col md:flex-1'>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  Home
                </a>
              </Link>
            </li>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  About
                </a>
              </Link>
            </li>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  Careers
                </a>
              </Link>
            </li>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  Blog
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='col-span-1 lg:col-span-2'>
          <ul className='flex flex-initial flex-col md:flex-1'>
            <li className='py-3 md:py-0 md:pb-4'>
              <p className='text-black font-bold hover:text-indigo-900 transition ease-in-out duration-150'>
                LEGAL
              </p>
            </li>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  Privacy Policy
                </a>
              </Link>
            </li>
            <li className='py-3 md:py-0 md:pb-4'>
              <Link href='/'>
                <a className='text-black hover:text-indigo-900 transition ease-in-out duration-150'>
                  Terms of Use
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className='col-span-1 lg:col-span-6 flex items-start lg:justify-end'>
          <div className='flex space-x-6 items-center h-10'>
            <a
              aria-label='Github Repository'
              href='https://github.com/nitrictech/nitric-subscription-payments'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22'></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className='py-12 flex flex-col md:flex-row justify-between items-center space-y-4'>
        <div>
          <span>&copy; 2022 Company, Inc. All rights reserved.</span>
        </div>
        <div className='flex items-center'>
          <span className='text-black'>Merged by</span>
          <a href='https://nitric.io' aria-label='Nitric.io Link'>
            <img
              src='/nitric.svg'
              alt='Nitric.io Logo'
              className='inline-block h-6 ml-4 text-black'
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
