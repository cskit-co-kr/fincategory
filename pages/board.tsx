import axios from 'axios';
import { NextSeo } from 'next-seo';

const Board = ({ board }: any) => {
  return (
    <>
      <div className='flex pt-7 bg-gray-50'>
        {/* Sidebar */}
        <div className='lg:min-w-[314px]'>
          <div className='lg:sticky lg:top-4'>
            <div className='flex flex-col gap-3 border border-gray-200 rounded-md p-[30px] bg-white'>123</div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board`);
  const board = await response.data;

  return {
    props: board,
  };
};

export default Board;
