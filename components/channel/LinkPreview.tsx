import React, { useEffect, useState } from 'react';

function LinkPreview({ meta }: any) {
  const [imageUrl, setImageUrl] = useState('/image.jpg');
  async function getL() {
    const response = await fetch(`https://jsonlink.io/api/extract?url=${meta.webpage.url}`);
    const link = await response.json();
    setImageUrl(link.images);
  }
  const [type, setType] = useState('');
  useEffect(() => {
    getL();
    if (meta.webpage.type === 'article' || meta.webpage.type === 'photo') {
      setType('embed');
    }
  }, []);

  return (
    <div className='flex text-xs border-l-2 pl-2 m-3 gap-2.5'>
      {type === 'embed' && (
        <>
          <div>
            <div className='font-semibold text-primary'>
              <a href={meta.webpage.url} target='_blank'>
                {meta.webpage.site_name}
              </a>
            </div>
            <div className='font-semibold'>{meta.webpage.title}</div>
            <div>{meta.webpage.description}...</div>
          </div>
          <div>
            <img src={imageUrl} alt={meta.webpage.site_name} className='max-w-[180px] max-h-[100px]' />
          </div>
        </>
      )}
      {meta.webpage.type === 'video' && meta.webpage.site_name === 'YouTube' && (
        <div className=''>
          <div className='flex gap-1'>
            <b>YouTube:</b>
            <a href={meta.webpage.url} target='_blank' className='text-primary'>
              {meta.webpage.display_url}
            </a>
          </div>
          <div className='font-semibold'>{meta.webpage.title}</div>
          <div className='text-ellipsis max-h-[34px] overflow-hidden'>{meta.webpage.description}</div>
          <div className='pb-[56.25%] relative'>
            <iframe
              width='100%'
              height='100%'
              className='h-full absolute'
              src={meta.webpage.embed_url}
              allow='autoplay; encrypted-media'
              allowFullScreen
              title='video'
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkPreview;
