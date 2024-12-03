import React from "react";
import { Channel } from "../../typings";
import Link from "next/link";
import ChannelAvatar from "../channel/ChannelAvatar";
import { LiaUserSolid } from "react-icons/lia";
import { useRouter } from "next/router";
import { koKR } from "../../lang/ko-KR";
import { enUS } from "../../lang/en-US";
import { Skeleton } from "@mui/material";

const Section2_2 = ({ channelsNew }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  return (
    <>
      {channelsNew?.map((channel: Channel, index: number) => {
        return (
          <Link
            href={`/channel/${channel.username}`}
            target="_blank"
            className="flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none"
            key={channel.id}
          >
            <div className="font-semibold">{++index}</div>
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center gap-2">
                <ChannelAvatar
                  id={channel.channel_id}
                  title={channel.title}
                  size="30"
                  shape="rounded-full"
                  showType
                  typeStyle="-bottom-1 absolute z-10 -right-1"
                  type={channel.type}
                  typeIcon={true}
                />
                <div className="line-clamp-1 max-w-[85%]">{channel.title}</div>
              </div>
              <div className="text-[12px] text-gray-text font-bold flex gap-0.5 items-center min-w-[110px] justify-end">
                <LiaUserSolid size={16} />
                {channel.type === "channel"
                  ? t["subscribers"]
                  : t["members"]}{" "}
                {channel.subscription?.toLocaleString()}
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
};
const Section2_2Skeleton = () => {
  return (
    <>
      {Array(5)
        .fill(1)
        .map((val, index) => {
          return (
            <div
              className="flex items-center gap-5 px-5 py-2 hover:no-underline border-b border-gray-100 last:border-none"
              key={index}
            >
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ bgcolor: "grey.100" }}
                width={20}
                height={20}
              />
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton
                    variant="circular"
                    animation="wave"
                    sx={{ bgcolor: "grey.100" }}
                    width={30}
                    height={30}
                  />
                  <Skeleton
                    variant="text"
                    animation="wave"
                    sx={{ bgcolor: "grey.100" }}
                    width={60}
                    height={10}
                  />
                </div>
                <Skeleton
                  variant="text"
                  animation="wave"
                  sx={{ bgcolor: "grey.100" }}
                  width={60}
                  height={10}
                  className="text-gray-500 text-[12px] font-bold min-w-[100px]"
                />
              </div>
            </div>
          );
        })}
    </>
  );
};
export { Section2_2, Section2_2Skeleton };
