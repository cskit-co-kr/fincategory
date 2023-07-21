import axios from 'axios';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { GetChannelsByCategory } from '../components/channel/GetChannelsByCategory';
import CustomImage from '../components/channel/CustomImage';
import Link from 'next/link';
import { Category, PostType } from '../typings';
import { formatDate } from '../lib/utils';
import GetChannels from '../components/channel/GetChannels';

const Home: NextPage = ({ channels, categories, postList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  // const cats = categories?.map((item: any) => {
  //   const obj = JSON.parse(item.name);
  //   return {
  //     value: item.id,
  //     label: locale === 'ko' ? obj.ko : obj.en,
  //   };
  // });
  // const [category, setCategory] = useState<any>([]);

  // useEffect(() => {
  //   setCategory(cats);
  // }, [locale]);

  return (
    <div className='pt-7 px-4 lg:px-0 text-black'>
      <div className='space-y-4'>
        <span className='font-bold text-sm'>오늘 가장 많이 본 채널</span>
        <div className='grid grid-cols-12 gap-0 md:gap-4 justify-items-stretch content-start w-full'>
          {channels.map((channel: any, index: number) => {
            return <GetChannels channels={channel} key={index} />;
          })}
        </div>
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div>
          <div className='flex items-center'>
            <h2 className='font-bold'>일간베스트</h2>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>
            <ul className='text-xs gap-0.5 flex flex-col'>
              {postList?.posts?.map((post: PostType) => (
                <li className='flex gap-1' key={post.id}>
                  <span className='text-gray-400 shrink-0'>&#9642; {formatDate(post.created_at)}</span>
                  <div className='flex w-[230px] md:w-[260px] lg:w-[290px]'>
                    <Link href={`/board/post/${post.id}`} className='truncate break-all md:break-words'>
                      {post.title}
                    </Link>
                    {post?.comment > 0 && <span className='text-red-500 text-[11px] font-semibold'> [{post.comment}]</span>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className='flex items-center'>
            <h2 className='font-bold'>짤방</h2>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>2</div>
        </div>
        <div>
          <div className='flex items-center'>
            <h2 className='font-bold'>핫딜</h2>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>3</div>
        </div>
      </div>

      <div className='flex border border-gray-200 rounded-md bg-white p-4 mt-4'>
        <ul className='grid md:grid-cols-4 gap-4'>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div className='grid md:grid-cols-3 gap-4 mt-4'>
        {channels.map((channel: any, index: number) => (
          <div key={index} className='flex border border-gray-200 rounded-md bg-white p-4'>
            <Link href={'/channel/' + channel.username} className='hover:no-underline text-black hover:text-black'>
              <div className='flex gap-2.5'>
                <div className='flex flex-col items-center max-w-[100px] md:min-w-[100px] gap-3'>
                  <CustomImage
                    className='rounded-full'
                    alt={channel.title}
                    src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`}
                    width={100}
                    height={100}
                  />
                  <div className='flex flex-col items-center text-xs text-gray-400'>
                    {t['subscribers']}
                    <span className='font-bold'>{channel.subscription}</span>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <h1 className='font-semibold text-sm truncate'>{channel.title}</h1>
                  <p className='text-xs'>{channel.description}</p>
                  <div>
                    {channel.country && channel.country.nicename}, {channel.language && channel.language.value}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className='grid md:grid-cols-2 lg:grid-cols-3 mt-4 gap-4'>
        {categories?.map((category: Category) => (
          <div key={category.id}>
            <div className='flex items-center'>
              <h2 className='font-bold'>{JSON.parse(category.name)[locale as string]}</h2>
              <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
                {t['see-more']}
                <ChevronRightIcon className='h-3' />
              </a>
            </div>
            <div className='border border-gray-200 rounded-md bg-white p-4'>{<GetChannelsByCategory value={category.id} label='' />}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = {
    query: null,
    withDesc: false,
    category: [],
    country: [],
    language: [],
    channel_type: null,
    channel_age: 0,
    erp: 0,
    subscribers_from: null,
    subscribers_to: null,
    paginate: { limit: 4, offset: 0 },
    sort: { field: 'created_at', order: 'desc' },
  };

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data);
  const channels = await response.data.channel;

  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`);
  const categories = await result.data;

  // Get Posts List
  const responsePost = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=null&category=null&postsperpage=6`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }
  );
  const postList = await responsePost.json();

  return {
    props: { channels, categories, postList },
  };
};

export default Home;
