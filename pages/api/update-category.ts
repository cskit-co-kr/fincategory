import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/rowUpdateCategory`, {
    id: req.body.channel_id,
    category: req.body.category_id,
  });
  const result = await response.data;
  res.status(200).json(result);
}
