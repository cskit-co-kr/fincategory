import React, { FunctionComponent } from 'react';
import { Channel } from '../../typings';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChannelAvatar from './ChannelAvatar';

type Props = {
  channels: Channel;
  desc: boolean;
  extra2?: boolean;
};

const GetChannels: FunctionComponent<Props> = ({ channels, desc, extra2 }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  return (
    <div className='relative flex h-full border-b md:border border-gray-200 md:rounded-md bg-white p-4 gap-2.5 text-black transition ease-in-out hover:border-gray-400 duration-300 hover:shadow-sm'>
      {extra2 === true && (
        <div className='bg-primary rounded-full w-fit h-fit absolute -right-2 -top-3 px-2.5 py-1.5 text-xs text-white'>
          +{channels.extra_02}
        </div>
      )}
      <Link href={`/channel/${channels.username}`} className='hover:no-underline hover:text-black' target='_blank'>
        <ChannelAvatar id={channels.channel_id} title={channels.title} size='50' shape='rounded-full' />
      </Link>
      <div className='space-y-2 overflow-hidden w-full'>
        <Link href={`/channel/${channels.username}`} className='hover:no-underline hover:text-black' target='_blank'>
          <h2 className='font-semibold text-sm line-clamp-1 text-ellipsis overflow-hidden'>{channels.title}</h2>
          {desc === true && <p className='text-[12px] h-9 overflow-hidden'>{channels.description}</p>}
        </Link>
        <div className='flex justify-between text-[12px] text-gray-500'>
          <span>
            {t['subscribers']} <b>{channels.subscription?.toLocaleString()}</b>
          </span>
          <span>
            오늘{channels.today && channels.today}/누적{channels.total && channels.total}
          </span>
        </div>
        <div className='tags flex flex-wrap'>
          {channels.tags &&
            channels.tags.map((tag: { id: number; channel_id: number; tag: string }) => {
              return (
                <button
                  onClick={() => {
                    router.push({
                      pathname: 'search',
                      query: { q: '#' + tag.tag },
                    });
                  }}
                  className='bg-gray-100 px-1.5 py-0.5 mx-0.5 mt-0.5 rounded-full text-xs font-semibold hover:underline text-gray-700'
                  key={tag.id}
                >
                  #{tag.tag}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default GetChannels;
