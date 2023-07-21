import React, { FunctionComponent } from 'react';
import { Channel } from '../../typings';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChannelAvatar from './ChannelAvatar';

type Props = {
  channels: Channel;
};

const GetChannels: FunctionComponent<Props> = ({ channels }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  return (
    <Link
      href={`/channel/${channels.username}`}
      className='hover:no-underline hover:text-black group col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-4'
      target='_blank'
    >
      <div className='flex h-full border-b md:border border-gray-200 md:rounded-md bg-white p-4 gap-2.5 text-black overflow-hidden transition ease-in-out hover:border-gray-400 duration-300 hover:shadow-sm'>
        <ChannelAvatar id={channels.channel_id} title={channels.title} size='50' shape='rounded-full' />
        <div className='flex flex-1 flex-col gap-2 overflow-hidden'>
          <h2 className='font-semibold text-sm truncate w-full'>{channels.title}</h2>
          <p className='text-[12px] h-9 w-full overflow-hidden'>{channels.description}</p>
          <div className='flex justify-between'>
            <p className='text-[12px] m-0 text-gray-500'>
              {t['subscribers']} <b>{channels.subscription?.toLocaleString()}</b>
            </p>
            <p className='text-[12px] m-0 text-gray-500'>
              오늘{channels.counter.today}/누적{channels.counter.total}
            </p>
          </div>
          <div className='tags flex flex-wrap'>
            {channels.tags &&
              channels.tags.map((tag: { id: number; channel_id: number; tag: string }) => {
                return (
                  <Link href={`/search?q=#${tag.tag}`} className='text-primary mr-1' key={tag.id}>
                    #{tag.tag}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GetChannels;
