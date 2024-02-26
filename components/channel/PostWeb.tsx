import {
  ArrowTopRightOnSquareIcon,
  EyeIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { toDateTimeformat } from "../../lib/utils";
import MediaWeb from "./ChannelMediaWeb";
import { Skeleton } from "@mui/material";

const PostWeb = ({ channel, post }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${channel.channel_id}/avatar.jfif`;

  const [error, setError] = useState<boolean>(false);

  const [postDate, setPostDate] = useState("");
  useEffect(() => {
    const d = new Date(toDateTimeformat(post.date, "-")).toLocaleTimeString(
      locale === "ko" ? "ko-KR" : "en-US",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
    setPostDate(d);
  }, []);

  return (
    <div className="w-full p-[20px] gap-4 border flex flex-col border-gray-200 rounded-md bg-white">
      <div className="header flex gap-4 border-b border-gray-200 pb-2 w-full">
        <Image
          src={error ? "/telegram-icon-96.png" : avatar}
          alt={channel.title}
          width={36}
          height={36}
          className="rounded-full object-fill h-fit"
          onError={() => setError(true)}
        />
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-bold">{channel.title}</div>
          <div className="text-xs text-gray-500">{postDate}</div>
        </div>
      </div>
      <div className="content max-w-[640px]">
        {post.forwarded_from === null ? (
          ""
        ) : (
          <div
            className="forwarded-from border-l-2 border-blue-400 pl-1 mb-4"
            dangerouslySetInnerHTML={{ __html: post.forwarded_from }}
          />
        )}
        {post.post_media === null ? (
          ""
        ) : (
          <div className="media py-2">
            <MediaWeb medias={post.post_media} />
          </div>
        )}
        <div
          className="post break-all"
          dangerouslySetInnerHTML={{
            __html: post.post,
          }}
        />
      </div>
      <div className="footer flex flex-row-reverse gap-3 border-t border-gray-200 pt-3">
        <div className="flex gap-1 text-xs py-1">
          <EyeIcon className="h-4" />
          {post.view}
        </div>
        <a
          href={`https://t.me/${post.id.toLowerCase()}`}
          target="_blank"
          className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline ml-auto"
        >
          <LinkIcon className="h-4" />
        </a>
        <span className="flex text-xs">
          <b>{t["Author"]}:</b>{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: post.author,
            }}
          />
        </span>
      </div>
    </div>
  );
};
const PostWebSkeleton = () => {
  return (
    <div className="w-full p-[20px] gap-4 border flex flex-col border-gray-200 rounded-md bg-white">
      <div className="header flex gap-4 border-b border-gray-200 pb-2 w-full">
        <Skeleton
          variant="circular"
          sx={{ bgcolor: "grey.100" }}
          animation="wave"
          width={40}
          height={40}
        />
        <div className="w-full flex-col align-center pt-2 ">
          <Skeleton
            variant="text"
            sx={{ bgcolor: "grey.100" }}
            animation="wave"
            height={15}
            width="30%"
          />
          <Skeleton
            variant="text"
            sx={{ bgcolor: "grey.100" }}
            animation="wave"
            height={10}
            width="50%"
          />
        </div>
      </div>
      <Skeleton
        variant="rectangular"
        sx={{ bgcolor: "grey.100" }}
        className="w-full"
        animation="wave"
        height={400}
      />
    </div>
  );
};
const EmptyPostWebSkeleton = ({ channel }: any) => {
  const ref = useRef(null);
  React.useEffect(() => {
    import("@lottiefiles/lottie-player");
  });
  return (
    <div className="w-full p-[20px] gap-4 border flex flex-col border-gray-200 rounded-md bg-white">
      <div className="w-full flex flex-col lg:flex-row p-4 justify-center items-center bg-gray-100 rounded-md h-[400px]">
        <lottie-player
          id="firstLottie"
          ref={ref}
          autoplay
          loop
          mode="normal"
          src="https://lottie.host/cf8c2d72-4ee7-4707-a33d-9a5ba5b4a407/BRUeDhOcpj.json"
          style={{ width: "300px", height: "300px" }}
        ></lottie-player>
        <div className="text-center lg:text-start">
          <div className="text-lg font-medium">
            Oops sorry, something went wrong.
          </div>
          <div className="flex flex-col gap-2">
            you can check "{channel.title}"s posts from telegram.{" "}
            <a
              href={`https://t.me/${
                channel.type === "private_group" ? "+" : ""
              }${channel.username}`}
              target="_blank"
              className="flex items-center gap-1 w-min border-2 border-primary px-3 self-center py-1 rounded-full text-primary text-sm 
                            transition ease-in-out duration-300 hover:bg-primary hover:no-underline hover:text-white"
            >
              @{channel.username}
              <ArrowTopRightOnSquareIcon className="h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export { PostWeb, PostWebSkeleton, EmptyPostWebSkeleton };
