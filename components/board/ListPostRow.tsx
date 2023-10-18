import { useRouter } from 'next/router';
import React from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import Link from 'next/link';
import { TbPhotoCircle, TbHeartFilled } from 'react-icons/tb';
import { PiChatCircleTextLight } from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import { formatDate, getToday } from '../../lib/utils';
import Image from 'next/image';

const ListPostRow = ({ post, boardName, checkedItems, handleCheckboxChange, userType }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  return (
    <div className='border-b border-gray-200 md:flex' key={post.id}>
      {session?.user && userType === 2 && (
        <input
          type='checkbox'
          name='checkbox'
          value={post.id.toString()}
          checked={checkedItems.includes(post.id.toString())}
          onChange={handleCheckboxChange}
          className='hidden md:block'
        />
      )}
      <div className='hidden md:block text-center px-2 py-2.5 min-w-[80px]'>
        {router.query.name && router.query.name?.length > 0 ? (
          post.category ? (
            <Link href={`/board/${boardName}/${post.category?.id}`}>{post.category?.category}</Link>
          ) : (
            post.id
          )
        ) : (
          <Link href={`/board/${post?.board?.name}`}>{post?.board?.title}</Link>
        )}
      </div>
      <div className='pt-4 px-4 md:px-2 md:py-2.5 flex flex-grow'>
        <div className='mr-4 md:mr-0'>
          <div className='flex items-start md:items-center md:gap-1'>
            <Link href={`/board/post/${post.id}`} className='break-all md:break-words line-clamp-3 md:line-clamp-1'>
              {post.title}
            </Link>
            {formatDate(post.created_at).length < 6 && <Image src='/n.svg' alt='New' width={14} height={14} className='pt-1 md:pt-0' />}
            {post?.comment > 0 && (
              <div className='flex gap-0.5 items-center text-[12px] font-semibold text-blue-500'>
                <PiChatCircleTextLight size={14} />
                {post.comment}
              </div>
            )}
            {post.reaction && (
              <div className='flex gap-0.5 items-center font-semibold text-red-500 text-[12px]'>
                <TbHeartFilled size={14} />
                {JSON.parse(post.reaction).length}
              </div>
            )}
            {post.extra_01 === '1' && (
              <span className='break-after'>
                <TbPhotoCircle size={16} className='hidden md:block text-green-500' />
              </span>
            )}
          </div>
          <div className='md:hidden flex gap-3 pb-4 pt-1.5 text-gray-400'>
            <div className='text-left'>{post.user?.nickname}</div>
            <div className=''>{formatDate(post.created_at)}</div>
            <div className=''>조회 {post.views}</div>
          </div>
        </div>

        {post.extra_01 === '1' && (
          <Image
            src={post.extra_02 || '/logo.png'}
            width='56'
            height='56'
            alt='Image'
            className='border border-gray-600 md:hidden aspect-square rounded-md ml-auto w-14 h-14'
          />
        )}
      </div>
      <div className='hidden md:flex gap-3 md:gap-0 px-4 pb-4 pt-1.5 md:p-0 text-gray-400 md:text-gray-900'>
        <div className='md:block text-left md:px-2 md:py-2.5 md:min-w-[128px]'>{post.user?.nickname}</div>
        <div className='md:block md:text-center md:px-2 md:py-2.5 md:min-w-[96px]'>{formatDate(post.created_at)}</div>
        <div className='md:block md:text-center md:px-2 md:py-2.5 md:min-w-[48px]'>
          <span className='md:hidden'>조회</span> {post.views}
        </div>
      </div>
    </div>
  );
};

export default ListPostRow;
