import React from 'react';
import { GetChannels, GetChannelsSkeleton } from '../channel/GetChannels';
import { Skeleton } from '@mui/material';

const Section1 = ({ channels24h, extra }: any) => {
  return (
    <div>
      <div className='grid md:grid-cols-3 gap-4 px-4 pb-4'>
        {channels24h?.map((channel: any) => {
          return (
            <GetChannels
              channels={channel}
              desc={false}
              extra={extra}
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
    <div>
      <div className='grid md:grid-cols-3 gap-4 px-4 pb-4'>
        {Array(6)
          .fill(0)
          .map((val, index) => {
            return (
              <Skeleton
                key={index}
                variant='rectangular'
                sx={{ bgcolor: 'grey.100' }}
                animation='wave'
                height={92}
                // width={298.66}
                className='relative flex md:rounded-xl p-4 gap-2.5 text-black min-h-[92px] max-w-[348px] rounded-xl'
              />
            );
          })}
      </div>
    </div>
  );
};
export { Section1, Section1Skeleton };
