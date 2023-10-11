import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';
var moment = require('moment-timezone');
import * as LottiePlayer from "@lottiefiles/lottie-player";

import { Loader } from 'rsuite';

const Media = ({ channel, post }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const getMediaData = { channel: channel, post: post };

  useEffect(() => {
    async function fetchMedia() {
      try {
        if (post.media.includes('photo') || post.media.includes('video')) {
          const media = JSON.parse(post.media);
          console.log(media);
          if (media._ === "messageMediaPhoto") {
            const photo = media.photo;
            const date1 = moment(photo.date * 1000).tz("Asia/Seoul").format('YYYY-MM-DD_HH-mm-ss');
            const date2 = moment(photo.date * 1000).tz("Asia/Seoul").format('YYYY/MM/DD');

            const fileName = `photo_${date1}.png`
            const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/1000/${channel.channel_id}/${date2}/${fileName}`;
            setImages([url]);
          } else if (media._ === "messageMediaDocument") {

            const document = media.document;
            const foldername = `${channel.channel_id}/${moment(document.date * 1000).tz("Asia/Seoul").format('YYYY/MM/DD')}`
            const fileattr = document.attributes.find((a: any) => a._ === "documentAttributeFilename");
            const fileName = fileattr ? fileattr.file_name : `${document.date}.png`;
            const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}/static/${foldername}/${fileName}`;


            if (document.mime_type === "application/x-tgsticker") {
              setStickers([url]);
            } else if (document.mime_type === "video/webm") {
              setVideos([url]);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchMedia();
  }, []);

  const [selectedImage, setSelectedImage] = useState(undefined);
  const handleImageClick = (event: any, image: any) => {
    setSelectedImage(image);
  };

  return (
    <>
      {images?.length !== 0 || videos?.length !== 0 || stickers?.length !== 0 ? (
        <Box>
          <ImageList variant='masonry' cols={images?.length === 1 ? 1 : 2} gap={8}>
            {images?.map((url: any, index: number) => (
              <ImageListItem key={index}>
                <img
                  src={`${url}?w=248&fit=crop&auto=format`}
                  srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt=''
                  loading='lazy'
                  className='max-h-[360px] aspect-auto !object-contain cursor-pointer'
                  onClick={(event) => handleImageClick(event, url)}
                />
              </ImageListItem>
            ))}
            {stickers?.length > 0 &&
              stickers?.map((url: any, index: number) => (
                  <tgs-player key={index} autoplay loop mode="normal" src={url} style={{width: 300, height: 300}}>
                  </tgs-player>
              ))}

            {videos?.length > 0 &&
              videos?.map((url: any, index: number) => (
                <ImageListItem key={index}>
                  <video autoPlay loop src={url}></video>
                </ImageListItem>
              ))}


          </ImageList>
          <Dialog open={selectedImage !== undefined} onClose={() => setSelectedImage(undefined)}>
            <img src={selectedImage} alt='' />
          </Dialog>
        </Box>
      ) : (
        <div className='w-full h-[300px] flex items-center justify-center bg-gray-100'>
          <Loader size='sm' content='loading media...' />
        </div>
      )}
    </>
  );
};

export default Media;
