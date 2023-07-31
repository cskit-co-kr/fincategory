import React from 'react';
import ChannelAvatar from './channel/ChannelAvatar';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Channel } from '../typings';

const HashtagBox = ({ channels }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div className='border border-gray-200 rounded-md bg-white px-5 py-7'>
      <div className='font-bold mb-7'>최근 추가된 채널</div>
      {channels.map((channel: Channel) => (
        <Link
          href={`/channel/${channel.username}`}
          className='flex gap-2 justify-between mb-4 last:mb-0 hover:no-underline hover:text-black'
          key={channel.id}
        >
          <div className='space-y-2'>
            <div className='font-semibold'>{channel.title}</div>
            <div className='text-[12px] text-gray-500'>
              {t['subscribers']} <b>{channel.subscription?.toLocaleString()}</b>
            </div>
          </div>
          <ChannelAvatar id={channel.channel_id} title={channel.title} size='50' shape='rounded-full' />
        </Link>
      ))}
    </div>
  );
};

export default HashtagBox;
