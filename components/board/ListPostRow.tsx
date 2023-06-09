import { useRouter } from 'next/router';
import React from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { formatDate } from '../../lib/utils';
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
          value={post.id.toString()}
          checked={checkedItems.includes(post.id.toString())}
          onChange={handleCheckboxChange}
          className='hidden md:block'
        />
      )}
      <div className='hidden md:block text-center p-2 min-w-[80px]'>
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
      <div className='pt-4 px-4 md:p-2 flex-grow flex items-center gap-1'>
        <Link href={`/board/post/${post.id}`}>{post.title}</Link>
        {post?.comment > 0 && <span className='text-[11px] font-semibold'>[{post.comment}]</span>}
        {post.extra_01 === '1' && (
          <span>
            <PhotoIcon className='hidden md:block h-[14px] text-gray-400' />
          </span>
        )}
        {post.extra_01 === '1' && (
          <Image
            src={post.extra_02}
            width='56'
            height='56'
            alt='Image'
            className='border border-gray-600 md:hidden aspect-square rounded-md ml-auto w-14'
          />
        )}
      </div>
      <div className='flex gap-3 md:gap-0 px-4 pb-4 pt-1.5 md:p-0 text-gray-400 md:text-gray-600 text-xs'>
        <div className='md:block text-left md:p-2 md:min-w-[128px]'>{post.user?.nickname}</div>
        <div className='md:block md:text-center md:p-2 md:min-w-[96px]'>{formatDate(post.created_at)}</div>
        <div className='md:block md:text-center md:p-2 md:min-w-[48px]'>
          <span className='md:hidden'>조회</span> {post.views}
        </div>
      </div>
    </div>
  );
};

export default ListPostRow;
