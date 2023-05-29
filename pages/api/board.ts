import * as cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';

let haveImage = 0;
let haveImageUrl = '';

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
    const limit = req.query.postsperpage ? req.query.postsperpage : 20;
    const offset = req.query.offset ? (parseInt(req.query.offset as string, 10) - 1) * parseInt(limit as string, 10) : 0;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        board: req.query.board === 'null' ? null : req.query.board,
        paginate: {
          offset: offset,
          limit: limit,
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
        content: await processContent(req.body.content),
        board: req.body.board,
        category: req.body.category,
        flag: req.body.flag === 'null' ? null : req.body.flag,
        status: req.body.status,
        user: req.body.user,
        extra_01: haveImage === 1 ? 1 : 0,
        extra_02: haveImage === 1 ? 'https://fincategory.com' + haveImageUrl : '',
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

// Image handling functions

interface MyComponentProps {
  htmlContent: string;
}

const processContent = async (htmlContent: string) => {
  const $ = cheerio.load(htmlContent);
  const imgElements = $('img');

  for (let i = 0; i < imgElements.length; i++) {
    const element = imgElements[i];
    const src = $(element).attr('src');

    if (src && src.startsWith('data:image')) {
      const imageData = src.split(';')[0].split(':')[1]; // Extract image data format
      const base64Data = src.split(',')[1]; // Extract Base64 data
      const binaryData = base64ToBinary(base64Data);
      const blobData = createBlobFromData(binaryData, imageData);
      const changedPath = await uploadImage(blobData, imageData);
      $(element).replaceWith(`<img src="https://fincategory.com${changedPath}" alt="Image" />`);
    }
  }
  let modifiedHtml = $.html(); // Get the modified HTML content with the root tags
  modifiedHtml = modifiedHtml.replace(/<\/?(html|head|body)[^>]*>/gi, ''); // Remove opening and closing tags of <html>, <head>, and <body>
  console.log(modifiedHtml);
  return modifiedHtml;
};
const base64ToBinary = (base64Data: any) => {
  const binaryString = Buffer.from(base64Data, 'base64').toString('binary');
  const byteArray = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  return byteArray;
};
const createBlobFromData = (data: any, type: any) => {
  return new Blob([data], { type });
};
const uploadImage = async (file: any, imageData: string) => {
  const extension = imageData.split('/')[1]; // Extract the file extension
  const filename = `image.${extension}`;

  const formData = new FormData();
  formData.append('image', file, filename);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/uploads`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      if (haveImage === 0) {
        haveImageUrl = result.path;
      }
      haveImage = 1;
      return result.path;
    } else {
      console.error('Image upload failed.');
    }
  } catch (error) {
    console.error('An error occurred while uploading the image:', error);
  }
};

export default handler;
