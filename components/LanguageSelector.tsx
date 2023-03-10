import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useRef } from 'react';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

function LanguageSelector() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [isOpen, setIsOpen] = useState(false);

  const browseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: any) {
      if (browseRef.current && !browseRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, [isOpen]);

  const handleClick = (lang: string) => {
    router.push(router.asPath, router.asPath, { locale: lang });
    setIsOpen(false);
  };

  return (
    <div className='relative group'>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className='flex gap-1 min-w-[66px] items-center text-[12px] font-bold'
      >
        {locale !== 'en' ? (
          <>
            <Image src='/south-korea.png' width={20} height={20} alt='' />
            {t['korean']}
          </>
        ) : (
          <>
            <Image src='/united-states.png' width={20} height={20} alt='' />
            {t['english']}
          </>
        )}

        {!isOpen ? (
          <ChevronDownIcon className='h-3 group-hover:animate-bounce' />
        ) : (
          <ChevronUpIcon className='h-3' />
        )}
      </button>

      {isOpen && (
        <div
          className='absolute top-7 border shadow-md bg-white flex flex-col rounded-md w-[100px]'
          ref={browseRef}
        >
          <button
            className='flex gap-1 hover:bg-gray-50 py-1 pt-2 px-3 text-[12px] font-bold'
            onClick={() => handleClick('ko')}
          >
            <Image src='/south-korea.png' width={20} height={20} alt='' />
            {t['korean']}
          </button>
          <button
            className='flex gap-1 hover:bg-gray-50 py-1 pb-2 px-3 text-[12px] font-bold'
            onClick={() => handleClick('en')}
          >
            <Image src='/united-states.png' width={20} height={20} alt='' />
            {t['english']}
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
