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
import { HiOutlineMegaphone } from "react-icons/hi2";

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
        <li
          className={`rounded-lg ml-auto ${
            router.pathname == "/channel/[id]/comments"
              ? "bg-primary text-white border border-primary"
              : "bg-gray-50 border border-gray-300 hover:bg-primary text-blue-primary hover:text-white hover:border-primary"
          }`}
        >
          <div
            className={`font-semibold px-4 py-2 cursor-pointer hover:no-underline flex gap-2 justify-center items-center`}
          >
            <HiOutlineMegaphone className="h-4 w-4 hidden md:inline" />
            <span className="">{t["Add ads"]}</span>
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
