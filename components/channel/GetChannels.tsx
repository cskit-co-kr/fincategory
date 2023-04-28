import React, { FunctionComponent, useState } from "react";
import { Channel } from "../../typings";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

type Props = {
  channels: Channel;
};

const GetChannels: FunctionComponent<Props> = ({ channels }) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channels.channel_id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);

  return (
    <Link
      href={{ pathname: "/channel/" + channels.username }}
      className="hover:no-underline group col-span-12 min-[530px]:col-span-6 sm:col-span-6 lg:col-span-6 xl:col-span-4"
      target={"_blank"}
    >
      <div
        className="relative flex items-start border border-gray-200 rounded-md bg-white p-4 gap-[10px] text-black max-h-[140px]
                      transition ease-in-out hover:border-gray-400 duration-300 hover:shadow-sm"
      >
        <Image
          src={error ? "/telegram-icon-96.png" : avatar}
          alt={"avatar of " + channels.title}
          width={50}
          height={50}
          className="object-contain rounded-full w-[50px] h-[50px] min-[420px]:w-[60px] min-[420px]:h-[60px] min-[460px]:w-[70px] min-[460px]:h-[70px] min-[530px]:w-[25px] min-[530px]:h-[25px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] min-[930px]:w-[80px] min-[930px]:h-[80px] lg:w-[70px] lg:h-[70px] min-[1200px]:w-[100px] min-[1200px]:h-[100px] xl:w-[50px] xl:h-[50px]"
          onError={() => setError(true)}
        />
        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg min-[420px]:text-lg min-[460px]:text-xl min-[530px]:text-sm sm:text-base md:text-lg min-[930px]:text-xl lg:text-lg min-[1200px]:text-xl xl:text-sm truncate w-[260px] min-[420px]:w-[270px] min-[460px]:w-[300px] min-[530px]:w-[180px] sm:w-[213px] md:w-[260px] min-[930px]:w-[300px] lg:w-[260px] min-[1200px]:w-[300px] xl:w-[213px]">
            {channels.title}
          </h2>
          <p className="text-sm min-[420px]:text-sm min-[530px]:text-[10px] sm:text-sm md:text-sm min-[1200px]:text-[16px] xl:text-[12px] h-9 w-[260px] min-[420px]:w-[280px] min-[460px]:w-[300px] min-[530px]:w-[180px] sm:w-[213px] md:w-[260px] min-[930px]:w-[300px] lg:w-[260px] min-[1200px]:w-[300px] xl:w-[213px] overflow-hidden">
            {channels.description}
          </p>
          <div className="flex">
            <p className="text-sm min-[420px]:text-[15px] min-[530px]:text-[10px] sm:text-[12px] m-0 text-gray-500">
              {t["subscribers"]}{" "}
              <b>{channels.subscription?.toLocaleString()}</b>
            </p>
            <p className="text-sm min-[420px]:text-[15px] min-[530px]:text-[10px] sm:text-[12px] m-0 text-gray-500 ml-auto">
              오늘{channels.counter.today}/누적{channels.counter.total}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GetChannels;
