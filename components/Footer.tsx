import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'

function Footer() {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS
  return (
    <div className='bg-white py-8 bottom-0 absolute w-full'>
        <div className='mx-auto xl:max-w-7xl md:grid md:grid-cols-5'>
            <div>
                <div className='mb-8 font-raleway text-lg'>
                    <a href='/' className='hover:no-underline hover:text-current'>
                        <span className='font-bold text-primary'>Fin</span>
                        Category
                    </a>
                </div>
                <h2 className='font-bold text-base'>{t['contact-us']}</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='/'>{t['customer-support']}</Link></li>
                    <li><Link href='mailto:jopaint@naver.com'>{t['email']}: jopaint@naver.com</Link></li>
                </ul>
            </div>
            <div>
                <h2 className='font-bold text-base'>{t['our-channels']}</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='https://t.me/comaps' target='_blank'>코인 상승 얼럿 Coin Pump Alert</Link></li>
                </ul>
            </div>
            <div>
                <h2 className='font-bold text-base'>{t['our-bots']}</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='/'>@HHGYSBot</Link></li>
                    <li><Link href='/'>@cskitjopaint_bot</Link></li>
                    <li><Link href='/'>@FinCategoryBot</Link></li>
                    <li><Link href='/'>@GGFTSSBot</Link></li>
                </ul>
            </div>
        </div>
        <div className='mx-auto max-w-7xl mt-10 font-semibold'>
            © 2023 FinCategory. All Rights Reserved.
        </div>
    </div>
  )
}

export default Footer