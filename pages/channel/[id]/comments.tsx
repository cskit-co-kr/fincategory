import { BoltIcon, CalendarDaysIcon, ChartBarSquareIcon, ClipboardDocumentListIcon, UsersIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button, Loader, Message, useToaster } from 'rsuite';
import { useSession } from 'next-auth/react';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import { PlacementType } from 'rsuite/esm/toaster/ToastContainer';

import ChannelDetailLeftSidebar from '../../../components/channel/ChannelDetailLeftSidebar';
import ChannelDetailNav from '../../../components/channel/ChannelDetailNav';

import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';
import ChannelComment from '../../../components/channel/ChannelComment';

type TComment = {
  id: number
  comment: string
  reaction: string
  created_at: Date
  updated_at: Date
  user: {
    id: number
    nickname: string
  }
}

const Post = dynamic(() => import('../../../components/channel/Post'), {
  ssr: false,
});

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
}

const Comments = ({ channel, sub, averageViews, averagePosts, averageErr }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;
  const [loadMoreText, setLoadMoreText] = useState<any>(t['load-more']);
  const [comments, setComments] = useState<Array<TComment>>([]);
  const [comment, setComment] = useState<string>('');
  const [loadMore, setLoadMore] = useState<boolean>(false);
  const [searchEvent, setSearchEvent] = useState<any | null>(null);
  const [placement, setPlacement] = useState<PlacementType>('topEnd');

  const message = (type: TypeAttributes.Status, message: string) => (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  );

  const { data: session } = useSession();

  const toaster = useToaster();

  useEffect(() => {
    getComments();
  }, []);

  const getComments = async () => {
    const getCommentData = { username: channel.channel_id, limit: 10, offset: 0 };
    setSearchEvent(getCommentData);
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/list`, {
      channel: channel.channel_id,
      paginate: {
        limit: getCommentData.limit,
        offset: getCommentData.offset,
      },
      sort: {
        field: 'created_at',
        order: 'DESC'
      }
    });

    const result = response.data;
    
    result.total === 0 ? null : setComments(result.comments);
    result.total > 10 && setLoadMore(true);
  }

  const handleLoadMore = async (getCommentData: any) => {
    setLoadMoreText(<Loader content={t['loading-text']} />);
    getCommentData.offset = getCommentData.offset + 10;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/list`, {
      channel: channel.channel_id,
      paginate: {
        limit: getCommentData.limit,
        offset: getCommentData.offset,
      },
      sort: {
        field: 'created_at',
        order: 'DESC'
      }
    });
    const result = response.data;
    result.comments.length < 10 && setLoadMore(false);

    setComments(comments.concat(result.comments));
    setLoadMoreText(t['load-more']);
  }

  const data = sub?.map((item: any) => {
    const date = new Date(item.created_at);
    const formattedDate = date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    return { name: formattedDate, sub: item.count };
  });

  // Save Comment
  const saveComment = async () => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/insert`, {
      comment: comment,
      user: Number(session?.user.id),
      channel: channel.channel_id
    });

    const result = response.data;

    if (response.status === 200) {
      if (result.code === 201 && result.message === 'Inserted') {
        toastShow('info', t['comment-saved']);
        setComment('');
      }
    } else {
      toastShow('error', t['login-to-comment']);
    }
    getComments();
  }

  const toastShow = (type: TypeAttributes.Status, txt: string) => {
    const options = { placement, duration: 5000 };
    toaster.push(message(type, txt), options);
  };

  return (
    <>
      <NextSeo
        title={channel.title}
        description={channel.description}
        additionalMetaTags={[
          { name: 'og:title', content: channel.title },
          { name: 'og:description', content: channel.description },
          { name: 'twitter:title', content: channel.title },
          { name: 'twitter:description', content: channel.description },
        ]}
      />
      <div className='md:pt-7 bg-gray-50'>
        <div className='md:flex mx-auto px-3 md:px-0'>
          <ChannelDetailLeftSidebar channel={channel} />
          <div className='w-full flex flex-col gap-4 justify-items-stretch content-start'>
            <ChannelDetailNav channel={channel} />
            <div className='flex flex-col lg:flex-row-reverse gap-4'>
              <div className='rightsidebar'>
                <div className='sticky inset-y-4 gap-4 flex flex-col md:grid md:grid-cols-5 lg:flex lg:flex-col'>
                  <div className='w-full md:col-span-3 lg:w-[250px] xl:w-[310px] gap-2 flex flex-col border border-gray-200 rounded-md p-5 bg-white'>
                    <div className='font-bold'>{t['subscribers']}</div>
                    <ResponsiveContainer width='100%' minWidth={0} height={120}>
                      <AreaChart width={270} height={120} data={data && data !== null ? data.slice(-30) : []}>
                        <defs>
                          <linearGradient id='color' x1='0' y1='0' x2='0' y2='1'>
                            <stop offset='5%' stopColor='#3886E2' stopOpacity={0.3} />
                            <stop offset='95%' stopColor='#3886E2' stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <XAxis dataKey='name' hide />
                        <YAxis type='number' domain={['dataMin', 'dataMax']} hide />
                        <Area type='monotone' dataKey='sub' stroke='#3886E2' strokeWidth={2} fillOpacity={1} fill='url(#color)' />
                      </AreaChart>
                    </ResponsiveContainer>
                    <a
                      href={`${router.asPath}/subscribers`}
                      className='flex text-center justify-center gap-2 rounded-full border text-sm py-2 text-primary hover:bg-gray-100 hover:no-underline mt-2.5'
                    >
                      <ChartBarSquareIcon className='h-5' />
                      {t['Subscribers']} {t['statistics']}
                    </a>
                  </div>

                  <div className='text-xs grid grid-cols-2 w-full md:h-[247px] lg:h-[146px] md:col-span-2 lg:w-[250px] xl:w-[310px] gap-4 h-fit border border-gray-200 rounded-md p-4 bg-white'>
                    <div className='flex flex-col gap-1 border-r'>
                      <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
                        <UsersIcon className='w-5 h-5 text-primary' />
                        {t['subscribers']}
                      </div>
                      <div className='text-center font-semibold text-base'>{channel.subscription?.toLocaleString()}</div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
                        <ClipboardDocumentListIcon className='w-5 h-5 text-[#55A348]' />
                        {t['views-per-post']}
                      </div>
                      <div className='text-center font-semibold text-base'>~{averageViews.toLocaleString()}</div>
                    </div>
                    <div className='flex flex-col gap-1 border-r'>
                      <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
                        <CalendarDaysIcon className='w-5 h-5 text-[#9B7C0C]' />
                        {t['posts-per-month']}
                      </div>
                      <div className='text-center font-semibold text-base'>~{averagePosts}</div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='flex sm:flex-col lg:flex-row items-center gap-2 text-gray-400'>
                        <BoltIcon className='w-5 h-5 text-[#CD5066]' />
                        {t['ERR']}
                      </div>
                      <div className='text-center font-semibold text-base'>{parseFloat(averageErr).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='gap-4 flex flex-col w-full'>
                <div className='bg-[#f2f2f2]'>
                  <div className='comment-write text-center md:mt-[20px] md:mb-[20px] md:mx-[140px]'>
                    <textarea
                      className='border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none'
                      onChange={(e) => setComment(e.currentTarget.value)}
                      value={comment}
                      name='textarea'
                    />
                    <Button
                      appearance='primary'
                      className='bg-primary text-white py-2 px-5 text-center hover:text-white'
                      disabled={comment.trim().length > 0 ? false : true}
                      onClick={saveComment}
                    >
                      등록
                    </Button>
                  </div>
                </div>
                {comments.length !== 0 ? (
                  <div className='p-4 border border-gray-200 rounded-md bg-white'>
                    {comments.map((comment: any, index: number) => {
                      return <ChannelComment comment={comment} userID={Number(session?.user.id)} fncToast={toastShow} key={index} />;
                    })}
                  </div>
                ) : (
                  <div className='text-center p-10 border border-gray-200 rounded-md bg-white'>{t['no-comments']}</div>
                )}
                {loadMore && (
                  <div className='flex justify-center col-span-3'>
                    <button onClick={() => handleLoadMore(searchEvent)} className='bg-primary px-8 rounded-full text-sm py-2 w-fit self-center text-white hover:shadow-xl active:bg-[#143A66] mb-4 md:mb-0'>
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
  const getId = context.query['id'];
  let averageViews = 0;
  let averagePosts = 0;
  let averageErr = 0;

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { detail: getId });
  const channel = response.data;

  const responseSub = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getSubsHistory`, { id: channel.channel_id });
  const sub = responseSub.data;

  const res = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
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

    averageErr = errPercent.reduce((a: any, b: any) => {
      return a + b.views;
    }, 0) / errPercent.length;
  }

  if (channel !== '') {
    return {
      props: { channel, sub, averageViews, averagePosts, averageErr }
    }
  } else {
    return { notFound: true }
  }
}

export default Comments;
