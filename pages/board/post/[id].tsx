import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, HeartIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ChatBubbleOvalLeftEllipsisIcon from '@heroicons/react/24/outline/ChatBubbleOvalLeftEllipsisIcon';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { getCookie } from 'cookies-next';
import { InferGetServerSidePropsType, NextPage } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Message, Pagination, useToaster } from 'rsuite';
import { TypeAttributes } from 'rsuite/esm/@types/common';
import { PlacementType } from 'rsuite/esm/toaster/ToastContainer';

import BoardSidebar from '../../../components/board/BoardSidebar';
import ButtonLink from '../../../components/board/buttonLink';

import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';

import { formatDate, toDateTimeformat } from '../../../lib/utils';
import { BoardType, CommentType, PostType } from '../../../typings';

import 'react-quill/dist/quill.snow.css';
import BoardComment from '../../../components/board/comment';

const Post: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const allBoards: Array<BoardType> = props.allBoards;
  const memberInfo = props.memberInfo;
  const [postList, setPostList] = useState(props.postList);

  const post: PostType = props.post;
  const prevNext = props.prevNext;
  
  const [commentTotal, setCommenTotal] = useState<number>(props.comments.total);
  const [commentTopTotal, setCommentTopTotal] = useState<number>(props.comments.topTotal);
  const [commentList, setCommentList] = useState<Array<CommentType>>(props.comments.comments);

  const [selectedComment, setSelectedComment] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [reaction, setReaction] = useState<boolean>(false);
  const [reactionTotal, setReactionTotal] = useState<number>(props.reactionTotal);

  const [placement, setPlacement] = useState<PlacementType>('topEnd');

  const [commentPage, setCommentPage] = useState<number>(1);
  const [commentPerPage, setCommentPerPage] = useState<number>(10);
  const [postPage, setPostPage] = useState<number>(parseInt(props.page));
  const [postPerPage, setPostPerPage] = useState<number>(parseInt(props.perPage));

  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const toaster = useToaster();

  const { data: session } = useSession();

  const commentListRef = useRef<HTMLDivElement | null>(null);
  const commentWriteRef = useRef<HTMLDivElement | null>(null);

  const message = (type: TypeAttributes.Status, message: string) => (
    <Message showIcon type={type} closable>{message}</Message>
  );

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (post.reaction === null) {
      setReaction(false);
    } else {
      const reaction = JSON.parse(post.reaction);
      const idx = reaction.indexOf(session?.user.id);

      if (idx > -1) {
        setReaction(true);
      } else {
        setReaction(false);
      }
    }
  }, [session]);

  useEffect(() => {
    loadComments();
  }, [commentPage]);

  const toastShow = (type: TypeAttributes.Status, txt: string) => {
    toaster.push(message(type, txt), { placement, duration: 5000 });
  }

  // Load Comments
  const loadComments = async () => {
    setCommentLoading(true);
    const responseComment = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getcomments`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: router.query.id,
        query: null,
        paginate: {
          offset: (commentPage - 1) * commentPerPage,
          limit: commentPerPage,
        },
        sort: {
          field: 'created_at',
          value: 'ASC'
        }
      })
    });
    const data = await responseComment.json();

    setCommenTotal(data.total);
    setCommentTopTotal(data.topTotal);
    setCommentList(data.comments);
    setCommentLoading(false);
  }

  // Post URL copy to clipboard
  const handleUrlToClipboard = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(window.location.toString());
    } else {
      document.execCommand("copy", true, window.location.toString());
    }
    toastShow('info', 'Board Post URL copied to clipboard');
  }

  // Save Comment 
  const saveComment = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=insertcomment`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        comment: comment,
        parent: 0,
        user: Number(session?.user.id),
        post: router.query.id,
        board: post.board.id
      }),
    });
    const result = await response.json();

    if (response.status === 200) {
      if (result.code === 201 && result.message === 'Inserted') {
        toastShow('info', 'Your comment has been successfully saved.');
        setComment('');
        loadComments();
      }
    } else {
      toastShow('error', 'An error occurred while trying to save your comment.');
    }
  };

  // Go to Comment List
  const handleGotoComment = () => {
    commentListRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleReaction = async (action: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=postReaction`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user: Number(session?.user.id),
        post: router.query.id,
        action: action
      }),
    });
    const result = await response.json();

    if (result.code === 200) {
      if (result.message === 'add') {
        setReaction(true);
        setReactionTotal(reactionTotal + 1);
      } else {
        setReaction(false);
        setReactionTotal(reactionTotal - 1);
      }
    } else {
      toastShow('error', 'An error occurred while trying to save your reaction.');
    }
  }

  return (
    <>
      <div className='flex gap-[14px] pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar allBoards={allBoards} memberInfo={memberInfo} />
        {/* Main */}
        <div className='flex-1 flex flex-col'>
          <div className='flex items-center justify-between mb-4'>
            <div className='text-xl font-bold'>{post.board.title}</div>
            <div className='flex justify-end gap-[10px]'>
              <ButtonLink url={prevNext.prev !== null ? `/board/post/${prevNext.prev}` : '#'} text='이전글' icon={<ChevronUpIcon className='h-3' />} />
              <ButtonLink url={prevNext.next !== null ? `/board/post/${prevNext.next}` : '#'} text='다음글' icon={<ChevronDownIcon className='h-3' />} />
              <ButtonLink url={`/board/${post.board.name}`} text='목록' />
            </div>
          </div>
          <div className='border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
            <div className='border-b border-gray-200 mb-4 pb-2 flex items-center'>
              <div className='post-header flex flex-1 flex-col'>
                <div className='title text-xl font-bold mb-[26px]'>{post.title}</div>
                <div className='flex'>
                  <div className='avatar mr-[10px]'>
                    <Avatar circle className='bg-[#E7EAED]'>
                      {post.user.nickname.slice(0, 1)}
                    </Avatar>
                  </div>
                  <div className='username flex flex-col'>
                    <p className='m-0 p-0 text-[14px] leading-[16px] font-medium'>{post.user.nickname}</p>
                    <p className='m-0 pt-[5px] text-[12px] leading-[14px]'>{toDateTimeformat(post.created_at, '.')} 조회 {post.views}</p>
                  </div>
                  <div className='right ml-auto self-center flex items-center'>
                    <span className='mr-[7px]'><ChatBubbleOvalLeftEllipsisIcon className='w-[18px]' /></span>
                    <span className='text-[12px] pr-2 cursor-pointer hover:text-[#000]' onClick={handleGotoComment}>댓글 {commentTotal}</span>
                    <span>URL <span className='cursor-pointer hover:text-[#000]' onClick={handleUrlToClipboard}>복사</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{
              __html: post.content as string
            }} />
            <div className='flex items-center mt-14 mb-[30px]'>
              <Avatar circle className='bg-[#E7EAED] mr-[10px] leading-[0]'>
                {post.user.nickname.slice(0, 1)}
              </Avatar>
              <Link href={'#'} className='flex text-black hover:text-black hover:no-underline'><span className='mr-[8px]'>블랙베리님의 게시글 더보기</span> <ChevronRightIcon className='w-[10px]' /></Link>
            </div>
            <div className='comment' ref={commentListRef}>
              <div className='flex border-b border-gray-200 pb-[14px]'>
                <span className='mr-[7px] cursor-pointer' onClick={() => handleReaction(reaction ? 'remove' : 'add')}><HeartIcon className={`w-[18px] ${reaction ? 'text-red-500' : ''}`} /></span>
                <span className='text-[12px] pr-2'>좋아요 {reactionTotal}</span>
                <span className='mr-[7px]'><ChatBubbleOvalLeftEllipsisIcon className='w-[18px]' /></span>
                <span className='text-[12px] pr-2'>댓글 {commentTotal}</span>
              </div>
              {commentTotal === 0 ? <></> :
                <div className='comment-list mt-[20px]'>
                  <p className='font-bold text-[17px] mb-[20px]'>댓글</p>
                  <ul className='relative overflow-hidden'>
                    {commentList.map((comment: CommentType, idx: number) => (
                      <li key={idx} className='border-b border-[#e4e4e4] pb-4 mb-4'>
                        <BoardComment comment={comment} selectedComment={selectedComment} userID={Number(session?.user.id)} postID={post.id} boardID={post.board.id} reply={true} fncToast={toastShow} fncLoadComment={loadComments} fncSelectComment={setSelectedComment} />
                        {comment.child?.length === 0 ?
                          <></>
                          :
                          <ul className='ml-[50px]'>
                            {comment.child?.map((child: CommentType, idxx: number) => (
                              <li key={idxx} className='mt-4'>
                                <BoardComment comment={child} selectedComment={selectedComment} userID={Number(session?.user.id)} postID={post.id} boardID={post.board.id} reply={true} fncToast={toastShow} fncLoadComment={loadComments} fncSelectComment={setSelectedComment} />
                                {child.child?.length === 0 ?
                                  <></>
                                  :
                                  <ul className='ml-[50px]'>
                                    {child.child?.map((grandchild: CommentType, idxx: number) => (
                                      <li key={idxx} className='mt-4'>
                                        <BoardComment comment={grandchild} selectedComment={selectedComment} userID={Number(session?.user.id)} postID={post.id} boardID={post.board.id} reply={false} fncToast={toastShow} fncLoadComment={loadComments} fncSelectComment={setSelectedComment} />
                                      </li>
                                    ))}
                                  </ul>
                                }
                              </li>
                            ))}
                          </ul>
                        }
                      </li>
                    ))}
                    <li className={`${commentLoading ? 'flex' : 'hidden'} bg-white opacity-80 absolute left-0 top-0 right-0 bottom-0 justify-center items-center`}>
                      <SpinnerIcon pulse style={{ fontSize: '2em' }} />
                    </li>
                  </ul>
                </div>
              }
              <div className={`flex flex-col bg-[#F9F9F9] rounded-lg p-[20px] mt-[30px]`}>
                {commentTopTotal > 0 ?
                  <div className='paginate flex w-full border-b border-[#E4E4E4] justify-center pb-[20px]'>
                    <Pagination prev last next first total={commentTopTotal} limit={commentPerPage} activePage={commentPage} onChangePage={setCommentPage} disabled={commentLoading} />
                  </div>
                  :
                  <></>
                }
                <div className='comment-write text-center mt-[20px] mx-[140px]' ref={commentWriteRef}>
                  <textarea className='border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none' onChange={(e) => setComment(e.currentTarget.value)} value={comment} />
                  <Button appearance='primary' className='bg-primary text-white py-2 px-5 text-center hover:text-white' disabled={comment.trim().length > 0 ? false : true} onClick={saveComment}>
                    글쓰기
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-end gap-[10px] mt-[16px]'>
            <ButtonLink url={`/board/${post.board.name}`} text='목록' />
            <span onClick={handleScrollTop} className="flex gap-[10px] items-center h-[35px] px-[10px] bg-white border border-[#d9d9d9] rounded-[5px] text-black text-[13px] cursor-pointer hover:text-[#0a5dc2] hover:no-underline">
              <ChevronUpIcon className='h-3' />
              <span className="flex-1">TOP</span>
            </span>
          </div>
          <div className='post-list-wrapper'>
            <p className='font-bold text-[17px] mb-[20px]'>전체글</p>
            <div className='post-list border-t border-gray-400'>
              <div className='w-full'>
                <div className='border-b border-gray-200 flex font-bold'>
                  <div className='text-center p-2 min-w-[80px]'>{postList.board ? '말머리' : ''}</div>
                  <div className='text-center p-2 flex-grow'>제목</div>
                  <div className='text-left p-2 min-w-[128px]'>작성자</div>
                  <div className='text-center p-2 min-w-[96px]'>작성일</div>
                  <div className='text-center p-2 min-w-[48px]'>조회</div>
                </div>
                <div className='text-xs'>
                  {postList?.posts?.map((post: PostType, idx: number) => {
                    const current = post.id === parseInt(router.query.id as string) ? true : false;
                    return (
                      <div className={`border-b border-gray-200 flex ${current ? 'font-bold text-[#0a5dc2]' : ''}`} key={post.id}>
                        <div className='text-center p-2 min-w-[80px]'>
                          <Link href={`/board/${postList.board.name}/${post.category.id}`}>{post.category.category}</Link>
                        </div>
                        <div className='p-2 flex flex-1 items-center'>
                          {current ? <>{post.title}</> : <Link href={`/board/post/${post.id}`}>{post.title} </Link>}
                          {post.extra_01 == '1' ? <PhotoIcon className='h-3 ml-1' /> : <></>}
                        </div>
                        <div className='text-left p-2 min-w-[128px]'>{post.user?.nickname}</div>
                        <div className='text-center p-2 min-w-[96px]'>{formatDate(post.created_at)}</div>
                        <div className='text-center p-2 min-w-[48px]'>{post.views}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='post-paginate flex justify-center p-5'>
              <Pagination first next prev last total={postList?.total} limit={postPerPage} activePage={postPage} onChangePage={setPostPage} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const req = context.req;
  const page = getCookie('page', { req }) as string;
  const perPage = getCookie('perPage', { req }) as string;

  // Get Post
  const resPost = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpost`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: context.query.id,
    }),
  });
  const data = await resPost.json();
  const post = data.post;
  const prevNext = data.prevNext[0];

  if (!post) {
    return {
      redirect: {
        destination: '/board',
        permanent: false
      }
    };
  }

  let reactionTotal: number = 0;
  if (post.reaction !== null) {
    reactionTotal = JSON.parse(post.reaction).length;
  }

  // Get Member Information
  let memberInfo = '';
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    memberInfo = await responseMember.json();
  } else {
    return {
      redirect: {
        destination: '/member/signin', // Redirect to the login page if not logged in
        permanent: false,
      },
    };
  }
  // Get Boards List
  const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getallboardslist`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  const allBoards = await response.json();

  // Get Comments
  const responseComment = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getcomments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: context.query.id,
      query: null,
      paginate: {
        offset: 0,
        limit: 10,
      },
      sort: {
        field: 'created_at',
        value: 'ASC'
      }
    })
  });
  const comments = await responseComment.json();

  // Get Posts List
  const board = post.board.name;
  const category = null;
  const responsePost = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}&postsperpage=${perPage}&offset=${page}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    }
  );
  const postList = await responsePost.json();

  // Return
  return {
    props: { allBoards, post, memberInfo, comments, postList, reactionTotal, page, perPage, prevNext },
  };
};

export default Post;
