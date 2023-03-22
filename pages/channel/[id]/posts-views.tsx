import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ChannelDetailLeftSidebar from '../../../components/channel/ChannelDetailLeftSidebar';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';
import { AreaChart, Area, Tooltip, XAxis, ResponsiveContainer, Brush, YAxis, CartesianGrid } from 'recharts';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const postsViews = ({ channel, totalViews, averageViews }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const CustomTooltip = ({ active, payload, label, which }: any) => {
    if (active && payload && payload.length) {
      const tooltipName = which === '1' ? t['Average-post-reach'] : t['Views'];
      return (
        <div className='flex flex-col border border-gray-200 rounded-md bg-white text-xs shadow-md'>
          <span className='bg-gray-200 p-1.5'>
            {new Date(label).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className='p-1.5 flex gap-1'>
            <UserCircleIcon className='h-4 text-primary' />
            <b>{tooltipName}:</b> {payload[0].value.toLocaleString()}
          </span>
        </div>
      );
    }
    return null;
  };

  const CustomizedAxisTick = ({ x, y, payload }: any) => {
    const date = new Date(payload.value);
    return (
      <g transform={`translate(${x},${y})`}>
        <text dy={16} textAnchor='middle' fill='#a3a3a3' className='text-xs'>
          {date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          })}
        </text>
      </g>
    );
  };

  const CustomizedYAxisTick = ({ x, y, payload }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor='end' fill='#a3a3a3' className='text-xs'>
          {payload.value.toLocaleString()}
        </text>
      </g>
    );
  };

  const [averagesCount, setAveragesCount] = useState<number>(averageViews.length - 30);
  const [averagesCountWMYA, setAveragesCountWMYA] = useState<string>('month');

  const setAveragesCountRange = (range: any) => {
    switch (range) {
      case 'week':
        setAveragesCount(averageViews.length - 7);
        setAveragesCountWMYA('week');
        console.log(averagesCount);
        break;
      case 'month':
        setAveragesCount(averageViews.length - 30);
        setAveragesCountWMYA('month');
        console.log(averagesCount);
        break;
      case 'year':
        setAveragesCount(averageViews.length - 365);
        setAveragesCountWMYA('year');
        console.log(averagesCount);
        break;
      case 'all':
        setAveragesCount(0);
        setAveragesCountWMYA('all');
        console.log(averagesCount);
        break;
    }
  };

  const [subscribersGrowth, setSubscribersGrowth] = useState<number>(totalViews.length - 30);
  const [subscribersGrowthWMYA, setSubscribersGrowthWMYA] = useState<string>('month');

  const setSubscribersGrowthRange = (range: any) => {
    switch (range) {
      case 'week':
        setSubscribersGrowth(totalViews.length - 7);
        setSubscribersGrowthWMYA('week');
        break;
      case 'month':
        setSubscribersGrowth(totalViews.length - 30);
        setSubscribersGrowthWMYA('month');
        break;
      case 'year':
        setSubscribersGrowth(totalViews.length - 365);
        setSubscribersGrowthWMYA('year');
        break;
      case 'all':
        setSubscribersGrowth(0);
        setSubscribersGrowthWMYA('all');
        break;
    }
  };

  return (
    <div className='pt-36 bg-gray-50'>
      <Head>
        <title>{`${router.query.id} - ${t['Subscribers']} ${t['statistics']}`}</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <div className='md:flex xl:w-[1280px] mx-auto text-black'>
        <ChannelDetailLeftSidebar channel={channel} />
        <div className='w-full xl:w-[974px] flex flex-col gap-4 justify-items-stretch content-start'>
          <div className='w-full xl:w-[974px] mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
            <div className='text-xl mx-auto font-semibold mb-4'>{t['Average-post-reach']}</div>
            {/* <div className='flex gap-0.5 text-xs my-4 h-fit'>
              <button
                onClick={() => setAveragesCountRange('week')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  averagesCountWMYA === 'week' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Week']}
              </button>
              <button
                onClick={() => setAveragesCountRange('month')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  averagesCountWMYA === 'month' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Month']}
              </button>
              <button
                onClick={() => setAveragesCountRange('year')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  averagesCountWMYA === 'year' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Year']}
              </button>
              <button
                onClick={() => setAveragesCountRange('all')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary whitespace-nowrap ${
                  averagesCountWMYA === 'all' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['All-time']}
              </button>
            </div> */}
            <ResponsiveContainer width='100%' height={420}>
              <AreaChart width={270} height={420} data={averageViews}>
                <defs>
                  <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#3886E2' stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip which='1' />} />
                <XAxis dataKey='date' tick={<CustomizedAxisTick />} />
                <YAxis type='number' domain={[0, 'dataMax + 100']} tickCount={6} fontSize={12} tick={<CustomizedYAxisTick />} />
                <CartesianGrid vertical={false} />

                <Brush dataKey='date' stroke='#3886E2' startIndex={averagesCount} endIndex={averageViews.length - 1} />

                <Area type='monotone' dataKey='average' stroke='#3886E2' strokeWidth={2} fillOpacity={1} fill='url(#color)' baseValue='dataMin' />
              </AreaChart>
            </ResponsiveContainer>
            <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['The-average-number']}</div>
          </div>

          <div className='w-full xl:w-[974px] mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
            <div className='text-xl mx-auto font-semibold mb-4'>{t['Views-of-the']}</div>
            <ResponsiveContainer width='100%' height={420}>
              <AreaChart width={270} height={420} data={totalViews}>
                <defs>
                  <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#3886E2' stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip which='2' />} />
                <XAxis dataKey='date' tick={<CustomizedAxisTick />} />
                <YAxis type='number' domain={[0, 'dataMax + 100']} tickCount={6} fontSize={12} tick={<CustomizedYAxisTick />} />
                <CartesianGrid vertical={false} />

                <Brush dataKey='date' stroke='#3886E2' startIndex={totalViews.length - 30} endIndex={totalViews.length - 1} />

                <Area type='monotone' dataKey='views' stroke='#3886E2' strokeWidth={2} fillOpacity={1} fill='url(#color)' baseValue='dataMin' />
              </AreaChart>
            </ResponsiveContainer>
            <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['Total-number-of']}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export const getServerSideProps = async (context: any) => {
  const getId = context.query['id'];
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: getId });
  const channel = response.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ channel_id: channel.channel_id }),
  });
  const combinedReturn = await res.json();
  const totalViews = combinedReturn[0].total.reverse();
  const averageViews = combinedReturn[0].average.reverse();

  return {
    props: {
      channel,
      totalViews,
      averageViews,
    },
  };
};

export default postsViews;
