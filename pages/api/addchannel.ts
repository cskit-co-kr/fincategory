// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addChannel();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function addChannel() {
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/addChannel`, {
      title: req.body.title,
      country: req.body.country,
      language: req.body.language,
      category: req.body.category,
      type: req.body.type,
      approved: false,
    });
    const data = await resp.data;

    if (resp.status === 200) {
      res.status(200).json('OK');
    } else {
      console.log(resp);
      res.status(resp.status).json('NO');
    }
  }
}
