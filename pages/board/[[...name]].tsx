import { ChevronDownIcon, ChevronUpIcon, ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { setCookie } from 'cookies-next';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader, Pagination } from 'rsuite';
import BoardSidebar from '../../components/board/BoardSidebar';
import ListPostRow from '../../components/board/ListPostRow';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { PostType } from '../../typings';

const useFocus = (): [React.RefObject<HTMLInputElement>, () => void] => {
  const htmlElRef = useRef<HTMLInputElement | null>(null);

  const setFocus = () => {
    htmlElRef.current && htmlElRef.current.focus();
  };

  return [htmlElRef, setFocus];
};

const Board = ({ allBoards, postList, memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [postsList, setPostsList] = useState(postList);

  const [activePage, setActivePage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(20);

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [viewPort, setViewPort] = useState('list');

  const [perpagePopup, setPerpagePopup] = useState(false);
  const [searchDatePopup, setSearchDatePopup] = useState(false);
  const [searchTermPopup, setSearchTermPopup] = useState(false);
  const [searchDateText, setSearchDateText] = useState(t['whole-period']);
  const [searchDate, setSearchDate] = useState('all');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchEndDate, setSearchEndDate] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [inputRef, setInputFocus] = useFocus();
  const [searchTerm, setSearchTerm] = useState('title');
  const [searchTermText, setSearchTermText] = useState(t['st-title']);

  useEffect(() => {
    setCookie('perPage', postsPerPage);
    setCookie('page', activePage);
  }, []);

  const setSearchDateHandler = (label: string, value: string) => {
    switch (value) {
      case 'all':
        setSearchStartDate('');
        setSearchEndDate('');
        break;
      case '1day':
        setSearchStartDate(getDate('1day') as string);
        setSearchEndDate(getToday());
        break;
      case '1week':
        setSearchStartDate(getDate('1week') as string);
        setSearchEndDate(getToday());
        break;
      case '1month':
        setSearchStartDate(getDate('1month') as string);
        setSearchEndDate(getToday());
        break;
      case '6months':
        setSearchStartDate(getDate('6months') as string);
        setSearchEndDate(getToday());
        break;
      case '1year':
        setSearchStartDate(getDate('1year') as string);
        setSearchEndDate(getToday());
        break;
      default:
        null;
    }
    setSearchDatePopup(false);
    setSearchDateText(label);
  };

  const setSearchTermHandler = (label: string, value: string) => {
    setSearchTerm(value);
    setSearchTermPopup(false);
    setSearchTermText(label);
  };

  const resetSearch = () => {
    setSearchStartDate('');
    setSearchEndDate('');
    setSearchInput('');
    setSearchTermHandler(t['st-title'], 'title');
  };

  const getPostsList = async () => {
    // Get Posts List
    const boardQuery = router.query.name;
    const board = boardQuery === undefined ? 'null' : boardQuery[0];
    const category = boardQuery !== undefined && boardQuery.length > 1 ? boardQuery[1] : 'null';
    const responsePost = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}&postsperpage=${postsPerPage}&offset=${activePage}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          search: {
            start: searchStartDate === '' ? null : searchStartDate,
            end: searchEndDate === '' ? null : searchEndDate,
            field: searchTerm,
            value: searchInput === '' ? null : searchInput,
          },
          hasImage: viewPort,
        }),
      }
    );
    const postList = await responsePost.json();
    setPostsList(postList);
  };

  useEffect(() => {
    getPostsList();
    setPerpagePopup(false);
    setCookie('perPage', postsPerPage);
    setCookie('page', activePage);
  }, [postsPerPage, activePage, viewPort]);

  useEffect(() => {
    resetSearch();
    setLoading(true);
    getPostsList();
    setLoading(false);
  }, [router.query.name]);

  useEffect(() => {
    if (session?.user && router.query.member === 'posts') {
      setSearchTermHandler(t['st-author'], 'author');
      setSearchInput(session?.user.nickname);
      getPostsList();
    } else if (session?.user && router.query.member === 'comments') {
      setSearchTermHandler(t['st-commenter'], 'commenter');
      setSearchInput(session?.user.nickname);
      getPostsList();
    }
  }, [router.query.member, session]);

  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar />
        {/* Main */}
        <div className='w-full xl:w-[974px] border border-gray-200 bg-white rounded-md p-[30px]'>
          <div className='text-xl font-bold'>{postsList.board ? postsList.board.title : t['view-all-articles']}</div>
          <div className='flex justify-between items-center text-xs mt-4 pb-2.5'>
            <div>{postsList.total} 개의 글</div>
            <div className='flex items-center gap-3 relative'>
              <button onClick={() => setViewPort('list')}>
                <ListBulletIcon className={`h-5 ${viewPort === 'list' && 'text-primary'}`} />
              </button>
              <button onClick={() => setViewPort('grid')}>
                <Squares2X2Icon className={`h-5 ${viewPort === 'grid' && 'text-primary'}`} />
              </button>
              {viewPort === 'list' && (
                <>
                  <button
                    className='border border-gray-200 p-2 flex items-center gap-2 hover:underline'
                    onClick={() => setPerpagePopup((prev) => !prev)}
                  >
                    {postsPerPage}개씩 {perpagePopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
                  </button>
                  {perpagePopup && (
                    <ul className='absolute top-[33px] right-0 border border-gray-200 bg-white'>
                      <li>
                        <button className='perpage' onClick={() => setPostsPerPage(10)}>
                          10개씩
                        </button>
                      </li>
                      <li>
                        <button className='perpage' onClick={() => setPostsPerPage(20)}>
                          20개씩
                        </button>
                      </li>
                      <li>
                        <button className='perpage' onClick={() => setPostsPerPage(30)}>
                          30개씩
                        </button>
                      </li>
                      <li>
                        <button className='perpage' onClick={() => setPostsPerPage(40)}>
                          40개씩
                        </button>
                      </li>
                      <li>
                        <button className='perpage' onClick={() => setPostsPerPage(50)}>
                          50개씩
                        </button>
                      </li>
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='border-t border-gray-400'>
            {viewPort === 'list' && (
              <div className='w-full'>
                <div className='border-b border-gray-200 flex font-bold'>
                  <div className='text-center p-2 min-w-[80px]'>{postsList.board ? '말머리' : ''}</div>
                  <div className='text-center p-2 flex-grow'>제목</div>
                  <div className='text-left p-2 min-w-[128px]'>작성자</div>
                  <div className='text-center p-2 min-w-[96px]'>작성일</div>
                  <div className='text-center p-2 min-w-[48px]'>조회</div>
                </div>
                <div className='text-xs'>
                  {loading && (
                    <div className='text-center w-full p-4'>
                      <Loader />
                    </div>
                  )}
                  {postsList?.posts?.map((post: PostType, idx: number) => (
                    <ListPostRow post={post} boardName={postsList?.board?.name} key={idx} />
                  ))}
                </div>
              </div>
            )}
            {viewPort === 'grid' && (
              <div className='w-full text-sm mt-4 grid md:grid-cols-4 gap-4'>
                {postsList?.posts?.map(
                  (post: PostType) =>
                    post.extra_01 === '1' && (
                      <div className='' key={post.id}>
                        <div className=''>
                          <Image src={post.extra_02} width='200' height='200' alt='Image' className='object-cover w-full aspect-square' />
                        </div>
                        <div className='font-semibold line-clamp-2'>
                          <Link href={`/board/post/${post.id}`}>{post.title}</Link>
                        </div>
                        <div className='mt-1'>{post?.board?.title}</div>
                        <div className='text-xs text-gray-400'>
                          {formatDate(post.created_at)} <span className='dot'>조회 {post.views}</span>
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </div>
          <div className='flex justify-end mt-2'>
            <Link className='bg-primary text-white py-2 px-5 text-sm text-center hover:text-white' href='/board/write'>
              {t['write']}
            </Link>
          </div>
          <div className='bg-[#F9F9F9] rounded-lg mt-2.5 '>
            <div className='p-5 flex justify-center'>
              <Pagination total={postsList?.total} limit={postsPerPage} activePage={activePage} onChangePage={setActivePage} />
            </div>
            <div className='border-t border-gray-300 p-5 flex justify-center gap-2 text-xs'>
              <div className='relative'>
                <button
                  className='border border-gray-200 p-2 flex items-center gap-2 hover:underline bg-white w-48 justify-between'
                  onClick={() => {
                    setSearchDatePopup((prev) => !prev);
                    setSearchTermPopup(false);
                  }}
                >
                  {searchDateText} {searchDatePopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
                </button>
                {searchDatePopup && (
                  <ul className='absolute top-[33px] left-0 border border-gray-200 bg-white'>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['whole-period'], 'all')}>
                        {t['whole-period']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['1-day'], '1day')}>
                        {t['1-day']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['1-week'], '1week')}>
                        {t['1-week']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['1-month'], '1month')}>
                        {t['1-month']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['6-months'], '6months')}>
                        {t['6-months']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchDateHandler(t['1-year'], '1year')}>
                        {t['1-year']}
                      </button>
                    </li>
                    <li className='p-2 border-t border-gray-200'>{t['enter-period']}</li>
                    <li className='flex gap-2 px-2 pb-2'>
                      <input
                        type='text'
                        className='border border-gray-200 p-2 w-24'
                        placeholder={getToday()}
                        value={searchStartDate}
                        onChange={(e) => setSearchStartDate(e.target.value)}
                      />
                      <input
                        type='text'
                        className='border border-gray-200 p-2 w-24'
                        placeholder={getToday()}
                        value={searchEndDate}
                        onChange={(e) => setSearchEndDate(e.target.value)}
                      />
                      <button
                        className='bg-primary text-white py-2 px-5 text-sm text-center hover:underline'
                        onClick={() => {
                          setSearchDate(searchStartDate + '&' + searchEndDate);
                          setSearchDateText(searchStartDate + ' - ' + searchEndDate);
                          setSearchDatePopup(false);
                          setInputFocus();
                        }}
                      >
                        Ok
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <div className='relative'>
                <button
                  className='border border-gray-200 p-2 flex items-center gap-2 hover:underline bg-white w-32 justify-between'
                  onClick={() => {
                    setSearchTermPopup((prev) => !prev);
                    setSearchDatePopup(false);
                  }}
                >
                  {searchTermText} {searchTermPopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
                </button>
                {searchTermPopup && (
                  <ul className='absolute top-[33px] left-0 border border-gray-200 bg-white'>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchTermHandler(t['st-title'], 'title')}>
                        {t['st-title']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchTermHandler(t['st-author'], 'author')}>
                        {t['st-author']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchTermHandler(t['st-comment'], 'comment')}>
                        {t['st-comment']}
                      </button>
                    </li>
                    <li>
                      <button className='perpage w-full text-left' onClick={() => setSearchTermHandler(t['st-commenter'], 'commenter')}>
                        {t['st-commenter']}
                      </button>
                    </li>
                  </ul>
                )}
              </div>
              <input
                type='text'
                placeholder={t['enter-search-term']}
                className='border border-gray-200 p-2'
                value={searchInput}
                ref={inputRef}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                className='bg-primary text-white py-2 px-5 text-xs text-center hover:underline'
                onClick={() => {
                  setSearchTermPopup(false);
                  setSearchDatePopup(false);
                  getPostsList();
                }}
              >
                {t['search']}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function formatDate(dateString: string) {
  const date: any = new Date(dateString);
  const currentDate: any = new Date();
  const timeDifference: any = currentDate - date;
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  const isWithin24Hours = timeDifference < oneDay;
  const formattedDateTime = isWithin24Hours
    ? date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0')
    : dateString.substring(0, 10).replaceAll('-', '.');
  return formattedDateTime;
}
function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
}
function getDate(interval: any) {
  const today = new Date();
  let fromDate = new Date();

  switch (interval) {
    case '1day':
      fromDate.setDate(today.getDate() - 1);
      break;
    case '1week':
      fromDate.setDate(today.getDate() - 7);
      break;
    case '1month':
      fromDate.setMonth(today.getMonth() - 1);
      break;
    case '6months':
      fromDate.setMonth(today.getMonth() - 6);
      break;
    case '1year':
      fromDate.setFullYear(today.getFullYear() - 1);
      break;
    default:
      // Default case if interval is not recognized
      return null;
  }
  const year = fromDate.getFullYear();
  const month = String(fromDate.getMonth() + 1).padStart(2, '0');
  const day = String(fromDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getServerSideProps = async (context: any) => {
  // Get Member Information
  let memberInfo = '';
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    memberInfo = await responseMember.json();
  }
  // Get Boards List
  const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getallboardslist`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  const allBoards = await response.json();
  // Get Posts List
  const boardQuery = context.query.name;
  const board = boardQuery === undefined ? 'null' : boardQuery[0];
  const category = boardQuery !== undefined && boardQuery.length > 1 ? boardQuery[1] : 'null';
  const responsePost = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}&postsperpage=20`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }
  );
  const postList = await responsePost.json();
  // Return
  return {
    props: { allBoards, postList, memberInfo },
  };
};

export default Board;
