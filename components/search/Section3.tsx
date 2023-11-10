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
      title: '자유게시판',
      link: '/board/free',
      list: posts1,
    },
    {
      title: '광고/홍보',
      link: '/board/advertising',
      list: posts2,
    },
    {
      title: '공지사항',
      link: '/board/announcement',
      list: posts3,
    },
  ];

  useEffect(() => {
    (async () => {
      let data: any = {
        board: 'free',
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
      data['board'] = 'advertising';
      const result2 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, data).then((response) => response.data);
      setPosts2(result2);
      data['board'] = 'announcement';
      const result3 = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, data).then((response) => response.data);
      setPosts3(result3);
    })();
  }, []);

  return (
    <div className='grid md:grid-cols-3 gap-4 px-0 mt-5 lg:mt-0'>
      {items.map((item, index) => (
        <div className='md:space-y-2.5 bg-white p-4 md:border md:border-gray-200 md:rounded-xl' key={index}>
          <div className='flex items-center mb-4'>
            <span className='font-semibold text-sm'>{item.title}</span>
            <Link href={item.link} className='ml-auto flex gap-1 items-center text-primary'>
              {t['see-more']}
              <ChevronRightIcon className='h-3' />
            </Link>
          </div>
          <HomeBoardPostList postList={item.list} />
        </div>
      ))}
    </div>
  );
};

export default Section3;
