// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return getPosts();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getPosts() {
    // const resp = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/posts`, {
    //   username: req.body.username,
    //   offset: req.body.offset,
    //   limit: req.body.limit,
    // });
    const resp = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail/${req.body.username}/posts`, {
      paginate: {
        limit: req.body.limit,
        offset: req.body.offset,
      },
    });
    const data = await JSON.parse(JSON.stringify(resp.data));

    if (resp.status === 200) {
      res.status(200).json(data);
    } else {
      res.status(resp.status).json('NO');
    }
  }
}
