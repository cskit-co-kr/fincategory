import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Dialog from '@mui/material/Dialog';

import { Loader } from 'rsuite';

const Media = ({ medias }: any) => {
  const [selectedImage, setSelectedImage] = useState(undefined);
  
  const handleImageClick = (event: any, image: any) => {
    setSelectedImage(image);
  }

  return (
    <>
      {medias?.length !== 0 ? (
        <Box>
          <ImageList variant='masonry' cols={medias?.length === 1 ? 1 : 2} gap={8}>
            {medias.map((media: any, index: number) => (
              <ImageListItem key={index}>
                {media.type === 'image' ?
                  <img
                    src={`${media.url}?w=248&fit=crop&auto=format`}
                    srcSet={`${media.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt=''
                    loading='lazy'
                    className='max-h-[360px] aspect-auto !object-contain cursor-pointer'
                    onClick={(event) => handleImageClick(event, media.url)}
                  /> : <></>
                }
                {media.type === 'video' ?
                  <video src={media.url}></video> : <></>
                }
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
