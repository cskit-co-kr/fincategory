import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiService from '../../lib/apiService';
import { useSession } from 'next-auth/react';
import AdChannel from './AdChannel';
import { Skeleton } from '@mui/material';

const Ads1 = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session } = useSession();
  const [data, setData] = useState<any>([]);
  const [emptyAd, setEmptyAd] = useState(false);

  const shuffleArray = (array: any) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    (async () => {
      const result = await apiService.getAds1();
      let rows = shuffleArray(result.rows).slice(0, 3);
      if (result.rows.length === 2) {
        rows.push({
          title: '핀카 최상단 배너',
          description:
            '메인 화면 최상단에 노출되는 배너입니다. 단 9분께 선착순 판매합니다. 지금 미리 구매하셔서 자리를 선점하세요. 늦으면 매진될 수 있습니다.',
        });
      } else if (result.rows.length === 1) {
        rows.push({
          title: '핀카 최상단 배너',
          description:
            '메인 화면 최상단에 노출되는 배너입니다. 단 9분께 선착순 판매합니다. 지금 미리 구매하셔서 자리를 선점하세요. 늦으면 매진될 수 있습니다.',
        });
        rows.push({
          title: '핀카 최상단 배너',
          description:
            '메인 화면 최상단에 노출되는 배너입니다. 단 9분께 선착순 판매합니다. 지금 미리 구매하셔서 자리를 선점하세요. 늦으면 매진될 수 있습니다.',
        });
      } else if (result.rows.length === 0) {
        setEmptyAd(true);
      }
      // const shuffledData = shuffleArray(rows).slice(0, 3);
      setData(rows);
    })();
  }, []);

  return (
    <div className='grid md:grid-cols-3 gap-4 mt-4 md:mt-0 '>
      {data.length === 0 && !emptyAd && (
        <>
          <Skeletons />
          <Skeletons />
          <Skeletons />
        </>
      )}
      {data.map((channel: any) => (
        <AdChannel channel={channel} key={channel.id} showType={channel.type ? true : false} />
      ))}
    </div>
  );
};

const Skeletons = () => {
  return (
    <Skeleton
      className={`relative flex md:rounded-xl p-4 gap-2.5 text-black `}
      sx={{ bgcolor: 'grey.100' }}
      variant='rectangular'
      animation='wave'
      width={422}
      height={131}
    />
  );
};

export default Ads1;
