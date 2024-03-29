import { ChatBubbleLeftRightIcon, EyeIcon, LinkIcon, ShareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import LinkPreview from './LinkPreview';
import RenderPost from './RenderPost';
import dynamic from 'next/dynamic';
import { toDateTimeformat } from '../../lib/utils';
import Media from './ChannelMediaDB';
var moment = require('moment-timezone');

const PostDB = ({ channel, post }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${channel.channel_id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);
  const [descHeight, setDescHeight] = useState('h-fit overflow-hidden');
  const postMedia = post.media && JSON.parse(post.media);
  const [postDate, setPostDate] = useState('');
  useEffect(() => {

    const date = moment.utc(post.date).tz("Asia/Seoul").format('YYYY-MM-DD HH:mm:ss');
    const d = new Date(toDateTimeformat(date, '-')).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    setPostDate(d);
  }, []);

  return (
    <div className='w-full p-[20px] gap-4 border flex flex-col border-gray-200 rounded-md bg-white'>
      <div className='flex gap-4 border-b border-gray-200 pb-2 w-full'>
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
          <div className='text-xs text-gray-500'>{postDate}</div>
        </div>
      </div>
      <div className='flex flex-col gap-2.5 justify-center'>
        {(postMedia?._ === 'messageMediaPhoto' || postMedia?._ === 'messageMediaDocument') && <Media channel={channel} post={post} />}
        <div className={descHeight}>
          <div>{<RenderPost message={post.message} entities={JSON.parse(post.entities)} />}</div>
          <div>{postMedia && postMedia._ === 'messageMediaWebPage' && <LinkPreview meta={postMedia} />}</div>
        </div>
        {/*<span className='text-center text-xs font-semibold text-primary'>
          <button onClick={() => showMore()}>{t['Show-more']}</button>
        </span>*/}
        <div className='flex flex-wrap gap-2 text-xs'>
          {JSON.parse(post.reactions)?.results.map((reaction: any, index: number) => (
            <div key={index} className='rounded-full bg-gray-100 pl-2 pr-3 py-1 flex gap-1'>
              <span>{reaction.reaction._ ? reaction.reaction.emoticon : reaction.reaction}</span>
              <span>{reaction.count}</span>
            </div>
          ))}
        </div>
        <div className='flex flex-row-reverse gap-3 border-t border-gray-200 pt-3'>
          <div className='flex gap-1 text-xs py-1'>
            <ShareIcon className='h-4' />
            {post.forwards}
          </div>
          {post.replies && (
            <div className='flex gap-1 text-xs py-1'>
              <ChatBubbleLeftRightIcon className='h-4' />
              {JSON.parse(post.replies)?.replies}
            </div>
          )}
          <div className='flex gap-1 text-xs py-1'>
            <EyeIcon className='h-4' />
            {post.views}
          </div>
          <a
            href={`https://t.me/${channel.username}/${post.id}`}
            target='_blank'
            className='flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline ml-auto'
          >
            <LinkIcon className='h-4' />
          </a>
          <span className='text-xs'>
            <b>{t['Author']}:</b> {post.post_author}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostDB;
