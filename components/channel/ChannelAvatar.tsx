import Image from "next/image";
import { useState } from "react";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import { FaUser, FaVolumeLow } from "react-icons/fa6";

const ChannelAvatar = ({
  id,
  title,
  size,
  shape,
  type,
  showType,
  typeStyle,
  typeIcon,
}: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  const avatar = `${process.env.NEXT_PUBLIC_IMAGE_URL}/v1/image/get/100/${id}/avatar.jfif`;
  const [error, setError] = useState<boolean>(false);
  let typee;
  if (type === "channel") {
    if (typeIcon) {
      typee = <FaUser size={10} />;
    } else {
      typee = t["channel"];
    }
  } else {
    if (typeIcon) {
      typee = <FaVolumeLow size={10} />;
    } else {
      typee = t["Group"];
    }
  }
  return (
    <div className={`relative min-w-[${size}px] max-w-[${size}px]`}>
      <Image
        src={error ? "/telegram-icon-96.png" : avatar}
        alt={"avatar of " + title}
        width={size}
        height={size}
        className={`object-contain ${shape} z-0`}
        onError={() => setError(true)}
        loading="lazy"
      />
      {showType && (
        <div
          className={`text-[10px] leading-[13px] mx-auto p-[2px] .border-2 .border-white rounded-full w-fit whitespace-nowrap text-white font-semibold ${typeStyle} ${
            showType === true
              ? type === "channel"
                ? "bg-[#71B2FF]"
                : "bg-[#FF7171]"
              : ""
          }`}
        >
          {type === "channel" ? (
            typeIcon ? (
              <FaVolumeLow size={10} />
            ) : (
              <div className="flex items-center">
                <FaVolumeLow size={10} />
                {t["channel"]}
              </div>
            )
          ) : typeIcon ? (
            <FaUser size={10} />
          ) : (
            <div className="flex items-center">
              <FaUser size={10} />
              {t["Group"]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelAvatar;
