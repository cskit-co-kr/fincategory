import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Channel, MultiValueOptions } from '../typings';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import GetChannels from '../components/channel/GetChannels';
import { Loader } from 'rsuite';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { FaXmark } from 'react-icons/fa6';
import { colorStyles } from '../constants';
import { useData } from '../context/context';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ReactSlickSlider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ChannelAvatar from '../components/channel/ChannelAvatar';
import Link from 'next/link';
import { LiaUserSolid } from 'react-icons/lia';

type Options = {
  options: Array<MultiValueOptions>;
};

const goToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const Search = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const tags = props.tags;
  const [selectedTags, setSelectedTags] = useState(['']);
  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div style={{ ...style, display: 'block' }} onClick={onClick}>
        <ChevronLeftIcon className='text-gray-400 h-6 absolute top-2 -left-5 lg:-left-7 cursor-pointer hover:text-black' />
      </div>
    );
  }
  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div style={{ ...style, display: 'block' }} onClick={onClick}>
        <ChevronRightIcon className='text-gray-400 h-6 absolute top-2 -right-5 lg:-right-7 cursor-pointer hover:text-black' />
      </div>
    );
  }
  const settings = {
    className: 'slider variable-width',
    variableWidth: true,
    dots: false,
    infinite: false,
    speed: 2000,
    slidesToShow: 8,
    slidesToScroll: 8,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  const isFirstLoad = useRef(true); // Create a ref to track the first load
  useEffect(() => {
    // Skip the push on first load
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    setLoadBar(true);
    const tag = selectedTags[0] ? `#${selectedTags[0]}` : undefined;
    router.push(
      {
        pathname: 'search',
        query: tag ? { q: tag } : {},
      },
      undefined,
      { shallow: true }
    );
  }, [selectedTags]);

  const [options, setOptions] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [optionsCountries, setOptionsCountries] = useState<Options[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [optionsLanguages, setOptionsLanguages] = useState<Options[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

  const { savePosts, posts } = useData();

  const optionsChannelTypes = [
    {
      value: 'channel',
      label: t['channel'],
    },
  ];

  const cats = props.categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      value: item.id,
      label: locale === 'ko' ? obj.ko : obj.en,
    };
  });

  const countries = props.countries?.map((item: any) => {
    const disable = item.nicename === 'Korea, Republic of' ? false : true;
    return {
      value: item.id,
      label: t[item.iso as keyof typeof t],
      isDisabled: disable,
    };
  });

  const languages = props.languages?.map((item: any) => {
    const disable = item.value === 'Korean' ? false : true;
    return {
      value: item.id,
      label: t[item.value as keyof typeof t],
      isDisabled: disable,
    };
  });

  const [searchText, setSearchText] = useState<any>('');
  const [selectDesc, setSelectDesc] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>([{ value: 113, label: 'Korea, Republic of' }]);
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>([{ value: 'ko', label: 'Korean' }]);
  const [channelType, setChannelType] = useState<any | null>(null);
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

  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [loadBar, setLoadBar] = useState(false);

  // useEffect(() => {
  //   doSearch('');
  // }, []);
  // useEffect(() => {
  //   doSearch('');
  // }, [sorting]);

  useEffect(() => {
    if (router.query.q !== undefined) {
      doSearch(router.query.q as string);
    } else {
      doSearch('');
    }
  }, [router, sorting]);

  useEffect(() => {
    setOptions(cats);
    setOptionsCountries(countries);
    setOptionsLanguages(languages);

    setIsLoading(false);
    setIsLoadingCountries(false);
    setIsLoadingLanguages(false);
    setLoadMoreText(t['load-more']);
    setSearchResultText(t['empty-search-text']);
  }, [locale, props]);

  const doSearch = async (q: string) => {
    q.length > 0 && setSearchText(q);
    // goToTop();
    setSearchResult(null);
    setSearchResultText(<Loader content={t['loading-text']} />);

    const data = {
      query: q.length > 0 ? q : null, //searchText === '' ? null : searchText,
      withDesc: selectDesc,
      category: selectedCategory === null ? [] : selectedCategory,
      country: selectedCountry === null ? [] : selectedCountry,
      language: selectedLanguage === null ? [] : selectedLanguage,
      channel_type: channelType === '' ? null : channelType,
      channel_age: channelsAge,
      erp: channelsERP,
      subscribers_from: subscribersFrom === '' ? null : subscribersFrom,
      subscribers_to: subscribersTo === '' ? null : subscribersTo,
      paginate: { limit: 60, offset: 0 },
      sort: sorting,
    };
    setSearchEvent(data);

    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    // const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, data)
    // const resultData = await response.data;
    const resultData = await response.json();
    const result = resultData.channel;

    setTotalChannels(resultData.total);
    result.length === 0 ? setSearchResultText(t['no-search-results']) : setSearchResult(result);
    result.length < 60 ? setLoadMore(false) : setLoadMore(true);
    setLoadBar(false);
  };

  const handleLoadMore = async (data: any) => {
    setLoadMoreText(<Loader content={t['loading-text']} />);
    data['paginate'].limit = data['paginate'].limit + 60;
    //const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, data)
    //const resultData = await response.data;
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    const resultData = await response.json();
    const result = resultData.channel;
    result.length - searchResult.length !== 60 && setLoadMore(false);
    setSearchResult(result);
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

  const [todayOrTotal, setTodayOrTotal] = useState('today');

  return (
    <>
      <div className='flex flex-1 flex-col md:pt-7'>
        <div className='grid md:flex'>
          {/* Sidebar */}
          <div className='lg:drawer-open mt-2 md:mt-0 ml-2 md:ml-0 z-20'>
            <input id='my-drawer-2' type='checkbox' className='drawer-toggle' />
            <div className='w-fit ml-auto mr-2'>
              {/* Page content here */}
              <label
                htmlFor='my-drawer-2'
                className='border border-gray-200 rounded-lg bg-white px-2 py-1 whitespace-nowrap lg:hidden flex items-center gap-1 z-0'
              >
                {t['search-filter']}
                <AdjustmentsHorizontalIcon className='h-4' />
              </label>
            </div>
            <div className='drawer-side'>
              <label htmlFor='my-drawer-2' className='drawer-overlay'></label>
              <div className='menu p-4 md:p-0 w-80 md:min-w-[314px] bg-base-200 md:bg-inherit'>
                {/* Sidebar content here */}
                <div className='flex flex-col md:min-w-[314px]'>
                  <div>
                    {/* <div className='lg:sticky lg:top-4'> */}
                    <div className='flex flex-col gap-3 border border-gray-200 rounded-xl pt-3 pb-5 px-4 bg-white'>
                      <label className='flex flex-col gap-2 relative'>
                        {t['by-keyword']}
                        <input
                          value={searchText}
                          onChange={(e: any) => setSearchText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={t['type-here']}
                          type='text'
                          className='py-3 px-3 text-xs outline-none rounded-lg border border-gray-200'
                          name='input'
                        />
                        {searchText !== '' && (
                          <button
                            className='absolute right-3 top-10 text-gray-300 hover:text-gray-400 transition-all duration-300'
                            onClick={() => setSearchText('')}
                          >
                            <FaXmark size={16} />
                          </button>
                        )}
                      </label>
                      <label className='text-sm flex gap-2 cursor-pointer'>
                        <input name='description' checked={selectDesc} onChange={() => setSelectDesc(!selectDesc)} type='checkbox' />
                        {t['search-also-in-description']}
                      </label>
                      <label className='flex flex-col gap-2'>
                        {t['channel-topic']}
                        <Select
                          instanceId='category'
                          onChange={setSelectedCategory}
                          name='category'
                          isLoading={isLoading}
                          styles={colorStyles}
                          options={options}
                          placeholder={t['select-topic']}
                          isMulti
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        {t['channel-country']}
                        <Select
                          value={{ value: 113, label: t['KR'] }}
                          instanceId='country'
                          onChange={setSelectedCountry}
                          name='country'
                          isLoading={isLoadingCountries}
                          styles={colorStyles}
                          options={optionsCountries}
                          placeholder={t['select-country']}
                          isMulti
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        {t['channel-language']}
                        <Select
                          value={{ value: 'ko', label: t['Korean'] }}
                          instanceId={'language'}
                          onChange={setSelectedLanguage}
                          name='language'
                          isLoading={isLoadingLanguages}
                          styles={colorStyles}
                          options={optionsLanguages}
                          placeholder={t['select-language']}
                          isMulti
                        />
                      </label>
                      <label className='flex flex-col gap-2'>
                        {t['channel-type']}
                        <Select
                          instanceId={'type'}
                          defaultValue={channelType}
                          onChange={setChannelType}
                          name='type'
                          styles={colorStyles}
                          options={optionsChannelTypes}
                          placeholder={t['select-type']}
                          isMulti
                        />
                      </label>
                    </div>
                    <div className='flex flex-col gap-3 mt-4 border border-gray-200 rounded-xl pt-3 pb-5 px-3 bg-white'>
                      <label className='flex flex-col gap-2'>
                        {t['channels-age-from-months']}
                        <Box className='pl-3 pr-6'>
                          <Slider
                            name='channelsAge'
                            valueLabelDisplay='auto'
                            size='small'
                            defaultValue={channelsAge}
                            onChange={(event: Event, newValue: number | number[]) => {
                              setChannelsAge(newValue as number);
                            }}
                            min={0}
                            max={36}
                            marks={[
                              { value: 0, label: 0 },
                              { value: 36, label: '36+' },
                            ]}
                          />
                        </Box>
                      </label>
                      <label className='flex flex-col gap-2'>
                        {t['engagement-rate-erp']}
                        <Box className='pl-3 pr-6'>
                          <Slider
                            name='ERP'
                            valueLabelDisplay='auto'
                            size='small'
                            defaultValue={channelsERP}
                            onChange={(event: Event, newValue: number | number[]) => {
                              setChannelsERP(newValue as number);
                            }}
                            min={0}
                            max={100}
                            marks={[
                              { value: 1, label: '0%' },
                              { value: 100, label: '100%+' },
                            ]}
                          />
                        </Box>
                      </label>
                    </div>
                    <div className='flex flex-col gap-3 mt-4 border border-gray-200 rounded-xl pt-3 pb-5 px-3 bg-white'>
                      <label className='flex flex-col gap-2'>
                        {t['subscribers']}
                        <div className='flex gap-2'>
                          <input
                            name='subscribersFrom'
                            value={subscribersFrom}
                            onChange={(e: any) => setSubscribersFrom(e.target.value)}
                            placeholder='from'
                            type='number'
                            min={0}
                            className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                          />
                          <input
                            name='subscribersTo'
                            value={subscribersTo}
                            onChange={(e: any) => setSubscribersTo(e.target.value)}
                            placeholder='to'
                            type='number'
                            min={0}
                            className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                          />
                        </div>
                      </label>
                      <button
                        onClick={() => {
                          //doSearch('');
                          router.push({
                            pathname: 'search',
                            query: searchText != '' ? { q: searchText } : undefined,
                          });
                          handleClick();
                        }}
                        className='bg-primary px-10 rounded-full text-sm py-2 w-fit self-center text-white active:bg-[#143A66]'
                      >
                        {t['search']}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='grid md:grid-cols-3 gap-0 md:gap-4 md:ml-4 justify-items-stretch content-start w-full'>
            <div className='md:col-span-3 bg-white rounded-xl border border-gray-200 m-4 md:m-0'>
              <div className='font-bold pt-5 pb-1 px-5'>구독자 상승 채널(24H)</div>
              <div className='grid md:grid-cols-3 gap-4 px-4 pb-4'>
                {props.channels24h?.map((channel: any) => {
                  return (
                    <GetChannels
                      channels={channel}
                      desc={false}
                      extra2={true}
                      key={channel.id}
                      bordered={false}
                      tag={false}
                      background='bg-gray-50'
                    />
                  );
                })}
              </div>
            </div>

            <div className='md:col-span-3 grid md:grid-cols-2 gap-4'>
              <div className='bg-white border border-gray-200 rounded-xl mx-4 md:mx-0'>
                <div className='font-bold pt-5 pb-1 px-5'>(오늘)조회수 상위</div>

                {props.channelsToday?.map((channel: Channel, index: number) => {
                  return (
                    <Link
                      href={`/channel/${channel.username}`}
                      className='flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none'
                      key={channel.id}
                    >
                      <div className='font-semibold'>{++index}</div>
                      <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-2'>
                          <ChannelAvatar id={channel.channel_id} title={channel.title} size='30' shape='rounded-full' />
                          <div className='line-clamp-1 text-ellipsis overflow-hidden'>{channel.title}</div>
                        </div>
                        <div className='text-gray-500 text-[12px] font-bold min-w-[100px]'>
                          오늘{channel.today && channel.today}/누적{channel.total && channel.total}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className='bg-white border border-gray-200 rounded-xl mx-4 md:mx-0'>
                <div className='font-bold pt-5 pb-1 px-5'>최근 추가 채널</div>
                {props.channelsNew?.map((channel: Channel, index: number) => {
                  return (
                    <Link
                      href={`/channel/${channel.username}`}
                      className='flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none'
                      key={channel.id}
                    >
                      <div className='font-semibold'>{++index}</div>
                      <div className='flex items-center w-full justify-between'>
                        <div className='flex items-center gap-2'>
                          <ChannelAvatar id={channel.channel_id} title={channel.title} size='30' shape='rounded-full' />
                          <div className='line-clamp-1 text-ellipsis overflow-hidden'>{channel.title}</div>
                        </div>
                        <div className='text-[12px] text-gray-500 font-bold flex gap-0.5 items-center min-w-[100px]'>
                          <LiaUserSolid size={16} />
                          {t['subscribers']} {channel.subscription?.toLocaleString()}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className='md:col-span-3 mt-3 flex items-center gap-2 mx-4 md:mx-0'>
              <div className='font-bold'>{t['tags']}:</div>
              <div className='relative block space-x-3 w-[75%] md:w-[88%] max-w-[320px] lg:max-w-[960px] mx-auto'>
                <ReactSlickSlider {...settings}>
                  {tags?.map((tag: any) => (
                    <div key={tag.tag} className='mr-1'>
                      <button
                        className={`group flex gap-1 px-3 py-2 whitespace-nowrap border border-gray-200 rounded-2xl hover:bg-primary hover:text-white ${
                          selectedTags.find((e) => e === tag.tag) ? 'bg-primary text-white font-bold' : 'text-black bg-white'
                        }`}
                        key={tag.tag}
                        onClick={() => {
                          selectedTags.find((e) => e === tag.tag)
                            ? setSelectedTags((current) =>
                                current.filter((element) => {
                                  return element !== tag.tag;
                                })
                              )
                            : setSelectedTags([tag.tag]);
                        }}
                      >
                        {tag.tag}
                        <span
                          className={`text-xs block bg-gray-200 rounded-full px-1.5 py-0.5 group-hover:text-black ${
                            selectedTags.find((e) => e === tag.tag) ? 'text-black' : ''
                          }`}
                        >
                          {tag.total}
                        </span>
                      </button>
                    </div>
                  ))}
                </ReactSlickSlider>
              </div>
            </div>
            {loadBar && (
              <div className='md:col-span-3 mx-auto'>
                <Loader />
              </div>
            )}
            {searchResult ? (
              <div className='sorting flex items-center w-full bg-white md:rounded-xl p-3 md:p-4 md:col-span-3 border border-gray-200 mt-2 md:mt-0'>
                <span className='text-xs'>
                  {`${t['total-search-results1']} ${router.query.q ? '"' + router.query.q + '"' : ''}: `}
                  <b>{totalChannels}</b>
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
                  </select>
                </div>
              </div>
            ) : null}
            {searchResult ? (
              searchResult.map((channel: any, index: number) => {
                return <GetChannels channels={channel} desc={true} key={index} />;
              })
            ) : (
              <div className='text-center mt-2 md:mt-0 md:col-span-3'>{searchResultText}</div>
            )}
            {loadMore && (
              <div className='flex justify-center md:col-span-3'>
                <button
                  onClick={() => handleLoadMore(searchEvent)}
                  className='bg-primary px-8 rounded-full text-sm py-2 my-4 md:my-0 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66]'
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

export const getServerSideProps = async () => {
  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`);
  const categories = await result.data;

  const resCountry = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`);
  const countries = await resCountry.data;

  const resLanguage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`);
  const languages = await resLanguage.data;

  let data: any = {
    query: null,
    withDesc: false,
    category: [],
    country: [],
    language: [{ value: 'ko', label: 'Korean' }],
    channel_type: null,
    channel_age: 0,
    erp: 0,
    subscribers_from: null,
    subscribers_to: null,
    paginate: { limit: 4, offset: 0 },
    sort: { field: 'created_at', order: 'desc' },
  };

  // Get recently added channels
  data['paginate'] = { limit: 5, offset: 0 };
  const channelsNew = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get most viewed channels today
  data['paginate'] = { limit: 5, offset: 0 };
  data['sort'] = { field: 'today', order: 'desc' };
  const channelsToday = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get most increased subscriptions in 24h channels
  data['paginate'] = { limit: 6, offset: 0 };
  data['sort'] = { field: 'extra_02', order: 'desc', type: 'integer' };
  const channels24h = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get Tag List
  const tags = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`).then((response) => response.data);

  return {
    props: { categories, countries, languages, tags, channelsNew, channelsToday, channels24h },
  };
};

export default Search;
