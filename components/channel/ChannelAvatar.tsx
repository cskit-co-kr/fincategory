import Image from 'next/image';
import { useState } from 'react';
import { enUS } from '../../lang/en-US';
import { koKR } from '../../lang/ko-KR';
import { useRouter } from 'next/router';

const ChannelAvatar = ({ id, title, size, shape, type, showType }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'ko' ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);
  return (
    <div
      className={`relative min-w-[${size}px] max-w-[${size}px] rounded-full ${
        showType === true ? (type === 'channel' ? 'bg-[#71B2FF]' : 'bg-[#FF7171]') : ''
      }`}
    >
      <Image
        src={error ? '/telegram-icon-96.png' : avatar}
        alt={'avatar of ' + title}
        width={size}
        height={size}
        className={`object-contain ${shape} z-0`}
        onError={() => setError(true)}
        loading='lazy'
      />
      {showType && <div className='text-[10px] text-center pt-2 pb-4 text-white'>{type === 'channel' ? t['channel'] : t['Group']}</div>}
    </div>
  );
};

export default ChannelAvatar;
