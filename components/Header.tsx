import React, { useContext, useEffect, useState } from 'react';
import { Bars3Icon, ChevronDownIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import LanguageSelector from './LanguageSelector';
import { useData } from '../context/context';
import { BoardType } from '../typings';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Header = () => {
  const router = useRouter();
  const getPath = useRouter().pathname;
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getallboardslist`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const allBoards = await response.json();
      setAllBoards(allBoards.boards);
    };
    getBoards();
  }, []);

  return (
    <>
      <header className='bg-white z-20'>
        <div className='container'>
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
            <div className='hidden sm:flex gap-4 items-center'>
              <div>
                <LanguageSelector />
              </div>
              <div>
                {session?.user ? (
                  <button className='flex gap-1 items-center text-xs border borde-gray-200 rounded-full px-2 py-1'>
                    <UserCircleIcon className='h-4' />
                    {session?.user.nickname}
                  </button>
                ) : (
                  <Link
                    href='/member/signin'
                    className='bg-primary font-semibold text-white rounded-full py-1 px-5 text-sm hover:text-white'
                  >
                    {t['sign-in']}
                  </Link>
                )}
              </div>
            </div>
            {/* Mobile */}
            <div className='md:hidden'>
              <Bars3Icon className='h-7' />
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
              <li className='relative'>
                <button
                  className={`group ${getPath === '/board' ? activePath : normalPath}`}
                  onClick={() => setBoardsPopupMenuShow((prev) => !prev)}
                >
                  {t['board']}{' '}
                  {boardsPopupMenuShow ? (
                    <FaChevronUp size={12} className='group-hover:animate-bounce' />
                  ) : (
                    <FaChevronDown size={12} className='group-hover:animate-bounce' />
                  )}
                </button>
                {boardsPopupMenuShow && (
                  <div className='absolute left-4 top-11 min-w-[100px] z-20 bg-white border border-gray-200 rounded-lg shadow-md divide-y font-normal text-xs'>
                    <div>
                      <Link href='/board' className='block px-3 py-2'>
                        {t['view-all-articles']}
                      </Link>
                    </div>
                    {allBoards.map((board: BoardType) => (
                      <div key={board.id}>
                        <Link href={`/board/${board.name}`} className='block px-3 py-2'>
                          {board.title}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
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
