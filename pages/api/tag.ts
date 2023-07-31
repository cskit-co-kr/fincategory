import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return getChannels();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getChannels() {
    const query = {
      query: req.body.query,
      country: [],
      language: [],
      paginate: {
        limit: 15,
        offset: req.body.offset,
      },
      sort: {
        field: 'subscription',
        order: 'desc',
      },
    };
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/tag/search`, query);
    const result = await response.data;

    if (response.status === 200) {
      res.status(200).json(result);
    } else {
      res.status(response.status).json(result);
    }
  }
}
