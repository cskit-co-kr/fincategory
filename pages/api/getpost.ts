import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`https://t.me/${req.query.channel}/${req.query.id}?embed=1`);
  const result = await response.text();

  res.status(200).json(result);
}
