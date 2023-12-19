import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Layout = ({ children }: any) => {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='relative wrapper bg-gray-50'>
        <Link
          href='https://t.me/+tII7nl-XenU0NjA1'
          target='_blank'
          className='hidden md:block fixed right-10 bottom-10 rounded-full shadow-lg bg-primary p-3 group z-[9999]'
        >
          <ChatBubbleLeftEllipsisIcon className='h-6 text-white group-hover:animate-spin' />
        </Link>
        <Header />
        <main>
          <div className='container' id='main'>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
