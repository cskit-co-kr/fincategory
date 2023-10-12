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
    const { channel, post } = req.body;
    const media = JSON.parse(post.media);
    const images = [];
    const stickers = [];
    const videos = [];
    const pdfs = [];
    const files = [];
    

    if (media._ === "messageMediaPhoto") {
      const photo = media.photo;
      const date1 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY-MM-DD_HH-mm-ss');
      const date2 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY/MM/DD');
      const thumb_sizes = photo.sizes?.filter((thumb: any) => thumb._ === "photoSize");
      const thumb_size = thumb_sizes?.length > 0 && thumb_sizes[thumb_sizes.length-1];
      const {w, h} = thumb_size;

      const foldername = `${channel.channel_id}/${date2}/${moment.utc(post.date).valueOf()}`;
      const fileName = `photo_${date1}.png`
      const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/2000/${foldername}/${fileName}`;
      images.push({url, w, h});

    } else if (media._ === "messageMediaDocument") {

      const document = media.document;
      const thumb_sizes = document.thumbs?.filter((thumb: any) => thumb._ === "photoSize");
      const thumb_size = thumb_sizes?.length > 0 && thumb_sizes[thumb_sizes.length-1];
      const {w, h} = thumb_size;

      const date2 = moment.utc(post.date).tz("Asia/Seoul").format('YYYY/MM/DD');

      const foldername = `${channel.channel_id}/${date2}/${moment.utc(post.date).valueOf()}`
      const fileattr = document.attributes.find((a: any) => a._ === "documentAttributeFilename");
      const fileName = fileattr ? `${fileattr.file_name}` : `${document.date}.png`;
      const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/static/${foldername}/${fileName}`;

      if (document.mime_type === "application/x-tgsticker") {
        stickers.push({url, w, h});

      } else if (document.mime_type === "video/webm" || document.mime_type === "video/mp4") {
        videos.push({url, w, h});

      } else if (document.mime_type === "image/webp") {
        const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/2000/${foldername}/${fileName}`;
        images.push({url, w, h});

      } else if (document.mime_type === "application/pdf" || document.mime_type === "text/plain"){
        files.push({url, fileName})
      }
    }
    res.status(200).json({ images, stickers, videos, files });
  }
}
