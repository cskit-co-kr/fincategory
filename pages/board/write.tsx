import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import BoardSidebar from '../../components/board/BoardSidebar';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { BoardType } from '../../typings';

import 'react-quill/dist/quill.snow.css';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
  'color',
  'background',
];

const WritePost = ({ allBoards, memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const [title, setTitle] = useState('');
  const [selectedBoard, setSelectedBoard] = useState();
  const [content, setContent] = useState('');
  const handleContentChange = (newContent: any) => {
    setContent(newContent);
  };

  const saveDraft = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=savepost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        board: selectedBoard,
        category: 1,
        flag: null,
        status: 0,
        user: session?.user.id,
      }),
    });
    const result = await response.json();
    if (result.code === 201 && result.message === 'Inserted') {
      router.push('/board');
    }
  };

  const savePost = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=savepost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        board: Number(selectedBoard),
        category: 1,
        flag: null,
        status: 1,
        user: Number(session?.user.id),
      }),
    });
    const result = await response.json();
    if (result.code === 201 && result.message === 'Inserted') {
      router.push('/board');
    }
  };

  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar allBoards={allBoards} memberInfo={memberInfo} />
        {/* Main */}
        <div className='w-full xl:w-[974px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm'>
          <div className='border-b border-gray-400 mb-4 pb-2 flex items-center'>
            <div className='text-xl font-bold'>글쓰기</div>
            <div className='ml-auto text-xs flex gap-2'>
              <Link className='border border-primary text-primary py-2 px-5 text-center hover:text-primary' href='' onClick={saveDraft}>
                임시등록
              </Link>
              <Link className='bg-primary text-white py-2 px-5 text-center hover:text-white' href='' onClick={savePost}>
                글쓰기
              </Link>
            </div>
          </div>
          <div className='mb-4'>
            <div>
              <select className='border border-gray-200 p-2 w-full' onChange={(e: any) => setSelectedBoard(e.target.value)}>
                <option value='0'>게시판을 선택해 주세요.</option>
                {allBoards?.boards.map((board: BoardType) => (
                  <option value={board.id} className='block px-2 py-1 text-sm' key={board.id}>
                    {board.title}
                  </option>
                ))}
              </select>
              <input
                type='text'
                placeholder='제목을 입력해 주세요.'
                className='border border-gray-200 p-2 w-full mt-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <QuillNoSSRWrapper modules={modules} formats={formats} theme='snow' onChange={handleContentChange} style={{ height: '490px' }} />
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

  // Return
  return {
    props: { allBoards, memberInfo },
  };
};

export default WritePost;
