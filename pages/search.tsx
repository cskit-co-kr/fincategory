import axios from 'axios';
import React, { useEffect, useRef, useState, useTransition } from 'react';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import { GetChannels, GetChannelsSkeleton } from '../components/channel/GetChannels';
import { Loader } from 'rsuite';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Section1, Section1Skeleton } from '../components/search/Section1';
import { Section2_1Skeleton, Section2_1 } from '../components/search/Section2_1';
import { Section2_2, Section2_2Skeleton } from '../components/search/Section2_2';
import { Skeleton } from '@mui/material';
import HashtagScroll from '../components/HashtagScroll';
import Section3 from '../components/search/Section3';
import SearchFilterBar from '../components/search/SearchFilterBar';
import Ads1 from '../components/search/Ads1';
import addAds2 from '../lib/ads2';
import AdChannel2 from '../components/search/AdChannel2';

const Search = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [selectedTag, setSelectedTag] = useState('');
  const [sortType, setSortType] = useState(1);

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  useEffect(() => {
    if (!isFirstLoad) {
      const tag = selectedTag ? `#${selectedTag}` : '';
      doSearch(tag);
    }
    setIsFirstLoad(false);
  }, [selectedTag]);

  const [searchText, setSearchText] = useState<any>('');
  const [selectDesc, setSelectDesc] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>([{ value: 113, label: 'Korea, Republic of' }]);
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>([{ value: 'ko', label: 'Korean' }]);
  const [channelType, setChannelType] = useState<any | null>([{ value: 'all', label: t['All'] }]);
  const [channelsAge, setChannelsAge] = useState<number>(0);
  const [channelsERP, setChannelsERP] = useState<number>(0);
  const [subscribersFrom, setSubscribersFrom] = useState<any | null>('');
  const [subscribersTo, setSubscribersTo] = useState<any | null>('');
  const [sorting, setSorting] = useState({
    field: 'subscription',
    order: 'desc',
  });
  const [selectedSorting, setSelectedSorting] = useState<string>('subscription_desc');

  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchResultText, setSearchResultText] = useState<any>(t['empty-search-text']);
  const [loadMoreText, setLoadMoreText] = useState<any>(t['load-more']);

  const [searchEvent, setSearchEvent] = useState<any | null>(null);

  const [totalChannels, setTotalChannels] = useState<number>(0);
  const [channelsNew, setChannelsNew] = useState<any>(null);
  const [channelsToday, setChannelsToday] = useState<any>(null);
  const [channelsTotal, setChannelsTotal] = useState<any>(null);
  const [channelsTotalToday, setChannelsTotalToday] = useState<any>(channelsToday);

  const [channels24, setChannels24] = useState<any>(null);
  const [channels7d, setChannels7d] = useState<any>(null);
  const [channels30d, setChannels30d] = useState<any>(null);
  const [channels24_7_30, setChannels24_7_30] = useState();

  const [tags, setTags] = useState<any[]>(Array(10).fill({ tag: '................' }));

  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadBar, setLoadBar] = useState(false);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const data: any = {
      query: null, //searchText === '' ? null : searchText,
      withDesc: selectDesc,
      category: selectedCategory === null ? [] : selectedCategory,
      country: selectedCountry === null ? [] : selectedCountry,
      language: selectedLanguage === null ? [] : selectedLanguage,
      channel_type: channelType[0].value === 'all' ? [] : channelType,
      channel_age: channelsAge,
      erp: channelsERP,
      subscribers_from: subscribersFrom === '' ? null : subscribersFrom,
      subscribers_to: subscribersTo === '' ? null : subscribersTo,
      paginate: { limit: 45, offset: 0 },
      sort: sorting,
    };
    const newChannels = async () => {
      // Get recently added channels
      data['sort'] = { field: 'created_at', order: 'desc' };
      data['paginate'] = { limit: 5, offset: 0 };
      data['channel_type'] = null;
      const channelsNew = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);
      setChannelsNew(channelsNew);
    };

    const todayChannels = async () => {
      // Get most viewed channels today
      data['paginate'] = { limit: 5, offset: 0 };
      data['sort'] = { field: 'today', order: 'desc' };
      data['channel_type'] = null;
      const channelsToday = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);

      setChannelsToday(channelsToday);
      setChannelsTotalToday(channelsToday);
    };

    const _channels24 = async () => {
      // Get most increased subscriptions in 24h
      data['paginate'] = { limit: 6, offset: 0 };
      data['sort'] = { field: 'extra_02', order: 'desc', type: 'integer' };
      data['channel_type'] = null;
      const channels24h = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);
      // Get most increased subscriptions in 7d
      data['sort'] = { field: 'extra_03', order: 'desc', type: 'integer' };
      const channels7d = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);
      // Get most increased subscriptions in 30d
      data['sort'] = { field: 'extra_04', order: 'desc', type: 'integer' };
      const channels30d = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);

      setChannels24(channels24h);
      setChannels7d(channels7d);
      setChannels30d(channels30d);

      setChannels24_7_30(channels24h);
    };

    const exec = async () => {
      const tags = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`).then((response) => response.data);

      startTransition(() => {
        setTags(tags);
      });
    };

    const getTotal = async () => {
      data['paginate'] = { limit: 5, offset: 0 };
      data['sort'] = { field: 'total', order: 'desc' };
      const channelsTotal = await axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
        .then((response) => response.data.channel);
      setChannelsTotal(channelsTotal);
    };
    getTotal();

    newChannels();
    todayChannels();
    _channels24();

    exec();
  }, [router]);

  useEffect(() => {
    if (router.query.q !== undefined) {
      doSearch(router.query.q as string);
    } else {
      doSearch('');
    }
  }, [router.query.q, sorting]);

  useEffect(() => {
    setLoadMoreText(t['load-more']);
    setSearchResultText(t['empty-search-text']);
  }, [locale]);

  const doSearch = async (q: string) => {
    q.length > 0 && setSearchText(q);
    setSearchResultText(<Loader content={t['loading-text']} />);

    let data;
    if (selectedTag !== '') {
      data = {
        query: selectedTag ? `#${selectedTag}` : null, //searchText === '' ? null : searchText,
        withDesc: selectDesc,
        category: [],
        country: [],
        language: [],
        channel_type: channelType[0].value === 'all' ? [] : channelType,
        channel_age: 0,
        erp: 0,
        subscribers_from: '',
        subscribers_to: '',
        paginate: { limit: 45, offset: 0 },
        sort: sorting,
      };
    } else {
      data = {
        query: q.length > 0 ? q : null, //searchText === '' ? null : searchText,
        withDesc: selectDesc,
        category: selectedCategory === null ? [] : selectedCategory,
        country: selectedCountry === null ? [] : selectedCountry,
        language: selectedLanguage === null ? [] : selectedLanguage,
        channel_type: channelType[0].value === 'all' ? [] : channelType,
        channel_age: channelsAge,
        erp: channelsERP,
        subscribers_from: subscribersFrom === '' ? null : subscribersFrom,
        subscribers_to: subscribersTo === '' ? null : subscribersTo,
        paginate: { limit: 45, offset: 0 },
        sort: sorting,
      };
    }

    setSearchEvent(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resultData = await response.json();
    const result = resultData.channel;

    if (result) {
      setTotalChannels(resultData.total);

      // add ad section 2 channels --------------------------------------
      const ads2Added = await addAds2(result);
      // ----------------------------------------------------------------

      setSearchResult(ads2Added);
      // setSearchResult(result);
      result.length < 45 ? setLoadMore(false) : setLoadMore(true);
    }

    setLoadBar(false);
  };

  const handleLoadMore = async (data: any) => {
    setIsLoading(true);
    setLoadMoreText(<Loader content={t['loading-text']} />);
    data['paginate'].limit = data['paginate'].limit + 45;
    const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, data);
    const resultData = await response.data;
    const result = resultData.channel;
    result.length - searchResult.length < 45 && setLoadMore(false);

    // add ad section 2 channels --------------------------------------
    const ads2Added = await addAds2(result);
    // ----------------------------------------------------------------

    setSearchResult(ads2Added);
    // setSearchResult(result);
    setIsLoading(false);
    setLoadMoreText(t['load-more']);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      router.push({
        pathname: 'search',
        query: searchText != '' ? { q: searchText } : undefined,
      });
      e.target.blur();
    }
  };

  const doFilter = (e: any) => {
    switch (e) {
      case 'subscription_desc':
        return setSorting({ field: 'subscription', order: 'desc' });
      case 'subscription_asc':
        return setSorting({ field: 'subscription', order: 'asc' });
      case 'today_asc':
        return setSorting({ field: 'today', order: 'asc' });
      case 'today_desc':
        return setSorting({ field: 'today', order: 'desc' });
      case 'total_asc':
        return setSorting({ field: 'total', order: 'asc' });
      case 'total_desc':
        return setSorting({ field: 'total', order: 'desc' });
      case 'created_desc':
        return setSorting({ field: 'created_at', order: 'desc' });
      default:
        return 'foo';
    }
  };

  function handleClick() {
    const element = document.getElementById('my-drawer-2');
    if (element) {
      element.click();
    }
  }

  const switchTodayTotalSortType = (type: number) => {
    if (type === 1) {
      setSortType(1);
      setChannelsTotalToday(channelsToday);
    } else {
      setSortType(2);
      setChannelsTotalToday(channelsTotal);
    }
  };

  // Mobile scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (loadMore === false) return;
      const isMobile = window.innerWidth <= 768;
      if (isLoading === false && isMobile && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) {
        handleLoadMore(searchEvent);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore, searchEvent]);

  const ref = useRef(null);
  const searchListRef = useRef(null);

  const [channelRankingUrl, setChannelRankingUrl] = useState('?column=increase24h');
  const [text24730, setText24730] = useState(1);
  const change24_7_30 = (x: number) => {
    if (x === 24) {
      setChannels24_7_30(channels24);
      setText24730(1);
      setChannelRankingUrl('?column=increase24h');
    } else if (x === 7) {
      setChannels24_7_30(channels7d);
      setText24730(2);
      setChannelRankingUrl('?column=increase7d');
    } else if (x === 30) {
      setChannels24_7_30(channels30d);
      setText24730(3);
      setChannelRankingUrl('?column=increase30d');
    }
  };

  return (
    <>
      <div className='flex flex-1 flex-col md:pt-7'>
        <div className='grid md:flex'>
          <div className='flex flex-col gap-0 md:gap-4 justify-items-stretch content-start w-full'>
            <div
              className='flex items-center gap-2 sticky top-0 z-20 bg-gray-50 py-4 md:py-2 px-4 md:px-0 border-b border-gray-200 md:border-none'
              ref={ref}
            >
              <div className='font-bold text-xl'>#</div>
              <div className='relative block md:w-[98%] max-w-[360px] md:max-w-[1000px] lg:max-w-[1300px]'>
                <div className='ml-2'>
                  <HashtagScroll tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag} searchListRef={searchListRef} />
                </div>
              </div>
            </div>
            <Ads1 />
            <Section3 />
            <div className='bg-white md:rounded-xl md:border md:border-gray-200 my-4 md:my-0 min-h-[263px]'>
              <div className='flex items-center px-5 pt-5 pb-6'>
                <div className='font-semibold text-sm'>유저 상승 상위</div>
                <div className='font-semibold flex gap-2 ml-6'>
                  <button
                    onClick={() => change24_7_30(24)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${text24730 === 1 && 'bg-primary text-white'}`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => change24_7_30(7)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${text24730 === 2 && 'bg-primary text-white'}`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => change24_7_30(30)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${text24730 === 3 && 'bg-primary text-white'}`}
                  >
                    30D
                  </button>
                </div>
                <Link
                  className='flex gap-1 text-primary items-center ml-auto'
                  href={`/channel/ranking${channelRankingUrl}`}
                  target='_blank'
                >
                  {t['see-more']}
                  <ChevronRightIcon className='h-3' />
                </Link>
              </div>
              {channels24 ? <Section1 channels24h={channels24_7_30} extra={text24730} /> : <Section1Skeleton />}
            </div>

            <div className='grid md:grid-cols-2 gap-4 min-h-[281px]'>
              <div className='bg-white md:border md:border-gray-200 md:rounded-xl'>
                <div className='flex flex-row justify-between items-center pt-5 pb-2 px-5'>
                  <div className='font-semibold text-sm flex gap-2 items-center'>
                    <div>조회수</div>
                    <button
                      className={`ml-6 rounded-full bg-gray-100 px-2 py-0.5 text-xs ${sortType === 1 && 'bg-primary text-white'}`}
                      onClick={() => {
                        switchTodayTotalSortType(1);
                      }}
                    >
                      오늘
                    </button>
                    <button
                      className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs ${sortType === 2 && 'bg-primary text-white'}`}
                      onClick={() => {
                        switchTodayTotalSortType(2);
                      }}
                    >
                      누적
                    </button>
                  </div>
                  <button
                    className='flex gap-1 text-primary items-center'
                    onClick={() => {
                      sortType === 1 ? setSelectedSorting('today_desc') : setSelectedSorting('total_desc');
                      sortType === 1 ? doFilter('today_desc') : doFilter('total_desc');
                      if (searchListRef.current) {
                        (searchListRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {t['see-more']}
                    <ChevronRightIcon className='h-3' />
                  </button>
                </div>
                {channelsToday ? <Section2_1 channels={channelsTotalToday} /> : <Section2_1Skeleton />}
              </div>

              <div className='bg-white md:border md:border-gray-200 md:rounded-xl'>
                <div className='flex justify-between items-center pt-5 pb-2 px-5'>
                  <div className='font-semibold text-sm'>{t['recently-added']}</div>
                  <button
                    className='flex gap-1 text-primary items-center'
                    onClick={() => {
                      setSelectedSorting('created_desc');
                      doFilter('created_desc');
                      if (searchListRef.current) {
                        (searchListRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {t['see-more']}
                    <ChevronRightIcon className='h-3' />
                  </button>
                </div>
                {channelsNew ? <Section2_2 channelsNew={channelsNew} /> : <Section2_2Skeleton />}
                <div id='search'></div>
              </div>
            </div>
            <div ref={searchListRef}></div>
            {searchResult ? (
              <SearchFilterBar
                totalChannels={totalChannels}
                doFilter={doFilter}
                setSelectedSorting={setSelectedSorting}
                selectedSorting={selectedSorting}
                loadBar={loadBar}
                channelType={channelType}
                setChannelType={setChannelType}
                selectedTag={selectedTag}
                handleClick={handleClick}
                doSearch={doSearch}
              />
            ) : (
              <Skeleton
                variant='rectangular'
                sx={{ bgcolor: 'grey.100' }}
                animation='wave'
                className='min-h-[64px] sorting flex items-center w-full  md:rounded-xl p-3 md:p-4 '
              />
            )}
            {searchResult ? (
              <div className='grid md:grid-cols-3 gap-0 md:gap-4'>
                {searchResult?.map((channel: any) => {
                  return channel.prod_section ? (
                    <AdChannel2 channel={channel} key={channel.id} showType={channel.type ? true : false} />
                  ) : (
                    <GetChannels channels={channel} desc={true} key={channel.id} showType background='px-8 md:px-4 bg-white' />
                  );
                })}
              </div>
            ) : (
              <div className='grid md:grid-cols-3 gap-0 md:gap-4'>
                {Array(10)
                  .fill(1)
                  .map((val, index) => {
                    return <GetChannelsSkeleton key={index} />;
                  })}
              </div>
            )}
            {loadMore && (
              <div className='flex justify-center'>
                <button
                  onClick={() => handleLoadMore(searchEvent)}
                  className='bg-primary px-8 rounded-full text-sm py-2 my-7 mx-7 md:my-0 w-full md:w-fit self-center text-white hover:shadow-xl active:bg-[#143A66]'
                >
                  {loadMoreText}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
