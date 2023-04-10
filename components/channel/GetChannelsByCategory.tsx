import { Skeleton } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CustomImage from './CustomImage';

export const GetChannelsByCategory = ({ value, label }: any) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    (async () => {
      const data = {
        query: null,
        withDesc: false,
        category: [{ value: value, label: label }],
        country: [],
        language: [],
        channel_type: null,
        channel_age: 0,
        erp: 0,
        subscribers_from: null,
        subscribers_to: null,
        paginate: { limit: 10, offset: 0 },
        sort: { field: 'subscription', order: 'desc' },
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setChannels(result.channel);
    })();
  }, []);

  return (
    <div className='gap-2 grid'>
      {channels ? (
        channels.map((channel: any, index: number) => (
          <Link href={'/channel/' + channel.username} className='hover:no-underline' key={index}>
            <div className='flex items-center gap-2'>
              <CustomImage
                className='rounded-full'
                width={28}
                height={28}
                alt={channel.title}
                src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`}
              />
              <span className='truncate w-[220px] md:w-[280px]'>{channel.title}</span>

              <span className='ml-auto text-xs'>{channel.subscription?.toLocaleString()}</span>
            </div>
          </Link>
        ))
      ) : (
        <div className='flex'>
          <Skeleton variant='circular' width={28} height={28} />
          <Skeleton variant='rectangular' width={210} height={28} />
        </div>
      )}
    </div>
  );
};
