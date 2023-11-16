import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiService from '../../lib/apiService';
import { useSession } from 'next-auth/react';

const Ads1 = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === 'ko' ? koKR : enUS;

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/member/signin');
    },
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      if (session) {
        const result = await apiService.getAds1();
        setData(result.rows);
      }
    })();
  }, [session]);

  return <div>Ads1</div>;
};

export default Ads1;
