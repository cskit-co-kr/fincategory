import { useEffect, useState, useRef } from 'react';
import { Bars3Icon, Cog6ToothIcon, MagnifyingGlassIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { FaCaretDown, FaTelegramPlane } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import LanguageSelector from './LanguageSelector';
import { GroupType, MemberType } from '../typings';
import Link from 'next/link';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Nav } from 'rsuite';

const Header = () => {
  const router = useRouter();
  const getPath = useRouter().pathname;
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const normalPath = 'px-5 py-3 font-bold text-[14px] hover:text-primary flex items-center gap-1';
  // const activePath = normalPath + ' border-b-2 border-primary';
  const activePath = normalPath + ' text-primary';

  const [searchField, setSearchField] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [searchSection, setSearchSection] = useState(1);
  const [searchSectionMenu, setSearchSectionMenu] = useState(false);

  const handleSubmit = () => {
    if (searchField !== '') {
      if (searchSection === 1) {
        router.push(`/search?q=${searchField}`);
      } else if (searchSection === 2) {
        router.push(`/board?q=${searchField}`);
      }
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
  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!searchSectionMenu) return;
    function handleClick(event: any) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchSectionMenu(false);
      }
    }
    window.addEventListener('click', handleClick, true);
    return () => window.removeEventListener('click', handleClick, true);
  }, [searchSectionMenu]);

  const [groups, setGroups] = useState([]);
  const [memberInfo, setMemberInfo] = useState<MemberType>();

  // Get Member Information
  const getMember = async () => {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getuser`, {
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

  useEffect(() => {
    const s = router.query.q === undefined ? '' : (router.query.q as string);
    setSearchField(s);
    const ss = router.asPath.includes('/board') ? 2 : 1;
    setSearchSection(ss);
  }, [router]);

  function handleClick() {
    const element = document.getElementById('my-drawer-4');
    if (element) {
      element.click();
    }
  }

  return (
    <>
      <header className='bg-white z-20'>
        <div className='container'>
          <div className='flex pt-4 justify-between items-center border-b pb-4'>
            <div className='font-raleway text-2xl pl-4 md:pl-0 flex gap-3 items-end'>
              <Link href='/search' className='hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none'>
                <span className='font-bold text-primary'>Fin</span>
                <span className=''>Ca</span>
              </Link>
              <div className='text-[11px] text-gray-500 leading-none mb-[3px]'>텔레그램 채널정보, 핀카</div>
            </div>

            {/* Mobile */}
            <div className='md:hidden drawer w-fit z-20'>
              <input id='my-drawer-4' type='checkbox' className='drawer-toggle' />
              <div className='drawer-content ml-auto pr-4'>
                {/* Page content here */}
                <label htmlFor='my-drawer-4' className=''>
                  <Bars3Icon className='h-7' />
                </label>
              </div>
              <div className='drawer-side'>
                <label htmlFor='my-drawer-4' className='drawer-overlay'></label>
                <div className='menu p-2 w-80 bg-gray-100'>
                  <div className='grid'>
                    {session?.user ? (
                      <div className='flex flex-col gap-2 text-sm bg-white shadow-sm rounded-xl p-4'>
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
                            className='bg-gray-100 rounded-full px-2 py-1 ml-auto text-xs'
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
                        <Link
                          className='bg-primary text-white py-2 px-5 text-center hover:text-white'
                          href='/board/write'
                          onClick={handleClick}
                        >
                          글쓰기
                        </Link>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-2 text-sm bg-white shadow-sm rounded-xl p-4'>
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
                      </div>
                    )}
                    <div className='text-sm'>
                      <div className='grid gap-2 my-3 bg-white p-4 rounded-xl shadow-sm'>
                        <Link className='font-semibold flex gap-2 items-center' href='/search' onClick={handleClick}>
                          <FaTelegramPlane className='mask mask-squircle h-6 w-6 bg-primary text-white p-1' />
                          {t['search']}
                        </Link>
                        <Link className='font-semibold flex gap-2 items-center' href='/channel/rankings' onClick={handleClick}>
                          <ChartBarIcon className='mask mask-squircle h-6 w-6 bg-primary text-white p-1' />
                          {t['channel-rankings']}
                        </Link>
                        <Link className='font-semibold flex gap-2 items-center' href='/add' onClick={handleClick}>
                          <PlusIcon className='mask mask-squircle h-6 w-6 bg-primary text-white p-1' />
                          {t['new-channel-registration']}
                        </Link>
                      </div>
                      <div className='bg-white p-4 rounded-xl shadow-sm'>
                        <div className='border-b border-gray-200 pb-2 font-semibold'>
                          <Link href='/board' onClick={handleClick} className='flex gap-1 items-center'>
                            {t['view-all-articles']}
                          </Link>
                        </div>
                        <div className='flex flex-col gap-2 py-2'>
                          {groups?.map((group: GroupType) => (
                            <div key={group.id} className='flex flex-col gap-2'>
                              <div className='font-semibold py-1 flex gap-1 items-center'>{group.name}</div>
                              {group.boards.map((board: any) => (
                                <Link key={board.id} href={`/board/${board.name}`} className='ml-3' onClick={handleClick}>
                                  {board.title}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className='bg-white p-2 rounded-xl shadow-sm mt-3 w-full'>
                      <Link href='mailto:jopaint@naver.com' className='flex items-center gap-2'>
                        <EnvelopeIcon className='mask mask-squircle h-6 w-6 bg-primary text-white p-1' /> jopaint@naver.com
                      </Link>
                    </div>
                    <div className='font-raleway text-2xl flex gap-3 items-end mx-auto my-10'>
                      <Link
                        href='/search'
                        className='hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none'
                      >
                        <span className='font-bold text-primary'>Fin</span>
                        <span className=''>Ca</span>
                      </Link>
                      <div className='text-[11px] text-gray-500 leading-none mb-[3px]'>텔레그램 채널정보, 핀카</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='relative border border-primary items-center py-2 px-3 rounded-full hidden md:inline-flex hover:shadow-md'>
              <input
                type='text'
                name='search'
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={handleKeyDown}
                className='outline-none pl-3 w-24 md:w-80 xl:w-96 text-sm'
              />
              <button
                className='text-xs py-1 px-2 flex gap-1 items-center rounded-full min-w-[70px] justify-center'
                onClick={() => setSearchSectionMenu((prev) => !prev)}
              >
                {searchSection === 1 ? t['channel'] : t['board']}
                <FaCaretDown size={14} />
              </button>
              {searchSectionMenu && (
                <div
                  className='absolute top-9 right-10 border shadow-md bg-white flex flex-col rounded-xl min-w-[50px] text-xs'
                  ref={searchRef}
                >
                  <button
                    onClick={() => {
                      setSearchSection(1);
                      setSearchSectionMenu((prev) => !prev);
                    }}
                    className='px-3 py-2 hover:bg-gray-50 rounded-xl'
                  >
                    {t['channel']}
                  </button>
                  <button
                    onClick={() => {
                      setSearchSection(2);
                      setSearchSectionMenu((prev) => !prev);
                    }}
                    className='px-3 py-2 hover:bg-gray-50 rounded-xl'
                  >
                    {t['board']}
                  </button>
                </div>
              )}
              <button onClick={handleSubmit}>
                <MagnifyingGlassIcon className='h-5 text-primary mr-1' />
              </button>
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
              <li>
                <button className={getPath === '/search' ? activePath : normalPath} onClick={() => router.push('/search')}>
                  {t['search']}
                </button>
              </li>
              <li>
                <button
                  className={getPath === '/channel/ranking' ? activePath : normalPath}
                  onClick={() => router.push('/channel/ranking')}
                >
                  {t['channel-rankings']}
                </button>
              </li>
              <Nav className='mt-1 custom-nav-menu z-20' appearance='subtle'>
                {groups?.map((group: GroupType) => (
                  <Nav.Menu key={group.id} title={group.name}>
                    {group.boards.map((board: any) => (
                      <Nav.Item key={board.id} as={Link} href={`/board/${board.name}`}>
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
