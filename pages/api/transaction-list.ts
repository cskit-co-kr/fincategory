import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/transaction/transactionListUser11`, {
    userId: req.body.userId,
    pagination: {
      limit: 15,
      offset: req.body.page === 1 ? 0 : (req.body.page - 1) * 15,
    },
    filters: {},
  });
  const result = await response.data;
  res.status(201).json(result);
}
