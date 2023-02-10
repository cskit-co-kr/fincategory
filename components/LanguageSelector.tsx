import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import onClickOutside from "react-onclickoutside";

function LanguageSelector() {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS

  const [isOpen, setIsOpen] = useState(false)

  LanguageSelector.handleClickOutside = () => {
    setIsOpen(false);
  };

  return (
    <div className='relative'>
        <button
            onClick={() => setIsOpen((prev) => !prev)}
            className='flex gap-1 min-w-[66px] items-center text-[12px] font-bold'>
            {locale!=='en'
                ? <><Image src="/south-korea.png" width={20} height={20} alt="" />{t['korean']}</>
                : <><Image src="/united-states.png" width={20} height={20} alt="" />{t['english']}</>
            }
            
            {!isOpen ? (
                <ChevronDownIcon className='h-3' />
            ) : (
                <ChevronUpIcon className='h-3' />
            )}
        </button>

        {isOpen && (
            <div className='absolute top-7 border shadow-md bg-white flex flex-col rounded-md w-[100px]'>
                <button 
                    className='flex gap-1 hover:bg-gray-50 py-1 pt-2 px-3 text-[12px] font-bold'
                    onClick={() => router.push( router.asPath, router.asPath, {locale: 'ko'})}
                >
                    <Image src="/south-korea.png" width={20} height={20} alt="" />
                    {t['korean']}
                </button>
                <button 
                    className='flex gap-1 hover:bg-gray-50 py-1 pb-2 px-3 text-[12px] font-bold'
                    onClick={() => router.push(router.asPath, router.asPath, {locale: 'en'})}
                >
                    <Image src="/united-states.png" width={20} height={20} alt="" />
                    {t['english']}
                </button>
            </div>
        )}
    </div>
  )
}

const clickOutsideConfig = {
    handleClickOutside: () => LanguageSelector.handleClickOutside,
  };
  
  export default onClickOutside(LanguageSelector, clickOutsideConfig);