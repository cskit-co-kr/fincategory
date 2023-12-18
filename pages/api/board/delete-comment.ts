import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

let result = '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (session?.user && session?.user.id === req.body.user) {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/comment/delete/${req.body.comment}`);
    result = await response.data;
  }
  res.status(200).json(result);
}
