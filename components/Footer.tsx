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
  const resultGroup: any = useData(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`, "POST");
  const groups = resultGroup?.groups;
  return (
    <footer className='bg-white py-8 bottom-0 w-full mt-10 hidden md:block'>
      <div className='container px-5'>
        <div className='flex items-end w-full justify-between mb-10'>
          <div className='font-raleway text-2xl flex gap-3 items-end'>
            <Link
              href='/'
              className='hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none'
            >
              <span className='font-bold text-primary'>Fin</span>
              <span className=''>Ca</span>
            </Link>
            <div className='text-[11px] text-gray-500 leading-none mb-[3px]'>텔레그램 채널정보, 핀카</div>
          </div>
          <div className='flex gap-5'>
            <Link href={"/privacy-policy"}>개인정보처리방침</Link>
            <Link href={"/terms"}>이용약관</Link>
          </div>
        </div>
        <div className='sm:grid md:grid-cols-7 lg:grid-cols-9 border-b-2 xl:pb-10 py-4 xl:p-0'>
          <div>
            <Link className={"font-bold text-base"} href={"/"}>
              {t["home"]}
            </Link>
          </div>
          <div>
            <Link className={"font-bold text-base"} href={"/ranking"}>
              {t["rank"]}
            </Link>
          </div>
          <div className='col-span-2'>
            <div className={"cursor-default font-bold text-base"}>{t["board"]}</div>
            <div className='grid mt-4 grid-cols-2 pr-10 pl-2'>
              {groups?.map((group: GroupType) =>
                group.boards.map((board: any) => (
                  <Link key={board.id} href={`/board/${board.name}`} className='py-1'>
                    {board.title}
                  </Link>
                ))
              )}
            </div>
          </div>
          <div>
            <Link className={"font-bold text-base"} href={"/ads"}>
              광고
            </Link>
          </div>
          <div className=' col-span-2'>
            <Link className={"font-bold text-base"} href={"/add"}>
              {t["new-channel-registration"]}
            </Link>
          </div>
        </div>
        <div className='mt-5 mb-10'>
          <div className='flex gap-2'>
            <p>씨스킷주식회사</p>
            <p>|</p>
            <a className='underline text-blue-400' href='tel:3098107535'>
              309 81 07535
            </a>
            <p>|</p>
            <a className='underline text-blue-400' href='mailto:cho@cskit.co.kr'>
              cho@cskit.co.kr
            </a>
            <p>|</p>
            <p>@fincatele</p>
          </div>
          <p className='mt-2'>(c) {moment.utc().tz("Asia/Seoul").format("YYYY")} CSKIT Inc. all rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
