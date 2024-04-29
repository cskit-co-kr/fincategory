import {
  BoltIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button, Loader, Message, useToaster } from "rsuite";
import { TypeAttributes } from "rsuite/esm/@types/common";
import { PlacementType } from "rsuite/esm/toaster/ToastContainer";

import { ChannelDetailLeftSidebar } from "../../../components/channel/ChannelDetailLeftSidebar";
import { ChannelDetailNav } from "../../../components/channel/ChannelDetailNav";

import ChannelComment from "../../../components/channel/ChannelComment";
import { enUS } from "../../../lang/en-US";
import { koKR } from "../../../lang/ko-KR";
import RightSidebar from "../../../components/channel/RightSidebar";

type TComment = {
  id: number;
  comment: string;
  reaction: string;
  created_at: Date;
  updated_at: Date;
  user: {
    id: number;
    nickname: string;
  };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='flex flex-col border border-gray-200 rounded-md bg-white text-xs shadow-md'>
        <span className='bg-gray-200 p-1.5'>{label}</span>
        <span className='p-1.5'>{payload[0].value.toLocaleString()}</span>
      </div>
    );
  }
  return null;
};

const Comments = ({ channel, sub, averageViews, averagePosts, averageErr }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const [loadMoreText, setLoadMoreText] = useState<any>(t["load-more"]);
  const [comments, setComments] = useState<Array<TComment>>([]);
  const [review, setReview] = useState<string>("");
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [searchEvent, setSearchEvent] = useState<any | null>(null);
  const [placement, setPlacement] = useState<PlacementType>("topEnd");

  const message = (type: TypeAttributes.Status, message: string) => (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  );

  const { data: session } = useSession();

  const toaster = useToaster();

  const [data, setData] = useState();
  useEffect(() => {
    const data = sub?.map((item: any) => {
      const date = new Date(item.created_at);
      const formattedDate = date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return { name: formattedDate, sub: item.count };
    });
    setData(data);
    getComments();
  }, []);

  const getComments = async () => {
    // setComments([]);
    const getCommentData = { username: channel.channel_id, limit: 10, offset: 0 };
    setSearchEvent(getCommentData);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/list`, {
      channel: channel.channel_id,
      paginate: {
        limit: getCommentData.limit,
        offset: getCommentData.offset,
      },
      sort: {
        field: "created_at",
        order: "DESC",
      },
    });

    const result = response.data;

    result.total === 0 ? setComments([]) : setComments(result.comments);
    result.total > 10 && setLoadMore(true);
  };

  const handleLoadMore = async (getCommentData: any) => {
    setLoadMoreText(<Loader content={t["loading-text"]} />);
    getCommentData.offset = getCommentData.offset + 10;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/list`, {
      channel: channel.channel_id,
      paginate: {
        limit: getCommentData.limit,
        offset: getCommentData.offset,
      },
      sort: {
        field: "created_at",
        order: "DESC",
      },
    });
    const result = response.data;
    result.comments.length < 10 && setLoadMore(false);

    setComments(comments.concat(result.comments));
    setLoadMoreText(t["load-more"]);
  };

  // Save Comment
  const saveReview = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/insert`, {
      comment: review,
      user: Number(session?.user.id),
      channel: channel.channel_id,
    });

    const result = response.data;

    if (response.status === 200) {
      if (result.code === 201 && result.message === "Inserted") {
        toastShow("info", t["comment-saved"]);
        setReview("");
        getComments();
      }
    } else {
      toastShow("error", t["login-to-comment"]);
    }
  };

  const toastShow = (type: TypeAttributes.Status, txt: string) => {
    const options = { placement, duration: 5000 };
    toaster.push(message(type, txt), options);
  };

  return (
    <>
      <NextSeo
        noindex={true}
        nofollow={true}
        title={channel.title}
        description={channel.description}
        additionalMetaTags={[
          { name: "title", content: `${channel.title} | FinCa ` },
          { name: "og:title", content: channel.title },
          { name: "og:description", content: channel.description },
          { name: "twitter:title", content: channel.title },
          { name: "twitter:description", content: channel.description },
        ]}
      />
      <div className='md:pt-7 bg-gray-50'>
        <div className='md:flex mx-auto px-3 md:px-0'>
          <ChannelDetailLeftSidebar channel={channel} />
          <div className='w-full flex flex-col gap-4 justify-items-stretch content-start'>
            <ChannelDetailNav channel={channel} />
            <div className='flex flex-col lg:flex-row-reverse gap-4'>
              <RightSidebar
                channel={channel}
                data={data}
                averageViews={averageViews}
                averagePosts={averagePosts}
                averageErr={averageErr}
              />

              <div className='gap-4 flex flex-col w-full'>
                <div className='bg-[#f2f2f2]'>
                  <div className='review-write text-center p-5'>
                    {session?.user ? (
                      <>
                        <textarea
                          className='border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none'
                          onChange={(e) => setReview(e.currentTarget.value)}
                          value={review}
                          name='textarea'
                        />
                        <Button
                          appearance='primary'
                          className='bg-primary text-white py-2 px-5 text-center hover:text-white'
                          disabled={review.trim().length > 0 ? false : true}
                          onClick={saveReview}
                        >
                          {t["register"]}
                        </Button>
                      </>
                    ) : (
                      <div className='p-10'>
                        <div className='text-center pb-5'>{t["login-to-comment"]}</div>
                        <Button
                          appearance='primary'
                          className='bg-primary text-white py-2 px-5 text-center hover:text-white'
                          onClick={() => router.push(`/board/signin?callbackUrl=/channel/${channel.username}/comments`)}
                        >
                          {t["sign-in"]}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                {comments.length !== 0 ? (
                  <div className='p-4 border border-gray-200 rounded-md bg-white'>
                    {comments.map((comment: any, index: number) => {
                      return (
                        <ChannelComment
                          comment={comment}
                          userID={Number(session?.user.id)}
                          fncToast={toastShow}
                          key={comment.id}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className='text-center p-10 border border-gray-200 rounded-md bg-white'>{t["no-comments"]}</div>
                )}
                {loadMore && (
                  <div className='flex justify-center col-span-3'>
                    <button
                      onClick={() => handleLoadMore(searchEvent)}
                      className='bg-primary px-8 rounded-full text-sm py-2 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66] mb-4 md:mb-0'
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
  let averageViews = 0;
  let averagePosts = 0;
  let averageErr = 0;

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: getId });
  const channel = response.data;

  const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, {
    id: channel.channel_id,
  });
  const sub = responseSub.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ channel_id: channel.channel_id }),
  });
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

  if (channel !== "") {
    return {
      props: { channel, sub, averageViews, averagePosts, averageErr },
    };
  } else {
    return { notFound: true };
  }
};

export default Comments;
