import React, { FunctionComponent, useState, useEffect } from "react";
import { Channel } from "../../typings";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import Link from "next/link";
import ChannelAvatar from "./ChannelAvatar";
import { LiaUserSolid } from "react-icons/lia";
import { Skeleton } from "@mui/material";
import axios from "axios";

type Props = {
  channels: Channel;
  desc: boolean;
  tag?: boolean;
  views?: boolean;
  bordered?: boolean;
  extra?: number;
  background?: string;
  showType?: boolean;
  typeStyle?: string;
  typeIcon?: boolean;
  showCategory?: boolean;
};

const GetChannels: FunctionComponent<Props> = ({
  channels,
  desc,
  tag,
  views,
  bordered,
  extra,
  background,
  showType,
  typeStyle,
  typeIcon,
  showCategory,
}) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const style =
    bordered === true
      ? "p-4 border-b md:border border-gray-200 hover:shadow-sm transition ease-in-out hover:border-gray-400 duration-300"
      : "";

  // const style2 = 'text-white border-b md:border border-primary hover:shadow-sm transition ease-in-out hover:border-gray-400 duration-300';
  // background = 'bg-primary';
  return (
    <div className={`${style} relative flex md:rounded-xl gap-2.5 text-black ${background}`}>
      {/* <div className='absolute bottom-0 right-0 bg-primary/80 px-2 py-[1px] text-[10px] rounded-tl-lg rounded-br-lg text-white'>ad</div> */}
      <Link href={`/channel/${channels.username}`} target='_blank'>
        <ChannelAvatar
          id={channels.channel_id}
          title={channels.title}
          type={channels.type}
          showType={showType}
          typeStyle={typeStyle}
          size='50'
          shape='rounded-full'
          typeIcon={typeIcon}
        />
      </Link>
      <div className='space-y-3 w-full'>
        <Link href={`/channel/${channels.username}`} className='hover:no-underline hover:text-black' target='_blank'>
          <h2 className='break-all md:break-words font-semibold line-clamp-1 text-ellipsis overflow-hidden'>
            {channels.title}
            {extra && (
              <div className='bg-primary rounded-full w-fit h-fit absolute right-4 md:-right-1 top-2 md:-top-2 px-1.5 py-0.5 text-xs font-normal text-white z-10'>
                +{extra === 1 ? channels.extra_02 : extra === 2 ? channels.extra_03 : extra === 3 && channels.extra_04}
              </div>
            )}
          </h2>

          {desc === true && (
            <p className='break-all md:break-words text-xs line-clamp-2 overflow-hidden mt-1'>{channels.description}</p>
          )}
        </Link>
        <div className='flex items-center justify-between text-xs text-gray-500 font-semibold'>
          <span className='flex gap-0.5 items-center'>
            <LiaUserSolid size={16} />
            {t["subscribers"]} {channels.subscription?.toLocaleString()}
          </span>
          {views === true && (
            <span>
              오늘{channels.today && channels.today}/누적{channels.total && channels.total}
            </span>
          )}
        </div>
        <div className='flex gap-1'>
          {channels.category && showCategory && (
            <div className='bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF] whitespace-nowrap h-fit'>
              {channels.category.name !== undefined && JSON.parse(channels.category.name)[locale]}
            </div>
          )}
          <div className='tags flex flex-wrap'>
            {channels.tags &&
              tag === true &&
              channels.tags.map((tag: { id: number; channel_id: number; tag: string }) => {
                return (
                  <button
                    onClick={() => {
                      router.push({
                        pathname: "",
                        query: { q: "#" + tag.tag },
                      });
                    }}
                    className='bg-gray-100 px-1.5 py-0.5 mx-0.5 mb-0.5 rounded-full text-sm md:text-xs font-semibold hover:underline text-gray-700'
                    key={tag.id}
                  >
                    #{tag.tag}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

const GetChannelsSkeleton = () => {
  return (
    <Skeleton
      className={`relative flex md:rounded-xl p-4 gap-2.5 text-black `}
      sx={{ bgcolor: "grey.100" }}
      variant='rectangular'
      animation='wave'
      width={310}
      height={192}
    />
  );
};
GetChannels.defaultProps = {
  tag: true,
  views: true,
  bordered: true,
  background: "bg-white",
  showType: false,
  typeStyle: "mt-3",
  typeIcon: true,
  showCategory: false,
};

export { GetChannels, GetChannelsSkeleton };
