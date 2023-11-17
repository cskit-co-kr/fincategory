import React, { FunctionComponent } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ChannelAvatar from '../channel/ChannelAvatar';
import { LiaUserSolid } from 'react-icons/lia';
import Image from 'next/image';

type Props = {
  channel: any;
  showType: boolean;
};

const AdChannel: FunctionComponent<Props> = ({ channel, showType }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const style = 'p-4 border border-primary hover:shadow-sm transition ease-in-out duration-300';

  return (
    <div className={`${style} relative flex rounded-xl gap-2.5 text-black bg-white mx-4 md:mx-0`}>
      <Image src='/ad.png' alt='' width={24} height={17} className='absolute -right-[7px] top-3' />
      <Link href={channel.channel_id ? `/channel/${channel.username}` : '/member/ads'} target='_blank'>
        {channel.channel_id ? (
          <ChannelAvatar
            id={channel.channel_id}
            title={channel.title}
            type={channel.type}
            showType={showType}
            typeStyle=''
            size='50'
            shape='rounded-full'
          />
        ) : (
          <div className='border border-primary rounded-full'>
            <Image src='/logo.png' alt='' width={50} height={50} />
          </div>
        )}
      </Link>
      <div className='space-y-3 w-full'>
        <Link
          href={channel.channel_id ? `/channel/${channel.username}` : '/member/ads'}
          className='hover:no-underline hover:text-black'
          target='_blank'
        >
          <h2 className='break-all md:break-words font-semibold line-clamp-1 text-ellipsis overflow-hidden'>{channel.title}</h2>
          <p className={`break-all md:break-words text-xs overflow-hidden mt-1 ${channel.channel_id && 'line-clamp-2'}`}>
            {channel.description}
          </p>
        </Link>
        {channel.channel_id && (
          <div className='flex items-center justify-between text-xs text-gray-500 font-semibold'>
            <span className='flex gap-0.5 items-center'>
              <LiaUserSolid size={16} />
              {t['subscribers']} {channel.subscription?.toLocaleString()}
            </span>
          </div>
        )}
        <div className='tags flex flex-wrap'>
          {channel.tags &&
            channel.tags.map((tag: { id: number; channel_id: number; tag: string }) => {
              return (
                <button
                  onClick={() => {
                    router.push({
                      pathname: 'search',
                      query: { q: '#' + tag.tag },
                    });
                  }}
                  className='bg-gray-100 px-1.5 py-0.5 mx-0.5 mb-0.5 rounded-full text-sm md:text-xs font-semibold hover:underline text-gray-700'
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

export default AdChannel;
