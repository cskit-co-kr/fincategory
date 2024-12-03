import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import useData from "../hooks/useData";
import { GroupType } from "../typings";
var moment = require("moment-timezone");

function Footer() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;
  const resultGroup: any = useData(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`,
    "POST"
  );
  const groups = resultGroup?.groups;
  return (
    <footer
      className="bg-white pt-[20px] pb-[19px] bottom-0 w-full mt-[16px] block .hidden .md:block
    md:pt-[32px] md:pb-[22px] md:mt-[34px]"
    >
      <div className="container px-5">
        <div className="flex items-end w-full justify-between border-b-[2px] border-[#EFF2F5] pb-[17px] md:pb-[24px]">
          <div className="font-raleway text-2xl flex gap-[12px] items-end">
            <Link
              href="/"
              className="min-w-[96px] hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none"
            >
              <span className="font-bold text-primary">Fin</span>
              <span className="">Cago</span>
              {/* <span className="">go</span> */}
            </Link>
            <div className="text-[12px] leading-[18px] .mb-[3px] text-gray-text font-segoe">
              {/* 텔레그램 채널정보, 핀카 */}
              {t["Telegram channel/group information"]}
            </div>
          </div>
          {/* <div className="flex gap-5">
            <Link href={"/privacy-policy"}>개인정보처리방침</Link>
            <Link href={"/terms"}>이용약관</Link>
          </div> */}
        </div>
        {/* <ul className='sm:grid md:grid-cols-7 lg:grid-cols-9 border-b-2 xl:pb-10 py-4 xl:p-0'>
          <li>
            <Link className={"font-bold text-base"} href={"/"}>
              {t["home"]}
            </Link>
          </li>
          <li>
            <Link className={"font-bold text-base"} href={"/ranking"}>
              {t["rank"]}
            </Link>
          </li>
          <li className='col-span-2'>
            <p className={"cursor-default font-bold text-base"}>{t["board"]}</p>
            <ul className='grid mt-4 grid-cols-2 pr-10 pl-2'>
              {groups?.map((group: GroupType) =>
                group.boards.map((board: any) => (
                  <li key={board.id}>
                    <Link href={`/board/${board.name}`} className='py-1'>
                      {board.title}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </li>
          <li>
            <Link className={"font-bold text-base"} href={"/ads"}>
              광고
            </Link>
          </li>
          <li className=' col-span-2'>
            <Link className={"font-bold text-base"} href={"/add"}>
              {t["new-channel-registration"]}
            </Link>
          </li>
        </ul> */}
        <div className="flex gap-[8px] text-gray-text mt-[16px] mb-[21px] md:mt-[26px] md:mb-[13px]">
          <a className="" target="_blank" href="https://cskit.co.kr/">
            {/* 씨스킷주식회사 */}
            {t["Cskit"]}
          </a>
          {/* <p>|</p> */}
          {/* <p>309 81 07535</p> */}
          <p>|</p>
          <p>cho@cskit.co.kr</p>
          <p>|</p>
          <a
            target="_blank"
            className=".font-bold"
            href="https://t.me/fincatele"
          >
            @fincatele
          </a>
        </div>
        {/* <p className="mt-2">(c) 2023. CSKIT Inc. all rights reserved.</p> */}
        <div
          className="flex p-[10px] justify-center items-center rouded-[25px] bg-blue-gradient 
        text-gray-text text-[12px] md:text-[14px] leading-[21px]"
        >
          <span>(c) 2023. CSKIT Inc. all rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
