import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';

import TelegramLogo from '../../public/telegram-icon-96.png';

type IData = {
  src: string;
  alt: string;
  className: string;
  width: number;
  height: number;
};

const CustomImage: FunctionComponent<IData> = ({ src, alt, className, width, height }) => {
  const [error, setError] = useState<boolean>(false);

  return (
    <Image
      src={error ? TelegramLogo : src}
      alt={alt ? 'FinCa' : alt}
      width={width}
      height={height}
      onError={() => setError(true)}
      className={className}
    />
  );
};

export default CustomImage;
