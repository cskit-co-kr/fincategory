import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Dialog from "@mui/material/Dialog";

const Media = ({ channel, post }: any) => {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const getMediaData = { channel: channel, post: post };
  useEffect(() => {
    async function fetchMedia() {
      try {
        if (post.media.includes("photo") || post.media.includes("video")) {
          await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/media`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(getMediaData),
          })
            .then((response) => response.json())
            .then((data) => {
              setImages(data.backgroundImageUrls);
              setVideos(data.srcValues);
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
      {images?.length !== 0 || videos?.length !== 0 ? (
        <Box>
          <ImageList
            variant="masonry"
            cols={images?.length === 1 ? 1 : 2}
            gap={8}
          >
            {images?.map((url: any, index: number) => (
              <ImageListItem key={index}>
                <img
                  src={`${url}?w=248&fit=crop&auto=format`}
                  srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt=""
                  loading="lazy"
                  className="max-h-[360px] aspect-auto !object-contain cursor-pointer"
                  onClick={(event) => handleImageClick(event, url)}
                />
              </ImageListItem>
            ))}
            {videos?.length > 0 &&
              videos?.map((url: any, index: number) => (
                <ImageListItem key={index}>
                  <video src={url}></video>
                </ImageListItem>
              ))}
          </ImageList>
          <Dialog
            open={selectedImage !== undefined}
            onClose={() => setSelectedImage(undefined)}
          >
            <img src={selectedImage} alt="" />
          </Dialog>
        </Box>
      ) : (
        <div className="w-full h-[300px] bg-gray-500 flex items-center justify-center">
          ...Loading
        </div>
        // <div className='bg-gray-100 w-full h-44 flex place-content-center items-center rounded-md'>
        //   <PhotoIcon className='h-14 w-14 text-gray-300' />
        // </div>
      )}
    </>
  );
};

export default Media;
