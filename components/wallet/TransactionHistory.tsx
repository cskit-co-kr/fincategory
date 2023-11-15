import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Table, Pagination } from 'rsuite';
import apiService from '../../lib/apiService';
import { useSession } from 'next-auth/react';

const { Column, HeaderCell, Cell } = Table;

const TransactionHistory = () => {
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
        const result = await apiService.transactionListUser(session?.user.id, page);
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
          total={pageTotal}
          activePage={page}
          onChangePage={setPage}
        />
      </div>
    </>
  );
};

export default TransactionHistory;
