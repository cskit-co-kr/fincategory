import React, { useEffect, useState } from 'react';

interface meta {
  title: string;
  description: string;
  images: string[];
  url: string;
}

function LinkPreview(metaLink: any) {
  const [imageUrl, setImageUrl] = useState('/image.jpg');
  const [meta, setMeta] = useState<meta>();
  const [isVideo, setIsVideo] = useState();
  async function getMeta() {
    const response = await fetch(`https://jsonlink.io/api/extract?url=${metaLink.url}`);
    const result = await response.json();
    setMeta(result);
    setImageUrl(result.images);
  }
  useEffect(() => {
    getMeta();
  }, []);

  return meta?.title ? (
    <div className='text-xs border-l-2 pl-2 m-3 mt-5 gap-2.5'>
      <div>
        <div className='font-semibold text-primary break-words'>
          <a href={meta?.url} target='_blank'>
            {meta?.url}
          </a>
        </div>
        <div className='font-semibold'>{meta?.title}</div>
        <div>{meta?.description}...</div>
      </div>
      <div className='w-full'>
        <img src={imageUrl} alt={meta?.title} className='max-w-[280px] md:max-w-[500px] max-h-[360px] mx-auto' />
      </div>
    </div>
  ) : (
    <div></div>
  );
}

export default LinkPreview;
