import React from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

const SubscriberChartMini = ({ data }: any) => {
  return (
    <ResponsiveContainer width='100%' minWidth={0} height={120}>
      <AreaChart width={270} height={120} data={data && data !== null ? data.slice(-30) : []}>
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
  );
};

export default SubscriberChartMini;
