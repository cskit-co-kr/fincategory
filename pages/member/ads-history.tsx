import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';

const AdsHistory = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });
  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        {/* Sidebar */}
        <Sidebar />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='white-box p-0'>
            <div className='text-xl font-bold p-[30px] pb-5'>상품구매내역</div>
            <table className='w-full border-t border-gray-200 whitespace-nowrap'>
              <thead className='bg-[#F5F5F5]'>
                <tr>
                  <th className='py-2.5 pl-[30px] text-left'>상품명</th>
                  <th className='py-2.5 text-center w-[120px]'>채널 ID</th>
                  <th className='py-2.5 text-right w-[70px]'>구매가격</th>
                  <th className='py-2.5 text-center w-[90px]'>상태</th>
                  <th className='py-2.5 text-right w-[140px]'>구매 날짜</th>
                  <th className='py-2.5 text-right pr-[30px] w-[170px]'>만료 날짜</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-200'>
                  <td className='py-2.5 pl-[30px] text-left'>웹사이트에서 구매한 핀코인</td>
                  <td className='py-2.5 text-center'>@comaps</td>
                  <td className='py-2.5 text-right'>100 000</td>
                  <td className='py-2.5 text-center'>
                    <span className='text-xs text-green-500 border border-green-500 rounded-full px-1.5 py-0.5'>&#x2022; Active</span>
                  </td>
                  <td className='py-2.5 text-right'>2023-08-28 15:11:32</td>
                  <td className='py-2.5 text-right pr-[30px]'>2023-08-28 15:11:32</td>
                </tr>
              </tbody>
            </table>
            <div className='my-[30px] grid justify-center'>Pagination</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdsHistory;
