import React from 'react';
import { Channel } from '../../typings';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';

const Section2_1 = ({ channelsToday }: any) => {
  return (
    <div className='bg-white border border-gray-200 rounded-xl mx-4 md:mx-0'>
      <div className='font-bold pt-5 pb-1 px-5'>(오늘)조회수 상위</div>

      {channelsToday?.map((channel: Channel, index: number) => {
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
              <div className='text-gray-500 text-[12px] font-bold min-w-[100px]'>
                오늘{channel.today && channel.today}/누적{channel.total && channel.total}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Section2_1;
