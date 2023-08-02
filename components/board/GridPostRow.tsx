import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../../lib/utils';

const GridPostRow = ({ post }: any) => {
  return (
    <div className='space-y-2 md:first:row-span-2 md:first:col-span-2'>
      <Link href={`/board/post/${post.id}`}>
        <img src={post.extra_02} alt={post.title} className='object-cover aspect-square rounded-md' />
      </Link>
      <Link href={`/board/post/${post.id}`} className='break-all line-clamp-2'>
        {post.title}
      </Link>
      <div className='mt-1'>{post.board?.title}</div>
      <div className='text-xs text-gray-400'>
        {formatDate(post.created_at)} <span className='dot'>조회 {post.views}</span>
      </div>
    </div>
  );
};

export default GridPostRow;
