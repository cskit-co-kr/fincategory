import { ChatBubbleLeftRightIcon, EyeIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import LinkPreview from './LinkPreview';
import RenderPost from './RenderPost';
import dynamic from 'next/dynamic';
import { toDateTimeformat } from '../../lib/utils';
import MediaWeb from './ChannelMediaWeb';

const PostWeb = ({ channel, post }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${channel.channel_id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);

  return (
    <div className='w-full p-[20px] gap-4 border flex flex-col border-gray-200 rounded-md bg-white'>
      <div className='header flex gap-4 border-b border-gray-200 pb-2 w-full'>
        <Image
          src={error ? '/telegram-icon-96.png' : avatar}
          alt={channel.title}
          width={36}
          height={36}
          className='rounded-full object-fill h-fit'
          onError={() => setError(true)}
        />
        <div className='flex flex-col gap-0.5'>
          <div className='text-sm font-bold'>{channel.title}</div>
          <div className='text-xs text-gray-500'>
            {new Date(post.date).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>
      <div className='content max-w-[640px]'>
        {post.forwarded_from === null ? (
          ''
        ) : (
          <div className='forwarded-from border-l-2 border-blue-400 pl-1 mb-4' dangerouslySetInnerHTML={{ __html: post.forwarded_from }} />
        )}
        {post.post_media === null ? (
          ''
        ) : (
          <div className='media py-2'>
            <MediaWeb medias={post.post_media} />
          </div>
        )}
        <div
          className='post'
          dangerouslySetInnerHTML={{
            __html: post.post,
          }}
        />
      </div>
      <div className='footer flex flex-row-reverse gap-3 border-t border-gray-200 pt-3'>
        <div className='flex gap-1 text-xs py-1'>
          <EyeIcon className='h-4' />
          {post.view}
        </div>
        <a
          href={`https://t.me/${post.id.toLowerCase()}`}
          target='_blank'
          className='flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline ml-auto'
        >
          <LinkIcon className='h-4' />
        </a>
        <span className='flex text-xs'>
          <b>{t['Author']}:</b>{' '}
          <span
            dangerouslySetInnerHTML={{
              __html: post.author,
            }}
          />
        </span>
      </div>
    </div>
  );
};

export default PostWeb;
