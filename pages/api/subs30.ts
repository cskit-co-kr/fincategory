import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.get(`https://t.me/s/${req.query.url}`);
  const result = await response.data;
  return result;
}
