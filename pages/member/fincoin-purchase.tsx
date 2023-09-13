import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Sidebar from '../../components/member/Sidebar';
import GuideImage from '../../public/fincoin-purchase-guide.png';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Table } from 'rsuite';
import { useState } from 'react';

const { Column, HeaderCell, Cell } = Table;

const data = [
  {
    id: 0,
    col1: '50,000 FinCoin',
    col2: '50,000원',
    col3: '5,000원',
    col4: '55,000원',
  },
  {
    id: 1,
    col1: '100,000 FinCoin',
    col2: '100,000원',
    col3: '10,000원',
    col4: '110,000원',
  },
  {
    id: 2,
    col1: '200,000 FinCoin',
    col2: '200,000원',
    col3: '20,000원',
    col4: '220,000원',
  },
  {
    id: 3,
    col1: '500,000 FinCoin',
    col2: '500,000원',
    col3: '50,000원',
    col4: '550,000원',
  },
  {
    id: 4,
    col1: '1,000,000 FinCoin',
    col2: '1,000,000원',
    col3: '100,000원',
    col4: '1,100,000원',
  },
  {
    id: 5,
    col1: '5,000,000 FinCoin',
    col2: '5,000,000원',
    col3: '500,000원',
    col4: '5,500,000원',
  },
];

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

  const [selectedOption, setSelectedOption] = useState(0);
  const rowClickHandle = (rowData: any) => {
    setSelectedOption(rowData.id);
  };

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
            <div className='grid justify-center mt-[30px]'>
              <Table data={data} width={690} onRowClick={rowClickHandle} bordered cellBordered autoHeight className='rounded-lg'>
                <Column width={50} align='center'>
                  <HeaderCell>선택</HeaderCell>
                  <Cell className='cursor-pointer'>
                    {(rowData) => (
                      <input
                        type='radio'
                        name='id'
                        value={rowData.id}
                        checked={selectedOption === rowData.id}
                        onChange={() => {}}
                        className='cursor-pointer'
                      />
                    )}
                  </Cell>
                </Column>
                <Column width={160} align='center'>
                  <HeaderCell>핀코인</HeaderCell>
                  <Cell dataKey='col1' className='cursor-pointer' />
                </Column>
                <Column width={160} align='center'>
                  <HeaderCell>원화 구입금액</HeaderCell>
                  <Cell dataKey='col2' className='cursor-pointer' />
                </Column>
                <Column width={160} align='center'>
                  <HeaderCell>부가세 (10%)</HeaderCell>
                  <Cell dataKey='col3' className='cursor-pointer' />
                </Column>
                <Column width={160} align='center'>
                  <HeaderCell>합계(부가세포함)</HeaderCell>
                  <Cell dataKey='col4' className='cursor-pointer' />
                </Column>
              </Table>
            </div>
            <div className='mt-10 max-w-[690px] border border-gray-100 rounded-lg mx-auto grid'>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>구매자 ID / 닉네임:</div>
                <div>
                  {session?.user.username} / {session?.user.nickname}
                </div>
              </div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>구입 할 핀코인:</div>
                <div>{data[selectedOption].col1}</div>
              </div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>입금액:</div>
                <div>{data[selectedOption].col4}</div>
              </div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>입금 계좌번호:</div>
                <div>신한은행 110 390 632138 조승기</div>
              </div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>입금자 명:</div>
                <div>
                  <input type='text' className='border border-gray-200 w-full rounded-lg px-2.5 py-1' />
                </div>
              </div>
              <div className='px-5 py-2.5 border-b border-gray-100 font-semibold'>입금 오류 발생시 연락할 연락처 또는 이메일 주소</div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>연락처:</div>
                <div>
                  <input type='text' className='border border-gray-200 w-full rounded-lg px-2.5 py-1' />
                </div>
              </div>
              <div className='grid grid-cols-2 px-5 py-3.5 border-b border-gray-100'>
                <div className='font-semibold'>이메일 주소:</div>
                <div>
                  <input type='text' className='border border-gray-200 w-full rounded-lg px-2.5 py-1' defaultValue={session?.user.email} />
                </div>
              </div>
              <button className='blue-button m-2.5 justify-self-center'>구매하기</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FincoinPurchaseGuide;
