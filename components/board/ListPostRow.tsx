import { useRouter } from 'next/router';
import React from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/24/outline';

const ListPostRow = ({ post, boardName }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div className='border-b border-gray-200 flex' key={post.id}>
      <div className='text-center p-2 min-w-[80px]'>
        {router.query.name && router.query.name?.length > 0 ? (
          <Link href={`/board/${boardName}/${post.category?.id}`}>{post.category?.category}</Link>
        ) : (
          <Link href={`/board/${post?.board?.name}`}>{post?.board?.title}</Link>
        )}
      </div>
      <div className='p-2 flex-grow flex items-center gap-1'>
        <Link href={`/board/post/${post.id}`}>{post.title}</Link>
        {post?.comment > 0 && <span className='text-[11px] font-semibold'>[{post.comment}]</span>}
        {post.extra_01 === '1' && <PhotoIcon className='h-3 text-gray-400' />}
      </div>
      <div className='text-left p-2 min-w-[128px]'>{post.user?.nickname}</div>
      <div className='text-center p-2 min-w-[96px]'>{formatDate(post.created_at)}</div>
      <div className='text-center p-2 min-w-[48px]'>{post.views}</div>
    </div>
  );
};

function formatDate(dateString: string) {
  const date: any = new Date(dateString);
  const currentDate: any = new Date();
  const timeDifference: any = currentDate - date;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const isWithin24Hours = timeDifference < oneDay;
  const formattedDateTime = isWithin24Hours
    ? date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
    : dateString.substring(0, 10).replaceAll('-', '.');
  return formattedDateTime;
}

export default ListPostRow;
