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
  const [selectedCountry, setSelectedCountry] = useState<any | null>([{ value: 113, label: 'Korea, Republic of' }]);
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>([{ value: 'ko', label: 'Korean' }]);

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

  // Data
  const doSearch = async () => {
    const sorting = {
      field: 'subscription',
      order: 'desc',
    };
    const searchData = {
      query: null,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      country: selectedCountry === null ? [] : selectedCountry,
      language: selectedLanguage === null ? [] : selectedLanguage,
      channel_type: null,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 100, offset: 0 },
      sort: sorting,
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, {
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
      // try {
      //   const data = await getSubsHistory(obj.channel_id);
      //   obj.increase24h = data.inc24h;
      //   obj.increase7d = data.inc7d;
      //   obj.increase30d = data.inc30d;
      // } catch (error) {
      //   console.error(error);
      // }
    }
    setData(result);
  };

  // const getSubsHistory = async (getId: any) => {
  //   const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/subs30`, { username: getId });
  //   const sub = await responseSub.data;
  //   const growthData = sub.slice(1).map((val: any, idx: any) => ({
  //     date: val.name.substring(0, 10),
  //     count: val.sub,
  //     diff: val.sub - sub[idx].sub,
  //   }));
  //   const oneDay = growthData.slice(growthData.length - 1);
  //   const sevenDay = growthData.slice(growthData.length - 7).reduce((a: any, b: any) => {
  //     return a + b.diff;
  //   }, 0);
  //   const thirtyDay = growthData.slice(growthData.length - 30).reduce((a: any, b: any) => {
  //     return a + b.diff;
  //   }, 0);
  //   return { inc24h: oneDay[0].diff, inc7d: sevenDay, inc30d: thirtyDay };
  // };

  const getCategoryName = (catId: string): string => {
    const category = cats.find((c: any) => c.value === catId && c.label);
    return category ? category.label : '';
  };

  // Table
  const [sortColumn, setSortColumn] = useState('subscription');
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
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  useEffect(() => {
    doSearch();
    setOptions(cats);
    setOptionsCountries(countries);
    setOptionsLanguages(languages);

    setIsLoading(false);
    setIsLoadingCountries(false);
    setIsLoadingLanguages(false);
  }, [locale, props, selectedCategory]);

  return (
    <div className='md:pt-7 bg-gray-50'>
      <div className='border border-gray-200 bg-white rounded-md p-[30px]'>
        <div className='mb-7 font-semibold text-lg leading-none'>{t['telegram-channels-rating']}</div>
        <div className='md:flex gap-5 z-10'>
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
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
              className='w-full'
            />
          </label>
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
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
              className='w-full'
            />
          </label>
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0'>
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
              className='w-full'
            />
          </label>
        </div>
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
            className='z-0'
            renderEmpty={() => <div className='text-center py-10'>{t['loading-text']}</div>}
            renderLoading={() => <div className='text-center py-10'>{t['loading-text']}</div>}
          >
            <Column width={70} align='center'>
              <HeaderCell>{t['rank']}</HeaderCell>
              <Cell dataKey='rank' />
            </Column>

            <Column flexGrow={2} minWidth={400}>
              <HeaderCell>{t['channel']}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className='flex gap-4 items-center'>
                    <div className='relative w-10 min-w-10 max-w-10'>
                      <Image
                        src={
                          error
                            ? '/telegram-icon-96.png'
                            : `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${rowData.channel_id}/avatar.jfif`
                        }
                        alt={'avatar of ' + rowData.title}
                        width={40}
                        height={40}
                        className='object-contain rounded-full z-0'
                        onError={() => setError(true)}
                      />
                    </div>
                    <div className='flex flex-col'>
                      <span>{rowData.title}</span>
                      <span className='text-xs text-gray-400'>
                        <Link href={`/channel/${rowData.username}`} target='_blank'>
                          @{rowData.username}
                        </Link>
                      </span>
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={120} align='center' sortable>
              <HeaderCell className={sortColumn === 'subscription' ? 'font-bold text-primary' : ''}>{t['subscribers']}</HeaderCell>
              <Cell dataKey='subscription' renderCell={formatKoreanNumber} />
            </Column>

            <Column width={120} align='center' sortable>
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

            <Column width={120} align='center' sortable>
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

            <Column width={120} align='center' sortable>
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

            <Column align='center'>
              <HeaderCell>{t['category']}</HeaderCell>
              <Cell dataKey='category' />
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
