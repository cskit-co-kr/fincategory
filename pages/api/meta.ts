import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const html: any = await axios.get(req.query.url as string);
  const data = html.data;

  res.status(200).json(data);
}
