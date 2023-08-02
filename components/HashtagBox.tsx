import React from 'react';
import ChannelAvatar from './channel/ChannelAvatar';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Channel } from '../typings';
import { LiaUserSolid } from 'react-icons/lia';

const HashtagBox = ({ channels }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div className='border border-gray-200 rounded-xl bg-white px-5 py-7'>
      <div className='font-bold mb-7 bg-primary text-white rounded-t-xl -mx-5 -my-7 px-5 py-6'>최근 추가된 채널</div>
      {channels.map((channel: Channel) => (
        <Link
          href={`/channel/${channel.username}`}
          className='flex gap-2 justify-between mb-4 last:mb-0 hover:no-underline hover:text-black'
          key={channel.id}
        >
          <div className='space-y-2'>
            <div className='font-semibold line-clamp-1'>{channel.title}</div>
            <div className='text-[11px] text-gray-500'>
              <span className='flex gap-0.5 items-center'>
                <LiaUserSolid size={16} />
                {t['subscribers']} <b>{channel.subscription?.toLocaleString()}</b>
              </span>
            </div>
          </div>
          <ChannelAvatar id={channel.channel_id} title={channel.title} size='50' shape='rounded-full' />
        </Link>
      ))}
    </div>
  );
};

export default HashtagBox;
