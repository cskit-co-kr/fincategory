import { useRouter } from 'next/router';
import React from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { formatDate } from '../../lib/utils';

const ListPostRow = ({ post, boardName, checkedItems, handleCheckboxChange, userType }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  return (
    <div className='border-b border-gray-200 flex' key={post.id}>
      {session?.user && userType === 2 && (
        <input
          type='checkbox'
          value={post.id.toString()}
          checked={checkedItems.includes(post.id.toString())}
          onChange={handleCheckboxChange}
        />
      )}
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

export default ListPostRow;
