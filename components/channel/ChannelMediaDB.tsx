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
          await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/mediaDB`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(getMediaData),
          })
            .then((response) => response.json())
            .then((data) => {
              setImages(data.images);
              setVideos(data.videos);
              setStickers(data.stickers);
            });
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
            {images?.map(({url, w, h}: any, index: number) => (
              <ImageListItem key={index}>
                <img
                  src={`${url}`}
                  srcSet={`${url}`}
                  alt=''
                  loading='lazy'
                  style={{width: w, height: h}}
                  className='max-h-[360px] aspect-auto !object-contain cursor-pointer'
                  onClick={(event) => handleImageClick(event, url)}
                />
              </ImageListItem>
            ))}
            {stickers?.length > 0 &&
              stickers?.map(({url, w, h}: any, index: number) => (
                  <tgs-player key={index} autoplay loop mode="normal" src={url} style={{width: 250, height: 250}}>
                  </tgs-player>
              ))}

            {videos?.length > 0 &&
              videos?.map(({url, w, h}: any, index: number) => (
                <ImageListItem key={index}>
                  <video autoPlay loop src={url} style={{width: w, height: h}}></video>
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
