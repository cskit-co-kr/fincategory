import { useEffect, useState, useTransition } from "react";
import {
  EyeIcon,
  HandThumbUpIcon,
  RectangleGroupIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { Loader, Notification, useToaster, Checkbox } from "rsuite";
import Image from "next/image";
import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { Skeleton } from "@mui/material";
import { HiOutlineMegaphone } from "react-icons/hi2";
import { getSession, useSession } from "next-auth/react";
import ModalAdsBuyByChannel from "../../components/member/ModalAdsBuyByChannel";

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
  const toaster = useToaster();

  const { data: session, status } = useSession();
  const [wallet, setWallet] = useState<any>(null);
  const [ads2, setAds2] = useState<any>(null);

  const fetchWallet = async () => {
    if (session?.user) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/getWallet/${session.user.id}`
        );
        const result = await response.json();
        setWallet(result.wallet); // Update state with the fetched wallet
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    }
  };

  useEffect(() => {
    // const fetchWallet = async () => {
    //   if (session?.user) {
    //     try {
    //       const response = await fetch(
    //         `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/point/getWallet/${session.user.id}`
    //       );
    //       const result = await response.json();
    //       setWallet(result.wallet); // Update state with the fetched wallet
    //     } catch (error) {
    //       console.error("Error fetching wallet:", error);
    //     }
    //   }
    // };
    const fetchAds2 = async () => {
      try {
        const response4 = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/product/getProductSection2`
        );
        const result4 = await response4.json();
        const section2 = result4.rows;
        const ads2 = await section2.map((ad: any) => ({
          id: ad.id,
          duration: `${ad.term / 30}`,
          coin: ad.fincoin,
        }));
        setAds2(ads2);
      } catch (error) {
        console.error("Error fetch Ads2:", error);
      }
    };

    fetchWallet();
    fetchAds2();
  }, [session]);

  // console.log("wallet", wallet);
  // console.log("ads2", ads2);

  const balance = wallet ? wallet?.balance : 0;

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
          className={`rounded-lg ml-auto bg-gray-50 border border-gray-300 hover:bg-primary hover:border-primary w-full sm:w-fit`}
          onClick={() => {
            if (session?.user.id) {
              const modalId = `ads2_modal_${channel?.channel_id}`;
              const modal = document.getElementById(modalId) as any;
              modal?.showModal();
            } else {
              const message = (
                <Notification type="info" closable>
                  <div className="flex items-center gap-2 font-bold">
                    {/* <Image
                      src="/party.svg"
                      width={24}
                      height={24}
                      alt="Success"
                    /> */}
                    {t["You need to be signed in to purchase ads!"]}
                  </div>
                </Notification>
              );

              toaster.push(message, { placement: "topCenter" });
            }
          }}
        >
          <div
            className={`font-semibold px-4 py-2 cursor-pointer hover:no-underline flex gap-2 justify-center items-center text-blue-primary hover:text-white`}
          >
            <HiOutlineMegaphone className="h-4 w-4" />
            <span className="text-dark-primary">{t["Add ads"]}</span>
          </div>
        </li>
      </ul>
      {balance && ads2?.[0] ? (
        <ModalAdsBuyByChannel
          // data={ad}
          ads2={ads2}
          balance={balance}
          modalId={channel?.channel_id}
          adsGroup="ads2"
          userId={session?.user.id}
          channelDetail={channel}
          fetchWallet={fetchWallet}
        />
      ) : null}
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
