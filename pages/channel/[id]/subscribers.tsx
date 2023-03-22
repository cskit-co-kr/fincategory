import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { PureComponent, useState } from 'react';
import ChannelDetailLeftSidebar from '../../../components/channel/ChannelDetailLeftSidebar';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';
import { AreaChart, Area, Tooltip, XAxis, ResponsiveContainer, Brush, YAxis, Label, Text, CartesianGrid } from 'recharts';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import SubscriberGrowthTable from '../../../components/channel/SubscriberGrowthTable';
import { Pagination } from 'rsuite';

const ITEMS_PER_PAGE = 30;

const subscribers = ({ channel, sub }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='flex flex-col border border-gray-200 rounded-md bg-white text-xs shadow-md'>
          <span className='bg-gray-200 p-1.5'>
            {new Date(label).toLocaleTimeString(locale === 'ko' ? 'ko-KR' : 'en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
          <span className='p-1.5 flex gap-1'>
            <UserCircleIcon className='h-4 text-primary' />
            <b>{t['Subscribers']}:</b> {payload[0].value.toLocaleString()}
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

  const data = sub.map((item: any) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return {
      name: formattedDate,
      sub: item.count,
    };
  });

  const growthData = data.slice(1).map((val: any, idx: any) => ({ name: val.name, sub: val.sub - data[idx].sub }));
  const growthData2 = data.slice(1).map((val: any, idx: any) => ({
    name: val.name,
    sub: val.sub,
    diff: val.sub - data[idx].sub,
  }));
  const gradientOffset = () => {
    const dataMax = Math.max(...growthData.map((i: any) => i.sub));
    const dataMin = Math.min(...growthData.map((i: any) => i.sub));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };
  const off = gradientOffset();

  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = growthData2.reverse().slice(startIndex, endIndex);

  const [subscribersCount, setSubscribersCount] = useState<number>(data.length - 30);
  const [subscribersCountWMYA, setSubscribersCountWMYA] = useState<string>('month');

  const setSubscribersCountRange = (range: any) => {
    switch (range) {
      case 'week':
        setSubscribersCount(data.length - 7);
        setSubscribersCountWMYA('week');
        break;
      case 'month':
        setSubscribersCount(data.length - 30);
        setSubscribersCountWMYA('month');
        break;
      case 'year':
        setSubscribersCount(data.length - 365);
        setSubscribersCountWMYA('year');
        break;
      case 'all':
        setSubscribersCount(0);
        setSubscribersCountWMYA('all');
        break;
    }
  };

  const [subscribersGrowth, setSubscribersGrowth] = useState<number>(data.length - 30);
  const [subscribersGrowthWMYA, setSubscribersGrowthWMYA] = useState<string>('month');

  const setSubscribersGrowthRange = (range: any) => {
    switch (range) {
      case 'week':
        setSubscribersGrowth(data.length - 7);
        setSubscribersGrowthWMYA('week');
        break;
      case 'month':
        setSubscribersGrowth(data.length - 30);
        setSubscribersGrowthWMYA('month');
        break;
      case 'year':
        setSubscribersGrowth(data.length - 365);
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
            <div className='ml-5 gap-4 items-center'>
              <div className='pb-2 text-lg font-semibold text-center'>{t['Subscribers-count']}</div>
              <div className='flex gap-0.5 text-xs my-4 h-fit'>
                <button
                  onClick={() => setSubscribersCountRange('week')}
                  className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                    subscribersCountWMYA === 'week' ? 'border border-primary bg-white' : 'bg-gray-100'
                  }`}
                >
                  {t['Week']}
                </button>
                <button
                  onClick={() => setSubscribersCountRange('month')}
                  className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                    subscribersCountWMYA === 'month' ? 'border border-primary bg-white' : 'bg-gray-100'
                  }`}
                >
                  {t['Month']}
                </button>
                <button
                  onClick={() => setSubscribersCountRange('year')}
                  className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                    subscribersCountWMYA === 'year' ? 'border border-primary bg-white' : 'bg-gray-100'
                  }`}
                >
                  {t['Year']}
                </button>
                <button
                  onClick={() => setSubscribersCountRange('all')}
                  className={`rounded-md px-1 py-0.5 border hover:border-primary whitespace-nowrap ${
                    subscribersCountWMYA === 'all' ? 'border border-primary bg-white' : 'bg-gray-100'
                  }`}
                >
                  {t['All-time']}
                </button>
              </div>
            </div>
            <ResponsiveContainer width='100%' height={420}>
              <AreaChart width={270} height={420} data={data}>
                <defs>
                  <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                    <stop offset='95%' stopColor='#3886E2' stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <XAxis dataKey='name' tick={<CustomizedAxisTick />} axisLine={false} />
                <YAxis type='number' domain={['dataMin - 100', 'dataMax + 100']} tickCount={6} fontSize={12} tick={<CustomizedYAxisTick />} />
                <CartesianGrid vertical={false} />

                <Brush dataKey='name' stroke='#3886E2' startIndex={subscribersCount} endIndex={data.length - 1} />

                <Area type='monotone' dataKey='sub' stroke='#3886E2' strokeWidth={2} fillOpacity={1} fill='url(#color)' baseValue='dataMin' />
              </AreaChart>
            </ResponsiveContainer>
            <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['The-graph-above'].replace('%{channel.title}', channel.title)}</div>
          </div>

          <div className='w-full xl:w-[974px] mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
            <div className='text-xl mx-auto font-semibold'>
              {t['Subscribers']} {t['gain']}
            </div>
            <div className='flex gap-0.5 text-xs m-4 h-fit'>
              <button
                onClick={() => setSubscribersGrowthRange('week')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  subscribersGrowthWMYA === 'week' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Week']}
              </button>
              <button
                onClick={() => setSubscribersGrowthRange('month')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  subscribersGrowthWMYA === 'month' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Month']}
              </button>
              <button
                onClick={() => setSubscribersGrowthRange('year')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary ${
                  subscribersGrowthWMYA === 'year' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['Year']}
              </button>
              <button
                onClick={() => setSubscribersGrowthRange('all')}
                className={`rounded-md px-1 py-0.5 border hover:border-primary whitespace-nowrap ${
                  subscribersGrowthWMYA === 'all' ? 'border border-primary bg-white' : 'bg-gray-100'
                }`}
              >
                {t['All-time']}
              </button>
            </div>
            <ResponsiveContainer width='100%' height={420}>
              <AreaChart width={270} height={420} data={growthData}>
                <Tooltip content={<CustomTooltip />} />
                <XAxis dataKey='name' tick={<CustomizedAxisTick />} />
                <YAxis type='number' domain={['dataMin', 'dataMax']} tickCount={6} fontSize={12} tick={<CustomizedYAxisTick />} />
                <CartesianGrid vertical={false} />
                <Brush dataKey='name' stroke='#3886E2' startIndex={subscribersGrowth} endIndex={growthData.length - 1} />
                <defs>
                  <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset={off} stopColor='#3886E2' stopOpacity={1} />
                    <stop offset={off} stopColor='#3886E2' stopOpacity={1} />
                  </linearGradient>
                </defs>
                <Area type='monotone' dataKey='sub' stroke='#3886E2' strokeWidth={2} fillOpacity={0.5} fill='url(#splitColor)' />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='w-full mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 bg-white'>
            <span className='font-semibold text-lg mb-1'>{t['by-days']}</span>
            <div className=''>
              {/* <SubscriberGrowthTable growthData2={growthData2} /> */}
              {currentItems.map((item: any, index: number) => (
                <div className='flex space-between w-full p-2.5 border-t' key={index}>
                  <div className='basis-1/3 text-gray-400'>
                    {new Date(item.name).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className='basis-1/3 text-center'>{item.sub.toLocaleString()}</div>
                  <div className={`basis-1/3 text-right pr-2 ${item.diff < 0 ? 'text-red-400' : 'text-green-500'}`}>{item.diff}</div>
                </div>
              ))}
              <div className='mt-2.5 bg-gray-100 p-2 rounded-md'>
                <Pagination total={growthData2.length} limit={ITEMS_PER_PAGE} activePage={currentPage} onChangePage={(page) => setCurrentPage(page)} />
              </div>
            </div>
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
  const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, { id: channel.channel_id });
  const sub = responseSub.data;

  return {
    props: {
      channel,
      sub,
    },
  };
};

export default subscribers;
