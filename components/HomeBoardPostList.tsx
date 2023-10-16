import Link from 'next/link';
import React from 'react';
import { formatDate } from '../lib/utils';
import { PostType } from '../typings';
import Image from 'next/image';
import { TbPhotoCircle, TbHeartFilled } from 'react-icons/tb';
import { PiChatCircleTextLight } from 'react-icons/pi';

const HomeBoardPostList = ({ postList }: any) => {
  return (
    <ul className='space-y-2'>
      {postList?.posts?.map((post: PostType) => (
        <li className='flex gap-2' key={post.id}>
          <span className='text-gray-400 shrink-0'>
            &#9642; {formatDate(post.created_at).length < 6 ? formatDate(post.created_at) : formatDate(post.created_at).slice(-5)}
          </span>
          <div className='flex items-center'>
            <Link href={`/board/post/${post.id}`} className='break-all md:break-words line-clamp-1'>
              <h1>{post.title}</h1>
            </Link>
            {formatDate(post.created_at).length < 6 && <Image src='/n.svg' alt='New' width={14} height={14} />}
            {post?.comment > 0 && (
              <div className='flex gap-0.5 items-center text-[12px] font-semibold text-blue-500'>
                <PiChatCircleTextLight size={14} />
                {post.comment}
              </div>
            )}
            {post.reaction && (
              <div className='flex gap-0.5 items-center font-semibold text-red-500 text-[12px] ml-0.5'>
                <TbHeartFilled size={14} />
                {JSON.parse(post.reaction).length}
              </div>
            )}
            {post.extra_01 === '1' && (
              <span>
                <TbPhotoCircle size={16} className='text-green-500 ml-0.5' />
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default HomeBoardPostList;
