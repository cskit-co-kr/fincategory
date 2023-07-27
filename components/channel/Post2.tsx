import React, { useEffect, useState } from 'react';

const Post2 = ({ post }: any) => {
  return (
    <div
      className='w-[640px]'
      dangerouslySetInnerHTML={{
        __html: post.post,
      }}
    ></div>
  );
};

export default Post2;
