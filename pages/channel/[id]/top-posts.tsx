import { EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import ChannelDetailLeftSidebar from '../../../components/channel/ChannelDetailLeftSidebar';
import ChannelDetailNav from '../../../components/channel/ChannelDetailNav';
import PostMini from '../../../components/channel/PostMini';
import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';
import { Channel } from '../../../typings';
import { NextSeo } from 'next-seo';

function TopPosts(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const channel: Channel = props.channel;
  const lastMonthData = props.lastMonthData;
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  return (
    <>
      <NextSeo
        title={channel.title}
        description={channel.description}
        additionalMetaTags={[
          { name: 'og:title', content: channel.title },
          { name: 'og:description', content: channel.description },
          { name: 'twitter:title', content: channel.title },
          { name: 'twitter:description', content: channel.description },
        ]}
      />
      <div className='pt-7 bg-gray-50'>
        <Head>
          <title>{`${router.query.id} - ${t['Top-posts']}`}</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='md:flex xl:w-[1280px] mx-auto text-black'>
          <ChannelDetailLeftSidebar channel={channel} />
          <div className='w-full xl:w-[974px] flex flex-col gap-4 justify-items-stretch content-start'>
            <ChannelDetailNav channel={channel} />
            <div className='w-full xl:w-[974px] mt-4 md:mt-0 gap-4 flex flex-col border border-gray-200 rounded-md p-4 bg-white'>
              <div className='text-xl mx-auto font-semibold my-4'>{t['The-most-popular-posts']}</div>
              <div className='p-4 bg-gray-50 border border-gray-200 rounded-md'>{t['top-posts-text-1'].replace('%{channel.title}', channel.title)}</div>
              {lastMonthData.length !== 0 ? (
                lastMonthData.map((post: any, index: number) => {
                  return <PostMini channel={channel} post={post} key={index} />;
                })
              ) : (
                <div className='text-center p-10 border border-gray-200 rounded-md bg-white'>{t['no-posts']}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context: any) => {
  const getId = context.query['id'];
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: getId });
  const channel: Channel = response.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      channel_id: channel.channel_id,
      get_what: 'ordered',
    }),
  });
  const lastMonthData = await res.json();

  return {
    props: { channel, lastMonthData },
  };
};

export default TopPosts;
