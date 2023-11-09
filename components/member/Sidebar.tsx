import { signIn, signOut, useSession } from 'next-auth/react';
import {
  ChatBubbleBottomCenterTextIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  StopCircleIcon,
  UserCircleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';

const Sidebar = ({ memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const menus = [
    {
      id: 1,
      title: '내정보',
      icon: <UserIcon className='h-5' />,
      link: '/member/profile',
    },
    {
      id: 2,
      title: '핀코인',
      icon: <StopCircleIcon className='h-5' />,
      link: '/member/wallet',
    },
    {
      id: 3,
      title: '상품구매내역',
      icon: <DocumentTextIcon className='h-5' />,
      link: '/member/ads-history',
    },
    {
      id: 4,
      title: '내가 쓴 글',
      icon: <PencilSquareIcon className='h-5' />,
      link: `/board?member=${session?.user.nickname}&show=posts`,
    },
    {
      id: 5,
      title: '내가 쓴 댓글',
      icon: <ChatBubbleBottomCenterTextIcon className='h-5' />,
      link: `/board?member=${session?.user.nickname}&show=comments`,
    },
  ];

  return (
    <>
      <div className='hidden lg:block lg:min-w-[310px] text-sm'>
        <div className='lg:sticky lg:top-4'>
          <div className='flex flex-col gap-2.5 border border-gray-200 rounded-lg p-[30px] bg-white'>
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
            <div className='space-y-5 mt-2.5'>
              {menus.map((menu, index) => (
                <Link
                  key={index}
                  className={`flex items-center gap-2.5 font-semibold text-sm ${
                    menu.link === router.asPath ? 'text-black' : 'text-gray-500'
                  }`}
                  href={menu.link}
                >
                  {menu.icon}
                  {menu.title}
                  {menu.id === 4 && <div className='ml-auto'>{memberInfo?.post}</div>}
                  {menu.id === 5 && <div className='ml-auto'>{memberInfo?.comment}</div>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
