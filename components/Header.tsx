import React, { useContext, useEffect, useState } from 'react';
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import LanguageSelector from './LanguageSelector';
import { useData } from '../context/context';
import { Board } from '../typings';
import Link from 'next/link';

const Header = () => {
  const router = useRouter();
  const getPath = useRouter().pathname;
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  const { toggleSideBar, sideBar } = useData();

  const normalPath = 'px-5 py-3 font-bold text-[14px] hover:text-primary flex items-center gap-1';
  // const activePath = normalPath + ' border-b-2 border-primary';
  const activePath = normalPath + ' text-primary';

  const [searchField, setSearchField] = useState<string | null>(null);
  const [allBoards, setAllBoards] = useState([]);
  const [boardsPopupMenuShow, setBoardsPopupMenuShow] = useState(false);

  const handleSubmit = () => {
    console.log(searchField);
    if (searchField !== null) {
      router.replace(`/search?q=${searchField}`);
      //setSearchField(null)
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
      e.target.blur();
    }
  };

  useEffect(() => {
    const getBoards = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board`, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      });
      const allBoards = await response.json();
      setAllBoards(allBoards.boards);
    };
    getBoards();
  }, []);

  return (
    <>
      <header className=' bg-white z-20'>
        <div className='container mx-auto px-4'>
          <div className='flex pt-4 justify-between items-center border-b pb-4'>
            <div className='font-raleway text-lg'>
              <a href='/' className='hover:no-underline hover:text-current'>
                <span className='font-bold text-primary'>Fin</span>
                Category
              </a>
            </div>
            <div className='relative bg-neutral-100 items-center py-2 px-3 rounded-full hidden md:inline-flex group'>
              <MagnifyingGlassIcon className='h-5 text-neutral-500 group-hover:bg-white group-hover:rounded-full group-hover:p-1 group-hover:text-black transition-all' />
              <input
                type='text'
                value={searchField ?? ''}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={handleKeyDown}
                className='outline-none bg-neutral-100 pl-3 w-24 md:w-80 xl:w-96 text-sm'
              />
            </div>
            <div className='flex gap-4 items-center'>
              <div>
                <LanguageSelector />
              </div>
              <div>
                <button className='bg-primary font-semibold text-white rounded-full py-1 px-5 text-sm'>{t['sign-in']}</button>
              </div>
            </div>
          </div>
          <nav className='flex text-sm font-bold'>
            <ul className='flex'>
              <li className='hidden'>
                <button className={getPath === '/' ? activePath : normalPath} onClick={() => router.push('/')}>
                  {t['home']}
                </button>
              </li>
              <li className='hidden lg:block'>
                <button className={getPath === '/search' ? activePath : normalPath} onClick={() => router.push('/search')}>
                  {t['search']}
                </button>
              </li>
              <li className='lg:hidden'>
                <button
                  className={getPath === '/search' ? activePath : normalPath}
                  onClick={() => (getPath === '/add' ? router.push('/search') : toggleSideBar(true))}
                >
                  {t['search']}
                </button>
              </li>
            </ul>
            <button
              className={getPath === '/new-channel' ? activePath + ' ml-auto' : normalPath + ' ml-auto'}
              onClick={() => router.push('/add')}
            >
              {t['new-channel-registration']}
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
