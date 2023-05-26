import { ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, HeartIcon } from '@heroicons/react/24/outline';
import ChatBubbleOvalLeftEllipsisIcon from '@heroicons/react/24/outline/ChatBubbleOvalLeftEllipsisIcon';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
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

import { toDateTimeformat } from '../../../lib/utils';
import { BoardType, CommentType, PostType } from '../../../typings';

import 'react-quill/dist/quill.snow.css';
import BoardComment from '../../../components/board/comment';

const Post: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const allBoards: Array<BoardType> = props.allBoards;
  const memberInfo = props.memberInfo;
  const [post, setPost] = useState<PostType>(props.post);
  const [commentTotal, setCommenTotal] = useState<number>(props.comments.total);
  const [commentTopTotal, setCommentTopTotal] = useState<number>(props.comments.topTotal);
  const [commentList, setCommentList] = useState<Array<CommentType>>(props.comments.comments);

  const [selectedComment, setSelectedComment] = useState<CommentType | null>(null);
  const [comment, setComment] = useState<string>('');
  const [reaction, setReaction] = useState<boolean>(false);
  const [reactionTotal, setReactionTotal] = useState<number>(props.reactionTotal);

  const [placement, setPlacement] = useState<PlacementType>('topEnd');

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(2);

  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const toaster = useToaster();

  const { data: session } = useSession();

  const commentListRef = useRef<HTMLDivElement | null>(null);
  const commentWriteRef = useRef<HTMLDivElement | null>(null);

  const message = (type: TypeAttributes.Status, message: string) => (
    <Message showIcon type={type} closable>{message}</Message>
  )

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
  }, [page]);

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
          offset: (page - 1) * perPage,
          limit: perPage,
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
        parent: selectedComment === null ? 0 : selectedComment.id,
        user: Number(session?.user.id),
        post: router.query.id,
        board: post.board.id
      }),
    });
    const result = await response.json();

    if (response.status === 200) {
      if (result.code === 201 && result.message === 'Inserted') {
        toastShow('info', 'Your comment has been successfully saved.');
        setSelectedComment(null);
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

  // Click Comment Reply 
  const handleSelectComment = (comment: CommentType) => {
    setSelectedComment(comment);
    commentWriteRef.current?.scrollIntoView({ behavior: 'smooth' });
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
          <div className='flex justify-end gap-[10px] mb-4'>
            <ButtonLink url='dff' text='이전글' icon={<ChevronUpIcon className='h-3' />} />
            <ButtonLink url='dff' text='다음글' icon={<ChevronDownIcon className='h-3' />} />
            <ButtonLink url={`/board/${post.board.name}`} text='목록' />
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
                        <BoardComment comment={comment} userID={Number(session?.user.id)} reply={true} fncComment={handleSelectComment} fncToast={toastShow} />
                        {comment.child?.length === 0 ?
                          <></>
                          :
                          <ul className='ml-[50px]'>
                            {comment.child?.map((child: CommentType, idxx: number) => (
                              <li key={idxx} className='mt-4'>
                                <BoardComment comment={child} userID={Number(session?.user.id)} reply={true} fncComment={handleSelectComment} fncToast={toastShow} />
                                {child.child?.length === 0 ?
                                  <></>
                                  :
                                  <ul className='ml-[50px]'>
                                    {child.child?.map((grandchild: CommentType, idxx: number) => (
                                      <li key={idxx} className='mt-4'>
                                        <BoardComment comment={grandchild} userID={Number(session?.user.id)} reply={false} fncComment={handleSelectComment} fncToast={toastShow} />
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
                    <Pagination prev last next first total={commentTopTotal} limit={perPage} activePage={page} onChangePage={setPage} disabled={commentLoading} />
                  </div>
                  :
                  <></>
                }
                <div className='comment-write text-center mt-[20px] mx-[140px]' ref={commentWriteRef}>
                  {selectedComment !== null ? <div className='text-left text-[12px] pl-1 mb-1 italic'>Reply of: {selectedComment.comment} : <span className='cursor-pointer text-red-500' onClick={() => setSelectedComment(null)}>Cancel</span></div> : <></>}
                  <textarea className='border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none' onChange={(e) => setComment(e.currentTarget.value)} value={comment} />
                  <Button appearance='primary' className='bg-primary text-white py-2 px-5 text-center hover:text-white' disabled={comment.trim().length > 0 ? false : true} onClick={saveComment}>
                    글쓰기
                  </Button>
                </div>
              </div>
            </div>
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

  // Get Post
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpost`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: context.query.id,
    }),
  });
  const post = await response2.json();

  let reactionTotal: number = 0;
  if (post.reaction !== null) {
    reactionTotal = JSON.parse(post.reaction).length;
  }

  // Get Comments
  const responseComment = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getcomments`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      id: context.query.id,
      query: null,
      paginate: {
        offset: 0,
        limit: 2,
      },
      sort: {
        field: 'created_at',
        value: 'ASC'
      }
    })
  });
  const comments = await responseComment.json();

  // Return
  return {
    props: { allBoards, post, memberInfo, comments, reactionTotal },
  };
};

export default Post;
