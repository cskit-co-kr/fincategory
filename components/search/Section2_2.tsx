import React from 'react';
import { Channel } from '../../typings';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';
import { LiaUserSolid } from 'react-icons/lia';
import { useRouter } from 'next/router';
import { koKR } from '../../lang/ko-KR';
import { enUS } from '../../lang/en-US';

const Section2_2 = ({ channelsNew }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <>
      {channelsNew?.map((channel: Channel, index: number) => {
        return (
          <Link
            href={`/channel/${channel.username}`}
            className='flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none'
            key={channel.id}
          >
            <div className='font-semibold'>{++index}</div>
            <div className='flex items-center w-full justify-between'>
              <div className='flex items-center gap-2'>
                <ChannelAvatar id={channel.channel_id} title={channel.title} size='30' shape='rounded-full' />
                <div className='line-clamp-1 text-ellipsis overflow-hidden'>{channel.title}</div>
              </div>
              <div className='text-[12px] text-gray-500 font-bold flex gap-0.5 items-center min-w-[100px]'>
                <LiaUserSolid size={16} />
                {t['subscribers']} {channel.subscription?.toLocaleString()}
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};

export default Section2_2;