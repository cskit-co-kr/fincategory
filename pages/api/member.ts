import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.query.f) {
    case 'getmember':
      return getMember();
    case 'checkusername':
      return checkUsername();
    case 'checkemail':
      return checkEmail();
    case 'register':
      return registerMember();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getMember() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/getMember/${req.query.userid}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json' },
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function checkUsername() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/checkUsername`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: req.query.username,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function checkEmail() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/checkEmail`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: req.query.email,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function registerMember() {
    if (req.method !== 'POST') {
      return false;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        username: req.body.username,
        nickname: req.body.nickname,
        password: req.body.password,
        email: req.body.email,
        type: 1,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }
};

export default handler;
