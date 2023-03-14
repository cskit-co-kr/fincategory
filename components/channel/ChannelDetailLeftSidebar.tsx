import {
  ArrowsRightLeftIcon,
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
  AtSymbolIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  HandThumbUpIcon,
  LinkIcon,
  RectangleGroupIcon,
  RocketLaunchIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';

const ChannelDetailLeftSidebar = ({ channel }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const menuPath = locale === 'ko' ? '/' : '/en/';
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);

  return (
    <div className='flex flex-col w-full md:w-[310px] mt-4 md:mt-0 md:mr-4 '>
      <div className='sticky top-4'>
        <div className='flex flex-col gap-4 border border-gray-200 rounded-md p-[30px] bg-white items-center'>
          <Image
            src={error ? '/telegram-icon-96.png' : avatar}
            alt={channel.title}
            width={170}
            height={170}
            className='rounded-full object-contain w-20 h-20 md:w-[170px] md:h-[170px]'
            onError={() => setError(true)}
          />
          <div className='text-xl font-semibold text-center'>{channel.title}</div>
          <a
            href={`https://t.me/${channel.username}`}
            target='_blank'
            className='flex items-center gap-1 w-min border-2 border-primary px-3 py-1 rounded-full text-primary text-sm 
                            transition ease-in-out duration-300 hover:bg-primary hover:no-underline hover:text-white'
          >
            @{channel.username}
            <ArrowTopRightOnSquareIcon className='h-4' />
          </a>
          <p>{channel.description}</p>
          <div className='flex flex-col justify-between w-full'>
            <span className='text-gray-400'>{t['category']}</span>
            <span className='text-primary'>{channel.category && JSON.parse(channel.category.name)[locale]}</span>
          </div>
          <div className='flex flex-col justify-between w-full'>
            <span className='text-gray-400'>{t['channel-region-and-language']}</span>
            <span>
              {channel.country.nicename}, {channel.language && channel.language.value}
            </span>
          </div>
        </div>
        <div className='flex gap-4 border border-gray-200 rounded-md p-4 bg-white mt-4'>
          <ul className='w-full text-[0.813rem] font-semibold'>
            <li className={`py-3 px-4 rounded-xl ${router.pathname == '/channel/[id]' ? 'bg-[#F5F7F9]' : 'hover:bg-[#F5F7F9]'}`}>
              <a href={`${menuPath}channel/${channel.username}`} className='hover:no-underline flex gap-2 items-center'>
                <RectangleGroupIcon className='h-3' />
                {t['Summary']}
              </a>
            </li>
            <li className={`py-3 px-4 rounded-xl ${router.pathname == '/channel/[id]/subscribers' ? 'bg-[#F5F7F9]' : 'hover:bg-[#F5F7F9]'}`}>
              <a href={`${menuPath}channel/${channel.username}/subscribers`} className='hover:no-underline flex gap-2 items-center'>
                <UsersIcon className='h-3' />
                {t['Subscribers']}
              </a>
            </li>
            {/* <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <AtSymbolIcon className='h-3' />
              {t['Citation-index']}
            </a>
          </li>
          <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <ChatBubbleLeftRightIcon className='h-3' />
              {t['Citation']}
            </a>
          </li> */}
            <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
              <a href='' className='hover:no-underline flex gap-2 items-center'>
                <EyeIcon className='h-3' />
                {t['Posts-reach']}
              </a>
            </li>
            <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
              <a href='' className='hover:no-underline flex gap-2 items-center'>
                <ChartBarIcon className='h-3' />
                {t['Views-analysis']}
              </a>
            </li>
            {/* <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <RocketLaunchIcon className='h-3' />
              {t['Advertising-efficiency']}
            </a>
          </li> */}
            <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
              <a href='' className='hover:no-underline flex gap-2 items-center'>
                <ArrowTrendingUpIcon className='h-3' />
                {t['Attracting-subscribers']}
              </a>
            </li>
            {/* <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <LinkIcon className='h-3' />
              {t['Invite-links']}
            </a>
          </li> */}
            {/* <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <ArrowsRightLeftIcon className='h-3' />
              {t['External-traffic']}
            </a>
          </li> */}
            <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
              <a href='' className='hover:no-underline flex gap-2 items-center'>
                <HandThumbUpIcon className='h-3' />
                {t['Top-posts']}
              </a>
            </li>
            {/* <li className='py-3 px-4 hover:bg-[#F5F7F9] rounded-xl'>
            <a href='' className='hover:no-underline flex gap-2 items-center'>
              <CalendarDaysIcon className='h-3' />
              {t['Posts-schedule']}
            </a>
          </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailLeftSidebar;
