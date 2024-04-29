import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      username: '',
      nickname: '',
      password: '',
      email: '',
    }),
  });
  const result = await response.json();
  if (result.code === 200 && result.message === 'Inserted') {
    console.log('/board/success');
  }
}
