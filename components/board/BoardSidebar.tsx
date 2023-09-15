import { signIn, signOut, useSession } from 'next-auth/react';
import { ArrowPathIcon, ChevronDownIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { GroupType } from '../../typings';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

const BoardSidebar = ({ memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const name = router.query.name && router.query.name[0];
  const postBoardName = getCookie('postboardname');
  const { data: session } = useSession();
  const [groups, setGroups] = useState([]);

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

  return (
    <>
      <div className='hidden lg:block lg:min-w-[310px] text-sm'>
        <div className='lg:sticky lg:top-4'>
          <div className='flex flex-col gap-2.5 border border-gray-200 rounded-md p-[30px] bg-white'>
            {session?.user ? (
              <>
                <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
                  <UserCircleIcon className='h-6 text-black' />
                  <span className='font-semibold'>
                    <Link href='/member/profile'>{session?.user.nickname}</Link>
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: '/search' })}
                    className='bg-gray-100 rounded-full text-[10px] px-2 py-1 ml-auto'
                  >
                    {t['sign-out']}
                  </button>
                </div>
                <div className='gap-1.5 grid'>
                  <div className='flex'>
                    가입<div className='ml-auto'>{memberInfo?.member?.created_at.substring(0, 10).replaceAll('-', '.')}</div>
                  </div>
                  <div className='flex'>
                    <Link href={`/board?member=${session?.user.nickname}&show=posts`}>내가 쓴 글 보기</Link>
                    <div className='ml-auto'>{memberInfo?.post}</div>
                  </div>
                  <div className='flex'>
                    <Link href={`/board?member=${session?.user.nickname}&show=comments`}>내가 쓴 댓글 보기</Link>
                    <div className='ml-auto'>{memberInfo?.comment}</div>
                  </div>
                </div>
                <Link className='bg-primary text-white py-2 px-5 text-center hover:text-white' href='/board/write'>
                  글쓰기
                </Link>
              </>
            ) : (
              <>
                <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
                  <UserCircleIcon className='h-6 text-black' />
                  <span className='font-semibold'>ID {t['sign-in']}</span>
                </div>
                <button className='bg-primary font-semibold text-white py-2 px-5' onClick={() => signIn()}>
                  {t['sign-in']}
                </button>
              </>
            )}
            <div className='border-y border-gray-200 py-2 font-semibold'>
              <Link href='/board' className={`${router.asPath === '/board' && 'text-primary'}`}>
                {t['view-all-articles']}
              </Link>
            </div>
            <div className='flex flex-col gap-1 pb-2'>
              {groups?.map((group: GroupType, index) =>
                group.id !== 99 ? (
                  <div key={index} className='flex flex-col gap-1'>
                    <div className='font-semibold py-2'>{group.name}</div>
                    {group.boards.map((board: any, key) => (
                      <Link
                        key={key}
                        href={`/board/${board.name}`}
                        className={`focus:no-underline ml-3 py-0.5 ${board.name === name ? 'text-primary' : ''} ${
                          router.query.id && postBoardName === board.name ? 'text-primary' : ''
                        }`}
                      >
                        {board.title}
                      </Link>
                    ))}
                  </div>
                ) : (
                  group.boards.map((board: any, key) => (
                    <Link
                      key={key}
                      href={`/board/${board.name}`}
                      className={`focus:no-underline py-2 font-semibold ${board.name === name ? 'text-primary' : ''} ${
                        router.query.id && postBoardName === board.name ? 'text-primary' : ''
                      }`}
                    >
                      {board.title}
                    </Link>
                  ))
                )
              )}
            </div>
            <div className='justify-between hidden'>
              <div className='font-semibold'>{t['connected-members']}</div>
              <div className='flex gap-1 text-black'>
                <ArrowPathIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
                <ChevronDownIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
              </div>
            </div>
            <div className='bg-gray-100 p-4 text-xs hidden'>{t['no-connected-members']}</div>
            <div className='border border-gray-200 p-4 text-xs hidden'>오늘 3 전체 549</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardSidebar;
