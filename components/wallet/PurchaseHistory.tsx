import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Table, Pagination } from 'rsuite';
import apiService from '../../lib/apiService';
import { useSession } from 'next-auth/react';

const { Column, HeaderCell, Cell } = Table;

const PurchaseHistory = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });
  const [page, setPage] = useState<number>(1);
  const [data, setData] = useState([]);
  const [pageTotal, setPageTotal] = useState(1);

  useEffect(() => {
    (async () => {
      if (session) {
        const result = await apiService.transactionListPurchase(session?.user.id, page);
        setData(result.data);
        setPageTotal(result.total);
      }
    })();
  }, [session, page]);

  return (
    <>
      <Table
        data={data}
        bordered
        className='wallet-table rounded-lg'
        autoHeight
        renderLoading={() => <div className='text-center py-10'>Loading</div>}
        renderEmpty={() => <div className='text-center py-10'>Empty</div>}
      >
        <Column width={160}>
          <HeaderCell>일시</HeaderCell>
          <Cell>{(rowData) => rowData.created_at.substr(0, 19).replace('T', ' ')}</Cell>
        </Column>

        <Column width={120} align='center'>
          <HeaderCell>구입한 핀코인</HeaderCell>
          <Cell>{(rowData) => rowData.coin.toLocaleString()}</Cell>
        </Column>

        <Column width={120} align='center'>
          <HeaderCell>구입한 핀코인</HeaderCell>
          <Cell>{(rowData) => <>{rowData.coin_transit.toLocaleString()}원</>}</Cell>
        </Column>

        <Column minWidth={200} flexGrow={1}>
          <HeaderCell>입력한 연락처/이메일</HeaderCell>
          <Cell>
            {(rowData) => (
              <>
                {rowData.sender_name} / {rowData.sender_email}
              </>
            )}
          </Cell>
        </Column>

        <Column width={140} align='center'>
          <HeaderCell>입력한 연락처/이메일</HeaderCell>
          <Cell>{(rowData) => rowData.purchase_user.username}</Cell>
        </Column>

        <Column width={100} align='center'>
          <HeaderCell>상태</HeaderCell>
          <Cell>{(rowData) => rowData.state}</Cell>
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
          total={pageTotal}
          activePage={page}
          onChangePage={setPage}
        />
      </div>
    </>
  );
};

export default PurchaseHistory;
