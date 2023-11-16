import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductActive`);
  const result = await response.data;
  res.status(200).json(result);
}
