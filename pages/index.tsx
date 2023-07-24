import axios from 'axios';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { GetChannelsByCategory } from '../components/channel/GetChannelsByCategory';
import { Category, PostType } from '../typings';
import GetChannels from '../components/channel/GetChannels';
import HashtagBox from '../components/HashtagBox';
import HomeBoardPostList from '../components/HomeBoardPostList';

const Home: NextPage = ({ channels, categories, postList }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  // const cats = categories?.map((item: any) => {
  //   const obj = JSON.parse(item.name);
  //   return {
  //     value: item.id,
  //     label: locale === 'ko' ? obj.ko : obj.en,
  //   };
  // });
  // const [category, setCategory] = useState<any>([]);

  // useEffect(() => {
  //   setCategory(cats);
  // }, [locale]);

  return (
    <div className='pt-7 px-4 lg:px-0 text-black'>
      <div className='space-y-4'>
        <span className='font-bold text-base'>오늘 가장 많이 본 채널</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          {channels.map((channel: any, index: number) => {
            return <GetChannels channels={channel} key={index} />;
          })}
        </div>
      </div>

      <div className='mt-7 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <span className='font-bold'>일간베스트</span>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>
            <HomeBoardPostList postList={postList} />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <span className='font-bold'>짤방</span>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>
            <HomeBoardPostList postList={postList} />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center'>
            <span className='font-bold'>핫딜</span>
            <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </a>
          </div>
          <div className='flex border border-gray-200 rounded-md bg-white p-4'>
            <HomeBoardPostList postList={postList} />
          </div>
        </div>
      </div>

      {/* <div className='flex border border-gray-200 rounded-md bg-white p-4 mt-4'>
        <ul className='grid md:grid-cols-4 gap-4'>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
          <li className='flex md:flex-col gap-4 md:gap-0'>
            <div className='w-1/3 md:w-full'>
              <Image src='/blog.jpg' width={302} height={207} alt='' />
            </div>
            <div>
              <div className='font-semibold mt-2'>탑 10 베스트 텔레그램 베팅 채널</div>
              <div className='text-xs text-gray-400 mt-2'>어드민 2023년 02월 06일</div>
              <div className='mt-2 text-sm leading-5 hidden md:inline'>
                Telegram 베팅(카지노) 채널을 찾는 방법은 무엇입니까? Telegram은 통신 및 주변 정보 공유에 사용되는 매우 인기있는 메시징 응용
                프로그램입니다.
              </div>
            </div>
          </li>
        </ul>
      </div> */}
      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>최근 추가된 채널</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          {channels.map((channel: any, index: number) => {
            return <GetChannels channels={channel} key={index} />;
          })}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          <HashtagBox channels={channels} />
          <HashtagBox channels={channels} />
          <HashtagBox channels={channels} />
          <HashtagBox channels={channels} />
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>대부분의 구독자는 24시간 내에 채널을 늘렸습니다</span>
        <div className='grid md:grid-cols-4 gap-0 md:gap-4'>
          {channels.map((channel: any, index: number) => {
            return <GetChannels channels={channel} key={index} />;
          })}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
        <span className='font-bold text-base'>이런 채널은 어떨까요?</span>
        <div className='flex gap-2'>
          <button className='bg-primary px-5 py-2 rounded-full text-white'>생활</button>
          <button className='border border-primary px-5 py-2 rounded-full text-primary'>생활</button>
        </div>
        <div className='grid md:grid-cols-3 gap-0 md:gap-4'>
          {channels.map((channel: any, index: number) => {
            return <GetChannels channels={channel} key={index} />;
          })}
        </div>
      </div>

      <div className='space-y-4 mt-7'>
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
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const data = {
    query: null,
    withDesc: false,
    category: [],
    country: [],
    language: [],
    channel_type: null,
    channel_age: 0,
    erp: 0,
    subscribers_from: null,
    subscribers_to: null,
    paginate: { limit: 4, offset: 0 },
    sort: { field: 'created_at', order: 'desc' },
  };

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data);
  const channels = await response.data.channel;

  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`);
  const categories = await result.data;

  // Get Posts List
  const responsePost = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=null&category=null&postsperpage=6`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }
  );
  const postList = await responsePost.json();

  return {
    props: { channels, categories, postList },
  };
};

export default Home;
