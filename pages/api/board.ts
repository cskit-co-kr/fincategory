import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.query.f) {
    case 'getallboardslist':
      return getBoardList();
    case 'getpostlist':
      return getPostList();
    case 'savepost':
      return savePost();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function getBoardList() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/read`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: null,
        mode: 'full',
        paginate: {
          offset: 0,
          limit: 20,
        },
        sort: {
          field: 'hot_low',
          order: 'ASC',
        },
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function getPostList() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        board: req.query.board === 'null' ? null : req.query.board,
        paginate: {
          offset: 0,
          limit: 20,
        },
        sort: {
          field: 'created_at',
          order: 'DESC',
        },
        filter: {
          field: null,
          value: null,
        },
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function savePost() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/insert`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: req.body.title,
        content: req.body.content,
        board: req.body.board,
        category: req.body.category,
        flag: req.body.flag === 'null' ? null : req.body.flag,
        status: req.body.status,
        user: req.body.user,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }
};

export default handler;
