import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';

function Footer() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <footer className='bg-white py-8 bottom-0 w-full mt-10 hidden md:block'>
      <div className='container'>
        <div className='sm:grid sm:grid-cols-3 md:grid-cols-5 py-4 xl:p-0'>
          <div className='mb-4'>
            <div className='font-raleway text-black text-2xl pl-4 md:pl-0 flex gap-3 items-end mb-8'>
              <Link href='/search' className='hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none'>
                <span className='font-bold text-primary'>Fin</span>
                <span className=''>Ca</span>
              </Link>
              <div className='text-[11px] text-gray-500 leading-none mb-[3px]'>텔레그램 채널정보, 핀카</div>
            </div>
            <h2 className='font-bold text-base'>{t['contact-us']}</h2>
            <ul className='list-none mt-3 leading-7'>
              <li>
                <Link href='/'>{t['customer-support']}</Link>
              </li>
              <li>
                <Link href='mailto:jopaint@naver.com'>{t['email']}: jopaint@naver.com</Link>
              </li>
            </ul>
          </div>
          <div className='mb-4'>
            <h2 className='font-bold text-base'>{t['our-channels']}</h2>
            <ul className='list-none mt-3 leading-7'>
              <li>
                <Link href='https://t.me/comaps' target='_blank'>
                  코인 상승 얼럿 Coin Pump Alert
                </Link>
              </li>
            </ul>
          </div>
          <div className='mb-4'>
            <h2 className='font-bold text-base'>{t['our-bots']}</h2>
            <ul className='list-none mt-3 leading-7'>
              <li>
                <Link target='_blank' href='https://t.me/HHGYSBot'>
                  @HHGYSBot
                </Link>
              </li>
              <li>
                <Link target='_blank' href='https://t.me/cskitjopaint_bot'>
                  @cskitjopaint_bot
                </Link>
              </li>
              <li>
                <Link target='_blank' href='https://t.me/FinCategoryBot'>
                  @FinCategoryBot
                </Link>
              </li>
              <li>
                <Link target='_blank' href='https://t.me/GGFTSSBot'>
                  @GGFTSSBot
                </Link>
              </li>
            </ul>
          </div>
          <div className='mb-4'>
            <div id='histats_counter'></div>
          </div>
        </div>
        <div className='mt-0 md:mt-10 text-sm'>© 2023 Finca. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
