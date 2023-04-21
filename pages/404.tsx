import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';

export default function PageNotFound() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div className='flex flex-col pt-36 bg-gray-50'>
      <Head>
        <title>FinCategory - Add channel</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <div className='w-full md:flex xl:w-[1280px] mx-auto bg-[url("/404_bg.png")] bg-no-repeat bg-right'>
        <div className='flex flex-col w-1/2 gap-6 my-10'>
          <span className='font-bold'>404 error</span>
          <span className='font-semibold text-4xl'>We lost that page</span>
          <span className='font-semibold'>Sorry, the page you are looking for doesn't exist. Try searching our site:</span>
          <div className='flex gap-4'>
            <button onClick={() => router.back()} className='border-2 rounded-full w-fit px-4 py-2 font-semibold'>
              Go Back
            </button>
            <button onClick={() => router.push('/')} className='bg-primary text-white rounded-full w-fit px-4 py-2 font-semibold'>
              Take me Home
            </button>
          </div>
          <span className='font-semibold'>If you looking for the channel that doesn't exist our database feel free to add channel</span>
          <button onClick={() => router.push('/add')} className='bg-primary text-white rounded-full w-fit px-4 py-2 font-semibold'>
            Add Channel
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
