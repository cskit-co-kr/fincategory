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
  const { data: session } = useSession();
  const [total, setTotal] = useState(0);
  const [totalAll, setTotalAll] = useState(0);
  const [edit, setEdit] = useState(false);
  const [selectCategory, setSelectCategory] = useState<any>();

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
      country: [{ value: 113, label: "Korea, Republic of" }],
      language: [],
      channel_type: null,
      channel_age: 0,
      erp: 0,
      subscribers_from: subscribersFrom.value + 1,
      post_per_day_from: postPerFrom.value + 1,
      err_to: eRRTo.value,
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

  function saveRankLimit() {
    if (!eRRTo.value || eRRTo.value < 0) {
      setERRTo({ ...eRRTo, error: true });
      message.warning(t["check-username"]);
      return;
    }
    if (!subscribersFrom.value || subscribersFrom.value < 0) {
      setSubscribersFrom({ ...subscribersFrom, error: true });
      message.warning(t["check-username"]);
      return;
    }
    if (!postPerFrom.value || postPerFrom.value < 0) {
      setPostPerFrom({ ...postPerFrom, error: true });
      message.warning(t["check-username"]);
      return;
    }
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/settings/setRankFilter`,
        {
          errprecent_to: eRRTo.value,
          subscribers_from: subscribersFrom.value,
          postperday_from: postPerFrom.value,
        }
      )
      .then(({ data }) => {
        if (data === "Done") {
          message.success(t["filter-saved"]);
          doSearch(sortColumn, sortType, selectedTag, selectedCategory);
          setEdit(false);
        }
      })
      .catch((e) => message.error("failed"));
  }
  useEffect(() => {
    const exec = async () => {
      const tags = await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`)
        .then((response) => response.data);

      startTransition(() => {
        setTags(tags);
      });
    };
    doSearch("extra_08", "desc", undefined, undefined);
    exec();
  }, [locale, props]);
  return (
    <div className="md:pt-7 bg-gray-50">
      {(width || 0) < 1024 && tags ? (
        <HashtagMobile
          isRank={true}
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
          searchListRef={searchListRef}
        />
      ) : null}
      {(width || 0) >= 1024 && tags ? (
        <Hashtag
          isRank={true}
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectCategory={selectCategory}
          setSelectCategory={setSelectCategory}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchListRef={searchListRef}
        />
      ) : null}
      <div
        className={`border mt-5 border-gray-200 min-h-[70vh] bg-white rounded-md p-4 md:p-[30px]`}
      >
        <div className="flex gap-5 flex-col lg:flex-row lg:p-4 p-1 pt-0 w-full lg:items-center justify-between">
          <div className="text-[12px] leading-5 items-center flex">
            <div className="rounded-full mr-2 h-[11px] w-[11px] min-w-[11px] bg-[#FF0000]" />
            <div className="flex flex-wrap">
              <div>검색결과</div>
              {selectedTag ? (
                <div className="font-bold">“# {selectedTag.tag}”</div>
              ) : null}{" "}
              : <div className="font-bold ml-1">{totalAll}</div>개 채널 중{" "}
              <div className="font-bold ml-1 text-[#FF0000]">
                {totalAll - total}
              </div>
              개가 필터링 되어{" "}
              <div className="font-bold ml-1 text-[#3687E2]">{total}</div>개
              채널을 찾았습니다.
            </div>
          </div>
          <div
            className={`text-[12px] leading-5 items-center relative flex ${
              session?.user.type === 2
                ? "border p-2 rounded-md select-none group border-gray-400"
                : ""
            }`}
          >
            {session?.user.type === 2 && edit === false ? (
              <div
                onClick={() => setEdit(true)}
                className="absolute -top-3 cursor-pointer rounded-md transition-all hover:scale-110 group-hover:animate-vote text-yellow-600 duration-300 group-hover:border-[#0047FF] bg-white border p-1 -right-6 text-xl"
              >
                <BiEdit />
              </div>
            ) : null}
            {session?.user.type === 2 ? (
              <div
                className={`absolute text-2xl bg-white flex transition-all overflow-hidden top-1/2 z-0 -translate-y-1/2 ${
                  edit
                    ? "translate-x-full duration-300 opacity-100"
                    : "translate-x-0 invisible opacity-0"
                } right-0 rounded-l-none border-gray-400  border rounded-md`}
              >
                <div
                  onClick={() => edit === true && setEdit(false)}
                  className="flex h-8 w-9 transition-all justify-center cursor-pointer items-center bg-white hover:bg-red-400 text-red-400 hover:text-4xl hover:text-white"
                >
                  <RiCloseLine />
                </div>
                <div
                  onClick={() => edit === true && saveRankLimit()}
                  className="flex h-8 w-9 transition-all justify-center cursor-pointer items-center bg-white text-green-400 hover:bg-green-400 hover:text-4xl hover:text-white"
                >
                  <RiCheckLine />
                </div>
              </div>
            ) : null}
            <div className="rounded-full mr-2 h-[11px] w-[11px] bg-[#0047FF] min-w-[11px]" />
            <div className="flex flex-wrap">
              필터링 조건 : 구독자
              <div className="ml-1 text-[#3687E2]">
                {session?.user.type === 2 && edit ? (
                  <InputNumber
                    status={subscribersFrom.error ? "error" : undefined}
                    autoFocus={subscribersFrom.error ? true : undefined}
                    className="w-11 defualtNumberInput"
                    size="small"
                    min={0}
                    value={subscribersFrom.value}
                    onChange={(v: any) =>
                      setSubscribersFrom({ value: v, error: false })
                    }
                  />
                ) : (
                  subscribersFrom.value
                )}
                명 이하 +
              </div>
              일간포스트수{" "}
              <div className="ml-1 text-[#3687E2]">
                {" "}
                {session?.user.type === 2 && edit ? (
                  <InputNumber
                    status={postPerFrom.error ? "error" : undefined}
                    autoFocus={postPerFrom.error ? true : undefined}
                    onChange={(v: any) =>
                      setPostPerFrom({ value: v, error: false })
                    }
                    className="w-11 defualtNumberInput"
                    size="small"
                    min={0}
                    value={postPerFrom.value}
                  />
                ) : (
                  postPerFrom.value
                )}{" "}
                이하 +
              </div>
              포스트조회율{" "}
              <div className="ml-1 text-[#3687E2]">
                {" "}
                {session?.user.type === 2 && edit ? (
                  <InputNumber
                    autoFocus={eRRTo.error ? true : undefined}
                    status={eRRTo.error ? "error" : undefined}
                    onChange={(v: any) => setERRTo({ value: v, error: false })}
                    className="w-11 defualtNumberInput"
                    size="small"
                    min={0}
                    value={eRRTo.value}
                  />
                ) : (
                  eRRTo.value
                )}
                % 이상
              </div>
            </div>
          </div>
        </div>
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
            className="z-0 rounded-lg !border-none "
            renderEmpty={() => (
              <div className="text-center py-10">{t["no-search-results"]}</div>
            )}
            renderLoading={() => (
              <div className="text-center py-10">{t["loading-text"]}</div>
            )}
          >
            <Column width={(width || 0) < 768 ? 45 : 50} align="center">
              <HeaderCell>{t["rank"]}</HeaderCell>
              <Cell dataKey="rank">
                {(rowdata) => (
                  <div className="flex w-full h-full justify-center items-center">
                    {rowdata.rank}
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={(width || 0) < 768 ? 45 : 70} align="center">
              <HeaderCell>구분</HeaderCell>
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

            <Column
              flexGrow={2}
              minWidth={(width || 0) < 550 ? (width || 0) - 100 : 300}
            >
              <HeaderCell>
                <div className="px-14">이름</div>
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

            <Column width={80} align="center">
              <HeaderCell>{t["category"]}</HeaderCell>
              <Cell>
                {(rowData) => (
                  <div className="flex w-full h-full justify-center items-center">
                    <div className="bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF] whitespace-nowrap h-fit">
                      {rowData.category}
                    </div>
                  </div>
                )}
              </Cell>
            </Column>

            <Column width={120} align="center">
              <HeaderCell>해시태그</HeaderCell>
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

            <Column width={locale === "ko" ? 80 : 110} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "subscription" ? "font-bold text-primary" : ""
                }
              >
                {t["subscribers"]}
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

            <Column width={locale === "ko" ? 90 : 120} align="center" sortable>
              <HeaderCell
                className={
                  sortColumn === "increase7d" ? "font-bold text-primary" : ""
                }
              >
                {t["increase-7d"]}
              </HeaderCell>
              <Cell dataKey="increase7d">
                {(rowData) => (
                  <div className="flex w-full h-full justify-center items-center pr-2">
                    {rowData.increase7d > 0 ? (
                      <span className="text-green-500">
                        +{rowData.increase7d}
                      </span>
                    ) : (
                      <span className="text-red-500">{rowData.increase7d}</span>
                    )}
                  </div>
                )}
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
                  return (
                    <div className="flex w-full h-full justify-center items-center pr-2">
                      {!!rowData.extra_06 ? (
                        <span className="">{rowData.extra_07}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </div>
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
                  return (
                    <div className="flex w-full h-full justify-center items-center pr-2">
                      {!!rowData.extra_06 ? (
                        <span className="">{rowData.extra_06}</span>
                      ) : (
                        <span>0</span>
                      )}
                    </div>
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
                  return (
                    <div className="flex w-full h-full justify-center items-center pr-2">
                      {!!rowData.extra_08 ? (
                        <span className="">
                          {parseFloat(rowData.extra_08).toFixed(2)}%
                        </span>
                      ) : (
                        <span>0.00%</span>
                      )}
                    </div>
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

  const resultRank = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/settings/getRankfilter`
  );

  const rankLimit = await resultRank.json();

  return {
    props: { categories, countries, languages, rankLimit },
  };
};

export default Ranking;
