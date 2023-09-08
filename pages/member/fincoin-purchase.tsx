import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';
import GuideImage from '../../public/fincoin-purchase-guide.png';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const FincoinPurchaseGuide = () => {
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
          <button
            onClick={() => router.back()}
            className='hidden md:flex gap-1 items-center border border-gray-200 rounded-full px-4 py-2 mb-4 text-xs'
          >
            <ArrowLeftIcon className='h-4' />
            Back
          </button>
          <div className='white-box'>
            <div className='text-xl font-bold'>핀코인 구매 안내</div>
            <div className='grid grid-cols-2 border border-gray-200 rounded-lg mt-5'>
              <div className='px-4 py-2.5 font-semibold border-b border-gray-200'>Deposit amount:</div>
              <div className='px-4 py-2.5 border-b border-gray-200'>Input (User입력) (ex: 100)</div>
              <div className='px-4 py-2.5 font-semibold border-b border-gray-200'>Bank name:</div>
              <div className='px-4 py-2.5 border-b border-gray-200'>Hana bank</div>
              <div className='px-4 py-2.5 font-semibold border-b border-gray-200'>Account number:</div>
              <div className='px-4 py-2.5 border-b border-gray-200'>00-00000-0000</div>
              <div className='px-4 py-2.5 font-semibold border-b border-gray-200'>Amount:</div>
              <div className='px-4 py-2.5 border-b border-gray-200'>100</div>
              <div className='px-4 py-2.5 font-semibold border-b border-gray-200'>Description:</div>
              <div className='px-4 py-2.5 border-b border-gray-200'>User Id (해당 유저ID), Phone number</div>
              <div className='px-4 py-2.5 col-span-2'>Boss phone number and description (Points are paid within 4 hours after deposit)</div>
            </div>

            <div className='bg-gray-50 rounded-lg p-5 mt-5'>
              <Image src={GuideImage} alt='Fincoin Purchase Information' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FincoinPurchaseGuide;
