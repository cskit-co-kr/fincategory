import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { UsersIcon, ClipboardDocumentListIcon, CalendarDaysIcon, BoltIcon, ChartBarSquareIcon } from '@heroicons/react/24/outline';
import ChannelDetailLeftSidebar from '../../components/channel/ChannelDetailLeftSidebar';
import Post from '../../components/channel/Post';
import { AreaChart, Area, Tooltip, XAxis, ResponsiveContainer, YAxis } from 'recharts';
import { Loader } from 'rsuite';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='flex flex-col border border-gray-200 rounded-md bg-white text-xs shadow-md'>
        <span className='bg-gray-200 p-1.5'>{label}</span>
        <span className='p-1.5'>{payload[0].value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
};

function Channel({ channel, sub }: any) {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const [loadMoreText, setLoadMoreText] = useState<any>(t['load-more']);
  const [posts, setPosts] = useState<any | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [searchEvent, setSearchEvent] = useState<any | null>(null);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    const getPostData = { username: channel.username, offset: 0, limit: 20 };
    setSearchEvent(getPostData);
    setLoadMore(true);
    setPosts(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(getPostData),
    });
    const resultData = await response.json();
    const result = resultData;
    result.length === 0 ? null : setPosts(result);
    result.length < 20 && setLoadMore(false);
  };

  const handleLoadMore = async (getPostData: any) => {
    setLoadMoreText(<Loader content={t['loading-text']} />);
    getPostData.limit = getPostData.limit + 20;

    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/posts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(getPostData),
    });
    const resultData = await response.json();
    const result = resultData;
    result.messages.length - posts.messages.length !== 20 && setLoadMore(false);
    console.log(result.messages.length);
    setPosts(result);
    setLoadMoreText(t['load-more']);
  };

  const data = sub.map((item: any) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return {
      name: formattedDate,
      sub: item.count,
    };
  });

  return (
    <div className='pt-36 bg-gray-50'>
      <Head>
        <title>{`FinCategory - ${channel.title}`}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <div className='md:flex xl:w-[1280px] w-full mx-auto'>
        <ChannelDetailLeftSidebar channel={channel} />
        <div className='w-full md:w-[974px] flex flex-col gap-4 justify-items-stretch content-start'>
          <div className='flex-col lg:flex-row-reverse flex gap-4'>
            <div className='gap-4 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col'>
              <div className='w-full lg:w-[310px] mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-[20px] bg-white'>
                <div className='font-bold'>{t['subscribers']}</div>
                <ResponsiveContainer width='100%' height={120}>
                  <AreaChart width={270} height={120} data={data.slice(-30)}>
                    <defs>
                      <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                        <stop offset='95%' stopColor='#3886E2' stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<CustomTooltip />} />
                    <XAxis dataKey='name' hide />
                    <YAxis type='number' domain={['dataMin', 'dataMax']} hide />
                    <Area type='monotone' dataKey='sub' stroke='#3886E2' strokeWidth={2} fillOpacity={1} fill='url(#color)' />
                  </AreaChart>
                </ResponsiveContainer>
                <a
                  href={`${router.asPath}/subscribers`}
                  className='flex bg-gray-100 text-center justify-center gap-2 rounded-lg text-sm py-2 text-black hover:bg-gray-200 transition-all duration-300 ease-in-out hover:no-underline hover:text-black mt-2.5'
                >
                  <ChartBarSquareIcon className='h-5' />
                  {t['Subscribers']} {t['statistics']}
                </a>
              </div>

              <div className='grid grid-cols-2 lg:flex lg:flex-wrap w-full lg:w-[310px] gap-4 h-fit mt-4 md:mt-0 '>
                <div className='w-full lg:w-[147px] flex flex-col gap-1 border border-gray-200 rounded-md p-[20px] bg-white'>
                  <div className='flex items-center justify-between text-gray-400'>
                    <UsersIcon className='w-6 h-6 text-primary' />
                    {t['subscribers']}
                  </div>
                  <div className='text-end font-semibold text-2xl'>{channel.subscription.toLocaleString()}</div>
                </div>
                <div className='w-full lg:w-[147px] flex flex-col gap-1 border border-gray-200 rounded-md p-[20px] bg-white'>
                  <div className='flex items-center justify-between text-gray-400'>
                    <ClipboardDocumentListIcon className='w-6 h-6 text-[#55A348]' />
                    {t['views-per-post']}
                  </div>
                  <div className='text-end font-semibold text-2xl'>~3,056</div>
                </div>
                <div className='w-full lg:w-[147px] flex flex-col gap-1 border border-gray-200 rounded-md p-[20px] bg-white'>
                  <div className='flex items-center justify-between text-gray-400'>
                    <CalendarDaysIcon className='w-6 h-6 text-[#9B7C0C]' />
                    {t['posts-per-month']}
                  </div>
                  <div className='text-end font-semibold text-2xl'>~82</div>
                </div>
                <div className='w-full lg:w-[147px] flex flex-col gap-1 border border-gray-200 rounded-md p-[20px] bg-white'>
                  <div className='flex items-center justify-between text-gray-400'>
                    <BoltIcon className='w-6 h-6 text-[#CD5066]' />
                    {t['ERR']}
                  </div>
                  <div className='text-end font-semibold text-2xl'>20.41%</div>
                </div>
              </div>
            </div>

            <div className='w-full lg:w-[648px] gap-4 flex flex-col'>
              {posts ? (
                posts.messages.map((post: any, index: number) => {
                  return <Post channel={channel} post={post} key={index} />;
                })
              ) : (
                <div className='text-center p-10 border border-gray-200 rounded-md mt-4 md:mt-0 md:ml-4 bg-white col-span-3'>{t['no-posts']}</div>
              )}
              {loadMore && (
                <div className='flex justify-center col-span-3'>
                  <button
                    onClick={() => handleLoadMore(searchEvent)}
                    className='bg-primary px-8 rounded-full text-sm py-2 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66]'
                  >
                    {loadMoreText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const getId = context.query['id'];
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: getId });
  const channel = response.data;
  const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, { id: channel.channel_id });
  const sub = responseSub.data;

  return {
    props: {
      channel,
      sub,
    },
  };
};

export default Channel;
