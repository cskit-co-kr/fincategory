import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import axios from 'axios';
import { InferGetServerSidePropsType } from 'next';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { MultiValueOptions } from '../../typings';
import { Row, Table } from 'rsuite';
import { formatKoreanNumber } from '../../lib/utils';
import { SortType } from 'rsuite/esm/Table';

const { Column, HeaderCell, Cell } = Table;

type Options = {
  options: Array<MultiValueOptions>;
};

const Ranking = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

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

  const colorStyles = {
    multiValue: (styles: any, { data }: any) => {
      return {
        ...styles,
        backgroundColor: '#D6e8FC',
        color: '#3886E2',
        borderRadius: 5,
        border: '1px solid #3886E2',
      };
    },
    multiValueLabel: (styles: any, { data }: any) => {
      return {
        ...styles,
        color: '#3886E2',
      };
    },
    multiValueRemove: (styles: any, { data }: any) => {
      return {
        ...styles,
        color: '#3886E2',
        cursor: 'pointer',
        ':hover': {
          color: '#fff',
          backgroundColor: '#3886E2',
          borderRadius: 3,
        },
        borderRadius: 5,
      };
    },
    placeholder: (base: any) => ({
      ...base,
      fontSize: '0.75rem',
    }),
  };

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
      paginate: { limit: 10, offset: 0 },
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
      try {
        const data = await getSubsHistory(obj.channel_id);
        obj.increase24h = data.inc24h;
      } catch (error) {
        console.error(error);
      }
    }
    setData(result);
  };

  const getSubsHistory = async (getId: any) => {
    const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, { id: getId });
    const sub = await responseSub.data;
    const growthData = await sub.slice(1).map((val: any, idx: any) => ({
      date: val.created_at.substring(0, 10),
      count: val.count,
      diff: val.count - sub[idx].count,
    }));
    const oneDay = await growthData.slice(growthData.length - 1);
    return { inc24h: oneDay[0].diff };
  };

  const getCategoryName = (catId: string): string => {
    const category = cats.find((c: any) => c.value === catId && c.label);
    return category ? category.label : '';
  };

  // Table
  const [sortColumn, setSortColumn] = useState('rank');
  const [sortType, setSortType] = useState<SortType>('asc');
  const [loading, setLoading] = useState(false);

  const getData = () => {
    if (sortColumn && sortType) {
      return data.sort((a: any, b: any) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === 'string') {
          x = x.charCodeAt(0);
        }
        if (typeof y === 'string') {
          y = y.charCodeAt(0);
        }
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
        <div className='flex gap-5'>
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap'>
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
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap'>
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
              className='w-full'
            />
          </label>
          <label className='flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap'>
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
            rowHeight={66}
            bordered
          >
            <Column width={70} align='center' sortable>
              <HeaderCell>Rank</HeaderCell>
              <Cell dataKey='rank' />
            </Column>

            <Column flexGrow={2} sortable>
              <HeaderCell>Channel</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className='flex flex-col'>
                    <span>{rowData.title}</span>
                    <span className='text-xs text-gray-400'>@{rowData.username}</span>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={120} align='center' sortable>
              <HeaderCell>Subscribers</HeaderCell>
              <Cell dataKey='subscription' renderCell={formatKoreanNumber} />
            </Column>

            <Column width={120} align='center' sortable>
              <HeaderCell>Increase (24h)</HeaderCell>
              <Cell>
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
              <HeaderCell>Increase (7d)</HeaderCell>
              <Cell dataKey='increase7d' />
            </Column>

            <Column width={120} align='center' sortable>
              <HeaderCell>Increase (30d)</HeaderCell>
              <Cell dataKey='increase30d' />
            </Column>

            <Column align='center' sortable>
              <HeaderCell>Category</HeaderCell>
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
