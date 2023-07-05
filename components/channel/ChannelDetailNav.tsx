import {
  EyeIcon,
  HandThumbUpIcon,
  RectangleGroupIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon 
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";

const ChannelDetailNav = ({ channel }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const menuPath = locale === 'ko' ? '/' : '/en/';
  const liSelected = 'bg-primary text-white border border-primary';
  const liNormal = 'bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary';
  const aNormal = 'py-2 px-3.5 hover:no-underline flex gap-2 justify-center items-center hover:text-white';
  return (
    <>
      <ul className='w-full text-sm grid sm:flex gap-2 bg-[#f2f2f2] rounded-md p-2 mt-4 md:mt-0'>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}`} className={aNormal}>
            <RectangleGroupIcon className='h-3 hidden md:inline' />
            {t['Summary']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/subscribers' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/subscribers`} className={aNormal}>
            <UsersIcon className='h-3 hidden md:inline' />
            {t['Subscribers']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/posts-views' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/posts-views`} className={aNormal}>
            <EyeIcon className='h-3 hidden md:inline' />
            {t['Posts-reach']}
          </a>
        </li>
        <li className={`rounded-lg ${router.pathname == '/channel/[id]/top-posts' ? liSelected : liNormal}`}>
          <a href={`${menuPath}channel/${channel.username}/top-posts`} className={aNormal}>
            <HandThumbUpIcon className='h-3 hidden md:inline' />
            {t['Top-posts']}
          </a>
        </li>
        <li
          className={`rounded-lg ${
            router.pathname == "/channel/[id]/comments" ? liSelected : liNormal
          }`}
        >
          <a
            href={`${menuPath}channel/${channel.username}/comments`}
            className={aNormal}
          >
            <ChatBubbleLeftRightIcon className="h-3 hidden md:inline" />
            {t["Comments"]} ({channel.comment})
          </a>
        </li>
      </ul>
    </>
  );
};

export default ChannelDetailNav;
