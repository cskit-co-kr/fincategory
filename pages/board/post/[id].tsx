import React from 'react';
import BoardSidebar from '../../../components/board/BoardSidebar';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { enUS } from '../../../lang/en-US';
import { koKR } from '../../../lang/ko-KR';

const Post = ({ allBoards, memberInfo, post }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();
  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar allBoards={allBoards} memberInfo={memberInfo} />
        {/* Main */}
        <div className='w-full xl:w-[974px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
          <div className='border-b border-gray-200 mb-4 pb-2 flex items-center'>
            <div className='text-xl font-bold'>{post.title}</div>
            <div>{session?.user.username}</div>
          </div>
          <div>{post.content}</div>
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

  // Return
  return {
    props: { allBoards, post, memberInfo },
  };
};

export default Post;
