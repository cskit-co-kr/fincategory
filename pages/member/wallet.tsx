import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { getSession, useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';
import { Table, Pagination, Nav } from 'rsuite';
import { useState, useEffect } from 'react';
import apiService from '../../lib/apiService';

const { Column, HeaderCell, Cell } = Table;

const Wallet = ({ memberInfo, wallet }: any) => {
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

  const [active, setActive] = useState('home');

  return (
    <>
      <div className='flex gap-4 pt-7 pb-7 md:pb-0 bg-gray-50'>
        {/* Sidebar */}
        <Sidebar memberInfo={memberInfo} />
        <div className='mx-auto w-full px-5 md:px-0 gap-4'>
          <div className='p-[30px] text-white bg-[#2B2B2B] rounded-lg bg-[url("/circle-lines.png")] bg-no-repeat bg-right-bottom grid grid-cols-2'>
            <div className='font-rubik grid'>
              내 지갑<span className='text-4xl font-semibold mt-2.5'>{balance}</span>
            </div>
            <div className='ml-auto mt-auto'>
              <button className='gradient-button' onClick={() => router.push('/member/fincoin-purchase')}>
                핀코인 구매
              </button>
            </div>
          </div>
          <div className='white-box mt-4 p-[30px]'>
            <div className=''>
              <Nav appearance='tabs' activeKey={active} onSelect={setActive}>
                <Nav.Item eventKey='home'>거래 내역</Nav.Item>
                <Nav.Item eventKey='news'>구매내역</Nav.Item>
              </Nav>
            </div>

            <Table data={data} bordered className='wallet-table rounded-lg' autoHeight>
              <Column width={160}>
                <HeaderCell>일시</HeaderCell>
                <Cell>{(rowData) => rowData.transaction_at.substr(0, 19).replace('T', ' ')}</Cell>
              </Column>

              <Column minWidth={300} flexGrow={1}>
                <HeaderCell>내용</HeaderCell>
                <Cell dataKey='transaction_type.transaction_name' />
              </Column>

              <Column width={100} align='center'>
                <HeaderCell>지급코인</HeaderCell>
                <Cell>{(rowData) => rowData.income && rowData.income !== 0 && rowData.income.toLocaleString()}</Cell>
              </Column>

              <Column width={100} align='center'>
                <HeaderCell>사용코인</HeaderCell>
                <Cell>{(rowData) => rowData.outcome && rowData.outcome.toLocaleString()}</Cell>
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
                total={data.length}
                activePage={page}
                onChangePage={setPage}
              />
            </div>

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

  // Return
  return {
    props: { memberInfo, wallet },
  };
};

export default Wallet;
