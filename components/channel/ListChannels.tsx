import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import { startTransition, useEffect, useRef, useState } from "react";
import { MultiValueOptions } from "../../typings";
import { Table } from "rsuite";
import { formatKoreanNumber } from "../../lib/utils";
import { SortType } from "rsuite/esm/Table";
import Link from "next/link";
import ChannelAvatar from "../../components/channel/ChannelAvatar";
import { FaUser, FaVolumeLow } from "react-icons/fa6";
import Hashtag from "../../components/Hashtag";
import HashtagMobile from "../../components/HashtagMobile";
import { useSession } from "next-auth/react";
import { InputNumber, message } from "antd";
import { BiEdit } from "react-icons/bi";
import { RiCheckLine, RiCloseLine } from "react-icons/ri";
import { NextSeo } from "next-seo";

const { Column, HeaderCell, Cell } = Table;

type Options = {
  options: Array<MultiValueOptions>;
};

const Ranking = (prop?: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const { data: session } = useSession();
  const [total, setTotal] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selectCategory, setSelectCategory] = useState<any>();
  const [props, setProps] = useState<any>({
    rankLimit: null,
    categories: null,
  });

  const [data, setData] = useState([]);
  const [subscribersFrom, setSubscribersFrom] = useState({
    value: props.rankLimit?.subscribers_from
      ? props.rankLimit?.subscribers_from
      : 99,
    error: false,
  });
  const [postPerFrom, setPostPerFrom] = useState({
    value: props.rankLimit?.postperday_from
      ? props.rankLimit?.postperday_from
      : 4,
    error: false,
  });

  const [eRRTo, setERRTo] = useState({
    value: props.rankLimit?.errprecent_to ? props.rankLimit?.errprecent_to : 50,
    error: false,
  });

  const searchListRef = useRef(null);

  const [selectedTag, setSelectedTag] = useState<any>();
  const [tags, setTags] = useState<any>();

  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  useEffect(() => {
    const exec = async () => {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`
      );
      const categories = await result.data;

      startTransition(() => {
        setProps({ categories: categories });
      });
    };
    exec();
  }, [locale]);

  const cats = props.categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      value: item.id,
      label: locale === "ko" ? obj.ko : obj.en,
    };
  });

  // Data
  const doSearch = async (
    field: any,
    order: any,
    tagQuery: any,
    categories: any
  ) => {
    setLoading(true);
    const sorting = {
      field: field,
      order: order,
      type: "float",
    };
    const searchData: any = {
      query: tagQuery
        ? `#${tagQuery.tag}`
        : selectedTag
        ? `#${selectedTag.tag}`
        : null,
      withDesc: false,
      category:
        categories?.length > 0
          ? categories
          : selectedCategory === null
          ? []
          : selectedCategory,
      //   country: [{ value: 113, label: "Korea, Republic of" }],
      //   language: [],
      language: [{ value: locale }],
      channel_type: null,
      channel_age: 0,
      erp: 0,
      //   subscribers_from: subscribersFrom.value + 1,
      //   post_per_day_from: postPerFrom.value + 1,
      //   err_to: eRRTo.value,
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
    searchData.subscribers_from = null;
    searchData.post_per_day_from = null;
    searchData.err_to = null;
    searchData.paginate = { limit: 5, offset: 0 };
    searchData["sort"] = { field: "created_at", order: "desc" };
    const response2 = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(searchData),
      }
    );
    const resultData2 = await response2.json();

    setData(result);
    setTotal(resultData?.total || 0);
    setTotalAll(resultData2?.total || 0);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  const useWindowDimensions = () => {
    const hasWindow = typeof window !== "undefined";

    function getWindowDimensions() {
      const width = hasWindow ? window.innerWidth : null;
      return {
        width,
      };
    }

    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      if (hasWindow) {
        const handleResize = () => {
          setWindowDimensions(getWindowDimensions());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, [hasWindow]);

    return windowDimensions;
  };

  const { width } = useWindowDimensions();
  const getCategoryName = (catId: string): string => {
    if (!Array.isArray(cats)) return "";
    const category = cats.find((c: any) => c.value === catId && c.label);
    return category ? category.label : "";
  };

  // Table
  const column = router.query.column
    ? (router.query.column as string)
    : "subscription";
  const [sortColumn, setSortColumn] = useState(column);
  const [sortType, setSortType] = useState<SortType>("desc");
  const [loading, setLoading] = useState(false);

  const handleSortColumn = (sortColumn: any, sortType: any) => {
    setLoading(true);
    setData([]);
    if (sortColumn === "increase7d") {
      doSearch("extra_03", sortType, undefined, undefined);
    } else if (sortColumn === "extra_06") {
      doSearch("extra_06", sortType, undefined, undefined);
    } else if (sortColumn === "extra_07") {
      doSearch("extra_07", sortType, undefined, undefined);
    } else if (sortColumn === "extra_08") {
      doSearch("extra_08", sortType, undefined, undefined);
    } else if (sortColumn === "subscription") {
      doSearch("subscription", sortType, undefined, undefined);
    }
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  useEffect(() => {
    if (selectedTag !== null || selectedCategory !== null) {
      doSearch(sortColumn, sortType, selectedTag, selectedCategory);
    }
  }, [selectedTag, selectedCategory]);

  useEffect(() => {
    const exec = async () => {
      const tags = await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`)
        .then((response) => response.data);

      startTransition(() => {
        setTags(tags);
      });
    };
    doSearch("subscription", "desc", undefined, undefined);
    exec();
  }, [locale, props]);
  // console.log("prop", prop);
  return (
    <>
      <div className="mt-4">
        <Table
          autoHeight
          data={prop?.searchResult}
          sortColumn={sortColumn}
          sortType={sortType}
          onSortColumn={handleSortColumn}
          loading={loading}
          rowHeight={72}
          headerHeight={56}
          bordered
          className="z-0 rounded-lg !border-none listChannelTable"
          renderEmpty={() => (
            <div className="text-center py-10">{t["no-search-results"]}</div>
          )}
          renderLoading={() => (
            <div className="text-center py-10">{t["loading-text"]}</div>
          )}
        >
          <Column width={(width || 0) < 768 ? 45 : 50} align="center">
            <HeaderCell>
              <div className="h-full flex items-center .w-full">#</div>
            </HeaderCell>
            <Cell dataKey="rank">
              {(rowdata, rowIndex: number | undefined) => {
                return (
                  <div className="flex w-full h-full justify-center items-center">
                    {/* {rowdata.rank} */}
                    {/* {rank} */}
                    {rowIndex !== undefined ? rowIndex + 1 : "-"}
                  </div>
                );
              }}
            </Cell>
          </Column>

          <Column
            flexGrow={2}
            minWidth={(width || 0) < 550 ? (width || 0) - 100 : 300}
          >
            <HeaderCell>
              <div className="h-full flex items-center">
                {/* 이름 */}
                Name
              </div>
            </HeaderCell>
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

          <Column
            width={354}
            align="center"
            // sortable
          >
            <HeaderCell
              className={
                prop?.sorting?.field === "Post" ? "font-bold text-primary" : ""
              }
            >
              <div className="h-full flex items-center w-full text-left">
                Description
              </div>
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <div className="pr-3 text-left max-w-[354px] w-[354px]">
                  <span className="w-full text-wrap line-clamp-2 overflow-hidden">
                    {rowData.description}
                  </span>
                </div>
              )}
            </Cell>
          </Column>

          <Column
            width={locale === "ko" ? 80 : 110}
            align="center"
            // sortable
          >
            <HeaderCell
              className={
                prop?.sorting?.field === "subscription"
                  ? "font-bold text-primary"
                  : ""
              }
            >
              <div className="h-full flex items-center">{t["subscribers"]}</div>
            </HeaderCell>
            <Cell
              dataKey="subscription"
              renderCell={(a) => (
                <div className="flex w-full h-full justify-center items-center pr-2">
                  {formatKoreanNumber(a)}
                </div>
              )}
            />
          </Column>

          <Column width={140} align="center">
            <HeaderCell>
              <div className="h-full flex items-center">
                Click per day / Total
              </div>
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <div className="flex w-full h-full justify-center items-center">
                  <div className=" text-[#1C1E21] font-normal whitespace-nowrap text-[14px] leading-[21px] w-full text-right">
                    {rowData.today}/{rowData.total}
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={(width || 0) < 768 ? 45 : 70} align="center">
            <HeaderCell>
              {" "}
              <div className="h-full flex items-center">구분 </div>
            </HeaderCell>
            <Cell dataKey="type">
              {(rowData) => (
                <div className="flex w-full h-full justify-center items-center">
                  <div
                    className={` text-[12px] px-0.5 py-0.5 rounded-full whitespace-nowrap text-white ${
                      rowData.type === "channel"
                        ? "bg-[#71B2FF]"
                        : "bg-[#FF7171]"
                    }`}
                  >
                    {rowData.type === "channel" ? (
                      <div className="flex items-center py-0 gap-0.5">
                        <FaVolumeLow size={13} />
                        <p className="hidden md:block">{t["channel"]}</p>
                      </div>
                    ) : (
                      <div className="flex py-0 items-center gap-0.5">
                        <FaUser size={13} />
                        <p className="hidden md:block"> {t["Group"]}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Cell>
          </Column>

          <Column width={120} align="center">
            <HeaderCell>
              {" "}
              <div className="h-full flex items-center">{t["category"]}</div>
            </HeaderCell>
            {/* <Cell>
              {(rowData) => (
                <div className="flex w-full h-full justify-center items-center">
                  {rowData.category ? (
                    <div className="bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF] whitespace-nowrap h-fit">
                      {rowData.category}
                    </div>
                  ) : null}
                </div>
              )}
            </Cell> */}
            <Cell>
              {(rowData) => {
                const categoryName =
                  typeof rowData.category === "object" &&
                  rowData.category !== null
                    ? JSON.parse(rowData.category.name).en // Access the English name
                    : rowData.category;

                return (
                  <div className="flex w-full h-full justify-center items-center">
                    {categoryName ? (
                      <div className="bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF] whitespace-nowrap h-fit">
                        {categoryName}
                      </div>
                    ) : null}
                  </div>
                );
              }}
            </Cell>
          </Column>

          <Column width={120} align="center">
            <HeaderCell>
              {" "}
              <div className="h-full flex items-center">해시태그</div>
            </HeaderCell>
            <Cell>
              {(rowData) => (
                <div className="flex gap-0.5 h-full w-full items-center">
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

          {/* <Column align='center' width={120} sortable>
              <HeaderCell className={sortColumn === 'averagePosts' ? 'font-bold text-primary' : ''}>일간 포스트 수</HeaderCell>
              <Cell dataKey='averagePosts' />
            </Column> */}
        </Table>
      </div>
    </>
  );
};

// export const getServerSideProps = async () => {
//   const result = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`
//   );
//   const categories = await result.data;

//   const resCountry = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`
//   );
//   const countries = await resCountry.data;

//   const resLanguage = await axios.get(
//     `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`
//   );
//   const languages = await resLanguage.data;

//   const resultRank = await fetch(
//     `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/settings/getRankfilter`
//   );

//   const rankLimit = await resultRank.json();

//   return {
//     props: { categories, countries, languages, rankLimit },
//   };
// };

export default Ranking;
