import React, { FunctionComponent } from 'react';
import { Channel } from '../../typings';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChannelAvatar from './ChannelAvatar';
import { LiaUserSolid } from 'react-icons/lia';

type Props = {
  channels: Channel;
  desc: boolean;
  tag?: boolean;
  views?: boolean;
  bordered?: boolean;
  extra2?: boolean;
};

const GetChannels: FunctionComponent<Props> = ({ channels, desc, tag, views, bordered, extra2 }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const style =
    bordered === true ? 'border-b md:border border-gray-200 hover:shadow-sm transition ease-in-out hover:border-gray-400 duration-300' : '';

  return (
    <div className={`${style} relative flex h-full md:rounded-xl bg-white p-4 gap-2.5 text-black`}>
      {extra2 === true && (
        <div className='bg-primary rounded-full w-fit h-fit absolute left-1 top-1 px-1.5 py-0.5 text-xs text-white z-10'>
          +{channels.extra_02}
        </div>
      )}
      <Link href={`/channel/${channels.username}`} className='hover:no-underline hover:text-black' target='_blank'>
        <ChannelAvatar id={channels.channel_id} title={channels.title} size='50' shape='rounded-full' />
      </Link>
      <div className='space-y-3 overflow-hidden w-full'>
        <Link href={`/channel/${channels.username}`} className='hover:no-underline hover:text-black' target='_blank'>
          <h2 className='font-semibold text-sm line-clamp-1 text-ellipsis overflow-hidden'>{channels.title}</h2>
          {desc === true && <p className='text-[12px] h-9 overflow-hidden'>{channels.description}</p>}
        </Link>
        <div className='flex items-center justify-between text-[12px] text-gray-500 font-bold'>
          <span className='flex gap-0.5 items-center'>
            <LiaUserSolid size={16} />
            {t['subscribers']} {channels.subscription?.toLocaleString()}
          </span>
          {views === true && (
            <span className='flex items-center gap-0.5'>
              오늘{channels.today && channels.today}/누적{channels.total && channels.total}
            </span>
          )}
        </div>
        <div className='tags flex flex-wrap'>
          {channels.tags &&
            tag === true &&
            channels.tags.map((tag: { id: number; channel_id: number; tag: string }) => {
              return (
                <button
                  onClick={() => {
                    router.push({
                      pathname: 'search',
                      query: { q: '#' + tag.tag },
                    });
                  }}
                  className='bg-gray-100 px-1.5 py-0.5 mx-0.5 rounded-full text-xs font-semibold hover:underline text-gray-700'
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

GetChannels.defaultProps = {
  tag: true,
  views: true,
  bordered: true,
};

export default GetChannels;
