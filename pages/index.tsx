import axios from 'axios';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { GetChannelsByCategory } from '../components/channel/GetChannelsByCategory';
import { Category, PostType } from '../typings';
import { GetChannels } from '../components/channel/GetChannels';
import HashtagBox from '../components/HashtagBox';
import HomeBoardPostList from '../components/HomeBoardPostList';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Pagination } from 'rsuite';
import GridPostRow from '../components/board/GridPostRow';
import Link from 'next/link';
import Section3 from '../components/search/Section3';

const Home: NextPage = ({
  channels,
  channelsToday,
  channels24h,
  categories,
  postList,
  gridPostList,
  tags,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [selectedTags, setSelectedTags] = useState([tags[5].tag]);
  const [taggedChannels, setTaggedChannels] = useState<any>([]);

  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    setActivePage(1);
  }, [selectedTags]);

  useEffect(() => {
    async function getChannels() {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/tag`, {
        query: selectedTags,
        offset: (activePage - 1) * 15,
      });
      const result = await response.data;
      setTaggedChannels(result);
    }
    getChannels();
  }, [selectedTags, activePage]);

  function PrevArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div style={{ ...style, display: 'block' }} onClick={onClick}>
        <ChevronLeftIcon className='text-gray-400 h-6 absolute top-2 -left-5 lg:-left-7 cursor-pointer hover:text-black' />
      </div>
    );
  }
  function NextArrow(props: any) {
    const { className, style, onClick } = props;
    return (
      <div style={{ ...style, display: 'block' }} onClick={onClick}>
        <ChevronRightIcon className='text-gray-400 h-6 absolute top-2 -right-5 lg:-right-7 cursor-pointer hover:text-black' />
      </div>
    );
  }

  const settings = {
    className: 'slider variable-width',
    variableWidth: true,
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 8,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1340,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  return (
    <div className='pt-7 px-4 lg:px-0 text-black'>
      <div className='space-y-4'>
        <span className='font-bold text-base'>(오늘)조회수 상위 채널</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          {channelsToday.map((channel: any, index: number) => {
            return (
              <div className='relative' key={channel.id}>
                <GetChannels channels={channel} desc={true} />
                <div className='absolute mask mask-decagon bg-yellow-500 -right-2 -top-2.5 font-bold text-xs text-white p-2'>{++index}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <div className='font-bold text-base items-center flex gap-2'>
          <span>최근 추가 채널</span>
          <span className='bg-[#D6e8FC] px-2 py-1 rounded-lg text-primary text-[11px] leading-none'>New</span>
        </div>
        <div className='grid md:grid-cols-5 border border-gray-200 rounded-xl bg-white p-1'>
          {channels.map((channel: any) => {
            return <GetChannels channels={channel} desc={false} tag={false} views={false} bordered={false} key={channel.id} />;
          })}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>이런 채널은 어떨까요?</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4 space-y-4 md:space-y-0'>
          <HashtagBox channels={channelsToday} />
          <HashtagBox channels={channels24h} />
          <HashtagBox channels={channelsToday} />
          <HashtagBox channels={channels24h} />
        </div>
      </div>

      <div className='space-y-4 my-7'>
        <span className='font-bold text-base'>구독자 상승 채널(24H)</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          {channels24h.map((channel: any) => {
            return <GetChannels channels={channel} desc={true} extra={1} key={channel.id} />;
          })}
        </div>
      </div>

      <Section3 />

      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>코인공지</span>
        <div className='w-full text-sm mt-4 grid md:grid-cols-6 gap-5 border border-gray-200 bg-white rounded-xl p-7'>
          {gridPostList?.posts?.map((post: PostType) => post.extra_01 === '1' && <GridPostRow post={post} key={post.id} />)}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>채널 해시태그</span>
        <div className='relative block space-x-3 w-[97%] mx-auto'>
          <Slider {...settings}>
            {tags?.map((tag: any) => (
              <div key={tag.tag} className='mr-1'>
                <button
                  className={`px-3 py-2 whitespace-nowrap border border-gray-200 rounded-2xl hover:bg-primary hover:text-white transition duration-300 ${
                    selectedTags.find((e) => e === tag.tag) ? 'bg-primary text-white font-bold' : 'text-black bg-white'
                  }`}
                  key={tag.tag}
                  onClick={() => {
                    selectedTags.find((e) => e === tag.tag)
                      ? setSelectedTags((current) =>
                          current.filter((element) => {
                            return element !== tag.tag;
                          })
                        )
                      : setSelectedTags([tag.tag]);
                  }}
                >
                  {tag.tag}
                </button>
              </div>
            ))}
          </Slider>
        </div>
        <div className='grid md:grid-cols-3 gap-0 md:gap-4'>
          {taggedChannels.channel?.map((channel: any, index: number) => {
            return <GetChannels channels={channel} desc={true} key={index} />;
          })}
        </div>
        <div className='p-5 flex justify-center'>
          <Pagination
            total={taggedChannels.total}
            limit={15}
            activePage={activePage}
            onChangePage={setActivePage}
            maxButtons={6}
            last
            first
            ellipsis
          />
        </div>
      </div>

      {/* <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>채널 카테고리</span>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories?.map((category: Category) => (
            <div key={category.id}>
              <div className='flex items-center'>
                <h2 className='font-bold'>{JSON.parse(category.name)[locale as string]}</h2>
                <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
                  {t['see-more']}
                  <ChevronRightIcon className='h-3' />
                </a>
              </div>
              <div className='border border-gray-200 rounded-md bg-white p-4'>{<GetChannelsByCategory value={category.id} label='' />}</div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  let data: any = {
    query: null,
    withDesc: false,
    category: [],
    country: [],
    language: [{ value: 'ko', label: 'Korean' }],
    channel_type: null,
    channel_age: 0,
    erp: 0,
    subscribers_from: null,
    subscribers_to: null,
    paginate: { limit: 4, offset: 0 },
    sort: { field: 'created_at', order: 'desc' },
  };

  // Get recently added channels
  data['paginate'] = { limit: 10, offset: 0 };
  const channels = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get most viewed channels today
  data['paginate'] = { limit: 4, offset: 0 };
  data['sort'] = { field: 'today', order: 'desc' };
  const channelsToday = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get most increased subscriptions in 24h channels
  data['paginate'] = { limit: 4, offset: 0 };
  data['sort'] = { field: 'extra_02', order: 'desc', type: 'integer' };
  const channels24h = await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
    .then((response) => response.data.channel);

  // Get Categories
  const categories = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`).then((response) => response.data);

  // Get Posts List
  const postList = await axios
    .post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=stock&category=null&postsperpage=6`)
    .then((response) => response.data);

  // Get Grid Posts List
  const gridPostQuery = {
    board: 'coin_notice',
    paginate: {
      offset: 0,
      limit: 9,
    },
    sort: {
      field: 'created_at',
      order: 'DESC',
    },
    filter: {
      field: 'extra_01',
      value: '1',
    },
    search: {
      start: null,
      end: null,
      field: 'author',
      value: null,
    },
  };
  const gridPostList = await axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, gridPostQuery)
    .then((response) => response.data);

  // Get Tag List
  const tags = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/get`).then((response) => response.data);

  return {
    props: { channels, channelsToday, channels24h, categories, postList, gridPostList, tags },
  };
};

export default Home;
