import Link from "next/link";
import { FunctionComponent } from "react";

type TLink = {
  url: string
  text: string
  icon?: any
}

const ButtonLink: FunctionComponent<TLink> = ({ url, text, icon }) => {
  return (
    <Link href={url} className="flex gap-[10px] items-center h-[35px] px-5 bg-white border border-[#d9d9d9] rounded-[5px] text-black text-[13px] hover:no-underline">
      {icon ? icon : <></>}
      <span className="flex-1">{text}</span>
    </Link>
  )
}

export default ButtonLink