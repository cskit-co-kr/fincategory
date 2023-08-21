import React from 'react';
import { GetChannels, GetChannelsSkeleton } from '../channel/GetChannels';
import { Skeleton } from '@mui/material';

const Section1 = ({ channels24h }: any) => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 m-4 md:m-0 min-h-[263px]' >
      <div className='font-bold pt-5 pb-1 px-5'>구독자 상승 채널(24H)</div>
      <div className='grid md:grid-cols-3 gap-4 px-4 pb-4'>
        {channels24h?.map((channel: any) => {
          return (
            <GetChannels
              channels={channel}
              desc={false}
              extra2={true}
              key={channel.id}
              bordered={false}
              tag={false}
              background='bg-gray-50'
            />
          );
        })}
      </div>
    </div>
  );
};


const Section1Skeleton = () => {
  return (
    <div className='bg-white rounded-xl border border-gray-200 m-4 md:m-0 min-h-[263px]' >
      <div className='font-bold pt-5 pb-1 px-5'>구독자 상승 채널(24H)</div>
      <div className='grid md:grid-cols-3 gap-4 px-4 pb-4'>
        {
          Array(6).fill(0).map(() => {
            return (
              <Skeleton variant='rectangular' sx={{ bgcolor: 'grey.100' }} animation="wave" className='min-h-[92px] min-w-[298.66px] rounded-xl' height={92} width={298.66} />
            )
          })
        }
      </div>
    </div>
  )
}
export { Section1, Section1Skeleton };
