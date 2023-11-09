import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import Sidebar from '../../components/member/Sidebar';
import Ads1 from '../../public/ads-1.jpg';
import Ads2 from '../../public/ads-2.jpg';
import Image from 'next/image';
import { getSession, useSession } from 'next-auth/react';
import Link from 'next/link';
import ModalAdsPurchaseConfirm from '../../components/member/ModalAdsPurchaseConfirm';

type ads = {
  id: string;
  duration: string;
  coin: number;
};

const ads2 = [
  {
    duration: '1 개월',
    coin: 200000,
  },
  {
    duration: '3 개월',
    coin: 400000,
  },
  {
    duration: '6 개월',
    coin: 600000,
  },
];

const Ads = ({ wallet, section1, activeProducts }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });

  const balance = wallet ? wallet.balance.toLocaleString() : 0;

  const ads1 = section1.map((ad: any) => ({
    id: ad.id,
    duration: `${ad.term / 30} 개월`,
    coin: ad.fincoin,
  }));

  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50 text-base'>
        <Sidebar />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='white-box'>
            <div className='text-2xl'>최상단 배너</div>
            <div className='mt-5'>
              <div className=''>
                핀카 메인 화면 최상단에 노출되는 배너입니다.
                <br />
                단 9분께 선착순 판매합니다.
                <br />
                지금 미리 구매하셔서 자리를 선점하세요. 늦으면 매진될 수 있습니다.
              </div>
              <Image src={Ads1} alt='Ads1' className='mt-7' />
              <div className='bg-[#fafafa] border border-[#b4b4b4] px-4 py-3 flex gap-10 mt-6'>
                <div className='font-semibold'>나의 FinCoin</div>
                <div>보유 : {balance} FinCoin </div>
                <div className='text-[#f12323]'>
                  <Link href='/member/fincoin-purchase'>[핀코인 구매하기]</Link>
                </div>
              </div>
              <div className='mt-6'>
                <div className='font-semibold mb-3'>가격</div>
                {ads1.map((ad: ads, index: number) => (
                  <div className='flex mt-2' key={index}>
                    <div>{ad.duration}</div>
                    <div className='ml-3'>{ad.coin.toLocaleString()} FinCoin</div>
                    <div className='ml-10'>
                      {activeProducts < 3 ? (
                        <button
                          onClick={() => {
                            const modalId = `ads1_modal_${index}`;
                            const modal = document.getElementById(modalId) as any;
                            modal?.showModal();
                          }}
                        >
                          [구매하기]
                        </button>
                      ) : (
                        <div className='text-red-500'>[Sold Out]</div>
                      )}
                      <ModalAdsPurchaseConfirm data={ad} balance={balance} modalId={index} adsGroup='ads1' userId={session?.user.id} />
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-12'>
                <div className='font-semibold'>유의사항</div>
                <ol className='list-disc list-inside mt-5'>
                  <li>최상단 배너는 9개의 광고가 랜덤으로 노출됩니다.</li>
                  <li>선착순 9분께 판매됩니다.</li>
                  <li>광고 연장은 기존 광고주께 우선 부여됩니다.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className='white-box mt-10'>
            <div className='text-2xl'>첫 페이지 노출</div>
            <div className='mt-5'>
              <div className=''>
                핀카에는 1500개 이상의 채널과 그룹이 있습니다.
                <br />
                그래서 내 채널/그룹이 다른 사용자에게 노출되기 어렵습니다.
                <br />
                <br />
                핀카 첫페이지에 랜덤으로 노출되는 광고입니다.
              </div>
              <Image src={Ads2} alt='Ads2' className='mt-7' />
              <div className='bg-[#fafafa] border border-[#b4b4b4] px-4 py-3 flex gap-10 mt-6'>
                <div className='font-semibold'>나의 FinCoin</div>
                <div>보유 : {balance} FinCoin </div>
                <div className='text-[#f12323]'>
                  <Link href='/member/fincoin-purchase'>[핀코인 구매하기]</Link>
                </div>
              </div>
              <div className='mt-6'>
                <div className='font-semibold mb-3'>가격</div>
                {ads2.map((ad, index) => (
                  <div className='flex mt-2' key={index}>
                    <div>{ad.duration}</div>
                    <div className='ml-3'>{ad.coin.toLocaleString()} FinCoin</div>
                    <div className='ml-10'>
                      <button
                        onClick={() => {
                          const modalId = `ads2_modal_${index}`;
                          const modal = document.getElementById(modalId) as any;
                          modal?.showModal();
                        }}
                      >
                        [구매하기]
                      </button>
                      <ModalAdsPurchaseConfirm data={ad} balance={balance} modalId={index} adsGroup='ads2' />
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-12'>
                <div className='font-semibold'>유의사항</div>
                <ol className='list-disc list-inside mt-5'>
                  <li>최상단 배너는 9개의 광고가 랜덤으로 노출됩니다.</li>
                  <li>선착순 9분께 판매됩니다.</li>
                  <li>광고 연장은 기존 광고주께 우선 부여됩니다.</li>
                </ol>
              </div>
            </div>
          </div>
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
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/getWallet/${session?.user.id}`);
  const result = await response.json();
  const wallet = result.wallet;

  const response2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductSection1`);
  const result2 = await response2.json();
  const section1 = result2.rows;

  const response3 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductActive`);
  const result3 = await response3.json();
  const activeProducts = result2.rows.length;

  // Return
  return {
    props: { memberInfo, wallet, section1, activeProducts },
  };
};

export default Ads;
