import { EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ChannelDetailLeftSidebar from "../../../components/channel/ChannelDetailLeftSidebar";
import { enUS } from "../../../lang/en-US";
import { koKR } from "../../../lang/ko-KR";
import { Channel } from "../../../typings";

function attraction(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const channel: Channel = props.channel;
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  return (
    <div className="pt-36 bg-gray-50">
      <Head>
        <title>{`${router.query.id} - ${t["Posts-reach"]}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:flex xl:w-[1280px] mx-auto text-black">
        <ChannelDetailLeftSidebar channel={channel} />
        <div className="w-full xl:w-[974px] flex flex-col gap-4 justify-items-stretch content-start">
          <div className="w-full xl:w-[974px] mt-4 md:mt-0 gap-4 flex flex-col border border-gray-200 rounded-md p-4 bg-white">
            <div className="text-xl mx-auto font-semibold mb-4">
              {t["Attracting-subscribers"]}
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              {t["attraction-text-1"].replace(
                "%{channel.title}",
                channel.title
              )}
              <br />
              <br />
              {t["attraction-text-2"]}
            </div>
            <div className="border border-gray-200 rounded-md">
              <ul className="w-full divide-y">
                <li className="p-4 flex w-full font-semibold bg-gray-100">
                  <div className="w-1/4">Month</div>
                  <div className="w-1/4">Mentions</div>
                  <div className="w-1/4">Total reach</div>
                  <div className="w-1/4">New participants</div>
                </li>
                <li className="px-4 py-2 flex w-full justify-between items-center hover:bg-gray-50">
                  <div className="w-1/4">March 2023</div>
                  <div className="w-1/4">
                    541 mentions
                    <br />
                    in 99 channels
                  </div>
                  <div className="w-1/4 text-lg flex gap-2 items-center">
                    <EyeIcon className="h-5" />
                    659643
                  </div>
                  <div className="w-1/4 text-green-500 text-lg">+1253</div>
                </li>
                <li className="px-4 py-2 flex w-full justify-between items-center hover:bg-gray-50">
                  <div className="w-1/4">March 2023</div>
                  <div className="w-1/4">
                    541 mentions
                    <br />
                    in 99 channels
                  </div>
                  <div className="w-1/4 text-lg flex gap-2 items-center">
                    <EyeIcon className="h-5" />
                    659643
                  </div>
                  <div className="w-1/4 text-green-500 text-lg">+1253</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: any) => {
  const getId = context.query["id"];
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`,
    { detail: getId }
  );
  const channel: Channel = response.data;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/postsapi`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ channel_id: channel.channel_id }),
    }
  );
  const combinedReturn = await res.json();
  const totalViews = combinedReturn[0].total.reverse();
  const averageViews = combinedReturn[0].average;
  const errPercent = combinedReturn[0].average.reverse().map((item: any) => ({
    date: item.date,
    views: Math.round((item.average * 100) / channel.subscription),
  }));

  return {
    props: {
      channel,
      totalViews,
      averageViews,
      errPercent,
    },
  };
};

export default attraction;
