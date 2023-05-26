import axios from 'axios';
import { useRouter } from 'next/router';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, ListBulletIcon, Squares2X2Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { BoardType, PostType } from '../../typings';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { signIn, signOut, useSession, getSession } from 'next-auth/react';
import BoardSidebar from '../../components/board/BoardSidebar';
import { formatDate } from '../../lib/utils';

const Board = ({ allBoards, postList, memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const [viewPort, setViewPort] = useState('list');

  const [perpagePopup, setPerpagePopup] = useState(false);
  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar allBoards={allBoards} memberInfo={memberInfo} />
        {/* Main */}
        <div className='w-full xl:w-[974px] border border-gray-200 bg-white rounded-md p-[30px]'>
          <div className='text-xl font-bold'>{postList.board ? postList.board.title : t['view-all-articles']}</div>
          <div className='flex justify-between items-center text-xs mt-4 pb-2.5'>
            <div>{postList.total} 개의 글</div>
            <div className='flex items-center gap-3 relative'>
              <button onClick={() => setViewPort('list')}>
                <ListBulletIcon className={`h-5 ${viewPort === 'list' && 'text-primary'}`} />
              </button>
              <button onClick={() => setViewPort('grid')}>
                <Squares2X2Icon className={`h-5 ${viewPort === 'grid' && 'text-primary'}`} />
              </button>
              {viewPort === 'list' && (
                <>
                  <Link
                    href=''
                    className='border border-gray-200 p-2 flex items-center gap-2'
                    onClick={() => setPerpagePopup((prev) => !prev)}
                  >
                    20개씩 {perpagePopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
                  </Link>
                  {perpagePopup && (
                    <ul className='absolute top-[33px] right-0 border border-gray-200 bg-white'>
                      <li>
                        <Link href='/' className='perpage'>
                          20개씩
                        </Link>
                      </li>
                      <li>
                        <Link href='/' className='perpage'>
                          30개씩
                        </Link>
                      </li>
                      <li>
                        <Link href='/' className='perpage'>
                          40개씩
                        </Link>
                      </li>
                      <li>
                        <Link href='/' className='perpage'>
                          50개씩
                        </Link>
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
                  <div className='text-center p-2 min-w-[80px]'>{postList.board ? '말머리' : ''}</div>
                  <div className='text-center p-2 flex-grow'>제목</div>
                  <div className='text-left p-2 min-w-[128px]'>작성자</div>
                  <div className='text-center p-2 min-w-[96px]'>작성일</div>
                  <div className='text-center p-2 min-w-[48px]'>조회</div>
                </div>
                <div className='text-xs'>
                  {postList?.posts?.map((post: PostType) => (
                    <div className='border-b border-gray-200 flex' key={post.id}>
                      <div className='text-center p-2 min-w-[80px]'>
                        {router.query.name && router.query.name?.length > 0 ? (
                          <Link href={`/board/${postList.board.name}/${post.category.id}`}>{post.category.category}</Link>
                        ) : (
                          <Link href={`/board/${post.board.name}`}>{post.board.title}</Link>
                        )}
                      </div>
                      <div className='p-2 flex-grow'>
                        <Link href={`/board/post/${post.id}`}>{post.title}</Link>
                      </div>
                      <div className='text-left p-2 min-w-[128px]'>{post.user?.nickname}</div>
                      <div className='text-center p-2 min-w-[96px]'>{formatDate(post.created_at)}</div>
                      <div className='text-center p-2 min-w-[48px]'>{post.views}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {viewPort === 'grid' && (
              <div className='w-full text-xs mt-4 grid grid-cols-4'>
                {postList?.posts?.map((post: PostType) => (
                  <div className='' key={post.id}>
                    <div className='font-semibold'>{post.title}</div>
                    <div className=''>{post.board ? post.board.title : post.id}</div>
                    <div className=''>{post.user?.nickname}</div>
                    <div className=''>
                      {formatDate(post.created_at)} 조회 {post.views}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

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
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}`,
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
