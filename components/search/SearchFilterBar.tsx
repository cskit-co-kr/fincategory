import { useRouter } from 'next/router';
import { koKR } from '../../lang/ko-KR';
import { enUS } from '../../lang/en-US';
import { Loader, SelectPicker } from 'rsuite';
import { ArrowSmallDownIcon } from '@heroicons/react/24/outline';
import { HiOutlineMegaphone, HiOutlineUsers, HiOutlineLockClosed } from 'react-icons/hi2';
import { RiCloseCircleFill } from 'react-icons/ri';

import { useEffect } from 'react';

const SearchFilterBar = ({
  totalChannels,
  doFilter,
  selectedSorting,
  setSelectedSorting,
  loadBar,
  channelType,
  setChannelType,
  selectedTag,
  handleClick,
  doSearch,
}: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const data = [
    {
      label: `${t['subscribers-desc']} ↓`,
      value: 'subscription_desc',
    },
    {
      label: `${t['subscribers-asc']} ↑`,
      value: 'subscription_asc',
    },
    {
      label: `${t['today-desc']}`,
      value: 'today_desc',
    },
    {
      label: `${t['today-asc']}`,
      value: 'today_asc',
    },
    {
      label: `${t['total-desc']}`,
      value: 'total_desc',
    },
    {
      label: `${t['total-asc']}`,
      value: 'total_asc',
    },
    {
      label: `${t['created-desc']}`,
      value: 'created_desc',
    },
  ];

  const handleChange = (e: any) => {
    setSelectedSorting(e);
    doFilter(e);
  };

  const updateChannelType = (type: any) => {
    setChannelType(type);
    setChannelType((state: any) => {
      return state;
    });
  };
  useEffect(() => {
    doSearch((router.query.q as string) || '');
  }, [channelType]);

  return (
    <>
      <div className='sorting flex items-center w-full bg-white md:rounded-xl p-3 md:p-4 border border-gray-200'>
        <div className='flex gap-2 items-center'>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === 'all' ? 'bg-primary border-primary text-white' : 'border-gray-200'
            }`}
            onClick={() => updateChannelType([{ value: 'all', label: t['All'] }])}
          >
            {t['All']}
          </button>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === 'channel' ? 'bg-primary border-primary text-white' : 'border-gray-200'
            }`}
            onClick={() => updateChannelType([{ value: 'channel', label: t['channel'] }])}
          >
            <HiOutlineMegaphone size={16} className={`${channelType[0].value === 'channel' ? 'text-white' : 'text-[#3886E2]'}`} />
            {t['channel']}
          </button>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === 'public_group' ? 'bg-primary border-primary text-white' : 'border-gray-200'
            }`}
            onClick={() => updateChannelType([{ value: 'public_group', label: t['public-group'] }])}
          >
            <HiOutlineUsers size={16} className={`${channelType[0].value === 'public_group' ? 'text-white' : 'text-[#FF7171]'}`} />
            {t['Public Group']}
          </button>
          <button
            className={`flex items-center text-[13px] rounded-lg border px-3 md:px-4 py-2 gap-1 whitespace-nowrap ${
              channelType[0].value === 'private_group' ? 'bg-primary border-primary text-white' : 'border-gray-200'
            }`}
            onClick={() => updateChannelType([{ value: 'private_group', label: t['private-group'] }])}
          >
            <HiOutlineLockClosed size={16} className={`${channelType[0].value === 'private_group' ? 'text-white' : 'text-[#FF7171]'}`} />
            {t['Private Group']}
          </button>
        </div>
        <div className='ml-auto hidden md:flex items-center'>
          <span className='hidden md:inline-flex mr-2'>{t['sort-by']}</span>
          <SelectPicker
            value={selectedSorting}
            onChange={handleChange}
            name='sorting'
            data={data}
            cleanable={false}
            searchable={false}
            size='sm'
            placement='bottomEnd'
          />
        </div>
      </div>
      <div className='flex items-center p-4 md:p-0 gap-4'>
        <div className='text-sm'>
          {`${t['total-search-results1']} ${selectedTag ? '"' + `#${selectedTag}` + '" ' : router.query.q ? router.query.q : ''}: `}
          {loadBar ? <Loader /> : <b>{totalChannels}</b>}
          {t['total-search-results2']}
        </div>
        {router.query.q && (
          <button
            onClick={() => router.push('/search')}
            className='flex items-center gap-1 bg-white text-xs font-semibold rounded-full px-4 py-1 text-primary'
          >
            검색 결과 지우기
            <RiCloseCircleFill className='text-gray-400' />
          </button>
        )}
        <div className='ml-auto flex md:hidden items-center'>
          <span className='hidden md:inline-flex mr-2'>{t['sort-by']}</span>
          <SelectPicker
            value={selectedSorting}
            onChange={handleChange}
            name='sorting'
            data={data}
            cleanable={false}
            searchable={false}
            size='sm'
            placement='bottomEnd'
          />
        </div>
      </div>
    </>
  );
};

export default SearchFilterBar;
