import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';
import { Table, Pagination } from 'rsuite';
import { useState, useEffect } from 'react';
import apiService from '../../lib/apiService';
import { toDateTimeformat } from '../../lib/utils';

const { Column, HeaderCell, Cell } = Table;

type PurchaseHistory = {
  id: string;
  product_info_id: string;
  channel_id: string;
  user_id: number;
  started_at: string;
  ended_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
};

type AdsHistoryProps = {
  purchaseHistory: PurchaseHistory[];
  memberInfo: any;
};

const AdsHistory = ({ purchaseHistory, memberInfo }: AdsHistoryProps) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });

  const [page, setPage] = useState(1);

  const [data, setData] = useState(purchaseHistory);

  // useEffect(() => {
  //   (async () => {
  //     const result = await apiService.transactionListUser(session?.user.id);
  //     setData(result.data);
  //   })();
  // }, []);

  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        <Sidebar memberInfo={memberInfo} />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='white-box p-[30px]'>
            <div className='text-xl font-bold pb-5'>상품구매내역</div>

            <Table data={data} bordered className='wallet-table rounded-lg' autoHeight>
              <Column minWidth={250} flexGrow={1}>
                <HeaderCell>상품명</HeaderCell>
                <Cell dataKey='product_name' />
              </Column>

              <Column width={150}>
                <HeaderCell>채널 ID</HeaderCell>
                <Cell dataKey='channel_name' />
              </Column>

              <Column width={110} align='right'>
                <HeaderCell>구매가격</HeaderCell>
                <Cell>{(rowData) => `${rowData.fincoin.toLocaleString()} FinCoin`}</Cell>
              </Column>

              <Column width={100} align='center'>
                <HeaderCell>상태</HeaderCell>
                <Cell>
                  {(rowData) =>
                    checkStatus(rowData.started_at, rowData.ended_at) === 'active' ? (
                      <div className='rounded-full border border-green-400 text-green-400 text-xs pb-[1px] px-1'>Active</div>
                    ) : checkStatus(rowData.started_at, rowData.ended_at) === 'ended' ? (
                      <div className='rounded-full border border-gray-400 text-gray-400 text-xs pb-[1px] px-1'>Ended</div>
                    ) : (
                      checkStatus(rowData.started_at, rowData.ended_at) === 'scheduled' && (
                        <div className='rounded-full border border-blue-400 text-blue-400 text-xs pb-[1px] px-1'>Scheduled</div>
                      )
                    )
                  }
                </Cell>
              </Column>
              <Column width={150} align='center'>
                <HeaderCell>구매 날짜</HeaderCell>
                <Cell>{(rowData) => toDateTimeformat(rowData.started_at, '-')}</Cell>
              </Column>
              <Column width={150} align='center'>
                <HeaderCell>만료 날짜</HeaderCell>
                <Cell>{(rowData) => toDateTimeformat(rowData.ended_at, '-')}</Cell>
              </Column>
            </Table>
            <div className='p-5'>
              <Pagination
                className='justify-center'
                prev
                next
                first
                last
                ellipsis
                maxButtons={5}
                total={data?.length}
                activePage={page}
                onChangePage={setPage}
              />
            </div>

            {/* <table className='w-full border-t border-gray-200 whitespace-nowrap'>
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
            <div className='my-[30px] grid justify-center'>Pagination</div> */}
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

  // const response2 = await fetch(`https://test-backend.fincategory.com/v1/product/getProductUser/11`);
  const response2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductUserId/${session?.user.id}`);
  const result2 = await response2.json();
  const purchaseHistory = result2.data;

  // Return
  return {
    props: { memberInfo, purchaseHistory },
  };
};

const checkStatus = (start: any, end: any) => {
  const now = Date.now();
  let status;
  const s = Date.parse(start);
  const e = Date.parse(end);
  if (e - now < 0) {
    status = 'ended';
  } else if (s - now < 0 && now - e < 0) {
    status = 'active';
  } else if (now - s < 0) {
    status = 'scheduled';
  }
  return status;
};

export default AdsHistory;
