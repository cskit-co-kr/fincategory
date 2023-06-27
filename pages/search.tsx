import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { MultiValueOptions } from '../typings';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import GetChannels from '../components/channel/GetChannels';
import { Loader } from 'rsuite';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { colorStyles } from '../constants';

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

  const [options, setOptions] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [optionsCountries, setOptionsCountries] = useState<Options[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [optionsLanguages, setOptionsLanguages] = useState<Options[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

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
      label: item.nicename,
      isDisabled: disable,
    };
  });

  const languages = props.languages?.map((item: any) => {
    const disable = item.value === 'Korean' ? false : true;
    return {
      value: item.id,
      label: item.value,
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
    // setLoadMore(true);
    goToTop();
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
    // const response = await axios.post(`https://api.fincategory.com/client/telegram/searchChannel`, data)
    // const result = await response.data.channel
    const resultData = await response.json();
    const result = resultData.channel;
    setTotalChannels(resultData.total);
    result.length === 0 ? setSearchResultText(t['no-search-results']) : setSearchResult(result);
    result.length < 60 ? setLoadMore(false) : setLoadMore(true);
  };

  const handleLoadMore = async (data: any) => {
    setLoadMoreText(<Loader content={t['loading-text']} />);
    data['paginate'].limit = data['paginate'].limit + 60;
    //const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/client/telegram/searchChannel`, data)
    //const result = await response.data.channel
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
      //doSearch('');
      router.push(`/search?q=${searchText}`);
      e.target.blur();
    }
  };

  const doFilter = (e: any) => {
    switch (e) {
      case 'subscription_desc':
        return setSorting({ field: 'subscription', order: 'desc' });
      case 'subscription_asc':
        return setSorting({ field: 'subscription', order: 'asc' });
      case 'name_asc':
        return setSorting({ field: 'title', order: 'asc' });
      case 'name_desc':
        return setSorting({ field: 'title', order: 'desc' });
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

  return (
    <>
      <div className='flex flex-1 flex-col md:pt-7'>
        <div className='grid md:flex'>
          {/* Sidebar */}
          <div className='lg:drawer-open mt-2 md:mt-0 ml-2 md:ml-0 z-10'>
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
                  <div className='lg:sticky lg:top-4'>
                    <div className='flex flex-col gap-3 border border-gray-200 rounded-md pt-3 pb-5 px-4 bg-white'>
                      <label className='flex flex-col gap-2'>
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
                          value={{ value: 113, label: 'Korea, Republic of' }}
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
                          value={{ value: 'ko', label: 'Korean' }}
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
                    <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
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
                    <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
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
                          router.push(`/search?q=${searchText}`);
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
          {/* <div className='flex flex-col w-0 lg:min-w-[314px]'>
            <div className='lg:sticky lg:top-4'>
              <div
                className={`${
                  sideBar ? 'left-0' : '-left-full'
                } bg-gray-50 px-4 py-6 lg:bg-transparent lg:px-0 lg:py-0 fixed top-0 h-full transition-all transform duration-500 w-[80%] lg:w-full z-10 lg:sticky lg:top-4 overflow-y-auto lg:overflow-hidden`}
              >
                <div className='flex flex-col gap-3 border border-gray-200 rounded-md pt-3 pb-5 px-4 bg-white'>
                  <label className='flex flex-col gap-2'>
                    {t['by-keyword']}
                    <input
                      value={searchText}
                      onChange={(e: any) => setSearchText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={t['type-here']}
                      type='text'
                      className='py-3 px-3 text-xs outline-none rounded-lg border border-gray-200'
                    />
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
                      value={{ value: 113, label: 'Korea, Republic of' }}
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
                      value={{ value: 'ko', label: 'Korean' }}
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
                <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
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
                <div className='flex flex-col gap-3 mt-5 border border-gray-200 rounded-md pt-3 pb-5 px-3 bg-white'>
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
                  
            <label className='flex flex-col gap-2'>{t['average-post-reach']}
                <div className='flex gap-2'>
                <input 
                    name='averagePostReachFrom'
                    placeholder='from'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='averagePostReachTo'
                    placeholder='to'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <label className='flex flex-col gap-2'>{t['average-post-reach-24hours']}
                <div className='flex gap-2'>
                <input 
                    name='averagePostReach24From'
                    placeholder='from'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='averagePostReach24To'
                    placeholder='to'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            <label className='flex flex-col gap-2'>{t['citation-index']}
                <div className='flex gap-2'>
                <input 
                    name='citationIndexFrom'
                    placeholder='from'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                <input 
                    name='citationIndexTo'
                    placeholder='to'
                    type='number'
                    className='py-2 px-3 text-sm outline-none rounded-lg border border-gray-200 w-1/2'
                />
                </div>
            </label>
            
                  <button
                    onClick={() => doSearch('')}
                    className='bg-primary px-10 rounded-full text-sm py-2 w-fit self-center text-white active:bg-[#143A66]'
                  >
                    {t['search']}
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          <div className='grid grid-cols-12 gap-0 md:gap-4 md:ml-4 justify-items-stretch content-start w-full'>
            {searchResult ? (
              <div className='sorting flex items-center w-full bg-white md:rounded-md p-3 md:p-4 col-span-12 border border-gray-200 mt-2 md:mt-0'>
                <span className='text-xs'>
                  {t['total-search-results1']}
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
                return <GetChannels channels={channel} key={index} />;
              })
            ) : (
              <div className='text-center mt-2 md:mt-0 col-span-12'>{searchResultText}</div>
            )}
            {loadMore && (
              <div className='flex justify-center col-span-12'>
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

  return {
    props: { categories, countries, languages },
  };
};

export default Search;
