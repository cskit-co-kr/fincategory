import {
  EyeIcon,
  HandThumbUpIcon,
  RectangleGroupIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { Skeleton } from "@mui/material";

const ChannelDetailNav = ({ channel }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  const menuPath = locale === "ko" ? "/" : "/en/";
  const liSelected = "bg-primary text-white border border-primary";
  const liNormal =
    "bg-gray-50 border border-gray-300 hover:bg-primary hover:text-white hover:border-primary";
  const aNormal =
    "py-2 px-3.5 cursor-pointer hover:no-underline flex gap-2 justify-center items-center hover:text-white";
  return (
    <>
      <ul className="w-full text-sm grid sm:flex gap-2 bg-[#f2f2f2] rounded-md p-2 mt-4 md:mt-0">
        <li
          className={`rounded-lg ${
            router.pathname == "/channel/[id]" ? liSelected : liNormal
          }`}
        >
          <div
            onClick={() => router.push(`/channel/${channel.username}`)}
            className={aNormal}
          >
            <RectangleGroupIcon className="h-3 hidden md:inline" />
            {t["Summary"]}
          </div>
        </li>
        <li
          className={`rounded-lg ${
            router.pathname == "/channel/[id]/subscribers"
              ? liSelected
              : liNormal
          }`}
        >
          <div
            onClick={() =>
              router.push(`/channel/${channel.username}/subscribers`)
            }
            className={aNormal}
          >
            <UsersIcon className="h-3 hidden md:inline" />
            {t["Subscribers"]}
          </div>
        </li>
        <li
          className={`rounded-lg ${
            router.pathname == "/channel/[id]/posts-views"
              ? liSelected
              : liNormal
          }`}
        >
          <div
            onClick={() =>
              router.push(`/channel/${channel.username}/posts-views`)
            }
            className={aNormal}
          >
            <EyeIcon className="h-3 hidden md:inline" />
            {t["Posts-reach"]}
          </div>
        </li>
        <li
          className={`rounded-lg ${
            router.pathname == "/channel/[id]/comments" ? liSelected : liNormal
          }`}
        >
          <div
            onClick={() => router.push(`/channel/${channel.username}/comments`)}
            className={aNormal}
          >
            <ChatBubbleLeftRightIcon className="h-3 hidden md:inline" />
            {t["Comments"]} ({channel.comment})
          </div>
        </li>
      </ul>
    </>
  );
};

const ChannelDetailNavSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      sx={{ bgcolor: "grey.100" }}
      animation="wave"
      width="100%"
      height={54}
      className="h-min-[54px]"
    />
  );
};
export { ChannelDetailNavSkeleton, ChannelDetailNav };
