import { getSession, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import BoardSidebar from '../../components/board/BoardSidebar';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { BoardType, PostType } from '../../typings';
import * as cheerio from 'cheerio';
import { Loader } from 'rsuite';
import { ChevronDownIcon, ChevronUpIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

import 'react-quill/dist/quill.snow.css';
import { formatDate } from '../../lib/utils';

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

const WritePost = ({ allBoards, groupsList, post }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [draftPopup, setDraftPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedBoard, setSelectedBoard] = useState<any>();
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
    if (title === '' || content === '') return alert('제목이나 내용을 입력해주세요.');
    setLoading(true);
    if (router.query.mode === 'edit') {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=editpost`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: title,
          content: content,
          status: 0,
          board: Number(selectedBoard),
          category: Number(selectedCategory),
          id: router.query.id,
        }),
      });
      const result = await response.json();
      setLoading(false);
      if (result.code === 201 && result.message === 'Updated') {
        router.push('/board');
      }
    } else {
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
    }
  };

  const savePost = async () => {
    if (selectedBoard === 0 || selectedBoard === '0' || title === '' || content === '') return alert('Please fill');
    setLoading(true);
    if (router.query.mode === 'edit') {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=editpost`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: title,
          content: content,
          status: 1,
          board: Number(selectedBoard),
          category: Number(selectedCategory),
          id: router.query.id,
        }),
      });
      const result = await response.json();
      setLoading(false);
      if (result.code === 201 && result.message === 'Updated') {
        router.push('/board');
      }
    } else {
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
    }
  };

  // Get Draft Post
  const [postDraft, setPostDraft] = useState<any>([]);
  const getDraft = async () => {
    const resPostDraft = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getdraftpostlist`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    const data = await resPostDraft.json();
    setPostDraft(data);
  };

  useEffect(() => {
    if (router.query.board) {
      allBoards.boards.find((board: BoardType) => {
        if (board.name === router.query.board) {
          setSelectedBoard(board.id);
        }
      });
    }
    getDraft();
  }, []);

  useEffect(() => {
    if (router.query.mode === 'edit') {
      setContent(post.content);
      setSelectedBoard(post.board.id);
      setTitle(post.title);
    } else {
      setContent('');
      setSelectedBoard(0);
      setTitle('');
    }
  }, [router]);

  const deletePost = async (id: any) => {
    if (!session?.user) return alert('error');
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=deletepost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        post: [id],
      }),
    });
    const result = await response.json();
    if (result.success === true) {
      getDraft();
    }
  };

  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        {/* Sidebar */}
        <BoardSidebar />
        {/* Main */}
        <div className='w-full xl:w-[974px] mx-auto border border-gray-200 bg-white rounded-md p-4 md:p-[30px] shadow-sm pb-20'>
          <div className='border-b border-gray-400 mb-4 pb-2 flex items-center'>
            <div className='text-xl font-bold'>글쓰기</div>
            <div className='ml-auto text-xs flex items-center'>
              {loading && <Loader />}
              <button
                className='border border-gray-200 text-primary rounded-l-md py-2 px-5 text-center hover:text-primary hover:underline'
                onClick={saveDraft}
              >
                임시등록
              </button>
              {postDraft?.posts?.length > 0 && (
                <div className='relative'>
                  <button
                    className='border border-l-0 border-gray-200 rounded-r-md p-2 pl-3 font-semibold flex items-center gap-2 hover:underline'
                    onClick={() => setDraftPopup((prev) => !prev)}
                  >
                    {postDraft?.total} {draftPopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
                  </button>
                  {draftPopup && (
                    <div className='absolute top-[33px] right-0 border border-gray-200 bg-white p-4 flex max-w-xs z-10 rounded-md'>
                      <ul className='min-w-0'>
                        {postDraft?.posts?.map((draft: PostType) => (
                          <li key={draft.id} className='flex items-center gap-2 justify-between'>
                            <Link
                              href=''
                              onClick={() => router.push(`/board/write?mode=edit&id=${draft.id}`).then(() => setDraftPopup(false))}
                              className='p-2 truncate'
                            >
                              {draft.title}
                            </Link>
                            <div className='flex items-center gap-1'>
                              {formatDate(draft.created_at)}
                              <button onClick={() => deletePost(draft.id)}>
                                <TrashIcon className='h-4' />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <button
                className='bg-primary text-white py-2 px-5 ml-2 rounded-md text-center hover:text-white hover:underline'
                onClick={savePost}
              >
                등록
              </button>
            </div>
          </div>
          <div className='mb-4'>
            <div>
              <div className='flex gap-2'>
                <select
                  className='border border-gray-200 p-2 w-full md:w-2/3'
                  onChange={(e: any) => setSelectedBoard(e.target.value)}
                  value={selectedBoard}
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
  // Get Post
  let post = [];
  if (session?.user && context.query.mode === 'edit' && context.query.id) {
    const resPost = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpost`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: context.query.id,
      }),
    });
    const data = await resPost.json();
    post = data.post;
    if (!post) {
      return {
        redirect: {
          destination: '/board',
          permanent: false,
        },
      };
    }
    if (session?.user.type === 2) {
      console.log('ok');
    } else if (session?.user.id !== post.user.id) {
      console.log('oh no');
      return {
        redirect: {
          destination: '/board',
          permanent: false,
        },
      };
    }
  }

  // Get Group
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
    props: { allBoards, groupsList, post },
  };
};

export default WritePost;
