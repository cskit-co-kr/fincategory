import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  HeartIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import ChatBubbleOvalLeftEllipsisIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftEllipsisIcon";
import { TbPhotoCircle, TbHeartFilled } from "react-icons/tb";
import { PiChatCircleTextLight } from "react-icons/pi";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import { getCookie, setCookie } from "cookies-next";
import { InferGetServerSidePropsType, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Avatar, Button, Message, Modal, Pagination, useToaster } from "rsuite";
// import { TypeAttributes } from "rsuite/esm/@types/common";
import { PlacementType } from "rsuite/esm/toaster/ToastContainer";

import BoardSidebar from "../../../components/board/BoardSidebar";
import ButtonLink from "../../../components/board/buttonLink";

import { enUS } from "../../../lang/en-US";
import { koKR } from "../../../lang/ko-KR";

import { formatDate, getHrefValue, toDateTimeformat } from "../../../lib/utils";
import { CommentType, PostType } from "../../../typings";

import "react-quill/dist/quill.snow.css";
import LinkPreview from "../../../components/board/LinkPreview";
import BoardComment from "../../../components/board/comment";

type Status = "success" | "error" | "warning" | "info";

export type HTMLElementCustom = HTMLElement & { showModal: () => {} };
const Post: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();

  // const [postList, setPostList] = useState(props.postList);
  const [postList, setPostList] = useState<any>([]);

  const post: PostType = props.post;
  const prevNext = props.prevNext;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [commentTotal, setCommenTotal] = useState<number>(props.comments.total);
  // const [commentTopTotal, setCommentTopTotal] = useState<number>(props.comments.topTotal);
  // const [commentList, setCommentList] = useState<Array<CommentType>>(props.comments.comments);

  const [commentTotal, setCommenTotal] = useState<number>(0);
  const [commentTopTotal, setCommentTopTotal] = useState<number>(0);
  const [commentList, setCommentList] = useState<Array<CommentType>>([]);

  const [selectedComment, setSelectedComment] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [reaction, setReaction] = useState<boolean>(false);
  const [reactionTotal, setReactionTotal] = useState<number>(
    props.reactionTotal
  );

  const [placement, setPlacement] = useState<PlacementType>("topEnd");

  const [commentPage, setCommentPage] = useState<number>(1);
  const [commentPerPage, setCommentPerPage] = useState<number>(10);
  const [postPage, setPostPage] = useState<number>(parseInt(props.page));
  const [postPerPage, setPostPerPage] = useState<number>(
    parseInt(props.perPage)
  );

  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;

  const toaster = useToaster();

  const commentListRef = useRef<HTMLDivElement | null>(null);
  const commentWriteRef = useRef<HTMLDivElement | null>(null);
  const [memberInfo, setMemberInfo] = useState<any>();
  const message = (type: Status, message: string) => (
    <Message showIcon type={type} closable>
      {message}
    </Message>
  );

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    getUser();
    setCookie("postboardname", post.board.name);
    if (post.reaction === null) {
      setReaction(false);
    } else {
      const reaction = JSON.parse(post.reaction);
      const idx = reaction.indexOf(session?.user.id);

      if (idx > -1) {
        setReaction(true);
      } else {
        setReaction(false);
      }
    }
  }, [session]);

  useEffect(() => {
    loadComments();
  }, [commentPage, router]);

  const toastShow = (type: Status, txt: string) => {
    const options = { placement, duration: 5000 };
    toaster.push(message(type, txt), options);
  };

  // Load Comments
  const loadComments = async () => {
    setCommentLoading(true);
    const currentSession = await getSession();
    const responseComment = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getcomments`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: router.query.id,
          query: null,
          paginate: {
            offset: (commentPage - 1) * commentPerPage,
            limit: commentPerPage,
          },
          sort: {
            field: "created_at",
            value: "ASC",
          },
          user: currentSession?.user.id,
          boardid: post.board.id,
        }),
      }
    );
    const data = await responseComment.json();

    setCommenTotal(data.total);
    setCommentTopTotal(data.topTotal);
    setCommentList(data.comments);
    setCommentLoading(false);
  };

  // Post URL copy to clipboard
  const handleUrlToClipboard = async () => {
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(window.location.toString());
    } else {
      document.execCommand("copy", true, window.location.toString());
    }
    toastShow("info", t["post-url-copied"]);
  };

  // Save Comment
  const saveComment = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=insertcomment`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          comment: comment,
          parent: 0,
          user: Number(session?.user.id),
          post: router.query.id,
          board: post.board.id,
        }),
      }
    );
    const result = await response.json();

    if (response.status === 200) {
      if (result.code === 201 && result.message === "Inserted") {
        toastShow("info", t["comment-saved"]);
        setComment("");
        loadComments();
      }
    } else {
      toastShow("error", t["login-to-comment"]);
    }
  };

  // Go to Comment List
  const handleGotoComment = () => {
    commentListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleReaction = async (action: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=postReaction`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user: Number(session?.user.id),
          post: router.query.id,
          action: action,
        }),
      }
    );
    const result = await response.json();

    if (result.code === 200) {
      if (result.message === "add") {
        setReaction(true);
        setReactionTotal(reactionTotal + 1);
      } else {
        setReaction(false);
        setReactionTotal(reactionTotal - 1);
      }
    } else {
      toastShow("error", t["error-save-reaction"]);
    }
  };

  const deletePost = async () => {
    if (session?.user.id === post.user.id || memberInfo?.member?.type === 2) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=deletepost`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            post: [post.id],
          }),
        }
      );
      const result = await response.json();
      if (result.success === true) {
        router.push("/board");
      }
    } else {
      return alert("permission error");
    }
  };

  // Get Posts List
  const [isLoading, setIsLoading] = useState(false);
  const [clickCheck, setClickCheck] = useState(false);
  const getPostsList = async () => {
    setIsLoading(true);
    const board = post.board.name;
    const category = "null";
    const currentSession = await getSession();
    const responsePost = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}&postsperpage=${postPerPage}&offset=${postPage}&user=${currentSession?.user.id}&boardid=${post.board.id}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
      }
    );
    const postList = await responsePost.json();
    setPostList(postList);
    setIsLoading(false);
  };

  const onChangeComment = (e: any) => {
    if (session?.user) {
      setComment(e.currentTarget.value);
    } else {
      const element: HTMLElementCustom | null = document.getElementById(
        "my_modal_1"
      ) as HTMLElementCustom;
      element?.showModal();
    }
  };
  const getUser = async () => {
    const currentSession = await getSession();
    // console.log('session id------------------->' + currentSession?.user.id);

    if (currentSession?.user) {
      const responseMember = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${currentSession?.user.id}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
        }
      );
      let u = await responseMember.json();
      setMemberInfo(u);
    }
  };
  useEffect(() => {
    setClickCheck((prev) => !prev);
  }, [postPage]);

  useEffect(() => {
    getPostsList();
  }, [clickCheck]);

  return (
    <>
      <NextSeo
        title={`핀카텔레 | ${post.title}`}
        titleTemplate={`${post.title}--AI 관련 코인 어플깔아두기만해도 쌓이는거발견`}
        description={
          post.content?.substring(0, 120).replace(/<\/?p>/g, "") + "..."
        }
      />
      <Modal
        backdrop="static"
        role="alertdialog"
        open={open}
        onClose={handleClose}
        size="xs"
      >
        <Modal.Body>게시글을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer className="flex place-content-end gap-2">
          <button
            onClick={deletePost}
            className="bg-primary px-4 py-2 rounded-md text-white hover:underline"
          >
            Yes
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-200 px-4 py-2 rounded-md hover:underline"
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
      <div className="flex gap-[14px] md:pt-7 bg-gray-50">
        {/* Sidebar */}
        {/* <BoardSidebar memberInfo={props.memberInfo} /> */}
        <BoardSidebar memberInfo={memberInfo} />
        {/* Main */}
        <div className="flex-1 flex flex-col">
          <div className="hidden md:flex items-center justify-between mb-4">
            <div className="text-xl font-bold">{post.board.title}</div>
            <div className="flex justify-end gap-[10px]">
              <ButtonLink
                url={
                  prevNext.prev !== null ? `/board/post/${prevNext.prev}` : "#"
                }
                text="이전글"
                icon={<ChevronUpIcon className="h-3" />}
              />
              <ButtonLink
                url={
                  prevNext.next !== null ? `/board/post/${prevNext.next}` : "#"
                }
                text="다음글"
                icon={<ChevronDownIcon className="h-3" />}
              />
              <ButtonLink url={`/board/${post.board.name}`} text="목록" />
            </div>
          </div>
          <div className="md:border border-gray-200 bg-white rounded-md p-4 md:p-[30px] shadow-sm">
            <div className="border-b border-gray-200 mb-4 pb-2 flex items-center">
              <div className="post-header flex flex-1 flex-col">
                <div className="title text-[24px] font-normal mb-[26px] break-all md:break-normal">
                  {post.title}
                </div>
                <div className="flex">
                  <div className="avatar mr-2.5">
                    <Avatar circle className="bg-gray-200 pt-1.5 text-center">
                      {post.user?.nickname.slice(0, 1)}
                    </Avatar>
                  </div>
                  <div className="username flex flex-col">
                    <p className="m-0 p-0 text-[14px] leading-[16px] font-medium">
                      {post.user?.nickname} [{post.user?.username}]
                    </p>
                    <p className="m-0 pt-[5px] text-[13px] leading-[16px] text-[#949494]">
                      {toDateTimeformat(post.created_at, ".")} 조회 {post.views}
                    </p>
                  </div>
                  <div className="right ml-auto self-center md:flex items-center">
                    <div className="flex mb-2 md:mb-0">
                      <div className="flex gap-2 items-center">
                        <ChatBubbleOvalLeftEllipsisIcon className="h-5" />
                        <span
                          className="text-[12px] pr-2 cursor-pointer hover:text-[#000]"
                          onClick={handleGotoComment}
                        >
                          댓글 {commentTotal}
                        </span>
                      </div>
                      <span>
                        URL{" "}
                        <span
                          className="cursor-pointer hover:text-[#000]"
                          onClick={handleUrlToClipboard}
                        >
                          복사
                        </span>
                      </span>
                    </div>
                    {session?.user &&
                      (session?.user.id === post.user?.id ||
                        session?.user.type === 2) && (
                        <div className="md:flex gap-2 ml-2">
                          <ButtonLink
                            url={`/board/write?board=${post.board.name}&mode=edit&id=${post.id}`}
                            text={t["edit"]}
                            icon={<PencilIcon className="h-3" />}
                          />
                          <button
                            className="flex whitespace-nowrap gap-1 md:gap-[10px] items-center h-[35px] px-5 bg-white border border-[#d9d9d9] rounded-[5px] text-black text-[13px] hover:text-primary"
                            onClick={handleOpen}
                          >
                            <TrashIcon className="h-3" />
                            {t["delete"]}
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: post.content as string,
              }}
              className="break-all md:break-words text-base leading-[23px] board-content"
            />
            <LinkPreview url={getHrefValue(post.content as string)} />
            <div className="flex items-center mt-14 mb-[30px]">
              <Avatar
                circle
                className="bg-gray-200 mr-[10px] leading-none"
                size="sm"
              >
                {post.user?.nickname.slice(0, 1)}
              </Avatar>
              <button
                onClick={() =>
                  router
                    .push(`/board?member=${post.user?.nickname}&show=posts`)
                    .then(() =>
                      router.push(
                        `/board?member=${post.user?.nickname}&show=posts`
                      )
                    )
                }
                className="flex text-black hover:underline items-center"
              >
                <span className="mr-[8px]">
                  {post.user?.nickname}님의 게시글 더보기
                </span>{" "}
                <ChevronRightIcon className="w-[10px]" />
              </button>
            </div>
            <div className="comment" ref={commentListRef}>
              <div className="flex border-b border-gray-200 pb-[14px]">
                <span
                  className="mr-[7px] cursor-pointer"
                  onClick={() => handleReaction(reaction ? "remove" : "add")}
                >
                  <HeartIcon
                    className={`w-[18px] ${reaction ? "text-red-500" : ""}`}
                  />
                </span>
                <span className="text-[12px] pr-2">좋아요 {reactionTotal}</span>
                <span className="mr-[7px]">
                  <ChatBubbleOvalLeftEllipsisIcon className="w-[18px]" />
                </span>
                <span className="text-[12px] pr-2">댓글 {commentTotal}</span>
              </div>
              {commentTotal === 0 ? (
                <></>
              ) : (
                <div className="comment-list mt-[20px] text-base md:text-sm">
                  <p className="font-bold text-[17px] mb-[20px]">댓글</p>
                  <ul className="relative overflow-hidden">
                    {commentList.map((comment: CommentType, idx: number) => (
                      <li
                        key={idx}
                        className="border-b border-[#e4e4e4] pb-4 mb-4"
                      >
                        <BoardComment
                          comment={comment}
                          selectedComment={selectedComment}
                          userID={Number(session?.user.id)}
                          postUserID={post.user.id}
                          postID={post.id}
                          boardID={post.board.id}
                          postUserNickname={post.user.nickname}
                          reply={true}
                          fncToast={toastShow}
                          fncLoadComment={loadComments}
                          fncSelectComment={setSelectedComment}
                        />
                        {comment.child?.length === 0 ? (
                          <></>
                        ) : (
                          <ul className="ml-5">
                            {comment.child?.map(
                              (child: CommentType, idxx: number) => (
                                <li key={idxx} className="mt-4">
                                  <BoardComment
                                    comment={child}
                                    selectedComment={selectedComment}
                                    userID={Number(session?.user.id)}
                                    postUserID={post.user.id}
                                    postID={post.id}
                                    boardID={post.board.id}
                                    postUserNickname={post.user.nickname}
                                    reply={true}
                                    fncToast={toastShow}
                                    fncLoadComment={loadComments}
                                    fncSelectComment={setSelectedComment}
                                  />
                                  {child.child?.length === 0 ? (
                                    <></>
                                  ) : (
                                    <ul className="ml-5">
                                      {child.child?.map(
                                        (
                                          grandchild: CommentType,
                                          idxx: number
                                        ) => (
                                          <li key={idxx} className="mt-4">
                                            <BoardComment
                                              comment={grandchild}
                                              selectedComment={selectedComment}
                                              userID={Number(session?.user.id)}
                                              postUserID={post.user.id}
                                              postID={post.id}
                                              boardID={post.board.id}
                                              postUserNickname={
                                                post.user.nickname
                                              }
                                              reply={false}
                                              fncToast={toastShow}
                                              fncLoadComment={loadComments}
                                              fncSelectComment={
                                                setSelectedComment
                                              }
                                            />
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </li>
                    ))}
                    <li
                      className={`${
                        commentLoading ? "flex" : "hidden"
                      } bg-white opacity-80 absolute left-0 top-0 right-0 bottom-0 justify-center items-center`}
                    >
                      <SpinnerIcon pulse style={{ fontSize: "2em" }} />
                    </li>
                  </ul>
                </div>
              )}
              <div
                className={`flex flex-col bg-[#F9F9F9] rounded-lg p-[20px] mt-[30px]`}
              >
                {commentTopTotal > 0 ? (
                  <div className="paginate flex w-full border-b border-[#E4E4E4] justify-center pb-[20px]">
                    <Pagination
                      last
                      first
                      total={commentTopTotal}
                      limit={commentPerPage}
                      activePage={commentPage}
                      onChangePage={setCommentPage}
                      disabled={commentLoading}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div
                  className="comment-write text-center"
                  ref={commentWriteRef}
                >
                  <textarea
                    className="border border-[#ccc] resize-none h-24 p-2 w-full mb-2 rounded-[5px] focus:outline-none"
                    onChange={onChangeComment}
                    value={comment}
                    name="textarea"
                  />
                  <Button
                    appearance="primary"
                    className="bg-primary text-white py-2 px-5 text-center hover:text-white"
                    disabled={comment.trim().length > 0 ? false : true}
                    onClick={saveComment}
                  >
                    등록
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-[10px] mt-[16px] mr-4 md:mr-0">
            <ButtonLink url={`/board/${post.board.name}`} text="목록" />
            <span
              onClick={handleScrollTop}
              className="flex gap-[10px] items-center h-[35px] px-[10px] bg-white border border-[#d9d9d9] rounded-[5px] text-black text-[13px] cursor-pointer hover:text-[#0a5dc2] hover:no-underline"
            >
              <ChevronUpIcon className="h-3" />
              <span className="flex-1">TOP</span>
            </span>
          </div>
          <div className="post-list-wrapper">
            <p className="font-bold text-[17px] mb-[20px] ml-4 md:ml-0">
              전체글
            </p>
            <div className="post-list border-t border-gray-400 text-base md:text-xs">
              <div className="w-full">
                <div className="border-b border-gray-200 hidden md:flex font-bold">
                  <div className="text-center p-2 min-w-[80px]">
                    {postList.board ? "말머리" : ""}
                  </div>
                  <div className="text-center p-2 flex-grow">제목</div>
                  <div className="text-left p-2 min-w-[128px]">작성자</div>
                  <div className="text-center p-2 min-w-[96px]">작성일</div>
                  <div className="text-center p-2 min-w-[48px]">조회</div>
                </div>
                <div className="">
                  {postList?.posts?.map((post: PostType, idx: number) => {
                    const current =
                      post.id === parseInt(router.query.id as string)
                        ? true
                        : false;
                    return (
                      <div
                        className={`border-b border-gray-200 md:flex ${
                          current ? "font-bold text-[#0a5dc2]" : ""
                        }`}
                        key={post.id}
                      >
                        <div className="hidden md:block text-center p-2 min-w-[80px]">
                          {post.category ? (
                            <Link
                              href={`/board/${postList?.board?.name}/${post.category?.id}`}
                            >
                              {post.category?.category}
                            </Link>
                          ) : (
                            post.id
                          )}
                        </div>
                        <div className="pt-4 px-4 md:p-2 flex-grow flex items-center gap-1 break-all">
                          {current ? (
                            <div className="md:line-clamp-1">{post.title}</div>
                          ) : (
                            <>
                              <Link
                                href={`/board/post/${post.id}`}
                                className="break-all md:line-clamp-1"
                              >
                                {post.title}
                              </Link>
                              {post?.comment > 0 && (
                                <div className="flex gap-0.5 items-center text-[12px] font-semibold text-blue-500">
                                  <PiChatCircleTextLight size={14} />
                                  {post.comment}
                                </div>
                              )}
                            </>
                          )}
                          {post.reaction && (
                            <div className="flex gap-0.5 items-center font-semibold text-red-500 text-[12px]">
                              <TbHeartFilled size={14} />
                              {JSON.parse(post.reaction).length}
                            </div>
                          )}
                          {post.extra_01 === "1" && (
                            <span>
                              <TbPhotoCircle
                                size={16}
                                className="hidden md:block text-green-500"
                              />
                            </span>
                          )}
                          {post.extra_01 === "1" && (
                            <Image
                              src={post.extra_02 || "/logo.png"}
                              width="56"
                              height="56"
                              alt="Image"
                              className="border border-gray-600 md:hidden aspect-square rounded-md ml-auto w-14"
                            />
                          )}
                        </div>

                        <div className="flex gap-3 md:gap-0 px-4 pb-4 pt-1.5 md:p-0 text-gray-400 md:text-gray-600 text-xs">
                          <div className="md:block text-left md:p-2 md:min-w-[128px]">
                            {post.user?.nickname}
                          </div>
                          <div className="md:block md:text-center md:p-2 md:min-w-[96px]">
                            {formatDate(post.created_at)}
                          </div>
                          <div className="md:block md:text-center md:p-2 md:min-w-[48px]">
                            <span className="md:hidden">조회</span> {post.views}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="post-paginate flex justify-center p-5">
              <Pagination
                first
                last
                ellipsis
                total={postList?.total}
                limit={postPerPage}
                activePage={postPage}
                onChangePage={setPostPage}
                maxButtons={6}
              />
            </div>
          </div>
        </div>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box rounded-md ">
            {/* <h3 className="font-bold text-lg">{t['warning-text']}</h3> */}
            <p className="">{t["go-to-login-1"]}</p>
            <p className="">{t["go-to-login-2"]}</p>
            <div className="modal-action">
              <form method="dialog">
                <Link
                  className="bg-primary text-white py-2 px-5 text-sm text-center hover:text-white rounded-md mr-2"
                  href={`/board/write?board=${
                    router.query.name !== undefined ? router.query.name : ""
                  }`}
                >
                  {t["ok"]}
                </Link>
                <button>{t["close"]}</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  const req = context.req;
  const page = (getCookie("page", { req }) as string) || "1";
  const perPage = (getCookie("perPage", { req }) as string) || "20";

  // Get Member Information
  // let memberInfo = '';
  // const session = await getSession(context);
  // if (session?.user) {
  //   const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getmember&userid=${session?.user.id}`, {
  //     method: 'POST',
  //     headers: { 'content-type': 'application/json' },
  //   });
  //   memberInfo = await responseMember.json();
  // }

  // Get Post
  try {
    const resPost = await fetch(
      `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpost`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          id: context.query.id,
        }),
      }
    );
    const data = await resPost.json();
    const post = data.post;
    const prevNext = data.prevNext[0];

    if (!post) {
      return {
        redirect: {
          destination: "/board",
          permanent: false,
        },
      };
    }

    let reactionTotal: number = 0;
    if (post.reaction !== null) {
      reactionTotal = JSON.parse(post.reaction).length;
    }

    // Get Comments
    // const responseComment = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getcomments`, {
    //   method: 'POST',
    //   headers: { 'content-type': 'application/json' },
    //   body: JSON.stringify({
    //     id: context.query.id,
    //     query: null,
    //     paginate: {
    //       offset: 0,
    //       limit: 10,
    //     },
    //     sort: {
    //       field: 'created_at',
    //       value: 'ASC',
    //     },
    //   }),
    // });
    // const comments = await responseComment.json();

    // Get Posts List
    // const board = post.board.name;
    // const category = null;
    // const responsePost = await fetch(
    //   `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getpostlist&board=${board}&category=${category}&postsperpage=${perPage}&offset=${page}`,
    //   {
    //     method: 'POST',
    //     headers: { 'content-type': 'application/json' },
    //   }
    // );
    // const postList = await responsePost.json();

    // Return
    return {
      // props: { post, comments, postList, reactionTotal, page, perPage, prevNext, memberInfo },
      props: { post, reactionTotal, page, perPage, prevNext },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
};

export default Post;
