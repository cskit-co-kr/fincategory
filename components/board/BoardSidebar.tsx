import { signIn, signOut, useSession } from "next-auth/react";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { GroupType } from "../../typings";
import Link from "next/link";
import { useRouter } from "next/router";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Sidebar from "../member/Sidebar";
import Image from "next/image";

const BoardSidebar = ({ memberInfo }: any) => {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;

  const name = router.query.name && router.query.name[0];
  const postBoardName = getCookie("postboardname");
  const { data: session, status } = useSession();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const getGroups = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const result = await response.json();
      setGroups(result.groups);
    };
    getGroups();
  }, []);

  return (
    <>
      <div className='hidden lg:block lg:min-w-[310px] text-sm'>
        <div className='lg:sticky lg:top-4'>
          <Sidebar memberInfo={memberInfo} />
          <div className='flex flex-col gap-2.5 border border-gray-200 rounded-lg p-[30px] bg-white mt-4'>
            {status === "authenticated" && (
              <Link
                className='bg-primary text-white py-2 px-5 text-center hover:text-white rounded-md w-full mb-2 block'
                href='/board/write'
              >
                글쓰기
              </Link>
            )}
            <div className='border-y border-gray-200 py-3 font-semibold'>
              <Link href='/board' className={`${router.asPath === "/board" && "text-primary"}`}>
                {t["view-all-articles"]}
              </Link>
            </div>
            <div className='flex flex-col gap-1 pb-2'>
              {groups?.map((group: GroupType, index) =>
                group.boards.map((board: any, key) => (
                  <Link
                    key={key}
                    href={`/board/${board.name}`}
                    className={`focus:no-underline py-1 items-center flex gap-2 ${
                      board.name === name ? "text-primary" : ""
                    } ${router.query.id && postBoardName === board.name ? "text-primary" : ""}`}
                  >
                    <Image src='/Group.png' width={20} height={20} alt='group' className='h-3 w-3' />
                    {board.title}
                  </Link>
                ))
              )}
            </div>
            <div className='justify-between hidden'>
              <div className='font-semibold'>{t["connected-members"]}</div>
              <div className='flex gap-1 text-black'>
                <ArrowPathIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
                <ChevronDownIcon className='border border-gray-200 rounded-md h-4 p-0.5' />
              </div>
            </div>
            <div className='bg-gray-100 p-4 text-xs hidden'>{t["no-connected-members"]}</div>
            <div className='border border-gray-200 p-4 text-xs hidden'>오늘 3 전체 549</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardSidebar;
