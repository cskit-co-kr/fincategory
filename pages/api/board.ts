import type { NextApiRequest, NextApiResponse } from 'next';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.query.f) {
    case 'getallboardslist':
      return getBoardList();
    case 'getpostlist':
      return getPostList();
    case 'getpost':
      return getPost();
    case 'savepost':
      return savePost();
    case 'getcomments':
      return getComments();
    case 'insertcomment':
      return insertComment();
    case 'postReaction':
      return postReaction();
    case 'commentReaction':
      return commentReaction();
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
          field: req.query.category === 'null' ? null : 'category_id',
          value: req.query.category === 'null' ? null : req.query.category,
        },
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function getPost() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/get/${req.body.id}`);

    const result = await response.json();

    if (result) return res.status(200).json(result.post);

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

  async function getComments() {
    console.log('body: ', req.body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/comment/list`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        post: req.body.id,
        query: req.body.query,
        paginate: {
          offset: req.body.paginate.offset,
          limit: req.body.paginate.limit
        },
        sort: {
          field: req.body.sort.field,
          order: req.body.sort.value
        }
      })
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  // GET LIST
  async function insertComment() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/comment/insert`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          comment: req.body.comment,
          parent: req.body.parent,
          user: req.body.user,
          post: req.body.post,
          board: req.body.board
        })
      });

      const data = await response.json();

      res.status(200).json(data)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Unexpected error' })
      }
    }
  }

  // GET LIST
  async function postReaction() {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/reaction/${req.body.post}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user: req.body.user,
          action: req.body.action
        })
      });

      const data = await response.json();

      res.status(200).json(data)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Unexpected error' })
      }
    }
  }

  // GET LIST
  async function commentReaction() {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/comment/reaction/${req.body.comment}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          user: req.body.user,
          action: req.body.action,
          type: req.body.type
        })
      });

      const data = await response.json();

      res.status(200).json(data)
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
      } else {
        res.status(500).json({ error: 'Unexpected error' })
      }
    }
  }
};

export default handler;
