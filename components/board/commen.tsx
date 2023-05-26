import { Avatar } from "rsuite"
import { toDateTimeformat } from "../../lib/utils"
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/outline"
import { CommentType } from "../../typings"
import { FunctionComponent, useState } from "react"
import { TypeAttributes } from "rsuite/esm/@types/common"

type TBoardComment = {
  comment: CommentType
  userID: number
  reply: boolean
  fncComment?: (comment: CommentType) => void
  fncToast?: (type: TypeAttributes.Status, txt: string) => void
}

const BoardComment: FunctionComponent<TBoardComment> = ({ comment, userID, reply, fncComment = () => { }, fncToast = () => { } }) => {
  const [reaction, setReaction] = useState<string | null>(comment.reaction);
  // Count Comment Reaction 
  const countCommentReaction = (mode: string) => {
    if (reaction === null) {
      return 0;
    } else {
      const reactionObj = JSON.parse(reaction);
      if (mode === 'like') {
        return reactionObj.like.length
      }

      if (mode === 'dislike') {
        return reactionObj.dislike.length
      }
    }
  }

  const handleCommentReaction = async (commentID: number, action: string, type: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=commentReaction`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user: userID,
        comment: commentID,
        action: action,
        type: type
      }),
    });

    const result = await response.json();

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
    <div className='single-comment flex'>
      <Avatar circle className='bg-[#E7EAED] mr-[10px] leading-[0]'>
        {comment.user.nickname.slice(0, 1)}
      </Avatar>
      <div className='flex flex-1 flex-col'>
        <p className='p-0 m-0 mb-[5px] text-[13px]'>{comment.user.nickname} | <span className='text-xs text-[#7A8486]'>{toDateTimeformat(comment.created_at.toString(), '.')}</span></p>
        <p className='p-0 m-0 mb-[10px] text-[13px] font-medium'>{comment.comment}</p>
        <p className='flex p-0 m-0 text-xs text-[#7A8486]'>
          <span className='mr-[7px] cursor-pointer hover:text-blue-700' onClick={() => handleCommentReaction(comment.id, (checkCommentReaction('like') ? 'remove' : 'add'), 'like')}><HandThumbUpIcon className={`w-[16px] ${checkCommentReaction('like') ? 'text-blue-600' : ''}`} /></span>
          <span className='mr-[12px]'>{countCommentReaction('like')}</span>
          <span className='mr-[7px] cursor-pointer hover:text-blue-700' onClick={() => handleCommentReaction(comment.id, (checkCommentReaction('dislike') ? 'remove' : 'add'), 'dislike')}><HandThumbDownIcon className={`w-[16px] ${checkCommentReaction('dislike') ? 'text-blue-600' : ''}`} /></span>
          <span>{countCommentReaction('dislike')}</span>
          {reply ?
            <>
              <span className='inline-block bg-[#e5e5ea] h-full mx-[12px] w-[1px]' />
              <span onClick={() => fncComment(comment)} className='cursor-pointer hover:text-[#000]'>반신</span>
            </>
            :
            <></>
          }
        </p>
      </div>
    </div>
  )
}

export default BoardComment