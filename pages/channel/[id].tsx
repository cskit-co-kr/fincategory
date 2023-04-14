import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  BoltIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import ChannelDetailLeftSidebar from "../../components/channel/ChannelDetailLeftSidebar";
import Post from "../../components/channel/Post";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { Loader } from "rsuite";
import ChannelDetailNav from "../../components/channel/ChannelDetailNav";
import { Channel } from "../../typings";

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

function ChannelDetail({
  channel,
  sub,
  averageViews,
  averagePosts,
  averageErr,
}: any) {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const [loadMoreText, setLoadMoreText] = useState<any>(t["load-more"]);
  const [posts, setPosts] = useState<any | null>(null);
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [searchEvent, setSearchEvent] = useState<any | null>(null);
  // const [data, setData] = useState<Array<any> | null>(null);

  useEffect(() => {
    getPosts();
    //getSub();
  }, []);

  // const getSub = async () => {
  //   const getSubsData = { username: channel.channel_id, locale: locale };

  //   const responseSub = await fetch(
  //     `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/subs`,
  //     {
  //       method: "POST",
  //       headers: { "content-type": "application/json" },
  //       body: JSON.stringify(getSubsData),
  //     }
  //   );
  //   const data = await responseSub.json();
  //   setData(data);
  //   // const sub = await responseSub.data;
  // };

  const getPosts = async () => {
    const getPostData = { username: channel.channel_id, limit: 20, offset: 0 };
    setSearchEvent(getPostData);
    setLoadMore(true);
    //setPosts(null);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/posts`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getPostData),
      }
    );
    const result = await response.json();
    result.length === 0 ? null : setPosts(result);
    result.length < 20 && setLoadMore(false);
  };

  const handleLoadMore = async (getPostData: any) => {
    setLoadMoreText(<Loader content={t["loading-text"]} />);
    getPostData.offset = getPostData.offset + 20;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/posts`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getPostData),
      }
    );
    const result = await response.json();
    result.length < 20 && setLoadMore(false);

    setPosts(posts.concat(result));
    setLoadMoreText(t["load-more"]);
  };

  const data = sub?.map((item: any) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString(
      locale === "ko" ? "ko-KR" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    return {
      name: formattedDate,
      sub: item.count,
    };
  });

  return (
    <div className="pt-36 bg-gray-50">
      <Head>
        {/* <title>{`FinCategory - ${channel.title}`}</title> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <div className="md:flex xl:w-[1280px] w-full mx-auto px-3 md:px-0">
        <ChannelDetailLeftSidebar channel={channel} />
        <div className="w-full md:w-[974px] flex flex-col gap-4 justify-items-stretch content-start">
          <ChannelDetailNav channel={channel} />
          <div className="flex-col lg:flex-row-reverse flex gap-4">
            <div>
              <div className="sticky inset-y-4 gap-4 flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-col">
                <div className="w-full lg:w-[310px] gap-2 flex flex-col border border-gray-200 rounded-md p-5 bg-white">
                  <div className="font-bold">{t["subscribers"]}</div>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart
                      width={270}
                      height={120}
                      data={data && data !== null ? data.slice(-30) : []}
                    >
                      <defs>
                        <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#3886E2"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3886E2"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <Tooltip content={<CustomTooltip />} />
                      <XAxis dataKey="name" hide />
                      <YAxis
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        hide
                      />
                      <Area
                        type="monotone"
                        dataKey="sub"
                        stroke="#3886E2"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#color)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <a
                    href={`${router.asPath}/subscribers`}
                    className="flex text-center justify-center gap-2 rounded-full border text-sm py-2 text-primary hover:bg-gray-100 hover:no-underline mt-2.5"
                  >
                    <ChartBarSquareIcon className="h-5" />
                    {t["Subscribers"]} {t["statistics"]}
                  </a>
                </div>

                <div className="text-xs grid grid-cols-2 w-full lg:w-[310px] gap-4 h-fit border border-gray-200 rounded-md p-4 bg-white">
                  <div className="flex flex-col gap-1 border-r">
                    <div className="flex items-center gap-2 text-gray-400">
                      <UsersIcon className="w-5 h-5 text-primary" />
                      {t["subscribers"]}
                    </div>
                    <div className="text-center font-semibold text-base">
                      {channel.subscription?.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400">
                      <ClipboardDocumentListIcon className="w-5 h-5 text-[#55A348]" />
                      {t["views-per-post"]}
                    </div>
                    <div className="text-center font-semibold text-base">
                      ~{averageViews.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 border-r">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarDaysIcon className="w-5 h-5 text-[#9B7C0C]" />
                      {t["posts-per-month"]}
                    </div>
                    <div className="text-center font-semibold text-base">
                      ~{averagePosts}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-400">
                      <BoltIcon className="w-5 h-5 text-[#CD5066]" />
                      {t["ERR"]}
                    </div>
                    <div className="text-center font-semibold text-base">
                      {parseFloat(averageErr).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[648px] gap-4 flex flex-col">
              {posts !== null ? (
                posts.map((post: any, index: number) => {
                  return <Post channel={channel} post={post} key={index} />;
                })
              ) : (
                <div className="text-center p-10 border border-gray-200 rounded-md bg-white">
                  {t["no-posts"]}
                </div>
              )}
              {loadMore && (
                <div className="flex justify-center col-span-3">
                  <button
                    onClick={() => handleLoadMore(searchEvent)}
                    className="bg-primary px-8 rounded-full text-sm py-2 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66]"
                  >
                    {loadMoreText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      {/* <img
        id='base64image'
        src='data:image/jpeg;base64, '
      /> */}
    </div>
  );
}

// export async function getStaticPaths() {
//   const path = await GetChannelsId();
//   const paths = path?.map((channel: any, idx: number) => ({
//     params: {
//       id: channel.username,
//     },
//   }));
//   // const paths = [
//   //   {
//   //     params: { id: "1" },
//   //   },
//   // ];
//   return { paths, fallback: true };
// }

export const getServerSideProps = async (context: any) => {
  const getId = context.query["id"];
  // const getId = params?.id;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`,
    { detail: getId }
  );
  const channel = response.data;
  const responseSub = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`,
    { id: channel.channel_id }
  );
  const sub = responseSub.data;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ channel_id: channel.channel_id }),
    }
  );
  const combinedReturn = await res.json();
  let averageViews = 0;
  let averagePosts = 0;
  let averageErr = 0;
  if (combinedReturn[0].total.length > 0) {
    averageViews = Math.round(
      combinedReturn[0].average.reduce((a: any, b: any) => {
        return a + b.average;
      }, 0) / combinedReturn[0].average.length
    );
    averagePosts = Math.round(
      combinedReturn[0].average.reduce((a: any, b: any) => {
        return a + b.views.length;
      }, 0) / combinedReturn[0].average.length
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

  if (channel !== "") {
    return {
      props: {
        channel,
        sub,
        averageViews,
        averagePosts,
        averageErr,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

export default ChannelDetail;
