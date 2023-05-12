import axios from 'axios';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, ListBulletIcon, Squares2X2Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Board } from '../typings';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const Board = ({ allBoards }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  const [perpagePopup, setPerpagePopup] = useState(false);
  return (
    <>
      <div className='flex gap-4 pt-7 bg-gray-50'>
        {/* Sidebar */}
        <div className='lg:min-w-[314px]'>
          <div className='lg:sticky lg:top-4'>
            <div className='flex flex-col gap-3 border border-gray-200 rounded-md p-[30px] bg-white'>
              <div className='flex gap-2 items-center border-b border-gray-200 pb-2.5'>
                <UserCircleIcon className='h-6 text-black' />
                <span className='font-semibold'>ID {t['sign-in']}</span>
              </div>
              <button className='bg-primary font-semibold text-white py-2 px-5 text-sm'>{t['sign-in']}</button>
              <div className='border-t border-b border-gray-200 py-2.5 font-semibold'>{t['view-all-articles']}</div>
              <div className='font-semibold'>{t['board-list']}</div>
              <div>
                {allBoards?.boards.map((board: Board) => (
                  <div key={board.id}>
                    <Link href={`/board/${board.name}`} className='block px-2 py-1 text-sm'>
                      {board.title}
                    </Link>
                  </div>
                ))}
              </div>
              <div className='flex justify-between'>
                <div className='font-semibold'>{t['connected-members']}</div>
                <div className='flex gap-1 text-black'>
                  <ArrowPathIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
                  <ChevronDownIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
                </div>
              </div>
              <div className='bg-gray-100 p-4 text-xs'>{t['no-connected-members']}</div>
              <div className='border border-gray-200 p-4 text-xs'>오늘 3 전체 549</div>
            </div>
          </div>
        </div>
        {/* Main */}
        <div className='w-full xl:w-[974px] border border-gray-200 bg-white rounded-md p-[30px]'>
          <div className='text-xl font-bold'>{t['view-all-articles']}</div>
          <div className='flex justify-between items-center text-xs mt-4 pb-2.5'>
            <div>163개의 글</div>
            <div className='flex items-center gap-3 relative'>
              <ListBulletIcon className='h-5' />
              <Squares2X2Icon className='h-5' />
              <Link href='' className='border border-gray-200 p-2 flex items-center gap-2' onClick={() => setPerpagePopup((prev) => !prev)}>
                15개씩 {perpagePopup ? <ChevronUpIcon className='h-3' /> : <ChevronDownIcon className='h-3' />}
              </Link>
              {perpagePopup && (
                <ul className='absolute top-[33px] right-0 border border-gray-200'>
                  <li>
                    <Link href='/' className='perpage'>
                      5개씩
                    </Link>
                  </li>
                  <li>
                    <Link href='/' className='perpage'>
                      10개씩
                    </Link>
                  </li>
                  <li>
                    <Link href='/' className='perpage'>
                      15개씩
                    </Link>
                  </li>
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
            </div>
          </div>
          <div className='border-t border-gray-400'>
            <table className='table-auto w-full'>
              <thead className='border-b border-gray-200'>
                <tr>
                  <th></th>
                  <th className='text-center py-2'>제목</th>
                  <th className='text-left'>작성자</th>
                  <th className='text-center'>작성일</th>
                  <th className='text-center'>조회</th>
                </tr>
              </thead>
              <tbody className='text-xs'>
                <tr className='border-b border-gray-200'>
                  <td className='text-center py-2'>자유게시판</td>
                  <td>아몬드(Amond) 내일 목요일19시 새우잡이로 옵니다!</td>
                  <td>가즈즈즈즈압</td>
                  <td className='text-center'>2023.04.28</td>
                  <td className='text-center'>3</td>
                </tr>
                <tr>
                  <td className='text-center py-2'>자유게시판</td>
                  <td>아몬드(Amond) 내일 목요일19시 새우잡이로 옵니다!</td>
                  <td>가즈즈즈즈압</td>
                  <td className='text-center'>2023.04.28</td>
                  <td className='text-center'>3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/read`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: null,
      mode: 'full',
      paginate: {
        offset: 0,
        limit: 20,
      },
      sort: {
        field: 'hot_low',
        order: 'ASC',
      },
    }),
  });
  const allBoards = await response.json();

  return {
    props: { allBoards },
  };
};

export default Board;
