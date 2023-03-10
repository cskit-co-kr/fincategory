import { useRouter } from 'next/router';
import React, { FunctionComponent, useState } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';

type FData = {
  total: number;
};

const ChannelFilter: FunctionComponent<FData> = ({ total }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  function doFilter(e: any) {
    const [sorting, setSorting] = useState({ field: 'subscription', order: 'desc' });
    switch (e) {
      case 'subscription_desc':
        return setSorting({ field: 'subscription', order: 'desc' });
      case 'name_asc':
        return setSorting({ field: 'title', order: 'asc' });
      case 'name_desc':
        return setSorting({ field: 'title', order: 'desc' });
      default:
        return 'foo';
    }
  }

  return (
    <div className='md:flex items-center w-full bg-white rounded-md px-4 py-3 col-span-3 border border-gray-200 mt-4 md:mt-0'>
      <span className='text-xs'>
        {t['total-search-results1']}
        <b>{total}</b>
        {t['total-search-results2']}
      </span>
      <div className='ml-auto'>
        <select
          onChange={(e) => doFilter(e.target.value)}
          className='border rounded-md pl-2 pr-5 py-1 mt-4 md:mt-0'
        >
          <option value='subscription_desc'>Sort by: Subscribers</option>
          <option value='name_asc'>Name A-Z</option>
          <option value='name_desc'>Name Z-A</option>
        </select>
      </div>
    </div>
  );
};

export default ChannelFilter;
