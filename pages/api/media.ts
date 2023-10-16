// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
const puppeteer = require('puppeteer');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return start();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function start() {
    const executablePath = process.env.IS_LOCAL === 'true' ? null : process.env.PUPPETEER_EXECUTABLE_PATH;
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'],  executablePath });
    const page = await browser.newPage();
    await page.goto(`https://t.me/${req.body.channel.username}/${req.body.post.id}?embed=1&mode=tme`);
    const elementExists = (await page.$('.tgme_widget_message_photo_wrap')) !== null;
    const elementExists2 = (await page.$('.tgme_widget_message_video')) !== null;
    if (elementExists !== false) {
      try {
        await page.waitForSelector('.tgme_widget_message_photo_wrap');
        const backgroundImageUrls = await page.$$eval('.tgme_widget_message_photo_wrap', (elements: any) => {
          return elements.map((element: any) => {
            const style = window.getComputedStyle(element);
            return style.backgroundImage.slice(4, -1).replace(/['"]/g, '');
          });
        });
        res.status(200).json({ backgroundImageUrls });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    } else if (elementExists2 !== false) {
      try {
        await page.waitForSelector('.tgme_widget_message_video');
        const srcValues = await page.$$eval('video[src]', (videos: any) => videos.map((video: any) => video.getAttribute('src')));
        res.status(200).json({ srcValues });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    } else {
      res.status(200).json('no');
    }
    await browser.close();
    //res.status(500).json('no');
  }
}
