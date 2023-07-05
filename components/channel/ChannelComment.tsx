import { HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { FunctionComponent, useState } from 'react';
import { Avatar } from 'rsuite';
import { TypeAttributes } from 'rsuite/esm/@types/common';

import { toDateTimeformat } from '../../lib/utils';
import { CommentType } from '../../typings';
import axios from 'axios';

type TBoardComment = {
  comment: CommentType
  userID: number
  fncToast?: (type: TypeAttributes.Status, txt: string) => void
};

const ChannelComment: FunctionComponent<TBoardComment> = ({ comment, userID, fncToast = () => { } }) => {
  const [reaction, setReaction] = useState<string | null>(comment.reaction);

  // Count Comment Reaction
  const countCommentReaction = (mode: string) => {
    if (reaction === null) {
      return 0;
    } else {
      const reactionObj = JSON.parse(reaction);
      if (mode === 'like') {
        return reactionObj.like.length;
      }

      if (mode === 'dislike') {
        return reactionObj.dislike.length;
      }
    }
  }

  const handleCommentReaction = async (commentID: number, action: string, type: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/channel/comment/reaction/${commentID}`, {
      user: userID,
      comment: commentID,
      action: action,
      type: type
    });

    const result = response.data;

    if (result.code === 200) {
      setReaction(result.reaction);
    } else {
      fncToast('error', 'Error on Reaction Click');
    }
  }

  // Exists Comment Reaction
  const checkCommentReaction = (mode: string) => {
    if (reaction === null) {
      return false;
    } else {
      const reactionObj = JSON.parse(reaction);
      if (mode === 'like') {
        const idx = reactionObj.like.indexOf(userID);
        return idx > -1 ? true : false;
      }

      if (mode === 'dislike') {
        const idx = reactionObj.dislike.indexOf(userID);
        return idx > -1 ? true : false;
      }
    }
  }

  return (
    <div className='single-comment flex border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0'>
      <Avatar circle className='bg-gray-200 mr-[10px] leading-none' size='sm'>
        {comment.user.nickname.slice(0, 1)}
      </Avatar>
      <div className='flex flex-1 flex-col'>
        <div className='comment-content'>
          <p className='p-0 m-0 mb-[5px]'>
            <b>{comment.user.nickname}</b> | <span className='text-xs text-[#7A8486]'>{toDateTimeformat(comment.created_at, '.')}</span>
          </p>
          <p className='p-0 m-0 mb-[10px]'>{comment.comment}</p>
          <p className='flex p-0 m-0 text-xs text-[#7A8486]'>
            <span
              className='mr-[7px] cursor-pointer hover:text-blue-700'
              onClick={() => handleCommentReaction(comment.id, checkCommentReaction('like') ? 'remove' : 'add', 'like')}
            >
              <HandThumbUpIcon className={`w-4 ${checkCommentReaction('like') ? 'text-blue-600' : ''}`} />
            </span>
            <span className='mr-[12px]'>{countCommentReaction('like')}</span>
            <span
              className='mr-[7px] cursor-pointer hover:text-blue-700'
              onClick={() => handleCommentReaction(comment.id, checkCommentReaction('dislike') ? 'remove' : 'add', 'dislike')}
            >
              <HandThumbDownIcon className={`w-4 ${checkCommentReaction('dislike') ? 'text-blue-600' : ''}`} />
            </span>
            <span>{countCommentReaction('dislike')}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChannelComment