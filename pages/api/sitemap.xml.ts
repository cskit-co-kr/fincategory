// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { formatDate, toDateformat } from '../../lib/utils';
import axios from 'axios';
import { number } from 'yup';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getSitemap();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getSitemap() {
    // const yesterday = toDateformat(new Date(new Date().setDate(new Date().getDate() - 1)).toString(), '-');
  var d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterday = d.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).split('/').reverse().join('-');

    const month = toDateformat(new Date(new Date().setDate(new Date().getDate() - 30)).toString(), '-');


    const priority8 = 0.8;
    const priority3 = 0.3;

    const responseChannel = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, {
      query: null,
      withDesc: false,
      category: [],
      country: [{ value: 113, label: 'Korea, Republic of' }],
      language: [{ value: 'ko', label: 'Korean' }],
      channel_type: null,
      channel_age: 0,
      erp: 0,
      subscribers_from: null,
      subscribers_to: null,
      paginate: { limit: 6000, offset: 0 },
      sort: {
        field: 'subscription',
        order: 'desc',
      }
    });

    const channelData = await responseChannel.data;

    const responseBoad = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/read`, {
      query: null,
      mode: null,
      group: null,
      paginate: {
        offset: 0,
        limit: 20
      },
      sort: {
        field: null,
        order: null
      }
    });

    const boardData = await responseBoad.data;

    // res.statusCode = 200;
    res.setHeader('Content-type', 'text/xml');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
                  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                    <url>
                      <loc>https://test-fincat.fincategory.com/</loc>
                      <lastmod>${yesterday}</lastmod>
                      <changefreq>daily</changefreq>
                      <priority>${priority8}</priority>
                    </url>
                    <url>
                      <loc>https://test-fincat.fincategory.com/ranking</loc>
                      <lastmod>${yesterday}</lastmod>
                      <changefreq>daily</changefreq>
                      <priority>${priority3}</priority>
                    </url>
                    <url>
                      <loc>https://test-fincat.fincategory.com/add</loc>
                      <lastmod>${yesterday}</lastmod>
                      <changefreq>monthly</changefreq>
                      <priority>${priority3}</priority>
                    </url>
                    <url>
                      <loc>https://test-fincat.fincategory.com/board/signin</loc>
                      <lastmod>${yesterday}</lastmod>
                      <changefreq>monthly</changefreq>
                      <priority>${priority3}</priority>
                    </url>
                  </urlset>`
    res.write(xml);
    res.end();
  }
}
