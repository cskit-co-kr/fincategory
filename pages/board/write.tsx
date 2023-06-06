import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import BoardSidebar from '../../components/board/BoardSidebar';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { BoardType } from '../../typings';
import * as cheerio from 'cheerio';
import { Loader } from 'rsuite';

import 'react-quill/dist/quill.snow.css';

const Quill = dynamic(import('react-quill'), {
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

const WritePost = ({ allBoards, groupsList }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedBoard, setSelectedBoard] = useState();
  const [selectedCategory, setSelectedCategory] = useState();
  const [content, setContent] = useState('');
  const handleContentChange = (newContent: any) => {
    const $ = cheerio.load(newContent);
    const iframes = $('iframe');
    iframes.each((index, iframe) => {
      const src = $(iframe).attr('src');
      if (src?.includes('<iframe')) {
        $(iframe).remove();
        alert("Don't add embed code. Only add video URL");
      }
    });
    let updatedContent = $.html();
    updatedContent = updatedContent.replace(/<\/?(html|head|body)[^>]*>/gi, '');
    setContent(updatedContent);
  };

  const saveDraft = async () => {
    if (selectedBoard === '0') return alert('Please select the board');
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=savepost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        board: Number(selectedBoard),
        category: Number(selectedCategory),
        flag: null,
        status: 0,
        user: Number(session?.user.id),
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (result.code === 201 && result.message === 'Inserted') {
      router.push('/board');
    }
  };

  const savePost = async () => {
    if (selectedBoard === '0') return alert('Please select the board');
    setLoading(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=savepost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: title,
        content: content,
        board: Number(selectedBoard),
        category: Number(selectedCategory),
        flag: null,
        status: 1,
        user: Number(session?.user.id),
      }),
    });
    const result = await response.json();
    setLoading(false);
    if (result.code === 201 && result.message === 'Inserted') {
      router.push('/board');
    }
  };

  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar />
        {/* Main */}
        <div className='w-full xl:w-[974px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm pb-20'>
          <div className='border-b border-gray-400 mb-4 pb-2 flex items-center'>
            <div className='text-xl font-bold'>글쓰기</div>
            <div className='ml-auto text-xs flex gap-2 items-center'>
              {loading && <Loader />}
              <button
                className='border border-primary text-primary py-2 px-5 text-center hover:text-primary hover:underline'
                onClick={saveDraft}
              >
                임시등록
              </button>
              <button className='bg-primary text-white py-2 px-5 text-center hover:text-white hover:underline' onClick={savePost}>
                글쓰기
              </button>
            </div>
          </div>
          <div className='mb-4'>
            <div>
              <div className='flex gap-2'>
                <select
                  className='border border-gray-200 p-2 w-full md:w-2/3'
                  defaultValue={0}
                  onChange={(e: any) => setSelectedBoard(e.target.value)}
                >
                  <option value='0'>게시판을 선택해 주세요.</option>
                  {groupsList?.groups.map((group: any) => (
                    <optgroup label={group.name} key={group.id}>
                      {group.boards.map((board: any) => (
                        <option value={board.id} className='block px-2 py-1 text-sm' key={board.id}>
                          {board.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <select className='border border-gray-200 p-2 w-full md:w-1/3' onChange={(e: any) => setSelectedCategory(e.target.value)}>
                  <option value='0'>말머리 선택</option>
                  {allBoards?.boards
                    .find((board: BoardType) => board.id === Number(selectedBoard))
                    ?.categories?.map((category: any) => (
                      <option value={category.id} className='block px-2 py-1 text-sm' key={category.id}>
                        {category.category}
                      </option>
                    ))}
                </select>
              </div>
              <input
                type='text'
                placeholder='제목을 입력해 주세요.'
                className='border border-gray-200 p-2 w-full mt-2'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <Quill
            modules={modules}
            formats={formats}
            theme='snow'
            onChange={handleContentChange}
            style={{ height: '490px' }}
            value={content}
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const session = await getSession(context);
  if (!session?.user) {
    return {
      redirect: {
        destination: '/member/signin', // Redirect to the login page if not logged in
        permanent: false,
      },
    };
  }
  const responseGroup = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  const groupsList = await responseGroup.json();
  // Get Boards List
  const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getallboardslist`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  });
  const allBoards = await response.json();

  // Return
  return {
    props: { allBoards, groupsList },
  };
};

export default WritePost;
