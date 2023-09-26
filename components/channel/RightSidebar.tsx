import React from 'react';
import SubscriberChartMini from './SubscriberChartMini';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { BoltIcon, CalendarDaysIcon, ChartBarSquareIcon, ClipboardDocumentListIcon, UsersIcon } from '@heroicons/react/24/outline';

const RightSidebar = ({ channel, data, averageViews, averagePosts, averageErr }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <div className='rightsidebar'>
      <div className='sticky inset-y-4 gap-4 flex flex-col md:grid md:grid-cols-5 lg:flex lg:flex-col'>
        <div className='w-full md:col-span-3 lg:w-[250px] xl:w-[310px] gap-2 flex flex-col border border-gray-200 rounded-md p-5 bg-white'>
          <div className='font-bold'>{t['subscribers']}</div>
          <SubscriberChartMini data={data} />
          <a
            href={`/channel/${channel?.username}/subscribers`}
            className='flex text-center justify-center gap-2 rounded-full border text-sm py-2 text-primary hover:bg-gray-100 hover:no-underline mt-2.5'
          >
            <ChartBarSquareIcon className='h-5' />
            {t['Subscribers']} {t['statistics']}
          </a>
        </div>

        <div className='text-xs grid grid-cols-2 w-full md:h-[247px] lg:h-[146px] md:col-span-2 lg:w-[250px] xl:w-[310px] gap-4 h-fit border border-gray-200 rounded-md p-4 bg-white'>
          <div className='flex flex-col gap-1 border-r'>
            <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
              <UsersIcon className='w-5 h-5 text-primary' />
              {t['subscribers']}
            </div>
            <div className='text-center font-semibold text-base'>{channel?.subscription?.toLocaleString()}</div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
              <ClipboardDocumentListIcon className='w-5 h-5 text-[#55A348]' />
              {t['views-per-post']}
            </div>
            <div className='text-center font-semibold text-base'>~{averageViews?.toLocaleString()}</div>
          </div>
          <div className='flex flex-col gap-1 border-r'>
            <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
              <CalendarDaysIcon className='w-5 h-5 text-[#9B7C0C]' />
              {t['posts-per-month']}
            </div>
            <div className='text-center font-semibold text-base'>~{averagePosts}</div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
              <BoltIcon className='w-5 h-5 text-[#CD5066]' />
              {t['ERR']}
            </div>
            <div className='text-center font-semibold text-base'>{parseFloat(averageErr).toFixed(2)}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
