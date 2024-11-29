import axios from "axios";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { useRouter } from "next/router";
import {
  GetChannels,
  GetChannelsSkeleton,
} from "../components/channel/GetChannels";
import { Loader } from "rsuite";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Section1, Section1Skeleton } from "../components/search/Section1";
import {
  Section2_1Skeleton,
  Section2_1,
} from "../components/search/Section2_1";
import {
  Section2_2,
  Section2_2Skeleton,
} from "../components/search/Section2_2";
import { Skeleton } from "@mui/material";
import Section3 from "../components/search/Section3";
import SearchFilterBar from "../components/search/SearchFilterBar";
import Ads1 from "../components/search/Ads1";
import addAds2 from "../lib/ads2";
import AdChannel2 from "../components/search/AdChannel2";
import Hashtag from "../components/Hashtag";
import HashtagMobile from "../components/HashtagMobile";
import { NextSeo } from "next-seo";

import ListChannels from "../components/channel/ListChannels";
import CategoriesSection from "../components/category/categoriesSection";

const Home = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  // console.log("locale", locale);
  const [selectedTag, setSelectedTag] = useState<any>();
  const [sortType, setSortType] = useState(1);

  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // const [searchText, setSearchText] = useState<any>("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectCategory, setSelectCategory] = useState<any>();

  const [channelType, setChannelType] = useState<any | null>([
    { value: "all", label: t["All-cumulative"] },
  ]);
  const [sorting, setSorting] = useState({
    field: "subscription",
    order: "desc",
  });
  const [selectedSorting, setSelectedSorting] =
    useState<string>("subscription_desc");

  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loadMoreText, setLoadMoreText] = useState<any>(t["load-more"]);

  const [searchEvent, setSearchEvent] = useState<any | null>(null);

  const [totalChannels, setTotalChannels] = useState<number>(0);
  const [channelsNew, setChannelsNew] = useState<any>(null);
  const [channelsToday, setChannelsToday] = useState<any>(null);
  const [channelsTotal, setChannelsTotal] = useState<any>(null);
  const [channelsTotalToday, setChannelsTotalToday] =
    useState<any>(channelsToday);

  const [channels24, setChannels24] = useState<any>(null);
  const [channels7d, setChannels7d] = useState<any>(null);
  const [channels30d, setChannels30d] = useState<any>(null);
  const [channels24_7_30, setChannels24_7_30] = useState();

  const [tags, setTags] = useState<any>();
  const [categories, setCategories] = useState<any>();

  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadBar, setLoadBar] = useState(false);

  const [isPending, startTransition] = useTransition();

  const [viewPort, setViewPort] = useState("grid");

  useEffect(() => {
    if (!isFirstLoad) {
      const tag = selectedTag?.tag ? `#${selectedTag.tag}` : "";
      doSearch(tag);
    }
    setIsFirstLoad(false);
    const data: any = {
      query: null, //searchText === '' ? null : searchText,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      // country: [{ value: 113, label: "Korea, Republic of" }],
      language: [{ value: locale }],
      channel_type: channelType[0].value === "all" ? [] : channelType,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 45, offset: 0 },
      sort: sorting,
    };

    const newChannels = async () => {
      // Get recently added channels
      data["sort"] = { field: "created_at", order: "desc" };
      data["paginate"] = { limit: 5, offset: 0 };
      data["channel_type"] = null;
      const channelsNew = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data?.channel)
        .catch((e) => console.log(e));
      setChannelsNew(channelsNew);
    };

    const todayChannels = async () => {
      // Get most viewed channels today
      data["paginate"] = { limit: 5, offset: 0 };
      data["sort"] = { field: "today", order: "desc" };
      data["channel_type"] = null;
      const channelsToday = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));

      setChannelsToday(channelsToday);
      setChannelsTotalToday(channelsToday);
    };
    newChannels();
    todayChannels();
  }, [selectedTag, selectedCategory]);

  useEffect(() => {
    const data: any = {
      query: null, //searchText === '' ? null : searchText,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      // country: [{ value: 113, label: "Korea, Republic of" }],
      language: [{ value: locale }],
      channel_type: channelType[0].value === "all" ? [] : channelType,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 45, offset: 0 },
      sort: sorting,
    };
    const newChannels = async () => {
      // Get recently added channels
      data["sort"] = { field: "created_at", order: "desc" };
      data["paginate"] = { limit: 5, offset: 0 };
      data["channel_type"] = null;
      const channelsNew = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data?.channel)
        .catch((e) => console.log(e));
      setChannelsNew(channelsNew);
    };

    const todayChannels = async () => {
      // Get most viewed channels today
      data["paginate"] = { limit: 5, offset: 0 };
      data["sort"] = { field: "today", order: "desc" };
      data["channel_type"] = null;
      const channelsToday = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));

      setChannelsToday(channelsToday);
      setChannelsTotalToday(channelsToday);
    };

    const _channels24 = async () => {
      // Get most increased subscriptions in 24h
      data["paginate"] = { limit: 6, offset: 0 };
      data["sort"] = { field: "extra_02", order: "desc", type: "integer" };
      data["channel_type"] = null;
      const channels24h = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));
      // Get most increased subscriptions in 7d
      data["sort"] = { field: "extra_03", order: "desc", type: "integer" };
      const channels7d = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));
      // Get most increased subscriptions in 30d
      data["sort"] = { field: "extra_04", order: "desc", type: "integer" };
      // console.log("data123", data);
      const channels30d = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));

      setChannels24(channels24h);
      setChannels7d(channels7d);
      setChannels30d(channels30d);

      setChannels24_7_30(channels24h);
    };

    const exec = async () => {
      const tags = await axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`)
        .then((response) => response.data);

      startTransition(() => {
        setTags(tags);
      });
    };

    const getTotal = async () => {
      data["paginate"] = { limit: 5, offset: 0 };
      data["sort"] = { field: "total", order: "desc" };
      const channelsTotal = await axios
        .post(
          `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
          data
        )
        .then((response) => response.data.channel)
        .catch((e) => console.log(e));
      setChannelsTotal(channelsTotal);
    };
    getTotal();

    newChannels();
    todayChannels();
    _channels24();

    exec();
    //
    // getCategoriesWithCount();
  }, [router]);

  useEffect(() => {
    if (router.query.q !== undefined) {
      doSearch(router.query.q as string);
    } else {
      doSearch("");
    }
    // getCategoriesWithCount();
  }, [router.query.q, sorting, locale]);

  useEffect(() => {
    setLoadMoreText(t["load-more"]);
    getCategoriesWithCount();
    setSelectedCategory(null);
  }, [locale]);

  const getCategoriesWithCount = async () => {
    const data = {
      language: locale,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/category/getCategoriesWithCount`,
        // "http://localhost:8080/v1/category/getCategoriesWithCount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      // console.log("response", response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // console.log("response", response);
      const resCat = await response.json();

      startTransition(() => {
        setCategories(resCat);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const doSearch = async (q: string) => {
    // q.length > 0 && setSearchText(q);

    let data = {
      query: q.length > 0 ? q : null, //searchText === '' ? null : searchText,
      withDesc: false,
      category: selectedCategory === null ? [] : selectedCategory,
      // country: [{ value: 113, label: "Korea, Republic of" }],
      language: [{ value: locale }],
      channel_type: channelType[0].value === "all" ? [] : channelType,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 45, offset: 0 },
      sort: sorting,
    };
    if (!!selectedTag?.tag) {
      data.query = `#${selectedTag.tag}`;
    }
    // console.log("data", data);
    setSearchEvent(data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      }
    );
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
    setLoadMoreText(<Loader content={t["loading-text"]} />);
    data["paginate"].limit = data["paginate"].limit + 45;
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`,
      data
    );
    const resultData = await response.data;
    // console.log("handleLoadMore >>> resultData", resultData);
    const result = resultData.channel;
    result.length - searchResult.length < 45 && setLoadMore(false);

    // add ad section 2 channels --------------------------------------
    const ads2Added = await addAds2(result);
    // ----------------------------------------------------------------

    setSearchResult(ads2Added);
    // setSearchResult(result);
    setIsLoading(false);
    setLoadMoreText(t["load-more"]);
  };

  const doFilter = (e: any) => {
    switch (e) {
      case "subscription_desc":
        return setSorting({ field: "subscription", order: "desc" });
      case "subscription_asc":
        return setSorting({ field: "subscription", order: "asc" });
      case "today_asc":
        return setSorting({ field: "today", order: "asc" });
      case "today_desc":
        return setSorting({ field: "today", order: "desc" });
      case "total_asc":
        return setSorting({ field: "total", order: "asc" });
      case "total_desc":
        return setSorting({ field: "total", order: "desc" });
      case "created_desc":
        return setSorting({ field: "created_at", order: "desc" });
      default:
        return "foo";
    }
  };

  function handleClick() {
    const element = document.getElementById("my-drawer-2");
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
      if (
        isLoading === false &&
        isMobile &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight
      ) {
        handleLoadMore(searchEvent);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMore, searchEvent]);

  const searchListRef = useRef(null);

  // const [channelRankingUrl, setChannelRankingUrl] = useState(
  //   "?column=increase24h"
  // );
  // const [text24730, setText24730] = useState(1);
  // const change24_7_30 = (x: number) => {
  //   if (x === 24) {
  //     setChannels24_7_30(channels24);
  //     setText24730(1);
  //     setChannelRankingUrl("?column=increase24h");
  //   } else if (x === 7) {
  //     setChannels24_7_30(channels7d);
  //     setText24730(2);
  //     setChannelRankingUrl("?column=increase7d");
  //   } else if (x === 30) {
  //     setChannels24_7_30(channels30d);
  //     setText24730(3);
  //     setChannelRankingUrl("?column=increase30d");
  //   }
  // };
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

  // console.log("searchResult", searchResult);
  // console.log("channelsToday", channelsToday);
  return (
    <>
      <NextSeo
        title={`핀카텔레 | 홈-텔레그램 채널/그룹 정보`}
        titleTemplate={`핀카텔레 | 홈-텔레그램 채널/그룹 정보`}
        description={
          "2000개 이상의 대한민국 코인, 금융, 정보취미, 정치사회 텔레그램 채널이 한자리에"
        }
      />
      <div className="flex flex-1 flex-col pt-[16px] lg:pt-[30px]">
        <div className="flex .grid .md:flex">
          <div className="flex flex-col gap-[16px] justify-items-stretch content-start w-full">
            {categories ? (
              <CategoriesSection
                tags={tags}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectCategory={selectCategory}
                setSelectCategory={setSelectCategory}
                searchListRef={searchListRef}
                categories={categories}
              />
            ) : null}
            {/*  */}
            {/* {(width || 0) < 1024 && tags ? (
              <HashtagMobile
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
                tags={tags}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                selectCategory={selectCategory}
                setSelectCategory={setSelectCategory}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchListRef={searchListRef}
              />
            ) : null} */}
            {/* <Ads1 /> */}
            {/* <Section3 /> */}
            {/* <div className="bg-white md:rounded-xl md:border md:border-gray-200 my-4 md:my-0 min-h-[263px]">
              <div className="flex items-center px-5 pt-5 pb-6">
                <div className="font-semibold text-sm">유저 상승 상위</div>
                <div className="font-semibold flex gap-2 ml-6">
                  <button
                    onClick={() => change24_7_30(24)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${
                      text24730 === 1 && "bg-primary text-white"
                    }`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => change24_7_30(7)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${
                      text24730 === 2 && "bg-primary text-white"
                    }`}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => change24_7_30(30)}
                    className={`rounded-full bg-gray-100 px-2 py-0.5 text-xs min-w-[40px] ${
                      text24730 === 3 && "bg-primary text-white"
                    }`}
                  >
                    30D
                  </button>
                </div>
                <Link
                  className="flex gap-1 text-primary items-center ml-auto"
                  href={`/ranking${channelRankingUrl}`}
                  target="_blank"
                >
                  {t["see-more"]}
                  <ChevronRightIcon className="h-3" />
                </Link>
              </div>
              {channels24 ? (
                <Section1 channels24h={channels24_7_30} extra={text24730} />
              ) : (
                <Section1Skeleton />
              )}
            </div> */}

            <div className="grid md:grid-cols-2 gap-4 min-h-[281px]">
              <div className="bg-white md:border md:border-gray-secondary md:rounded-xl">
                <div className="flex flex-row justify-between items-center pt-6 pb-3 px-5">
                  <div className="font-semibold text-sm flex gap-[12px] items-center">
                    <div className="min-w-[42.2px] h-[25px]">
                      {/* 조회수 */}
                      {t["Views"]}
                    </div>
                    <button
                      className={`rounded-full bg-gray-100 px-2 py-1 text-xs ${
                        sortType === 1 && "bg-primary text-white"
                      }`}
                      onClick={() => {
                        switchTodayTotalSortType(1);
                      }}
                    >
                      {/* 오늘 */}
                      {t["today"]}
                    </button>
                    <button
                      className={`rounded-full bg-gray-100 px-2 py-1 text-xs w-[40.2px] ${
                        sortType === 2 && "bg-primary text-white"
                      }`}
                      onClick={() => {
                        switchTodayTotalSortType(2);
                      }}
                    >
                      {/* 누적 */}
                      {t["All-cumulative"]}
                    </button>
                  </div>
                  <button
                    className="flex gap-1 text-primary items-center"
                    onClick={() => {
                      sortType === 1
                        ? setSelectedSorting("today_desc")
                        : setSelectedSorting("total_desc");
                      sortType === 1
                        ? doFilter("today_desc")
                        : doFilter("total_desc");
                      window.scrollTo({
                        top: 500,
                        behavior: "smooth",
                      });
                      // if (searchListRef.current) {
                      //   (searchListRef.current as HTMLElement).scrollIntoView({
                      //     behavior: "smooth",
                      //   });
                      // }
                    }}
                  >
                    {t["see-more"]}
                    <ChevronRightIcon className="h-3" />
                  </button>
                </div>
                {channelsToday ? (
                  <Section2_1 channels={channelsTotalToday} />
                ) : (
                  <Section2_1Skeleton />
                )}
              </div>

              <div className="bg-white md:border md:border-gray-secondary md:rounded-xl">
                <div className="flex justify-between items-center pt-5 pb-2 px-5">
                  <div className="font-semibold text-sm">
                    {t["recently-added"]}
                  </div>
                  <button
                    className="flex gap-1 text-primary items-center"
                    onClick={() => {
                      setSelectedSorting("created_desc");
                      doFilter("created_desc");
                      window.scrollTo({
                        top: 500,
                        behavior: "smooth",
                      });
                      // if (searchListRef.current) {
                      //   (searchListRef.current as HTMLElement).scrollIntoView({
                      //     behavior: "smooth",
                      //   });
                      // }
                    }}
                  >
                    {t["see-more"]}
                    <ChevronRightIcon className="h-3" />
                  </button>
                </div>
                {channelsNew ? (
                  <Section2_2 channelsNew={channelsNew} />
                ) : (
                  <Section2_2Skeleton />
                )}
                <div id="search"></div>
              </div>
            </div>
            {/* <div ref={searchListRef}></div> */}
            {/*  */}
            {/* all, channels, groups */}
            {/*  */}
            {searchResult ? (
              <SearchFilterBar
                totalChannels={totalChannels}
                doFilter={doFilter}
                setSelectedSorting={setSelectedSorting}
                selectedSorting={selectedSorting}
                loadBar={loadBar}
                channelType={channelType}
                setChannelType={setChannelType}
                selectedTag={selectedTag?.tag}
                handleClick={handleClick}
                doSearch={doSearch}
                viewPort={viewPort}
                setViewPort={setViewPort}
                selectedCategory={selectedCategory}
              />
            ) : (
              <Skeleton
                variant="rectangular"
                sx={{ bgcolor: "grey.100" }}
                animation="wave"
                className="min-h-[64px] sorting flex items-center w-full  md:rounded-xl p-3 md:p-4 "
              />
            )}
            {searchResult ? (
              searchResult.length > 0 ? (
                viewPort === "grid" ? (
                  <div className="grid md:grid-cols-3 gap-[8px] md:gap-[16px]">
                    {searchResult.map((channel: any, index: number) => {
                      return channel.prod_section ? (
                        <AdChannel2
                          channel={channel}
                          key={index}
                          showType={!!channel.type}
                          typeIcon={true}
                          showCategory={false}
                        />
                      ) : (
                        <GetChannels
                          channels={channel}
                          desc={true}
                          key={index}
                          showType
                          background=".px-8 .md:px-4 px-4 bg-white"
                          typeIcon={false}
                          typeStyle="px-1 mt-3 border-0"
                          showCategory={true}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <ListChannels
                      searchResult={searchResult}
                      sorting={sorting}
                    />
                  </div>
                )
              ) : (
                // Render empty sign when `searchResult` is empty
                <div className="text-center py-8 text-gray-500">
                  No channels found.
                </div>
              )
            ) : (
              // Loading skeletons while fetching
              <div className="grid md:grid-cols-3 gap-0 md:gap-[16px]">
                {Array(10)
                  .fill(1)
                  .map((_, index) => (
                    <GetChannelsSkeleton key={index} />
                  ))}
              </div>
            )}
            {loadMore && (
              <div className="flex justify-center">
                <button
                  onClick={() => handleLoadMore(searchEvent)}
                  className="bg-primary px-8 rounded-full text-sm py-2 my-7 mx-7 md:my-0 w-full md:w-fit self-center text-white hover:shadow-xl active:bg-[#143A66]"
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

export default Home;
