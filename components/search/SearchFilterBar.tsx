import { useRouter } from 'next/router';
import { koKR } from '../../lang/ko-KR';
import { enUS } from '../../lang/en-US';
import { useState } from 'react';
import { Loader } from 'rsuite';

const SearchFilterBar = ({ totalChannels, doFilter }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [selectedSorting, setSelectedSorting] = useState('subscription_desc');
  const [loadBar, setLoadBar] = useState(false);

  return (
    <div className='sorting flex items-center w-full bg-white md:rounded-xl p-3 md:p-4 border border-gray-200'>
      <span className='text-xs'>
        {`${t['total-search-results1']} ${router.query.q ? '"' + router.query.q + '"' : ''}: `}
        {loadBar ? <Loader /> : <b>{totalChannels}</b>}
        {t['total-search-results2']}
      </span>
      <div className='ml-auto flex items-center'>
        <span className='hidden md:inline-flex mr-2'>{t['sort-by']}</span>
        <select
          onChange={(e) => {
            setSelectedSorting(e.target.value);
            doFilter(e.target.value);
          }}
          value={selectedSorting}
          className='border rounded-md pl-2 pr-4 py-1'
          name='select'
        >
          <option value='subscription_desc'>{t['subscribers-desc']} &darr;</option>
          <option value='subscription_asc'>{t['subscribers-asc']} &uarr;</option>
          <option value='today_desc'>오늘 조회수 순 &darr;</option>
          <option value='today_asc'>오늘 조회수 순 &uarr;</option>
          <option value='total_desc'>누적 조회수 순 &darr;</option>
          <option value='total_asc'>누적 조회수 순 &uarr;</option>
          <option value='created_desc'>최근 추가</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilterBar;
