import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';
var moment = require('moment-timezone');
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { FaCaretDown, } from 'react-icons/fa';
import { BiSolidDownload } from 'react-icons/bi';

import { Loader } from 'rsuite';
import axios from 'axios';
import Link from 'next/link';

const Media = ({ channel, post }: any) => {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [stickers, setStickers] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  const getMediaData = { channel: channel, post: post };

  useEffect(() => {
    async function fetchMedia() {
      try {
        if (post.media) {
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
              setFiles(data.files);
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
      {images?.length !== 0 || videos?.length !== 0 || stickers?.length !== 0 || files?.length !== 0 ? (
        <Box>
          <ImageList variant='masonry' cols={images?.length === 1 ? 1 : 2} gap={8}>
            {images?.map(({ url, w, h }: any, index: number) => (
              <ImageListItem key={index}>
                <img
                  src={`${url}`}
                  srcSet={`${url}`}
                  alt=''
                  loading='lazy'
                  style={{ width: w, height: h }}
                  className='max-h-[360px] aspect-auto !object-contain cursor-pointer'
                  onClick={(event) => handleImageClick(event, url)}
                />
              </ImageListItem>
            ))}
            {stickers?.length > 0 &&
              stickers?.map(({ url, w, h }: any, index: number) => (
                <tgs-player key={index} autoplay loop mode="normal" src={url} style={{ width: 250, height: 250 }}>
                </tgs-player>
              ))}

            {videos?.length > 0 &&
              videos?.map(({ url, w, h }: any, index: number) => (
                <ImageListItem key={index}>
                  <video autoPlay loop src={url}></video>
                </ImageListItem>
              ))}

            {files?.length > 0 &&
              files?.map(({ url, fileName }: any, index: number) => (
                <div className='flex flex-row justify-start'>
                  <p className='font-semibold'>{fileName}</p>
                  <Link href={url} target='#'>
                    <BiSolidDownload size={14} className='m-1 cursor-pointer hover:text-blue-500' color='#ccc' />
                  </Link>
                </div>
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
