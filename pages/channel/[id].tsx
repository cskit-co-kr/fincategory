import {
  BoltIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState, useTransition } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loader } from "rsuite";

import {
  ChannelDetailLeftSidebar,
  ChannelDetailLeftSidebarSkeleton,
} from "../../components/channel/ChannelDetailLeftSidebar";
import {
  ChannelDetailNav,
  ChannelDetailNavSkeleton,
} from "../../components/channel/ChannelDetailNav";
import {
  EmptyPostWebSkeleton,
  PostWeb,
  PostWebSkeleton,
} from "../../components/channel/PostWeb";
import PostDB from "../../components/channel/PostDB";

import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { Skeleton } from "@mui/material";
import { start } from "repl";
import SubscriberChartMini from "../../components/channel/SubscriberChartMini";
import RightSidebar from "../../components/channel/RightSidebar";
import _ from "lodash";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col border border-gray-200 rounded-md bg-white text-xs shadow-md">
        <span className="bg-gray-200 p-1.5">{label}</span>
        <span className="p-1.5">{payload[0].value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
};

const ChannelDetail = ({ channel }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const [loadMoreText, setLoadMoreText] = useState<any>(t["load-more"]);
  const [posts, setPosts] = useState<any>(null);
  // const [channel, setChannel] = useState<any>(null);
  const [sub, setSub] = useState<any>();
  const [averageViews, setAverageViews] = useState<any>();
  const [averagePosts, setAveragePosts] = useState<any>();
  const [averageErr, setAverageErr] = useState<any>();

  const [postsLastId, setPostsLastId] = useState<number | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [searchEvent, setSearchEvent] = useState<any | null>(null);
  const [mode, setMode] = useState<string>("web");

  const [isPending, startTransition] = useTransition();

  // useEffect(() => {
  //   const _channel = async () => {
  //     const id = router.query['id'];

  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: id });
  //     const channel = response.data;
  //     setChannel(channel);
  //   };

  //   _channel();
  // }, [router]);

  useEffect(() => {
    if (channel) {
      getPostsWeb();
    }
  }, [channel]);

  useEffect(() => {
    const sub = async () => {
      const responseSub = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`,
        {
          id: channel?.channel_id,
        }
      );
      const sub = responseSub.data;
      const d = sub.map((item: any) => {
        const date = new Date(item.created_at);
        const formattedDate = date.toLocaleDateString(
          locale === "ko" ? "ko-KR" : "en-US",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          }
        );
        return { name: formattedDate, sub: item.count };
      });
      setData(d);
      setSub(sub);
    };

    sub();
  }, [router, channel]);

  useEffect(() => {
    const average = async () => {
      let averageViews = channel?.extra_06 || 0;
      let averagePosts = channel?.extra_07 || 0;
      let averageErr = channel?.extra_08 || 0;
      if (!averageViews && !averagePosts && !averageErr) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ channel_id: channel.channel_id }),
          }
        );
        const combinedReturn = await res.json();
        if (combinedReturn[0].total.length > 0) {
          averageViews = Math.round(
            combinedReturn[0].average.reduce((a: any, b: any) => {
              return a + b.average;
            }, 0) / combinedReturn[0].average.length
          );

          averagePosts = Math.round(
            combinedReturn[0].average.slice(-30).reduce((a: any, b: any) => {
              return a + b.posts;
            }, 0) / combinedReturn[0].average.slice(-30).length
          );

          const errPercent = combinedReturn[0].average.map((item: any) => ({
            date: item.date,
            views: Math.round((item.average * 100) / channel.subscription),
          }));

          averageErr =
            errPercent.reduce((a: any, b: any) => {
              return a + b.views;
            }, 0) / errPercent.length;
        }
      }
      startTransition(() => {
        setAverageViews(averageViews);
        setAveragePosts(averagePosts);
        setAverageErr(averageErr);
      });
    };
    if (channel) {
      average();
    }
  }, [router, channel]);

  const getPostsWeb = async () => {
    try {
      setLoadMore(true);
      // console.log("channel?.username", channel?.username);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/posts`,
        {
          channel: channel?.username,
          last_id: null,
        }
      );
      const result = await response.data;
      setPostsLastId(result.last_id);
      if (result.posts.length === 0) {
        setMode("db");
        getPostsDB();
      } else {
        result.posts.length === 0 ? setPosts("empty") : setPosts(result.posts);
        result.posts.length < 12 && setLoadMore(false);
        setMode("web");
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleLoadMoreWeb = async (getPostData: any) => {
    setLoadMoreText(<Loader content={t["loading-text"]} />);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/posts`,
      {
        channel: channel.username,
        last_id: postsLastId,
      }
    );
    const result = await response.data;

    result.last_id === null ? setLoadMore(false) : setLoadMore(true);
    setPostsLastId(result.last_id);
    setLoadMoreText(t["load-more"]);
    setPosts(posts.concat(result.posts));
  };

  const getPostsDB = async () => {
    const getPostData = { username: channel.channel_id, limit: 10, offset: 0 };
    setSearchEvent(getPostData);
    setLoadMore(true);
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail/${getPostData.username}/posts`,
      {
        paginate: {
          limit: getPostData.limit,
          offset: getPostData.offset,
        },
      }
    );

    const result = await response?.data;
    result.length === 0 ? setPosts("empty") : setPosts(result);
    result.length < 10 && setLoadMore(false);
  };

  const handleLoadMoreDB = async (getPostData: any) => {
    setLoadMoreText(<Loader content={t["loading-text"]} />);
    getPostData.offset = getPostData.offset + 10;

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail/${getPostData.username}/posts`,
      {
        paginate: {
          limit: getPostData.limit,
          offset: getPostData.offset,
        },
      }
    );
    const result = await response?.data;
    result.length < 10 && setLoadMore(false);

    setPosts(posts.concat(result));
    setLoadMoreText(t["load-more"]);
  };

  // const data = sub?.map((item: any) => {
  //   const date = new Date(item.created_at);
  //   const formattedDate = date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //   });

  //   return { name: formattedDate, sub: item.count };
  // });

  const [data, setData] = useState();
  // useEffect(() => {
  //   const d = sub?.map((item: any) => {
  //     const date = new Date(item.created_at);
  //     const formattedDate = date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
  //       day: 'numeric',
  //       month: 'long',
  //       year: 'numeric',
  //     });
  //     return { name: formattedDate, sub: item.count };
  //   });
  //   setData(d);
  // }, []);

  return (
    <>
      <NextSeo
        title={`${channel.title} @${channel.username} `}
        description={channel.description}
        titleTemplate={`${channel.title} @${channel.username} `}
      />
      <div className="md:pt-7 bg-gray-50">
        <div className="md:flex mx-auto px-3 md:px-0">
          {channel ? (
            <ChannelDetailLeftSidebar channel={channel} />
          ) : (
            <ChannelDetailLeftSidebarSkeleton />
          )}
          <div className="w-full flex flex-col gap-4 justify-items-stretch content-start">
            {channel ? (
              <ChannelDetailNav channel={channel} />
            ) : (
              <ChannelDetailNavSkeleton />
            )}
            <div className="flex flex-col lg:flex-row-reverse gap-4">
              <RightSidebar
                channel={channel}
                data={data}
                averageViews={averageViews}
                averagePosts={averagePosts}
                averageErr={averageErr}
              />

              <div className="gap-4 flex flex-col w-full">
                {posts === "empty" ? (
                  <EmptyPostWebSkeleton channel={channel} />
                ) : posts?.length > 0 ? (
                  posts.map((post: any) => {
                    if (mode === "web") {
                      return (
                        <PostWeb channel={channel} post={post} key={post.id} />
                      );
                    }

                    if (mode === "db") {
                      return post.post !== null ? (
                        <PostDB channel={channel} post={post} key={post.id} />
                      ) : (
                        <></>
                      );
                    }
                  })
                ) : (
                  Array(1)
                    .fill(1)
                    .map((index) => {
                      return <PostWebSkeleton key={index} />;
                    })
                )}
                {loadMore && (
                  <div className="flex justify-center col-span-3">
                    <button
                      onClick={() =>
                        mode === "web"
                          ? handleLoadMoreWeb(searchEvent)
                          : handleLoadMoreDB(searchEvent)
                      }
                      className="bg-primary px-8 rounded-full text-sm py-2 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66] mb-4 md:mb-0"
                    >
                      {loadMoreText}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const getId = context.query["id"];

  //   let averageViews = 0;
  //   let averagePosts = 0;
  //   let averageErr = 0;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`,
    { detail: getId }
  );

  const channel = response.data;

  if (_.isEmpty(channel) && getId === "ranking") {
    return {
      redirect: {
        destination: "/ranking",
        permanent: false,
      },
    };
  }
  //   if (!channel) {
  //     return { notFound: true };
  //   }

  //   const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, { id: channel.channel_id });
  //   const sub = responseSub.data;

  //   const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`, {
  //     method: 'POST',
  //     headers: { 'content-type': 'application/json' },
  //     body: JSON.stringify({ channel_id: channel.channel_id }),
  //   });
  //   const combinedReturn = await res.json();

  //   if (combinedReturn[0].total.length > 0) {
  //     averageViews = Math.round(
  //       combinedReturn[0].average.reduce((a: any, b: any) => {
  //         return a + b.average;
  //       }, 0) / combinedReturn[0].average.length
  //     );

  //     averagePosts = Math.round(
  //       combinedReturn[0].average.slice(-30).reduce((a: any, b: any) => {
  //         return a + b.posts;
  //       }, 0) / combinedReturn[0].average.slice(-30).length
  //     );

  //     const errPercent = combinedReturn[0].average.map((item: any) => ({
  //       date: item.date,
  //       views: Math.round((item.average * 100) / channel.subscription),
  //     }));

  //     averageErr =
  //       errPercent.reduce((a: any, b: any) => {
  //         return a + b.views;
  //       }, 0) / errPercent.length;
  //   }

  if (channel !== "") {
    return {
      props: { channel },
    };
  } else {
    return { notFound: true };
  }
};

export default ChannelDetail;
