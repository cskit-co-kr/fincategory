import * as cheerio from 'cheerio';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

let haveImage = 0;
let haveImageUrl = '';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.query.f) {
    case 'getgroups':
      return getGroups();
    case 'getallboardslist':
      return getBoardList();
    case 'getpostlist':
      return getPostList();
    case 'getdraftpostlist':
      return getDraftPostList();
    case 'getpost':
      return getPost();
    case 'deletepost':
      return deletePost();
    case 'savepost':
      return savePost();
    case 'editpost':
      return editPost();
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

  async function getGroups() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/group/read`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: 'full',
        sort: {
          field: 'id',
          order: 'asc',
        },
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function getBoardList() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/read`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: null,
        mode: null,
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
    const filter =
      req.body.hasImage === 'grid'
        ? {
            field: 'extra_01',
            value: '1',
          }
        : {
            field: req.query.category === 'null' ? null : 'category_id',
            value: req.query.category === 'null' ? null : req.query.category,
          };
    let data: any = {
      board: req.query.board === 'null' ? null : req.query.board,
      paginate: {
        offset: offset,
        limit: limit,
      },
      sort: {
        field: 'created_at',
        order: 'DESC',
      },
      filter: filter,
      user: req.query.user,
      boardid: req.query.boardid,
    };
    if (req.body.search) {
      data['search'] = req.body.search;
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function getDraftPostList() {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user) {
        const limit = req.query.postsperpage ? req.query.postsperpage : 20;
        const offset = req.query.offset ? (parseInt(req.query.offset as string, 10) - 1) * parseInt(limit as string, 10) : 0;
        let data: any = {
          board: null,
          paginate: {
            offset: offset,
            limit: limit,
          },
          sort: {
            field: 'created_at',
            order: 'DESC',
          },
          filter: {
            field: 'status',
            value: 0,
          },
          search: {
            start: null,
            end: null,
            field: 'author',
            value: session?.user.username,
          },
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/list`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        return res.status(200).json(result);
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async function getPost() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/get/${req.body.id}`);
    const result = await response.json();
    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function deletePost() {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (session?.user) {
        await Promise.all(
          req.body.post.map(async (id: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/delete/${id}`, {
              method: 'DELETE',
              headers: { 'content-type': 'application/json' },
            });
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result.message);
            }
            return result;
          })
        );
        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  async function savePost() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/insert`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: req.body.title,
        content: await processContent(req.body.content),
        board: req.body.board,
        category: req.body.category === 0 ? null : req.body.category,
        flag: req.body.flag === 'null' ? null : req.body.flag,
        status: req.body.status,
        user: req.body.user,
        extra_01: haveImage === 1 ? 1 : 0,
        extra_02: haveImage === 1 ? `${process.env.NEXT_PUBLIC_AVATAR_URL}` + haveImageUrl : '',
      }),
    });

    const result = await response.json();
    haveImage = 0;
    haveImageUrl = '';
    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function editPost() {
    const processedContent = await processContent(req.body.content);
    let srcValue: string | undefined;
    const $ = cheerio.load(processedContent);
    const imgElement = $('img').first();

    if (imgElement.length) {
      srcValue = imgElement.attr('src');
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/post/update/${req.body.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: req.body.title,
        content: processedContent,
        board: req.body.board,
        status: req.body.status,
        category: req.body.category === 0 ? null : req.body.category,
        extra_01: haveImage === 1 || req.body.content.includes('<img') ? 1 : null,
        extra_02: haveImage === 1 || req.body.content.includes('<img') ? srcValue : null,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  async function getComments() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/board/comment/list`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        post: req.body.id,
        query: req.body.query,
        paginate: {
          offset: req.body.paginate.offset,
          limit: req.body.paginate.limit,
        },
        sort: {
          field: req.body.sort.field,
          order: req.body.sort.value,
        },
        user: req.body.user,
        boardid: req.body.boardid,
      }),
    });

    const result = await response.json();

    if (result) return res.status(200).json(result);

    return res.status(500);
  }

  // INSERT COMMENT
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
          board: req.body.board,
        }),
      });

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unexpected error' });
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
          action: req.body.action,
        }),
      });

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unexpected error' });
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
          type: req.body.type,
        }),
      });

      const data = await response.json();

      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unexpected error' });
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
      $(element).replaceWith(`<img src="${process.env.NEXT_PUBLIC_AVATAR_URL}${changedPath}" alt="Image" class='post-image' />`);
    } else if (src && src.startsWith(`${process.env.NEXT_PUBLIC_AVATAR_URL}`)) {
      $(element).replaceWith(`<img src="${src}" alt="Image" class='post-image' />`);
    }
  }
  let modifiedHtml = $.html(); // Get the modified HTML content with the root tags
  modifiedHtml = modifiedHtml.replace(/<\/?(html|head|body)[^>]*>/gi, ''); // Remove opening and closing tags of <html>, <head>, and <body>
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
