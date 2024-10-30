import { Avatar, Button } from "rsuite";
import { toDateTimeformat } from "../../lib/utils";
import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { CommentType } from "../../typings";
import { FunctionComponent, useEffect, useState } from "react";
// import { TypeAttributes } from "rsuite/esm/@types/common";

type Status = "success" | "error" | "warning" | "info";

type TBoardComment = {
  comment: CommentType;
  selectedComment: number;
  userID: number;
  postUserID: number;
  postID: number;
  boardID: number;
  postUserNickname: string;
  reply: boolean;
  fncToast?: (type: Status, txt: string) => void;
  fncLoadComment: () => void;
  fncSelectComment: (id: number) => void;
};

const BoardComment: FunctionComponent<TBoardComment> = ({
  comment,
  selectedComment,
  userID,
  postUserID,
  postID,
  boardID,
  postUserNickname,
  reply,
  fncToast = () => {},
  fncLoadComment = () => {},
  fncSelectComment = () => {},
}) => {
  const [content, setContent] = useState<string>("");
  const [reaction, setReaction] = useState<string | null>(comment.reaction);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  useEffect(() => {
    if (comment.id !== selectedComment) {
      setShowReply(false);
      setContent("");
    }
  }, [selectedComment]);

  // Count Comment Reaction
  const countCommentReaction = (mode: string) => {
    if (reaction === null) {
      return 0;
    } else {
      const reactionObj = JSON.parse(reaction);
      if (mode === "like") {
        return reactionObj.like.length;
      }

      if (mode === "dislike") {
        return reactionObj.dislike.length;
      }
    }
  };

  const handleCommentReaction = async (
    commentID: number,
    action: string,
    type: string
  ) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=commentReaction`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: userID,
          comment: commentID,
          action: action,
          type: type,
        }),
      }
    );

    const result = await response.json();

    if (result.code === 200) {
      setReaction(result.reaction);
    } else {
      fncToast("error", "Error on Reaction Click");
    }
  };

  // Exists Comment Reaction
  const checkCommentReaction = (mode: string) => {
    if (reaction === null) {
      return false;
    } else {
      const reactionObj = JSON.parse(reaction);
      if (mode === "like") {
        const idx = reactionObj.like.indexOf(userID);
        return idx > -1 ? true : false;
      }

      if (mode === "dislike") {
        const idx = reactionObj.dislike.indexOf(userID);
        return idx > -1 ? true : false;
      }
    }
  };

  // Save Comment
  const saveComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=insertcomment`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          comment: content.trim(),
          parent: comment.id,
          user: userID,
          post: postID,
          board: boardID,
        }),
      }
    );

    const result = await response.json();
    if (response.status === 200) {
      if (result.code === 201 && result.message === "Inserted") {
        setShowReply(false);
        fncToast("info", "댓글 등록 되었습니다.");
        setContent("");
        fncLoadComment();
      }
    } else {
      fncToast("error", "댓글 등록 실패하였습니다.");
    }
  };

  // Edit Comment
  const editComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board/edit-comment`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          comment: comment.id,
          content: content,
          user: userID,
        }),
      }
    );

    const result = await response.json();

    if (result.code === 201 && result.message === "Updated") {
      setShowEdit(false);
      setShowReply(false);
      fncToast("info", "댓글 수정되었습니다.");
      setContent("");
      fncLoadComment();
    } else {
      fncToast("error", "댓글 수정 실패하였습니다.");
    }
  };

  // Delete Comment
  const deleteComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board/delete-comment`,
      {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          comment: comment.id,
          user: userID,
        }),
      }
    );

    const result = await response.json();

    if (result.code === 201 && result.message === "Deleted") {
      setShowReply(false);
      fncToast("info", "댓글 삭제되었습니다.");
      setContent("");
      fncLoadComment();
    } else {
      fncToast("error", "댓글 삭제 실패하였습니다.");
    }
  };

  return (
    <div className="single-comment flex">
      <Avatar circle className="bg-gray-200 mr-[10px] leading-none" size="sm">
        {comment.user.nickname.slice(0, 1)}
      </Avatar>
      <div className="flex flex-1 flex-col">
        <div className="comment-content relative">
          {comment.user.id === userID && (
            <div className="absolute right-0 top-0 flex gap-1 text-[10px]">
              <button
                onClick={() => {
                  setShowEdit((prev) => !prev);
                  setContent(comment.comment);
                }}
                className="flex items-center gap-1 whitespace-nowrap border border-gray-200 rounded-md px-2 py-1 hover:underline"
              >
                <PencilIcon className="h-3" />
                수정
              </button>
              <button
                onClick={deleteComment}
                className="flex items-center gap-1 whitespace-nowrap border border-gray-200 rounded-md px-2 py-1 hover:underline"
              >
                <TrashIcon className="h-3" />
                삭제
              </button>
            </div>
          )}
          <p className="p-0 m-0 mb-[5px]">
            <b>{comment.user.nickname}</b>{" "}
            {postUserNickname === comment.user.nickname && (
              <span className="rounded-full bg-sky-200 px-1 py-[1px] text-[10px] text-sky-700">
                작성자
              </span>
            )}{" "}
            |{" "}
            <span className="text-xs text-[#7A8486]">
              {toDateTimeformat(comment.created_at, ".")}
            </span>
          </p>
          <p className="p-0 m-0 mb-[10px]">{comment.comment}</p>
          <p className="flex p-0 m-0 text-xs text-[#7A8486]">
            <span
              className="mr-[7px] cursor-pointer hover:text-blue-700"
              onClick={() =>
                handleCommentReaction(
                  comment.id,
                  checkCommentReaction("like") ? "remove" : "add",
                  "like"
                )
              }
            >
              <HandThumbUpIcon
                className={`w-4 ${
                  checkCommentReaction("like") ? "text-blue-600" : ""
                }`}
              />
            </span>
            <span className="mr-[12px]">{countCommentReaction("like")}</span>
            <span
              className="mr-[7px] cursor-pointer hover:text-blue-700"
              onClick={() =>
                handleCommentReaction(
                  comment.id,
                  checkCommentReaction("dislike") ? "remove" : "add",
                  "dislike"
                )
              }
            >
              <HandThumbDownIcon
                className={`w-4 ${
                  checkCommentReaction("dislike") ? "text-blue-600" : ""
                }`}
              />
            </span>
            <span>{countCommentReaction("dislike")}</span>
            {reply ? (
              <>
                <span className="bg-[#e5e5ea] h-4 mx-3 w-[1px]" />
                <span
                  onClick={() => {
                    setShowReply(true);
                    fncSelectComment(comment.id);
                  }}
                  className="cursor-pointer hover:text-black"
                >
                  댓글
                </span>
                {showReply ? (
                  <span
                    onClick={() => {
                      setShowReply(false);
                      setContent("");
                    }}
                    className="cursor-pointer hover:text-black ml-3"
                  >
                    취소
                  </span>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </p>
        </div>
        <div
          className={`comment-reply mt-5 ${
            showReply || showEdit ? "block" : "hidden"
          }`}
        >
          <textarea
            className="border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-md focus:outline-none"
            onChange={(e) => setContent(e.currentTarget.value)}
            value={content}
            name="textarea"
          />
          <Button
            appearance="primary"
            className="bg-primary text-white py-2 px-5 text-center hover:text-white"
            disabled={content.trim().length > 0 ? false : true}
            onClick={showEdit ? editComment : saveComment}
          >
            등록
          </Button>
          <button
            className="ml-1 rounded-md border border-gray-200 px-4 py-2"
            onClick={() => {
              setContent("");
              setShowEdit(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardComment;
