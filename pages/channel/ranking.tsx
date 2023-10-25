import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { MultiValueOptions } from '../../typings';
import { Table } from 'rsuite';
import { formatKoreanNumber } from '../../lib/utils';
import { SortType } from 'rsuite/esm/Table';
import Image from 'next/image';
import Link from 'next/link';
import { colorStyles } from '../../constants';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { useMediaQuery } from '@mui/material';
import ChannelAvatar from '../../components/channel/ChannelAvatar';

const { Column, HeaderCell, Cell } = Table;

type Options = {
  options: Array<MultiValueOptions>;
};

const Ranking = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [error, setError] = useState<boolean>(false);

  const [data, setData] = useState([]);

  const [options, setOptions] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [optionsCountries, setOptionsCountries] = useState<Options[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [optionsLanguages, setOptionsLanguages] = useState<Options[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [channelType, setChannelType] = useState<any | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>([{ value: 113, label: 'Korea, Republic of' }]);
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>([{ value: 'ko', label: 'Korean' }]);

  const cats = props.categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      value: item.id,
      label: locale === 'ko' ? obj.ko : obj.en,
    };
  });

  const optionsChannelTypes = [
    {
      value: 'channel',
      label: t['channel'],
    },
    {
      value: 'public_group',
      label: t['public-group'],
    },
    {
      value: 'private_group',
      label: t['private-group'],
    },
  ];

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

  // Data
  const doSearch = async (field: any, order: any) => {
    const sorting = {
      field: field,
      order: order,
      type: 'integer',
    };
    const searchData = {
      query: null,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      country: selectedCountry === null ? [] : selectedCountry,
      language: selectedLanguage === null ? [] : selectedLanguage,
      channel_type: channelType === null ? [] : channelType,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 100, offset: 0 },
      sort: sorting,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(searchData),
    });
    const resultData = await response.json();
    const result = resultData.channel;
    for (let i = 0; i < result.length; i++) {
      const obj = result[i];
      obj.rank = i + 1;
      obj.category = getCategoryName(obj.category_id);
      const splitExtra = obj.extra_01 === null ? [0, 0, 0] : obj.extra_01.split(':');
      obj.increase24h = splitExtra[0];
      obj.increase7d = splitExtra[1];
      obj.increase30d = splitExtra[2];
    }
    setData(result);
  };

  const getCategoryName = (catId: string): string => {
    const category = cats.find((c: any) => c.value === catId && c.label);
    return category ? category.label : '';
  };

  // Table
  const column = router.query.column ? (router.query.column as string) : 'increase24h';
  const [sortColumn, setSortColumn] = useState(column);
  const [sortType, setSortType] = useState<SortType>('desc');
  const [loading, setLoading] = useState(false);

  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a: any, b: any) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        // if (typeof x === 'string') {
        //   x = x.charCodeAt(0);
        // }
        // if (typeof y === 'string') {
        //   y = y.charCodeAt(0);
        // }
        if (sortType === 'asc') {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn: any, sortType: any) => {
    setLoading(true);
    setData([]);
    if (sortColumn === 'increase7d') {
      doSearch('extra_03', sortType);
    } else if (sortColumn === 'increase30d') {
      doSearch('extra_04', sortType);
    } else if (sortColumn === 'increase24h') {
      doSearch('extra_02', sortType);
    } else if (sortColumn === 'subscription') {
      doSearch('subscription', sortType);
    }
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  useEffect(() => {
    doSearch('extra_02', 'desc');
    setOptions(cats);
    setOptionsCountries(countries);
    setOptionsLanguages(languages);

    setIsLoading(false);
    setIsLoadingCountries(false);
    setIsLoadingLanguages(false);
  }, [locale, props, channelType]);

  const [filterShow, setFilterShow] = useState(false);
  const isMedium = useMediaQuery('(min-width:768px)');

  return (
    <div className='md:pt-7 bg-gray-50'>
      <div className='border border-gray-200 bg-white rounded-md p-4 md:p-[30px]'>
        <div className='mb-4 md:mb-7 font-semibold text-lg leading-none'>{t['rank']}</div>
        <div className='flex justify-end'>
          <button
            onClick={() => setFilterShow((prev) => !prev)}
            className='rounded-lg bg-white border border-gray-200 text-sm px-2 py-1 whitespace-nowrap mb-2 flex md:hidden gap-1 justify-center items-center'
          >
            <AdjustmentsHorizontalIcon className='h-4' />
            {t['channel-filter']}
          </button>
        </div>
        {(isMedium === true || filterShow === true) && (
          <div className='md:flex gap-5 z-10 border md:border-none border-gray-200 rounded-lg p-4 md:p-0'>
            <label className='grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
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
                className='w-full mb-2 md:mb-0'
              />
            </label>
            <label className='grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
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
                className='w-full mb-2 md:mb-0'
              />
            </label>
            <label className='grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
              {t['contents-language']}
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
                className='w-full'
              />
            </label>
          </div>
        )}
        <div className='mt-4'>
          <Table
            autoHeight
            data={getData()}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={loading}
            rowHeight={68}
            bordered
            className='z-0 rounded-lg'
            renderEmpty={() => <div className='text-center py-10'>{t['loading-text']}</div>}
            renderLoading={() => <div className='text-center py-10'>{t['loading-text']}</div>}
          >
            <Column width={50} align='center' fixed>
              <HeaderCell>{t['rank']}</HeaderCell>
              <Cell dataKey='rank' />
            </Column>

            <Column flexGrow={2} minWidth={170} fixed>
              <HeaderCell>{t['channel']}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Link href={`/channel/${rowData.username}`} target='_blank' className='hover:no-underline'>
                    <div className='flex gap-2 md:gap-4 items-center'>
                      <div className='relative w-10 min-w-10 max-w-10'>
                        <ChannelAvatar id={rowData.channel_id} title={rowData.title} size={40} shape='rounded-full min-w-[20px]' />
                        {/* <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${rowData.channel_id}/avatar.jfif`}
                          onError={() => '/telegram-icon-96.png'}
                          alt={rowData.title}
                          width={40}
                          height={40}
                          className='object-contain rounded-full z-0 min-w-[20px]'
                        /> */}
                      </div>
                      <div className='flex flex-col'>
                        <span>{rowData.title}</span>
                        <span className='text-xs text-gray-400'>@{rowData.username}</span>
                      </div>
                    </div>
                  </Link>
                )}
              </Cell>
            </Column>

            <Column align='center'>
              <HeaderCell>{t['channel-type']}</HeaderCell>
              <Cell dataKey='type'>
                {(rowData) => (
                  <div
                    className={`mx-auto text-[12px] px-2 py-0.1 rounded-full w-fit whitespace-nowrap text-white ${
                      rowData.type === 'channel' ? 'bg-[#71B2FF]' : 'bg-[#FF7171]'
                    }`}
                  >
                    {rowData.type === 'channel' ? t['channel'] : t['Group']}
                  </div>
                )}
              </Cell>
            </Column>

            <Column align='center' sortable>
              <HeaderCell className={sortColumn === 'subscription' ? 'font-bold text-primary' : ''}>{t['subscribers']}</HeaderCell>
              <Cell dataKey='subscription' renderCell={formatKoreanNumber} />
            </Column>

            <Column align='center' sortable>
              <HeaderCell className={sortColumn === 'increase24h' ? 'font-bold text-primary' : ''}>{t['increase-24h']}</HeaderCell>
              <Cell dataKey='increase24h'>
                {(rowData) =>
                  rowData.increase24h > 0 ? (
                    <span className='text-green-500'>+{rowData.increase24h}</span>
                  ) : (
                    <span className='text-red-500'>{rowData.increase24h}</span>
                  )
                }
              </Cell>
            </Column>

            <Column align='center' sortable>
              <HeaderCell className={sortColumn === 'increase7d' ? 'font-bold text-primary' : ''}>{t['increase-7d']}</HeaderCell>
              <Cell dataKey='increase7d'>
                {(rowData) =>
                  rowData.increase7d > 0 ? (
                    <span className='text-green-500'>+{rowData.increase7d}</span>
                  ) : (
                    <span className='text-red-500'>{rowData.increase7d}</span>
                  )
                }
              </Cell>
            </Column>

            <Column align='center' sortable>
              <HeaderCell className={sortColumn === 'increase30d' ? 'font-bold text-primary' : ''}>{t['increase-30d']}</HeaderCell>
              <Cell dataKey='increase30d'>
                {(rowData) =>
                  rowData.increase30d > 0 ? (
                    <span className='text-green-500'>+{rowData.increase30d}</span>
                  ) : (
                    <span className='text-red-500'>{rowData.increase30d}</span>
                  )
                }
              </Cell>
            </Column>
          </Table>
        </div>
      </div>
    </div>
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

export default Ranking;
