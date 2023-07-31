import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '../../lib/utils';

const GridPostRow = ({ post }: any) => {
  return (
    <div className=''>
      <Link href={`/board/post/${post.id}`}>
        <img src={post.extra_02} alt={post.title} className='object-cover aspect-square' />
      </Link>
      <Link href={`/board/post/${post.id}`} className='break-words line-clamp-2 font-semibold'>
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
