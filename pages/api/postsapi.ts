// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const get_what = req.body.get_what;
  switch (req.method) {
    case 'POST':
      return get_what === 'ordered' ? getOrderedPosts() : getPosts();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getOrderedPosts() {
    const user_id = req.body.channel_id;
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail/${user_id}/posts`, {
      paginate: {
        limit: 500,
        offset: 0,
      },
    });
    const data = await JSON.parse(JSON.stringify(resp.data));
    const currentDate = new Date();
    const startDate = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last30DaysData = data.filter((item: any) => {
      const itemDate = new Date(item.date.replace(/-/g, '/'));
      return itemDate >= startDate && itemDate < currentDate;
    });
    const v = last30DaysData.sort((a: any, b: any) => b.views - a.views);
    if (resp.status === 200) {
      res.status(200).json(v);
    } else {
      res.status(resp.status).json('NO');
    }
  }

  async function getPosts() {
    const user_id = req.body.channel_id;
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail/${user_id}/posts`, {
      paginate: {
        limit: 1000,
        offset: 0,
      },
    });
    const data = await JSON.parse(JSON.stringify(resp.data));

    const result = data.reduce((acc: any, { date, views }: any) => {
      const dateString = date.substring(0, 10);
      if (!acc[dateString]) {
        acc[dateString] = { date: dateString, views: 0 };
      }
      acc[dateString].views += views;
      return acc;
    }, {});
    const totalViews = Object.values(result);

    const averages = Object.values(
      data.reduce((acc: any, { date, views }: any) => {
        const dateString = date.substring(0, 10);
        if (!acc[dateString]) {
          acc[dateString] = { date: dateString, views: [], average: 0 };
        }
        acc[dateString].views.push(views);
        acc[dateString].average = Math.round(acc[dateString].views.reduce((a: any, b: any) => a + b) / acc[dateString].views.length);
        return acc;
      }, {})
    );

    const combinedReturn = [{ total: totalViews, average: averages }];

    if (resp.status === 200) {
      res.status(200).json(combinedReturn);
    } else {
      res.status(resp.status).json('NO');
    }
  }
}
