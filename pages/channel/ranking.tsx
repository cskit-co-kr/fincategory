import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import Select from "react-select";
import { startTransition, useEffect, useRef, useState } from "react";
import { MultiValueOptions } from "../../typings";
import { Table } from "rsuite";
import { getAverages, formatKoreanNumber } from "../../lib/utils";
import { SortType } from "rsuite/esm/Table";
import Image from "next/image";
import Link from "next/link";
import { colorStyles } from "../../constants";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "@mui/material";
import ChannelAvatar from "../../components/channel/ChannelAvatar";
import { FaUser, FaVolumeLow } from "react-icons/fa6";
import { TbLoader } from "react-icons/tb";
import { Result, Spin } from "antd";
import Hashtag from "../../components/Hashtag";
import HashtagMobile from "../../components/HashtagMobile";

const { Column, HeaderCell, Cell } = Table;

type Options = {
  options: Array<MultiValueOptions>;
};

const Ranking = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const [error, setError] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const [data, setData] = useState([]);

  const [options, setOptions] = useState<Options[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [optionsCountries, setOptionsCountries] = useState<Options[]>([]);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  const [optionsLanguages, setOptionsLanguages] = useState<Options[]>([]);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const searchListRef = useRef(null);

  const [selectedTag, setSelectedTag] = useState<any>();
  const [tags, setTags] = useState<any>();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [channelType, setChannelType] = useState<any | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any | null>([
    { value: 113, label: "Korea, Republic of" },
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<any | null>([
    { value: "ko", label: "Korean" },
  ]);

  const cats = props.categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      value: item.id,
      label: locale === "ko" ? obj.ko : obj.en,
    };
  });

  const optionsChannelTypes = [
    {
      value: "channel",
      label: t["channel"],
    },
    {
      value: "public_group",
      label: t["public-group"],
    },
    {
      value: "private_group",
      label: t["private-group"],
    },
  ];

  const countries = props.countries?.map((item: any) => {
    const disable = item.nicename === "Korea, Republic of" ? false : true;
    return {
      value: item.id,
      label: t[item.iso as keyof typeof t],
      isDisabled: disable,
    };
  });

  const languages = props.languages?.map((item: any) => {
    const disable = item.value === "Korean" ? false : true;
    return {
      value: item.id,
      label: t[item.value as keyof typeof t],
      isDisabled: disable,
    };
  });

  // Data
  const doSearch = async (field: any, order: any, tagQuery: any) => {
    const sorting = {
      field: field,
      order: order,
      type: "float",
    };
    const searchData = {
      query: tagQuery
        ? `#${tagQuery.tag}`
        : selectedTag
        ? `#${selectedTag.tag}`
        : null,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      country: selectedCountry === null ? [] : selectedCountry,
      language: selectedLanguage === null ? [] : selectedLanguage,
      channel_type: channelType === null ? [] : channelType,
      channel_age: 0,
      erp: 0,
      subscribers_from: 100,
      post_per_day_from: 5,
      subscribers_to: null,
      paginate: { limit: 100, offset: 0 },
      sort: sorting,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(searchData),
      }
    );
    const resultData = await response.json();
    const result = resultData.channel;
    for (let i = 0; i < result.length; i++) {
      const obj = result[i];
      obj.rank = i + 1;
      obj.category = getCategoryName(obj.category_id);
      const splitExtra =
        obj.extra_01 === null ? [0, 0, 0] : obj.extra_01.split(":");
      obj.increase7d = splitExtra[1];
      // const a: any = await getAverages(obj.channel_id, obj.subscription);
      // obj.averageViews = a?.averageViews;
      // obj.averagePosts = a?.averagePosts;
      // obj.averageErr = a?.averageErr;
    }
    setData(result);
  };
  console.log(Result);
  const getCategoryName = (catId: string): string => {
    const category = cats.find((c: any) => c.value === catId && c.label);
    return category ? category.label : "";
  };

  // Table
  const column = router.query.column
    ? (router.query.column as string)
    : "extra_08";
  const [sortColumn, setSortColumn] = useState(column);
  const [sortType, setSortType] = useState<SortType>("desc");
  const [loading, setLoading] = useState(false);

  const handleSortColumn = (sortColumn: any, sortType: any) => {
    setLoading(true);
    setData([]);
    if (sortColumn === "increase7d") {
      doSearch("extra_03", sortType, undefined);
    } else if (sortColumn === "extra_06") {
      doSearch("extra_06", sortType, undefined);
    } else if (sortColumn === "extra_07") {
      doSearch("extra_07", sortType, undefined);
    } else if (sortColumn === "extra_08") {
      doSearch("extra_08", sortType, undefined);
    } else if (sortColumn === "subscription") {
      doSearch("subscription", sortType, undefined);
    }
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  useEffect(() => {
    if (!!selectedTag) {
      doSearch(sortColumn, sortType, selectedTag);
    }
  }, [selectedTag]);

  useEffect(() => {
    const exec = async () => {
      const tags = await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`)
        .then((response) => response.data);

      startTransition(() => {
        setTags(tags);
      });
    };
    doSearch("extra_08", "desc", undefined);
    setOptions(cats);
    setOptionsCountries(countries);
    setOptionsLanguages(languages);
    exec();
    setIsLoading(false);
    setIsLoadingCountries(false);
    setIsLoadingLanguages(false);
    if (typeof window !== "undefined") {
      const windowWidth = window.innerWidth;
      setWindowWidth(windowWidth);
    }
  }, [locale, props, channelType]);

  const [filterShow, setFilterShow] = useState(false);
  const isMedium = useMediaQuery("(min-width:768px)");

  return (
    <div className="md:pt-7 bg-gray-50">
      {/* {tags &&
        (windowWidth < 1000 ? (
          <HashtagMobile
            tags={tags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchListRef={searchListRef}
          />
        ) : (
          <Hashtag
            isRank={true}
            tags={tags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchListRef={searchListRef}
          />
        ))} */}
      <div
        className={`border border-gray-200 bg-white rounded-md p-4 md:p-[30px]`}
      >
        <div className={`${!isMedium && "flex justify-between items-center"}`}>
          <div className="md:mb-7 font-semibold text-lg leading-none">
            {t["rank"]}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setFilterShow((prev) => !prev)}
              className="md:hidden flex gap-1 justify-center items-center rounded-lg bg-white border border-gray-200 text-sm px-2 py-1 whitespace-nowrap"
            >
              <AdjustmentsHorizontalIcon className="h-4" />
              {t["channel-filter"]}
            </button>
          </div>
        </div>
        {(isMedium === true || filterShow === true) && (
          <div className="md:flex gap-5 z-10 border md:border-none border-gray-200 rounded-lg p-4 md:p-0">
            <label className="grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0">
              {t["channel-type"]}
              <Select
                instanceId={"type"}
                defaultValue={channelType}
                onChange={setChannelType}
                name="type"
                styles={colorStyles}
                options={optionsChannelTypes}
                placeholder={t["select-type"]}
                isMulti
                className="w-full mb-2 md:mb-0"
              />
            </label>
            <label className="grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0">
              {t["channel-country"]}
              <Select
                value={{ value: 113, label: t["KR"] }}
                instanceId="country"
                onChange={setSelectedCountry}
                name="country"
                isLoading={isLoadingCountries}
                styles={colorStyles}
                options={optionsCountries}
                placeholder={t["select-country"]}
                isMulti
                className="w-full mb-2 md:mb-0"
              />
            </label>
            <label className="grid md:flex gap-2 items-center w-full md:w-1/3 whitespace-nowrap mb-2 md:mb-0">
              {t["contents-language"]}
              <Select
                value={{ value: "ko", label: t["Korean"] }}
                instanceId={"language"}
                onChange={setSelectedLanguage}
                name="language"
                isLoading={isLoadingLanguages}
                styles={colorStyles}
                options={optionsLanguages}
                placeholder={t["select-language"]}
                isMulti
                className="w-full"
              />
            </label>
          </div>
        )}
        <div className="mt-4">
          <Table
            autoHeight
            data={data}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            loading={loading}
            rowHeight={68}
            bordered
            className="z-0 rounded-lg"
            renderEmpty={() => (
              <div className="text-center py-10">{t["loading-text"]}</div>
            )}
            renderLoading={() => (
              <div className="text-center py-10">{t["loading-text"]}</div>
            )}
          >
            <Column width={50} align="center" fixed>
              <HeaderCell>{t["rank"]}</HeaderCell>
              <Cell dataKey="rank" />
            </Column>

            <Column width={70} align="center">
              <HeaderCell>구분</HeaderCell>
              <Cell dataKey="type">
                {(rowData) => (
                  <div
                    className={`mx-auto text-[12px] px-2 py-0.1 rounded-full w-fit h-fit whitespace-nowrap text-white ${
                      rowData.type === "channel"
                        ? "bg-[#71B2FF]"
                        : "bg-[#FF7171]"
                    }`}
                  >
                    {rowData.type === "channel" ? (
                      <div className="flex items-center gap-0.5">
                        <FaVolumeLow size={10} />
                        {t["channel"]}
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        <FaUser size={10} />
                        {t["Group"]}
                      </div>
                    )}
                  </div>
                )}
              </Cell>
            </Column>

            <Column flexGrow={2} minWidth={170} fixed>
              <HeaderCell>이름</HeaderCell>
              <Cell>
                {(rowData) => (
                  <Link
                    href={`/channel/${rowData.username}`}
                    target="_blank"
                    className="hover:no-underline"
                  >
                    <div className="flex gap-2 md:gap-4 items-center">
                      <div className="relative w-10 min-w-10 max-w-10">
                        <ChannelAvatar
                          id={rowData.channel_id}
                          title={rowData.title}
                          size={40}
                          shape="rounded-full min-w-[20px]"
                        />
                        {/* <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${rowData.channel_id}/avatar.jfif`}
                          onError={() => '/telegram-icon-96.png'}
                          alt={rowData.title}
                          width={40}
                          height={40}
                          className='object-contain rounded-full z-0 min-w-[20px]'
                        /> */}
                      </div>
                      <div className="flex flex-col">
                        <span>{rowData.title}</span>
                        <span className="text-xs text-gray-400">
                          @{rowData.username}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </Cell>
            </Column>

            <Column width={80} align="center">
              <HeaderCell>{t["category"]}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className="bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF] whitespace-nowrap h-fit">
                    {rowData.category}
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={120} align="right">
              <HeaderCell>해시태그</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className="flex flex-wrap gap-0.5 justify-end">
                    {rowData.tags &&
                      rowData.tags.map(
                        (tag: {
                          id: number;
                          channel_id: number;
                          tag: string;
                        }) => {
                          return (
                            <div
                              className="h-fit bg-gray-100 px-1.5 py-0.5 rounded-full text-sm md:text-xs font-semibold text-gray-700"
                              key={tag.id}
                            >
                              #{tag.tag}
                            </div>
                          );
                        }
                      )}
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={locale === "ko" ? 80 : 110} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "subscription" ? "font-bold text-primary" : ""
                }
              >
                {t["subscribers"]}
              </HeaderCell>
              <Cell dataKey="subscription" renderCell={formatKoreanNumber} />
            </Column>

            <Column width={locale === "ko" ? 90 : 120} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "increase7d" ? "font-bold text-primary" : ""
                }
              >
                {t["increase-7d"]}
              </HeaderCell>
              <Cell dataKey="increase7d">
                {(rowData) =>
                  rowData.increase7d > 0 ? (
                    <span className="text-green-500">
                      +{rowData.increase7d}
                    </span>
                  ) : (
                    <span className="text-red-500">{rowData.increase7d}</span>
                  )
                }
              </Cell>
            </Column>

            <Column width={locale === "ko" ? 120 : 134} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "extra_07" ? "font-bold text-primary" : ""
                }
              >
                {t["posts-per-month"]}
              </HeaderCell>
              <Cell dataKey="extra_07">
                {(rowData) => {
                  return !!rowData.extra_06 ? (
                    <span className="">{rowData.extra_07}</span>
                  ) : (
                    <span>0</span>
                  );
                }}
              </Cell>
            </Column>

            <Column width={locale === "ko" ? 105 : 125} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "extra_06" ? "font-bold text-primary" : ""
                }
              >
                {t["views-per-post"]}
              </HeaderCell>
              <Cell dataKey="extra_06">
                {(rowData) => {
                  return !!rowData.extra_06 ? (
                    <span className="">{rowData.extra_06}</span>
                  ) : (
                    <span>0</span>
                  );
                }}
              </Cell>
            </Column>

            <Column width={locale === "ko" ? 120 : 80} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "extra_08" ? "font-bold text-primary" : ""
                }
              >
                {t["ERR"]}
              </HeaderCell>
              <Cell dataKey="extra_08">
                {(rowData) => {
                  return !!rowData.extra_08 ? (
                    <span className="">
                      {parseFloat(rowData.extra_08).toFixed(2)}%
                    </span>
                  ) : (
                    <span>0.00%</span>
                  );
                }}
              </Cell>
            </Column>

            {/* <Column align='center' width={120} sortable>
              <HeaderCell className={sortColumn === 'averagePosts' ? 'font-bold text-primary' : ''}>일간 포스트 수</HeaderCell>
              <Cell dataKey='averagePosts' />
            </Column> */}
          </Table>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`
  );
  const categories = await result.data;

  const resCountry = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`
  );
  const countries = await resCountry.data;

  const resLanguage = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`
  );
  const languages = await resLanguage.data;

  return {
    props: { categories, countries, languages },
  };
};

export default Ranking;
