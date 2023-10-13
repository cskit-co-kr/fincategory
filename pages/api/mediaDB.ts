// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const puppeteer = require('puppeteer');
var moment = require('moment-timezone');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return start();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function start() {
    try {

      const { channel, post } = req.body;
      const media = JSON.parse(post.media);
      const images = [];
      const stickers = [];
      const videos = [];
      const files = [];
      const audios = [];


      const file_mimetypes = [
        "multipart/",
        "text/",
        "application/",
        "font/",
      ]

      if (media._ === "messageMediaPhoto") {
        const photo = media.photo;
        const date1 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY-MM-DD_HH-mm-ss');
        const date2 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY/MM/DD');
        const thumb_sizes = photo.sizes?.filter((thumb: any) => thumb._ === "photoSize");
        const thumb_size = thumb_sizes?.length > 0 && thumb_sizes[thumb_sizes.length - 1];
        const { w, h } = thumb_size;

        const foldername = `${channel.channel_id}/${date2}/${moment.utc(post.date).valueOf()}`;
        const fileName = `photo_${date1}.png`
        const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/2000/${foldername}/${fileName}`;
        images.push({ url, w, h });

      } else if (media._ === "messageMediaDocument") {

        const document = media.document;
        const thumb_sizes = document.thumbs?.filter((thumb: any) => thumb._ === "photoSize");
        const thumb_size = thumb_sizes?.length > 0 && thumb_sizes[thumb_sizes.length - 1];
        const { w, h } = thumb_size;

        const date2 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY/MM/DD');
        const fileattr = document.attributes.find((a: any) => a._ === "documentAttributeFilename");

        const foldername = `${channel.channel_id}/${date2}/${moment.utc(post.date).valueOf()}`
        const fileName = fileattr ? fileattr.file_name : `${document.date}.png`;
        const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/static/${foldername}/${fileName}`;

        if(parseInt(document.size) < 10485863){
          files.push({ url: null, fileName, mime_type: document.mime_type })

        } else if (document.mime_type === "application/x-tgsticker") {
          stickers.push({ url, w, h, mime_type: document.mime_type });

        } else if (document.mime_type.includes('video/')) {
          videos.push({ url, w, h, mime_type: document.mime_type });

        } else if (document.mime_type.includes("image/")) {
          const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/2000/${foldername}/${fileName}`;
          images.push({ url, w, h, mime_type: document.mime_type });

        } else if (document.mime_type.includes("audio/")) {
          audios.push({ url, fileName, mime_type: document.mime_type });

        } else {
          const type = file_mimetypes.filter(type => document.mime_type.includes(type));
          if (type) {
            files.push({ url, fileName, mime_type: document.mime_type })
          }
        }
      }
      res.status(200).json({ audios, images, stickers, videos, files });
    } catch (err) {
      console.log(err);
      res.status(501).send(err)
    }

  }
}
