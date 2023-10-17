// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return resolve();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function resolve() {
    const username = req.query.username;
    if(username){
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/check?username=${username}`);
      const data = await response.data;
      if (data.existed === true) {
        res.status(200).send({message: "existed"});
      } else {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/getChatInfo?username=${username}`);
        const data = await response.data;
        if (response.status === 200) {
          if (data) {
            res.status(200).send({message: "correct", data})
          }
        } else {
          res.status(200).send({message: "wrong", data})
        };
      }
    } else {
    //   setCheckStatus("idle")
    }
  }
}
