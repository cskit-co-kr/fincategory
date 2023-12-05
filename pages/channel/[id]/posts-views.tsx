import { UserCircleIcon } from '@heroicons/react/24/solid';
import { PiInfoLight } from 'react-icons/pi';
import { Tooltip as AntTooltip } from 'antd';
import axios from 'axios';
import { Tooltip as TT, Whisper } from 'rsuite';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Area, AreaChart, Brush, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChannelDetailLeftSidebar } from '../../../components/channel/ChannelDetailLeftSidebar';
import { ChannelDetailNav } from '../../../components/channel/ChannelDetailNav';

import { NextSeo } from 'next-seo';
import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';

const postsViews = ({ channel, totalViews, averageViews, errPercent }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const CustomTooltip = ({ active, payload, label, which }: any) => {
    if (active && payload && payload.length) {
      let tooltipName;
      switch (which) {
        case '1':
          tooltipName = t['Average-post-reach'];
          break;
        case '2':
          tooltipName = t['Views'];
          break;
        case '3':
          tooltipName = t['ERR'];
          break;
      }

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
            <b>{tooltipName}:</b> {Math.round(payload[0].value).toLocaleString()}
            {which === '3' && '%'}
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
        <text dy={12} textAnchor='middle' fill='#333333' className='text-[10px]'>
          {date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </text>
      </g>
    );
  };

  const CustomizedYAxisTick = ({ x, y, payload, which }: any) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} textAnchor='end' fill='#333333' className='text-[10px]'>
          {Math.round(payload.value).toLocaleString()}
          {which === '3' && '%'}
        </text>
      </g>
    );
  };

  const [averagesCount, setAveragesCount] = useState<number>(averageViews.length - 30);

  const [averagesCountWMYA, setAveragesCountWMYA] = useState<string>('month');

  // const setAveragesCountRange = (range: any) => {
  //   switch (range) {
  //     case "week":
  //       setAveragesCount(averageViews.length - 7);
  //       setAveragesCountWMYA("week");
  //       break;
  //     case "month":
  //       setAveragesCount(averageViews.length - 30);
  //       setAveragesCountWMYA("month");
  //       break;
  //     case "year":
  //       setAveragesCount(averageViews.length - 365);
  //       setAveragesCountWMYA("year");
  //       break;
  //     case "all":
  //       setAveragesCount(0);
  //       setAveragesCountWMYA("all");
  //       // console.log(averagesCount);
  //       break;
  //   }
  // };

  const [totalCount, setTotalCount] = useState<number>(totalViews.length - 30);
  const [totalWMYA, setTotalWMYA] = useState<string>('month');

  // const setTotalViewsRange = (range: any) => {
  //   switch (range) {
  //     case "week":
  //       setTotalCount(totalViews.length - 7);
  //       setTotalWMYA("week");
  //       break;
  //     case "month":
  //       setTotalCount(totalViews.length - 30);
  //       setTotalWMYA("month");
  //       break;
  //     case "year":
  //       setTotalCount(totalViews.length - 365);
  //       setTotalWMYA("year");
  //       break;
  //     case "all":
  //       setTotalCount(0);
  //       setTotalWMYA("all");
  //       break;
  //   }
  // }

  const [errPercentCount, setErrPercentCount] = useState<number>(errPercent.length - 30);

  let tx = 1;
  const CustomTraveller = ({ x, y }: any) => {
    if (tx++ % 2 === 0) {
      return (
        <g transform={`translate(${x - 5},${y})`}>
          <image href='/handles-right-svg.svg' width={20} height={35} />
        </g>
      );
    } else {
      return (
        <g transform={`translate(${x + 1},${y})`}>
          <image href='/handles-left-svg.svg' width={20} height={35} />
        </g>
      );
    }
  };

  return (
    <>
      <NextSeo
        noindex={true}
        nofollow={true}
        title={channel.title}
        description={channel.description}
        additionalMetaTags={[
          { name: 'title', content: `${channel.title} | FinCa ` },
          { name: 'og:title', content: channel.title },
          { name: 'og:description', content: channel.description },
          { name: 'twitter:title', content: channel.title },
          { name: 'twitter:description', content: channel.description },
        ]}
      />
      <div className='pt-7 bg-gray-50'>
        <div className='md:flex xl:w-[1280px] mx-auto text-black'>
          <ChannelDetailLeftSidebar channel={channel} />
          <div className='w-full flex flex-col gap-4 justify-items-stretch content-start'>
            <ChannelDetailNav channel={channel} />
            <div className='w-full mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
              <div className='text-base font-bold mt-2 ml-16 mb-10 flex items-center gap-2'>
                {t['Average-post-reach']}

                <AntTooltip
                  title='일 전체 포스트 조회수 합 / 일 전체 포스트 수'
                  arrow={false}
                  placement='bottom'
                  color='#fafafa'
                  overlayClassName='rounded-lg'
                  overlayInnerStyle={{
                    color: '#435066',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    padding: '10px',
                    width: 'fit-content',
                    boxShadow: 'none',
                    border: '1px solid #e8e8e8',
                  }}
                >
                  <PiInfoLight size={20} />
                </AntTooltip>
              </div>
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
              <ResponsiveContainer width='95%' style={{ margin: 'auto' }} height={420}>
                <AreaChart width={270} height={420} data={averageViews}>
                  <defs>
                    <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#3886E2' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip which='1' />} />
                  <XAxis dataKey='date' tick={<CustomizedAxisTick />} />
                  <YAxis
                    type='number'
                    domain={[0, 'dataMax + 10']}
                    axisLine={false}
                    tickCount={7}
                    tickLine={false}
                    fontSize={10}
                    tick={<CustomizedYAxisTick />}
                  />
                  <CartesianGrid vertical={false} strokeDasharray='6 2' strokeWidth={1} strokeOpacity={0.5} />
                  <Brush
                    dataKey='date'
                    stroke='#3886E2'
                    startIndex={0}
                    endIndex={averageViews.length - 1}
                    height={35}
                    travellerWidth={15}
                    traveller={<CustomTraveller />}
                  >
                    <AreaChart height={35} data={averageViews}>
                      <rect x={0} y={0} width='100%' height='100%' fill='#f2f2f2' />
                      <defs>
                        <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#8884d8' stopOpacity={0.8} />
                          <stop offset='95%' stopColor='#8884d8' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type='monotone'
                        dataKey='average'
                        stroke='#3886E2'
                        strokeWidth={1}
                        fillOpacity={1}
                        fill='url(#color)'
                        baseValue='dataMin'
                      />
                    </AreaChart>
                  </Brush>
                  <Area
                    type='monotone'
                    dataKey='average'
                    stroke='#3886E2'
                    strokeWidth={1}
                    fillOpacity={1}
                    fill='url(#color)'
                    baseValue='dataMin'
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['The-average-number']}</div>
            </div>

            <div className='w-full mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
              <div className='text-base font-bold mt-2 ml-16 mb-10 flex items-center gap-2'>{t['Views-of-the']}</div>
              <ResponsiveContainer width='95%' style={{ margin: 'auto' }} height={420}>
                <AreaChart width={270} height={420} data={totalViews}>
                  <defs>
                    <linearGradient id='color2' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#55A348' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#55A348' stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip which='2' />} />
                  <XAxis dataKey='date' tick={<CustomizedAxisTick />} />
                  <YAxis
                    type='number'
                    domain={[0, 'dataMax + 100']}
                    axisLine={false}
                    tickCount={7}
                    tickLine={false}
                    fontSize={12}
                    tick={<CustomizedYAxisTick />}
                  />
                  <CartesianGrid vertical={false} strokeDasharray='6 2' strokeWidth={1} strokeOpacity={0.5} />
                  <Brush
                    dataKey='date'
                    stroke='#55A348'
                    startIndex={0}
                    endIndex={totalViews.length - 1}
                    height={35}
                    travellerWidth={15}
                    traveller={<CustomTraveller />}
                  >
                    <AreaChart height={35} data={totalViews}>
                      <rect x={0} y={0} width='100%' height='100%' fill='#f2f2f2' />
                      <defs>
                        <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#55A348' stopOpacity={0.8} />
                          <stop offset='95%' stopColor='#55A348' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type='monotone'
                        dataKey='total'
                        stroke='#55A348'
                        strokeWidth={1}
                        fillOpacity={1}
                        fill='url(#color2)'
                        baseValue='dataMin'
                      />
                    </AreaChart>
                  </Brush>
                  <Area
                    type='monotone'
                    dataKey='total'
                    stroke='#55A348'
                    strokeWidth={1}
                    fillOpacity={1}
                    fill='url(#color2)'
                    baseValue='dataMin'
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['Total-number-of']}</div>
            </div>

            <div className='w-full mt-4 md:mt-0 gap-2 flex flex-col border border-gray-200 rounded-md p-5 pl-0 bg-white'>
              <div className='text-base font-bold mt-2 ml-16 mb-10 flex items-center gap-2'>
                {t['ERR-engagement-by-views']}

                <AntTooltip
                  title='일 평균 포스트 조회수 / 일 평균 구독자 수'
                  arrow={false}
                  placement='bottom'
                  color='#fafafa'
                  overlayClassName='rounded-lg'
                  overlayInnerStyle={{
                    color: '#435066',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    padding: '10px',
                    width: 'fit-content',
                    boxShadow: 'none',
                    border: '1px solid #e8e8e8',
                  }}
                >
                  <PiInfoLight size={20} />
                </AntTooltip>
              </div>
              <ResponsiveContainer width='95%' style={{ margin: 'auto' }} height={420}>
                <AreaChart width={270} height={420} data={errPercent}>
                  <defs>
                    <linearGradient id='color3' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='5%' stopColor='#CD5066' stopOpacity={0.3} />
                      <stop offset='95%' stopColor='#CD5066' stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip which='3' />} />
                  <XAxis dataKey='date' tick={<CustomizedAxisTick />} />
                  <YAxis
                    type='number'
                    domain={[0, 'dataMax']}
                    axisLine={false}
                    tickCount={5}
                    tickLine={false}
                    fontSize={12}
                    tick={<CustomizedYAxisTick which='3' />}
                  />
                  <CartesianGrid vertical={false} strokeDasharray='6 2' strokeWidth={1} strokeOpacity={0.5} />
                  <Brush
                    dataKey='date'
                    stroke='#CD5066'
                    startIndex={0}
                    endIndex={errPercent.length - 1}
                    height={35}
                    travellerWidth={15}
                    traveller={<CustomTraveller />}
                  >
                    <AreaChart height={35} data={errPercent}>
                      <rect x={0} y={0} width='100%' height='100%' fill='#f2f2f2' />
                      <defs>
                        <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%' stopColor='#CD5066' stopOpacity={0.8} />
                          <stop offset='95%' stopColor='#CD5066' stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type='monotone'
                        dataKey='views'
                        stroke='#CD5066'
                        strokeWidth={1}
                        fillOpacity={1}
                        fill='url(#color3)'
                        baseValue='dataMin'
                      />
                    </AreaChart>
                  </Brush>
                  <Area
                    type='monotone'
                    dataKey='views'
                    stroke='#CD5066'
                    strokeWidth={1}
                    fillOpacity={1}
                    fill='url(#color3)'
                    baseValue='dataMin'
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className='p-4 ml-4 mt-4 bg-gray-50 border border-gray-200 rounded-md'>{t['Percentage-of-subscribers']}</div>
            </div>
          </div>
        </div>
      </div>
    </>
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
  const totalViews = combinedReturn[0].total;
  const averageViews = combinedReturn[0].average;
  const errPercent = combinedReturn[0].average.map((item: any) => ({
    date: item.date,
    views: Math.round((item.average * 100) / channel.subscription),
  }));

  return {
    props: { channel, totalViews, averageViews, errPercent },
  };
};

export default postsViews;
