import { ChatBubbleLeftRightIcon, EyeIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import LinkPreview from './LinkPreview';
import RenderPost from './RenderPost';
import { useEffect, useState } from 'react';
import { toDateTimeformat } from '../../lib/utils';

const PostMini = ({ channel, post }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const postMedia = post.media && JSON.parse(post.media);

  const [postDate, setPostDate] = useState('');
  useEffect(() => {
    const d = new Date(toDateTimeformat(post.date, '-')).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setPostDate(d);
  }, []);

  return (
    <div className='w-full gap-4 border flex border-gray-200 rounded-md bg-white'>
      <div className='w-1/4 flex flex-col text-sm gap-3 bg-gray-50 rounded-md rounded-r-none p-4'>
        <div className='flex gap-2 items-center font-semibold'>
          <EyeIcon className='h-5' />
          {post.views.toLocaleString()}
        </div>
        <div className='flex gap-2 items-center'>
          <ShareIcon className='h-5' />
          {post.forwards}
        </div>
        {post.replies && (
          <div className='flex gap-2 items-center'>
            <ChatBubbleLeftRightIcon className='h-5' />
            {JSON.parse(post.replies)?.replies}
          </div>
        )}
        <div>
          <a
            href={`https://t.me/${channel.username}/${post.id}`}
            target='_blank'
            className='flex items-center gap-2 hover:no-underline w-fit'
          >
            <LinkIcon className='h-5' />
            Post #{post.id}
          </a>
        </div>
        <div className='text-gray-500'>{postDate}</div>
      </div>

      <div className='w-3/4 flex flex-col gap-2.5 p-4'>
        {postMedia && postMedia._ === 'messageMediaPhoto' && (
          <div className='bg-gray-100 w-full h-44 flex place-content-center items-center rounded-md'>
            <PhotoIcon className='h-14 w-14 text-gray-300' />
          </div>
        )}
        {postMedia && postMedia._ === 'messageMediaDocument' && (
          <div className='bg-gray-100 w-full h-44 flex place-content-center items-center rounded-md'>
            <PhotoIcon className='h-14 w-14 text-gray-300' />
            <VideoCameraIcon className='h-14 w-14 text-gray-300' />
          </div>
        )}

        <div className='h-fit overflow-hidden'>
          <div>{<RenderPost message={post.message} entities={JSON.parse(post.entities)} />}</div>
          <div>{postMedia && postMedia._ === 'messageMediaWebPage' && <LinkPreview meta={postMedia} />}</div>
        </div>
        <div className='flex flex-wrap gap-2 text-xs'>
          {JSON.parse(post.reactions)?.results.map((reaction: any, index: number) => (
            <div className='rounded-full bg-gray-100 pl-2 pr-3 py-1 flex gap-1' key={index}>
              <span>{reaction.reaction}</span>
              <span>{reaction.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostMini;
