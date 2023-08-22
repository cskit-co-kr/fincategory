import React, { useEffect, useState } from 'react';
import { Channel } from '../../typings';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';
import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const Section2_1 = ({ channelsToday }: any) => {
  const router = useRouter();
  const [sortType, setSortType] = useState(1);
  const [channelsTotal, setChannelsTotal] = useState(channelsToday);
  const [channels, setChannels] = useState(channelsToday);

  const switchSortType = (type: number) => {
    if (type === 2) {
      setChannels(channelsTotal);
    } else setChannels(channelsToday);

    setSortType(type)
  }
  useEffect(() => {
    const getChannelTotal = async () => {

      let data: any = {
        query: null,
        withDesc: false,
        category: [],
        country: [],
        language: [{ value: 'ko', label: 'Korean' }],
        channel_type: null,
        channel_age: 0,
        erp: 0,
        subscribers_from: null,
        subscribers_to: null,
        paginate: { limit: 5, offset: 0 },
        sort: { field: 'created_at', order: 'desc' },
      };
      data['sort'] = { field: 'total', order: 'desc' };
      const channelsTotal = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);
      setChannelsTotal(channelsTotal)
    }
    getChannelTotal();
  }, [router]);

  return (
    <div className='bg-white border border-gray-200 rounded-xl mx-4 md:mx-0'>
      <div className='flex flex-row justify-start align-start'>
        <div className={`font-bold pt-5 pb-1 pl-5 pr-3 cursor-pointer hover:text-primary ${sortType === 1 && 'text-primary'}`} onClick={() => {
          switchSortType(1)
        }}>(오늘)조회수 상위</div>
        <div className='font-bold pt-5 pb-1 '>{"|"}</div>
        <div className={`font-bold pt-5 pb-1 px-4 cursor-pointer hover:text-primary ${sortType === 2 && 'text-primary'}`} onClick={() => {
          switchSortType(2)
        }}>(누적)조회수 상위</div>
      </div>

      {channels?.map((channel: Channel, index: number) => {
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

const Section2_1Skeleton = () => {
  return (
    <div className='bg-white border border-gray-200 rounded-xl mx-4 md:mx-0'>
      <div className='font-bold pt-5 pb-1 px-5'>(오늘)조회수 상위</div>
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
