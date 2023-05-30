import { Avatar, Button } from "rsuite"
import { toDateTimeformat } from "../../lib/utils"
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/outline"
import { CommentType } from "../../typings"
import { FunctionComponent, useEffect, useState } from "react"
import { TypeAttributes } from "rsuite/esm/@types/common"

type TBoardComment = {
  comment: CommentType
  selectedComment: number
  userID: number
  postID: number
  boardID: number
  reply: boolean
  fncToast?: (type: TypeAttributes.Status, txt: string) => void
  fncLoadComment: () => void
  fncSelectComment: (id: number) => void
}

const BoardComment: FunctionComponent<TBoardComment> = ({ comment, selectedComment, userID, postID, boardID, reply, fncToast = () => { }, fncLoadComment = () => { }, fncSelectComment = () => { } }) => {
  const [content, setContent] = useState<string>('');
  const [reaction, setReaction] = useState<string | null>(comment.reaction);
  const [showReply, setShowReply] = useState<boolean>(false);

  useEffect(() => {
    if (comment.id !== selectedComment) {
      setShowReply(false);
      setContent('');
    }
  }, [selectedComment]);

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

  // Save Comment 
  const saveComment = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=insertcomment`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        comment: content.trim(),
        parent: comment.id,
        user: userID,
        post: postID,
        board: boardID
      })
    });

    const result = await response.json();

    if (response.status === 200) {
      if (result.code === 201 && result.message === 'Inserted') {
        setShowReply(false);
        fncToast('info', 'Your comment has been successfully saved.');
        setContent('');
        fncLoadComment();
      }
    } else {
      fncToast('error', 'An error occurred while trying to save your comment.');
    }
  }

  return (
    <div className='single-comment flex'>
      <Avatar circle className='bg-[#E7EAED] mr-[10px] leading-[0]'>
        {comment.user.nickname.slice(0, 1)}
      </Avatar>
      <div className='flex flex-1 flex-col'>
        <div className="comment-content">
          <p className='p-0 m-0 mb-[5px] text-[13px]'>{comment.user.nickname} | <span className='text-xs text-[#7A8486]'>{toDateTimeformat(comment.created_at, '.')}</span></p>
          <p className='p-0 m-0 mb-[10px] text-[13px] font-medium'>{comment.comment}</p>
          <p className='flex p-0 m-0 text-xs text-[#7A8486]'>
            <span className='mr-[7px] cursor-pointer hover:text-blue-700' onClick={() => handleCommentReaction(comment.id, (checkCommentReaction('like') ? 'remove' : 'add'), 'like')}><HandThumbUpIcon className={`w-[16px] ${checkCommentReaction('like') ? 'text-blue-600' : ''}`} /></span>
            <span className='mr-[12px]'>{countCommentReaction('like')}</span>
            <span className='mr-[7px] cursor-pointer hover:text-blue-700' onClick={() => handleCommentReaction(comment.id, (checkCommentReaction('dislike') ? 'remove' : 'add'), 'dislike')}><HandThumbDownIcon className={`w-[16px] ${checkCommentReaction('dislike') ? 'text-blue-600' : ''}`} /></span>
            <span>{countCommentReaction('dislike')}</span>
            {reply ?
              <>
                <span className='bg-[#e5e5ea] h-[16px] mx-[12px] w-[1px]' />
                <span onClick={() => { setShowReply(true); fncSelectComment(comment.id) }} className='cursor-pointer hover:text-[#000]'>댓글</span>
                {showReply ? <span onClick={() => { setShowReply(false); setContent('') }} className='cursor-pointer hover:text-[#000] ml-[12px]'>취소</span> : <></>}
              </>
              :
              <></>
            }
          </p>
        </div>
        <div className={`comment-reply mt-[20px] ${showReply ? 'block' : 'hidden'}`}>
          <textarea className='border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none' onChange={(e) => setContent(e.currentTarget.value)} value={content} />
          <Button appearance='primary' className='bg-primary text-white py-2 px-5 text-center hover:text-white' disabled={content.trim().length > 0 ? false : true} onClick={saveComment}>
            글쓰기
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BoardComment