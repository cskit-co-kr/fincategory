import React, { useContext, useEffect, useState, useRef } from 'react';
import { Bars3Icon, ChevronDownIcon, Cog6ToothIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import LanguageSelector from './LanguageSelector';
import { useData } from '../context/context';
import { BoardType, GroupType, MemberType } from '../typings';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Nav } from 'rsuite';

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
  const [userMenu, setUserMenu] = useState(false);

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

  const browseRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!userMenu) return;
    function handleClick(event: any) {
      if (browseRef.current && !browseRef.current.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setUserMenu(false);
      }
    }
    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, [userMenu]);

  const [groups, setGroups] = useState([]);
  const [memberInfo, setMemberInfo] = useState<MemberType>();

  // Get Member Information
  const getMember = async () => {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const memberInfo = await responseMember.json();
    setMemberInfo(memberInfo);
  };

  useEffect(() => {
    const getGroups = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const result = await response.json();
      setGroups(result.groups);
    };
    getGroups();
  }, []);

  useEffect(() => {
    if (session?.user) {
      getMember();
    }
  }, [session]);

  function handleClick() {
    const element = document.getElementById('my-drawer-4');
    if (element) {
      element.click();
    }
  }

  return (
    <>
      {/* Mobile */}
      <div className='md:hidden drawer absolute top-4 z-50'>
        <input id='my-drawer-4' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content ml-auto pr-4'>
          {/* Page content here */}
          <label htmlFor='my-drawer-4' className=''>
            <Bars3Icon className='h-7' />
          </label>
        </div>
        <div className='drawer-side'>
          <label htmlFor='my-drawer-4' className='drawer-overlay'></label>
          <div className='menu p-5 w-80 bg-white'>
            <div className='grid'>
              {session?.user ? (
                <div className='flex flex-col gap-2 text-sm'>
                  <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
                    <UserCircleIcon className='h-6 text-black' />
                    <span className='font-semibold text-base'>
                      <Link href='/member/profile' className='flex gap-1' onClick={handleClick}>
                        {session?.user.nickname}
                        <Cog6ToothIcon className='h-4' />
                      </Link>
                    </span>
                    <button
                      onClick={() => {
                        signOut();
                        handleClick();
                      }}
                      className='bg-gray-100 rounded-full px-2 py-1 ml-auto'
                    >
                      {t['sign-out']}
                    </button>
                  </div>
                  <div className='gap-1.5 grid'>
                    <div className='flex'>
                      가입<div className='ml-auto'>{memberInfo?.member.created_at.substring(0, 10).replaceAll('-', '.')}</div>
                    </div>
                    <div className='flex'>
                      <Link href={`/board?member=${session?.user.nickname}&show=posts`} onClick={handleClick}>
                        내가 쓴 글 보기
                      </Link>
                      <div className='ml-auto'>{memberInfo?.post}</div>
                    </div>
                    <div className='flex'>
                      <Link href={`/board?member=${session?.user.nickname}&show=comments`} onClick={handleClick}>
                        내가 쓴 댓글 보기
                      </Link>
                      <div className='ml-auto'>{memberInfo?.comment}</div>
                    </div>
                  </div>
                  <Link className='bg-primary text-white py-2 px-5 text-center hover:text-white' href='/board/write' onClick={handleClick}>
                    글쓰기
                  </Link>
                </div>
              ) : (
                <>
                  <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
                    <UserCircleIcon className='h-6 text-black' />
                    <span className='font-semibold'>ID {t['sign-in']}</span>
                  </div>
                  <button
                    className='bg-primary font-semibold text-white py-2 px-5 text-base'
                    onClick={() => {
                      signIn();
                      handleClick();
                    }}
                  >
                    {t['sign-in']}
                  </button>
                </>
              )}
              <div className='text-base'>
                <div className='flex flex-col'>
                  <Link className='font-semibold pt-2' href='/search' onClick={handleClick}>
                    {t['search']}
                  </Link>
                  <Link className='font-semibold py-2' href='/add' onClick={handleClick}>
                    {t['new-channel-registration']}
                  </Link>
                </div>
                <div className='border-y border-gray-200 py-2 font-semibold'>
                  <Link href='/board' onClick={handleClick}>
                    {t['view-all-articles']}
                  </Link>
                </div>
                <div className='flex flex-col gap-2 py-2'>
                  {groups?.map((group: GroupType, index) => (
                    <div key={index} className='flex flex-col gap-2'>
                      <div className='font-semibold py-1'>{group.name}</div>
                      {group.boards.map((board: any, key) => (
                        <Link key={key} href={`/board/${board.name}`} className='ml-3' onClick={handleClick}>
                          {board.title}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <header className='bg-white z-20'>
        <div className='container'>
          <div className='flex pt-4 justify-between items-center border-b pb-4'>
            <div className='font-raleway text-lg pl-4 md:pl-0'>
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
            <div className='hidden md:flex gap-4 items-center'>
              <div>
                <LanguageSelector />
              </div>
              <div>
                {session?.user ? (
                  <div className='relative'>
                    <button
                      ref={buttonRef}
                      onClick={() => setUserMenu((prev) => !prev)}
                      className='flex gap-1 items-center text-xs border border-gray-200 rounded-full px-2 py-1'
                    >
                      <UserCircleIcon className='h-4' />
                      {session?.user.nickname}
                    </button>
                    {userMenu && (
                      <div
                        className='absolute top-7 right-0 border shadow-md bg-white flex flex-col rounded-xl min-w-[100px] text-xs'
                        ref={browseRef}
                      >
                        <Link href='/member/profile' onClick={() => setUserMenu(false)} className='px-3 py-2 hover:bg-gray-50 rounded-xl'>
                          내 정보
                        </Link>
                        <Link href='' onClick={() => signOut()} className='px-3 py-2 hover:bg-gray-50 rounded-xl'>
                          {t['sign-out']}
                        </Link>
                      </div>
                    )}
                  </div>
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
          </div>
          <nav className='text-sm font-bold items-center hidden md:flex flex-nowrap break-keep'>
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
              <Nav className='mt-1 custom-nav-menu' appearance='subtle'>
                {groups?.map((group: GroupType, i: number) => (
                  <Nav.Menu key={i} title={group.name}>
                    {group.boards.map((board: any, key: number) => (
                      <Nav.Item key={key} as={Link} href={`/board/${board.name}`}>
                        {board.title}
                      </Nav.Item>
                    ))}
                  </Nav.Menu>
                ))}
              </Nav>
            </ul>
            <button
              className={`${getPath === '/new-channel' ? activePath + ' ml-auto' : normalPath + ' ml-auto'}`}
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
