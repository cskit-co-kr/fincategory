import React, { useEffect, useState } from 'react';
import { Channel } from '../../typings';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';

const Section2_1 = ({ channels }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div>
      {channels?.map((channel: Channel, index: number) => {
        return (
          <Link
            href={`/channel/${channel.username}`}
            target='_blank'
            className='flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none'
            key={channel.id}
          >
            <div className='font-semibold'>{++index}</div>
            <div className='flex items-center w-full justify-between'>
              <div className='flex items-center gap-2'>
                <ChannelAvatar id={channel.channel_id} title={channel.title} size='30' shape='rounded-full' />
                <div className='line-clamp-1 text-ellipsis overflow-hidden'>{channel.title}</div>
                <div
                  className={`text-[11px] px-2 py-0.1 rounded-full w-fit whitespace-nowrap text-white ${
                    channel.type === 'channel' ? 'bg-[#71B2FF]' : 'bg-[#FF7171]'
                  }`}
                >
                  {channel.type === 'channel' ? t['channel'] : t['Group']}
                </div>
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

const Section2_1Skeleton = () => {
  return (
    <div>
      {Array(5)
        .fill(1)
        .map((val, index) => {
          return (
            <div className='flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none' key={index}>
              <Skeleton variant='text' animation='wave' sx={{ bgcolor: 'grey.100' }} width={20} height={20} />
              <div className='flex items-center w-full justify-between'>
                <div className='flex items-center gap-2'>
                  <Skeleton variant='circular' animation='wave' sx={{ bgcolor: 'grey.100' }} width={30} height={30} />
                  <Skeleton variant='text' animation='wave' sx={{ bgcolor: 'grey.100' }} width={60} height={10} />
                </div>
                <Skeleton
                  variant='text'
                  animation='wave'
                  sx={{ bgcolor: 'grey.100' }}
                  width={60}
                  height={10}
                  className='text-gray-500 text-[12px] font-bold min-w-[100px]'
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
export { Section2_1Skeleton, Section2_1 };
