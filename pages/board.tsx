import axios from 'axios';
import { useRouter } from 'next/router';
import { enUS } from '../lang/en-US';
import { koKR } from '../lang/ko-KR';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Board } from '../typings';
import Link from 'next/link';

const Board = ({ allBoards }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  return (
    <>
      <div className='flex pt-7 bg-gray-50'>
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
                {allBoards?.map((board: Board) => (
                  <div key={board.id}>
                    <Link href={`/board/${board.name}`} className='block px-3 py-2'>
                      {board.title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board`, {
    method: 'GET',
    headers: { 'content-type': 'application/json' },
  });
  const allBoards = await response.json();
  return {
    props: allBoards,
  };
};

export default Board;
