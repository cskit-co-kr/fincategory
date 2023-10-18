import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';
import Ads1 from '../../public/ads-1.jpg';
import Ads2 from '../../public/ads-2.jpg';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const ads1 = [
  {
    title: '200,000 FinCoin / 1 개월',
    link: '',
  },
  {
    title: '400,000 FinCoin / 3 개월',
    link: '',
  },
  {
    title: '600,000 FinCoin / 6 개월',
    link: '',
  },
];

const ads2 = [
  {
    title: '200,000 FinCoin / 1 개월',
    link: '',
  },
  {
    title: '400,000 FinCoin / 3 개월',
    link: '',
  },
  {
    title: '600,000 FinCoin / 6 개월',
    link: '',
  },
];

const Ads = () => {
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
      <div className='flex gap-4 md:pb-0 bg-gray-50'>
        {/* <Sidebar /> */}
        {/* <Sidebar />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='white-box'>
            <div className='text-xl font-bold'>거래 내역</div>
            <div className='mt-5'>
              <div className='font-semibold'>섹션 1</div>
              <Image src={Ads1} alt='Ads1' className='mt-2.5' /> */}
        {/* <div className='grid grid-cols-3 mt-5 gap-4'> */}
        {ads1.map((ad, index) => (
          <div className='white-box justify-center grid' key={index}>
            <div className='font-rubik font-semibold text-base'>{ad.title}</div>
            <button
              onClick={() => router.push('/member/ads-purchase')}
              className='blue-button rounded-full mt-2.5 justify-self-center items-start'
            >
              구매
              <ArrowRightIcon className='h-4' />
            </button>
          </div>
        ))}
        {/* </div> */}
        {/* </div> */}

        {/* <div className='mt-5'>
              <div className='font-semibold'>섹션 2</div>
              <Image src={Ads2} alt='Ads2' className='mt-2.5' />
              <div className='grid grid-cols-3 mt-5 gap-4'>
                {ads2.map((ad, index) => (
                  <div className='white-box justify-center grid' key={index}>
                    <div className='font-rubik font-semibold text-base'>{ad.title}</div>
                    <button
                      onClick={() => router.push(ad.link)}
                      className='blue-button rounded-full mt-2.5 justify-self-center items-start'
                    >
                      구매
                      <ArrowRightIcon className='h-4' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Ads;
