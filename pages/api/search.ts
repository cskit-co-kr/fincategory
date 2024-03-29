import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return searchChannel();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function searchChannel() {
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, {
      query: req.body.query,
      withDesc: req.body.withDesc,
      category: req.body.category,
      country: req.body.country,
      language: req.body.language,
      channel_type: req.body.channel_type,
      channel_age: req.body.channel_age,
      erp: req.body.erp,
      subscribers_from: req.body.subscribers_from,
      subscribers_to: req.body.subscribers_to,
      paginate: req.body.paginate,
      sort: req.body.sort,
    });

    const data = await resp.data;
    if (resp.status === 200) {
      res.status(200).json(data);
    } else {
      res.status(resp.status).json('Unexpected status code: ' + resp.status);
    }
  }
}
