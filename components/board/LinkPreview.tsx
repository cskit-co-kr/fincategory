import { useEffect, useState } from 'react';
import * as cheerio from 'cheerio';

interface meta {
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
  url: string | undefined;
}

function LinkPreview(metaLink: any) {
  const [imageUrl, setImageUrl] = useState<string | undefined>('/image.jpg');
  const [meta, setMeta] = useState<meta>();
  async function getMeta() {
    const response = await fetch(`https://jsonlink.io/api/extract?url=${metaLink.url}`);
    const result = await response.json();
    setMeta(result);
    setImageUrl(result.images);
  }
  const fetchMeta = async () => {
    const html: any = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/meta?url=${metaLink.url}`);
    const $ = cheerio.load(await html.json());

    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDesc = $('meta[property="og:description"]').attr('content');
    const ogImage = $('meta[property="og:image"]').attr('content');
    const ogUrl = $('meta[property="og:url"]').attr('content');
    setMeta({ title: ogTitle, description: ogDesc, image: ogImage, url: ogUrl });
    setImageUrl(ogImage);
  };
  useEffect(() => {
    getMeta();
    // fetchMeta();
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
