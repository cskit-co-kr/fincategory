import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/react";
import Sidebar from "../../components/member/Sidebar";
import { Table, Pagination, Nav } from "rsuite";
import { useState, useEffect } from "react";
import apiService from "../../lib/apiService";
import TransactionHistory from "../../components/wallet/TransactionHistory";
import PurchaseHistory from "../../components/wallet/PurchaseHistory";
import { NextSeo } from "next-seo";

const { Column, HeaderCell, Cell } = Table;

const Wallet = ({ memberInfo, wallet }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/board/signin");
    },
  });

  const balance = wallet ? wallet.balance.toLocaleString() : 0;

  const [page, setPage] = useState<number>(1);

  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (session) {
        const result = await apiService.transactionListUser(session?.user.id, page);
        setData(result.data);
      }
    })();
  }, [session, page]);

  const [activeTab, setActiveTab] = useState(1);

  return (
    <>
      <NextSeo
        title={`핀코인`}
        titleTemplate={`핀코인`}
        noindex={true}
        nofollow={true}
        description={session?.user.nickname + ` ${session?.user.email}...`}
      />
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        {/* Sidebar */}
        <Sidebar memberInfo={memberInfo} />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='p-[30px] text-white bg-[#2B2B2B] rounded-xl bg-[url("/circle-lines.png")] bg-no-repeat bg-right-bottom grid grid-cols-2'>
            <div className='font-rubik grid'>
              내 지갑<span className='text-4xl font-semibold mt-2.5'>{balance}</span>
            </div>
            <div className='ml-auto mt-auto'>
              <button className='gradient-button' onClick={() => router.push("/board/fincoin-purchase")}>
                핀코인 구매
              </button>
            </div>
          </div>
          <div className='white-box mt-4 p-[30px]'>
            <div className='flex gap-1 mb-4'>
              <button
                className={`${activeTab === 1 ? "button-tab-active" : "button-tab"}`}
                onClick={() => setActiveTab(1)}
              >
                핀코인
              </button>
              <button
                className={`${activeTab === 2 ? "button-tab-active" : "button-tab"}`}
                onClick={() => setActiveTab(2)}
              >
                구매내역
              </button>
            </div>

            {activeTab === 1 && <TransactionHistory />}
            {activeTab === 2 && <PurchaseHistory />}

            {/* <table className='w-full border-t border-gray-200 whitespace-nowrap'>
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
            <div className='my-[30px] grid justify-center'>Pagination</div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  // Get Member Information
  let memberInfo = "";
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
      }
    );
    memberInfo = await responseMember.json();
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/getWallet/${session?.user.id}`);
  const result = await response.json();
  const wallet = result.wallet;

  // Return
  return {
    props: { memberInfo, wallet },
  };
};

export default Wallet;
