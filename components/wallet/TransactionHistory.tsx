import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Table, Pagination } from 'rsuite';
import apiService from '../../lib/apiService';
import { useSession } from 'next-auth/react';
import { toDateTimeformat } from '../../lib/utils';

const { Column, HeaderCell, Cell } = Table;

const TransactionHistory = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, status } = useSession({
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
        className='wallet-table rounded-xl'
        autoHeight
        renderLoading={() => <div className='text-center py-10'></div>}
        renderEmpty={() => <div className='text-center py-10'></div>}
      >
        <Column width={160}>
          <HeaderCell>일시</HeaderCell>
          <Cell>{(rowData) => toDateTimeformat(rowData.transaction_at, '-')}</Cell>
        </Column>

        <Column minWidth={300} flexGrow={1}>
          <HeaderCell>내용</HeaderCell>
          <Cell>
            {(rowData) => {
              switch (rowData.transaction_type.transaction_name) {
                case 'Purchase product':
                  return '광고상픔 구매';
                case 'Write post':
                  return '게시판 글쓰기';
                case 'Write comment':
                  return '게시판 댓글쓰기';
                case 'Read post':
                  return '게시판 글 읽기';
                case 'New channel registration':
                  return '신규채널등록';
                case 'Signup':
                  return '회원가입';
                case 'Withdraw':
                  return '회수';
                case 'Deposit':
                  return '지급';
                default:
                  return '핀코인 구매';
              }
            }}
          </Cell>
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
