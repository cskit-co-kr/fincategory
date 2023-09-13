import Link from 'next/link';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import HomeBoardPostList from '../HomeBoardPostList';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Section3 = () => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;

  const [posts1, setPosts1] = useState();
  const [posts2, setPosts2] = useState();
  const [posts3, setPosts3] = useState();

  const items = [
    {
      title: '전체글보기',
      link: '/board',
      list: posts1,
    },
    {
      title: '주식',
      link: '/board/stock',
      list: posts2,
    },
    {
      title: '가상화폐',
      link: '/board/coin',
      list: posts3,
    },
  ];

  useEffect(() => {
    (async () => {
      let data: any = {
        board: null,
        paginate: {
          offset: 0,
          limit: 5,
        },
        sort: {
          field: 'created_at',
          order: 'DESC',
        },
        filter: {
          field: 'status',
          value: '1',
        },
        search: {
          start: null,
          end: null,
          field: 'author',
          value: null,
        },
      };
      const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, data).then((response) => response.data);
      setPosts1(result);
      data['board'] = 'stock';
      const result2 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, data).then((response) => response.data);
      setPosts2(result2);
      data['board'] = 'coin';
      const result3 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, data).then((response) => response.data);
      setPosts3(result3);
    })();
  }, []);

  return (
    <div className='grid md:grid-cols-3 gap-4'>
      {items.map((item, index) => (
        <div className='space-y-2.5' key={index}>
          <div className='flex items-center'>
            <span className='font-bold text-sm'>{item.title}</span>
            <Link href={item.link} className='ml-auto flex gap-1 items-center text-xs text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </Link>
          </div>
          <div className='flex border border-gray-200 rounded-xl bg-white p-4'>
            <HomeBoardPostList postList={item.list} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Section3;