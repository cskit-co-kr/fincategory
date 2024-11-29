import React, { FunctionComponent } from "react";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import Link from "next/link";
import ChannelAvatar from "../channel/ChannelAvatar";
import { LiaUserSolid } from "react-icons/lia";
import Image from "next/image";

type Props = {
  channel: any;
  showType: boolean;
  typeIcon?: boolean;
  showCategory?: boolean;
};

const AdChannel2: FunctionComponent<Props> = ({
  channel,
  showType,
  typeIcon,
  showCategory,
}) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const style =
    "p-4 px-8 md:px-4 border border-primary hover:shadow-sm transition ease-in-out duration-300";

  return (
    // <div className={`${style} relative flex md:rounded-xl gap-2.5 text-black bg-white min-h-[131px]`}>
    <div
      className={`p-4 px-4 border border-blue-primary hover:shadow-sm transition ease-in-out duration-300
    relative flex md:rounded-xl gap-2.5 text-black bg-gray-primary min-h-[131px]`}
    >
      <div className="absolute bottom-0 right-0 bg-blue-primary rounded-tl-lg md:rounded-br-lg text-white text-[10px] px-2.5 py-[1px]">
        ad
      </div>
      <Link
        href={
          channel.channel_id ? `/channel/${channel.username}` : "/board/ads"
        }
        target="_blank"
      >
        {channel.channel_id ? (
          <ChannelAvatar
            id={channel.channel_id}
            title={channel.title}
            type={channel.type}
            showType={showType}
            typeStyle="-bottom-1 absolute z-10 -right-1"
            size="50"
            shape="rounded-full"
            typeIcon={typeIcon}
          />
        ) : (
          <div className="border border-primary rounded-full">
            <Image src="/logo.png" alt="" width={50} height={50} />
          </div>
        )}
      </Link>
      <div className="space-y-3 w-full">
        <Link
          href={
            channel.channel_id ? `/channel/${channel.username}` : "/board/ads"
          }
          className="hover:no-underline hover:text-black"
          target="_blank"
        >
          <h2 className="break-all md:break-words font-semibold line-clamp-1 text-ellipsis overflow-hidden">
            {channel.title}
          </h2>
          <p
            className={`break-all md:break-words text-xs overflow-hidden mt-1 ${
              channel.channel_id && "line-clamp-2"
            }`}
          >
            {channel.description}
          </p>
        </Link>
        {channel.channel_id && (
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
            <span className="flex gap-0.5 items-center">
              <LiaUserSolid size={16} />
              {t["subscribers"]} {channel.subscription?.toLocaleString()}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1">
          {channel.category_id && showCategory && (
            <div className="bg-[#f5f5f5] px-1.5 py-[1px] rounded-full text-sm md:text-xs text-[#71B2FF] font-semibold border border-[#71B2FF]">
              {JSON.parse(channel.category.name)[locale]}
            </div>
          )}
          <div className="tags flex flex-wrap">
            {channel.tags &&
              channel.tags.map(
                (tag: { id: number; channel_id: number; tag: string }) => {
                  return (
                    <button
                      onClick={() => {
                        router.push({
                          pathname: "/",
                          query: { q: "#" + tag.tag },
                        });
                      }}
                      className="bg-gray-100 px-1.5 py-0.5 mx-0.5 mb-0.5 rounded-full text-sm md:text-xs font-semibold hover:underline text-gray-700"
                      key={tag.id}
                    >
                      #{tag.tag}
                    </button>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdChannel2;
