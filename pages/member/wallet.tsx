import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';

const Wallet = () => {
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
          <div className='p-[30px] text-white bg-[#2B2B2B] rounded-lg bg-[url("/circle-lines.png")] bg-no-repeat bg-right-bottom grid grid-cols-2'>
            <div className='font-rubik grid'>
              My Balance<span className='text-4xl font-semibold mt-2.5'>500 000</span>
            </div>
            <div className='ml-auto mt-auto'>
              <button className='gradient-button' onClick={() => router.push('/member/fincoin-purchase')}>
                Buy Fincoin
              </button>
            </div>
          </div>
          <div className='white-box mt-4 p-0'>
            <div className='text-xl font-bold p-[30px] pb-5'>거래 내역</div>
            <table className='w-full border-t border-gray-200 whitespace-nowrap'>
              <thead className='bg-[#F5F5F5]'>
                <tr>
                  <th className='py-2.5 text-left pl-[30px] w-[180px]'>일시</th>
                  <th className='py-2.5 text-left'>내용</th>
                  <th className='py-2.5 text-right w-[80px]'>지급코인</th>
                  <th className='py-2.5 text-right pr-[30px] w-[110px]'>사용코인</th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-b border-gray-200'>
                  <td className='py-2.5 text-left pl-[30px]'>2023-08-28 15:11:32</td>
                  <td className='py-2.5 text-left'>웹사이트에서 구매한 핀코인</td>
                  <td className='py-2.5 text-right'>100 000</td>
                  <td className='py-2.5 text-right pr-[30px]'>0</td>
                </tr>
                <tr className='border-b border-gray-200'>
                  <td className='py-2.5 text-left pl-[30px]'>2023-08-28 15:11:32</td>
                  <td className='py-2.5 text-left'>웹사이트에서 구매한 핀코인</td>
                  <td className='py-2.5 text-right'>400 000</td>
                  <td className='py-2.5 text-right pr-[30px]'>0</td>
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

export default Wallet;
