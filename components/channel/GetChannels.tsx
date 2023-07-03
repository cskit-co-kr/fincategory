import React, { FunctionComponent, useState } from 'react';
import { Channel } from '../../typings';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  channels: Channel;
};

const GetChannels: FunctionComponent<Props> = ({ channels }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channels.channel_id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);

  return (
    <Link
      href={{ pathname: '/channel/' + channels.username }}
      className='hover:no-underline group col-span-12 sm:col-span-6 lg:col-span-6 xl:col-span-4'
      target={'_blank'}
    >
      <div className='flex items-start border-b md:border border-gray-200 md:rounded-md bg-white p-4 gap-2.5 text-black max-h-[140px] overflow-hidden transition ease-in-out hover:border-gray-400 duration-300 hover:shadow-sm'>
        <div className='relative w-[50px] min-w-[50px] max-w-[50px]'>
          <Image
            src={error ? '/telegram-icon-96.png' : avatar}
            alt={'avatar of ' + channels.title}
            width={50}
            height={50}
            className='object-contain rounded-full z-0'
            onError={() => setError(true)}
          />
        </div>
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
        </div>
      </div>
    </Link>
  );
};

export default GetChannels;
