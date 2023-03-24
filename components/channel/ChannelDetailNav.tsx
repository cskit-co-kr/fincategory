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
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { Channel } from '../../typings';

const ChannelDetailNav = ({ channel }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const menuPath = locale === 'ko' ? '/' : '/en/';
  const liSelected = 'bg-primary text-white border border-primary';
  const liNormal = 'bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary';
  const aNormal = 'py-2 px-3.5 hover:no-underline flex gap-2 items-center hover:text-white';
  return (
    <div>
      <ul className='w-full text-[0.813rem] font-semibold flex gap-2 bg-[#f2f2f2] rounded-md p-2'>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}`} className={aNormal}>
            <RectangleGroupIcon className='h-3' />
            {t['Summary']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/subscribers' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/subscribers`} className={aNormal}>
            <UsersIcon className='h-3' />
            {t['Subscribers']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/posts-views' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/posts-views`} className={aNormal}>
            <EyeIcon className='h-3' />
            {t['Posts-reach']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/top-posts' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/top-posts`} className={aNormal}>
            <HandThumbUpIcon className='h-3' />
            {t['Top-posts']}
          </a>
        </li>
      </ul>
    </div>
  );
};

export default ChannelDetailNav;
