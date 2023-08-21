import Image from 'next/image';
import { useState } from 'react';

const ChannelAvatar = ({ id, title, size, shape }: any) => {
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);
  return (
    <div className={`relative min-w-[${size}px] max-w-[${size}px]`}>
      <Image
        src={error ? '/telegram-icon-96.png' : avatar}
        alt={'avatar of ' + title}
        width={size}
        height={size}
        className={`object-contain ${shape} z-0`}
        onError={() => setError(true)}
        loading='lazy'
      />
    </div>
  );
};

export default ChannelAvatar;
