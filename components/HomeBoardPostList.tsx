import Link from 'next/link';
import React from 'react';
import { formatDate } from '../lib/utils';
import { PostType } from '../typings';

const HomeBoardPostList = ({ postList }: any) => {
  return (
    <ul className='text-xs space-y-2'>
      {postList?.posts?.map((post: PostType) => (
        <li className='flex gap-2' key={post.id}>
          <span className='text-gray-400 shrink-0'>&#9642; {formatDate(post.created_at)}</span>
          <div className='flex'>
            <Link href={`/board/post/${post.id}`} className='break-all md:break-words line-clamp-1'>
              {post.title}
            </Link>
            {post?.comment > 0 && <span className='text-red-500 text-[11px] font-semibold'> [{post.comment}]</span>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default HomeBoardPostList;
