import React, { useEffect, useState } from 'react';
import { Channel } from '../../typings';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const Section2_1 = ({ channels }: any) => {
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
    <div >
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
