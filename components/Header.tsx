import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  PlusIcon,
  StopCircleIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { ChartBarIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaTelegramPlane } from "react-icons/fa";
import { HiArrowUp } from "react-icons/hi2";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { RiBarChartHorizontalFill } from "react-icons/ri";
import { Nav } from "rsuite";
import useData from "../hooks/useData";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { GroupType } from "../typings";
import LanguageSelector from "./LanguageSelector";
import Image from "next/image";
var moment = require("moment-timezone");

const Header = () => {
  const router = useRouter();
  const getPath = useRouter().pathname;
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;

  const { data: session, status } = useSession();

  const normalPath =
    "px-5 py-3 font-bold text-[14px] hover:text-primary flex items-center gap-1";
  // const activePath = normalPath + ' border-b-2 border-primary';
  const activePath = normalPath + " text-primary";

  const [searchField, setSearchField] = useState("");
  const [userMenu, setUserMenu] = useState(false);
  const [searchSection, setSearchSection] = useState(1);
  const [searchSectionMenu, setSearchSectionMenu] = useState(false);
  const [isOpen, setOpen] = useState(true);

  const handleSubmit = () => {
    if (searchField !== "") {
      if (searchSection === 1) {
        router.push({
          pathname: "/",
          query: { q: searchField },
          hash: "",
        });
      } else if (searchSection === 2) {
        router.push(`/board?q=${searchField}`);
      }
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      setMobileSearch(false);
      handleSubmit();
      e.target.blur();
    }
  };

  const browseRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenu) return;
    function handleClick(event: any) {
      if (
        browseRef.current &&
        !browseRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setUserMenu(false);
      }
    }
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [userMenu]);

  useEffect(() => {
    if (!searchSectionMenu) return;
    function handleClick(event: any) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchSectionMenu(false);
      }
    }
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [searchSectionMenu]);

  const resultGroup: any = useData(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/board?f=getgroups`,
    "POST"
  );
  const groups = resultGroup?.groups;

  const memberInfo: any = useData(
    `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getuser`,
    "POST"
  );

  useEffect(() => {
    const s = router.query.q === undefined ? "" : (router.query.q as string);
    setSearchField(s);
    // const ss = router.asPath.includes("/board") ? 2 : 1;
    // setSearchSection(ss);
  }, [router]);

  function handleClick() {
    const element = document.getElementById("my-drawer-4");
    if (element) {
      element.click();
    }
  }

  const menus = [
    {
      id: 1,
      title: t["내정보"],
      icon: <UserIcon className="h-5" />,
      link: "/board/profile",
    },
    {
      id: 2,
      title: t["핀코인"],
      icon: <StopCircleIcon className="h-5" />,
      link: "/board/wallet",
    },
    {
      id: 3,
      title: t["상품구매내역"],
      icon: <DocumentTextIcon className="h-5" />,
      link: "/board/ads-history",
    },
    {
      id: 4,
      title: t["내가 쓴 글"],
      icon: <PencilSquareIcon className="h-5" />,
      link: `/board?member=${session?.user.nickname}&show=posts`,
    },
    {
      id: 5,
      title: t["내가 쓴 댓글"],
      icon: <ChatBubbleBottomCenterTextIcon className="h-5" />,
      link: `/board?member=${session?.user.nickname}&show=comments`,
    },
  ];

  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchSectionMenuMobile, setSearchSectionMenuMobile] = useState(false);

  return (
    <>
      <header className="bg-white z-20">
        <div className="container">
          <div className="flex py-[16px] lg:py-5 justify-between items-center lg:border-b px-[16px] lg:px-[0px]">
            <div className="font-raleway text-2xl flex gap-3 items-end">
              <Link
                href="/"
                className="hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none w-[94px] whitespace-pre"
              >
                <span className="font-bold text-primary">Fin</span>
                <span className="">Cago</span>
              </Link>
              <h1 className="text-[12px] leading-[11px] leading-none mb-[3px] text-gray-text font-segoe">
                {t["Telegram channel/group information"]}
                {/* 텔레그램 채널/그룹 정보 핀카 */}
              </h1>
            </div>

            {/* Mobile */}

            {/* {mobileSearch && (
              <div className="fixed top-0 left-0 w-full bg-white md:hidden z-[999999] h-full">
                <div className="flex items-center px-4 py-4 shadow-md">
                  <MagnifyingGlassIcon className="h-6 text-gray-500 mr-1" />
                  <input
                    type="text"
                    name="search"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="outline-none text-sm px-2 py-1 w-full"
                    aria-label="Search"
                    placeholder="검색어를 입력해 주세요."
                  />
                  <button
                    className="text-xs py-2 flex gap-1 items-center rounded-full min-w-[100px] justify-center"
                    onClick={() => setSearchSectionMenuMobile((prev) => !prev)}
                  >
                    {searchSection === 1 ? t["channel/group"] : t["board"]}
                    <FaCaretDown size={14} />
                  </button>
                  {searchSectionMenuMobile && (
                    <div className="absolute top-12 right-8 border shadow-md bg-white flex flex-col rounded-xl min-w-[50px] text-xs">
                      <button
                        onClick={() => {
                          setSearchSection(1);
                          setSearchSectionMenuMobile((prev) => !prev);
                        }}
                        className="px-3 py-2 whitespace-nowrap"
                      >
                        {t["channel/group"]}
                      </button>
                      <button
                        onClick={() => {
                          setSearchSection(2);
                          setSearchSectionMenuMobile((prev) => !prev);
                        }}
                        className="px-3 py-2 whitespace-nowrap"
                      >
                        {t["board"]}
                      </button>
                    </div>
                  )}
                </div>
                <div className="justify-center text-sm flex gap-4 items-center font-semibold mt-6">
                  <button
                    onClick={() => {
                      setMobileSearch(false);
                      handleSubmit();
                    }}
                    name="search"
                    className="bg-primary text-white px-5 py-2 rounded-lg"
                  >
                    {t["검색"]}
                  </button>
                  <button
                    onClick={() => setMobileSearch(false)}
                    className="bg-gray-100 px-5 py-2 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              </div>
            )} */}

            <div className="lg:hidden drawer w-fit z-50">
              {/* <button onClick={() => setMobileSearch(true)}>
                <MagnifyingGlassIcon className="h-5 mr-4" />
              </button> */}
              <div className="flex items-center">
                <LanguageSelector />
              </div>
              <input
                id="my-drawer-4"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content ml-auto">
                {/* Page content here */}
                <label htmlFor="my-drawer-4" className="">
                  <Bars3Icon className="h-[24px]" />
                </label>
              </div>
              <div className="drawer-side ">
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-overlay !fixed w-full top-0 right-0 !h-full"
                ></label>
                <div className="menu py-[0px] px-[16px] w-80 min-h-screen bg-white ..bg-gray-100">
                  <div className="flex justify-between text-[24px] leading-[24px] py-[16px]">
                    <Link
                      href="/"
                      className="hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none w-[94px] whitespace-pre"
                    >
                      <span className="font-bold text-primary">Fin</span>
                      <span className="">Cago</span>
                    </Link>
                    <Image
                      onClick={handleClick}
                      src={"/img/close_icon.svg"}
                      width={20}
                      height={20}
                      className="min-w-[20px] max-h-[20px]"
                      alt="close_icon"
                    />
                  </div>
                  <div className="grid mb-10">
                    {session?.user ? (
                      <div className="flex flex-col gap-[16px] text-sm bg-white py-[16px]">
                        <Link
                          className="flex gap-2 items-center min-h-[50px]"
                          href="/board/profile"
                          onClick={handleClick}
                        >
                          <UserCircleIcon className="h-[35px] text-black" />
                          <span className="font-normal">
                            {session?.user?.email}
                          </span>
                        </Link>
                        <button
                          className="bg-[#EBEAEA] font-semibold text-dark-primary pt-[4px] pb-[5px] text-[14px] leading-[27px] rounded-full"
                          onClick={() => {
                            signOut({ callbackUrl: "/" });
                            handleClick();
                          }}
                        >
                          {t["sign-out"]}
                        </button>
                      </div>
                    ) : (
                      // <div className="flex flex-col gap-2 text-sm bg-white shadow-sm rounded-xl p-4">
                      //   <div className="flex gap-2 items-center border-b border-gray-200 pb-2.5">
                      //     <UserCircleIcon className="h-6 text-black" />
                      //     <span className="font-semibold text-base">
                      //       <Link
                      //         href="/board/profile"
                      //         className="flex gap-1"
                      //         onClick={handleClick}
                      //       >
                      //         {session?.user.nickname}
                      //         <Cog6ToothIcon className="h-4" />
                      //       </Link>
                      //     </span>
                      //     <button
                      //       onClick={() => {
                      //         signOut({ callbackUrl: "/" });
                      //         handleClick();
                      //       }}
                      //       className="bg-gray-100 rounded-full px-2 py-1 ml-auto text-xs"
                      //     >
                      //       {t["sign-out"]}
                      //     </button>
                      //   </div>

                      //   <div className="space-y-5 mt-2.5">
                      //     {menus.map((menu, index) => (
                      //       <Link
                      //         key={index}
                      //         className={`flex items-center gap-2.5 font-semibold text-sm ${
                      //           menu.link === router.asPath
                      //             ? "text-black"
                      //             : "text-gray-500"
                      //         }`}
                      //         href={menu.link}
                      //       >
                      //         {menu.icon}
                      //         {menu.title}
                      //         {menu.id === 4 && (
                      //           <div className="ml-auto">
                      //             {memberInfo?.post}
                      //           </div>
                      //         )}
                      //         {menu.id === 5 && (
                      //           <div className="ml-auto">
                      //             {memberInfo?.comment}
                      //           </div>
                      //         )}
                      //       </Link>
                      //     ))}
                      //   </div>
                      // </div>
                      <div className="flex flex-col gap-[16px] text-sm bg-white py-[16px]">
                        <div className="flex gap-2 items-center min-h-[50px]">
                          <UserCircleIcon className="h-[35px] text-black" />
                          <span className="font-normal">ID {t["sign-in"]}</span>
                        </div>
                        <button
                          className="bg-primary font-semibold text-white pt-[4px] pb-[5px] text-[14px] leading-[27px] rounded-full"
                          onClick={() => {
                            signIn();
                            handleClick();
                          }}
                        >
                          {t["sign-in"]}
                        </button>
                      </div>
                    )}
                    {/* <div className="text-sm">
                      <div className="grid gap-2 my-3 bg-white p-4 rounded-xl shadow-sm">
                        <Link
                          className="font-semibold flex gap-2 items-center"
                          href="/"
                          onClick={handleClick}
                        >
                          <FaTelegramPlane className="mask mask-squircle h-6 w-6 bg-primary text-white p-1" />
                          {t["home"]}
                        </Link>
                        <Link
                          className="font-semibold flex gap-2 items-center"
                          href="/ranking"
                          onClick={handleClick}
                        >
                          <ChartBarIcon className="mask mask-squircle h-6 w-6 bg-primary text-white p-1" />
                          {t["rank"]}
                        </Link>
                        <Link
                          className="font-semibold flex gap-2 items-center"
                          href="/ads"
                          onClick={handleClick}
                        >
                          <PiCurrencyKrwBold className="mask mask-squircle h-6 w-6 bg-primary text-white p-1" />
                          광고
                        </Link>
                        <Link
                          className="font-semibold flex gap-2 items-center"
                          href="/add"
                          onClick={handleClick}
                        >
                          <PlusIcon className="mask mask-squircle h-6 w-6 bg-primary text-white p-1" />
                          {t["new-channel-registration"]}
                        </Link>
                      </div>
                      <div className="bg-white p-4 rounded-xl shadow-sm">
                        {status === "authenticated" && (
                          <Link
                            className="bg-primary text-white py-2 px-5 text-center hover:text-white rounded-md w-full mb-4 block"
                            href="/board/write"
                            onClick={handleClick}
                          >
                            글쓰기
                          </Link>
                        )}
                        <div
                          className="border-b border-gray-200 pb-2 font-semibold flex w-full relative items-center gap-2"
                          onClick={() => setOpen(!isOpen)}
                        >
                          <div className="absolute right-0">
                            <HiArrowUp
                              className={`mask mask-squircle h-6 w-6 bg-slate-100 text-gray-500 p-1 transition-transform duration-500 ${
                                isOpen ? "" : "rotate-180"
                              }`}
                            />
                          </div>
                          <RiBarChartHorizontalFill className="mask mask-squircle h-6 w-6 bg-primary text-white p-1" />
                          {t["board"]}
                        </div>
                        <div
                          className={`flex ml-3  flex-col gap-2 py-2 overflow-hidden transition-all duration-500 ${
                            isOpen ? "h-[380px]" : "h-0"
                          }`}
                        >
                          {groups?.map((group: GroupType) =>
                            group.boards.map((board: any) => (
                              <Link
                                key={board.id}
                                href={`/board/${board.name}`}
                                className="py-1"
                                onClick={handleClick}
                              >
                                {board.title}
                              </Link>
                            ))
                          )}
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {/* <div className="mt-auto font-raleway text-2xl flex gap-3 items-end mx-auto my-5">
                    <Link
                      href="/"
                      className="hover:no-underline hover:text-current focus:no-underline focus:text-current leading-none"
                    >
                      <span className="font-bold text-primary">Fin</span>
                      <span className="">Ca</span>
                    </Link>
                    <div className="text-[11px] text-gray-500 leading-none mb-[3px]">
                      텔레그램 채널정보, 핀카
                    </div>
                  </div>
                  <div className="text-center mb-5">
                    <div>
                      {t["씨스킷주식회사"]} | <p>309 81 07535</p>
                    </div>
                    <div className="pr-4">
                      <p>cho@cskit.co.kr</p> | @fincatele
                    </div>
                    <p className="mt-5">
                      (c) {moment.utc().tz("Asia/Seoul").format("YYYY")} CSKIT
                      Inc. all rights reserved.
                    </p>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Desktop search */}
            <div className="relative border border-primary items-center py-2 px-3 rounded-full hidden lg:inline-flex hover:shadow-md">
              <input
                type="text"
                name="search"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={handleKeyDown}
                className="outline-none pl-3 w-24 md:w-80 xl:w-96 text-sm"
                aria-label="Search"
                placeholder="Search..."
              />
              <button
                className="text-xs py-1 px-2 flex gap-1 items-center rounded-full min-w-[70px] justify-center text-dark-primary"
                // onClick={() => setSearchSectionMenu((prev) => !prev)}
              >
                {searchSection === 1 ? t["channel/group"] : t["board"]}
                <FaCaretDown size={14} />
              </button>
              {searchSectionMenu && (
                <div
                  className="absolute top-9 right-10 border shadow-md bg-white flex flex-col rounded-xl min-w-[50px] text-xs"
                  ref={searchRef}
                >
                  <button
                    onClick={() => {
                      setSearchSection(1);
                      setSearchSectionMenu((prev) => !prev);
                    }}
                    className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                  >
                    {t["channel/group"]}
                  </button>
                  <button
                    onClick={() => {
                      setSearchSection(2);
                      setSearchSectionMenu((prev) => !prev);
                    }}
                    className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                  >
                    {t["board"]}
                  </button>
                </div>
              )}
              <button onClick={handleSubmit} name="search">
                <MagnifyingGlassIcon className="h-5 text-primary mr-1" />
              </button>
            </div>

            <div className="hidden lg:flex gap-4 items-center">
              <div>
                <LanguageSelector />
              </div>
              <div>
                {session?.user ? (
                  <div className="relative">
                    <button
                      ref={buttonRef}
                      onClick={() => setUserMenu((prev) => !prev)}
                      className="flex gap-1 items-center text-xs border border-gray-200 rounded-full px-2 py-1"
                    >
                      <UserCircleIcon className="h-4" />
                      {session?.user.nickname}
                    </button>
                    {userMenu && (
                      <div
                        className="absolute top-7 right-0 border shadow-lg bg-white flex flex-col rounded-xl min-w-[120px] text-xs z-10"
                        ref={browseRef}
                      >
                        <Link
                          href="/board/profile"
                          onClick={() => setUserMenu(false)}
                          className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-xl"
                        >
                          <UserCircleIcon className="h-4" />
                          {t["내정보"]}
                        </Link>

                        <Link
                          href="#"
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="flex gap-2 items-center px-3 py-2 hover:bg-gray-50 rounded-xl"
                        >
                          <ArrowRightOnRectangleIcon className="h-4" />
                          {t["sign-out"]}
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="bg-primary font-semibold text-white rounded-full py-1 px-5 text-sm hover:text-white"
                  >
                    {t["sign-in"]}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="flex items-center justify-center w-full pb-[15px] border-b lg:border-none px-[16px] lg:hidden">
            <div className="flex justify-between relative border border-primary items-center py-[8px] px-[15px] rounded-full hover:shadow-md w-full max-w-[560px]">
              <input
                type="text"
                name="search"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                onKeyDown={handleKeyDown}
                className="outline-none max-[370px]:max-w-[120px] text-sm"
                aria-label="Search"
                placeholder="Search..."
              />
              <div className="inline-flex">
                <button
                  className="text-xs p-[5px] flex gap-[3px] items-center rounded-full min-w-[70px] justify-center text-dark-primary"
                  // onClick={() => setSearchSectionMenu((prev) => !prev)}
                >
                  {searchSection === 1 ? t["channel/group"] : t["board"]}
                  <FaCaretDown size={14} />
                </button>
                {searchSectionMenu && (
                  <div
                    className="absolute top-9 right-10 border shadow-md bg-white flex flex-col rounded-xl min-w-[50px] text-xs"
                    ref={searchRef}
                  >
                    <button
                      onClick={() => {
                        setSearchSection(1);
                        setSearchSectionMenu((prev) => !prev);
                      }}
                      className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                    >
                      {t["channel/group"]}
                    </button>
                    <button
                      onClick={() => {
                        setSearchSection(2);
                        setSearchSectionMenu((prev) => !prev);
                      }}
                      className="px-3 py-2 hover:bg-gray-50 rounded-xl"
                    >
                      {t["board"]}
                    </button>
                  </div>
                )}
                <button onClick={handleSubmit} name="search">
                  <MagnifyingGlassIcon className="h-5 text-primary" />
                </button>
              </div>
            </div>
          </div>
          <nav className="text-sm font-bold items-center flex flex-nowrap break-keep max-[1023px]:px-[16px] max-[1023px]:py-[12px]">
            {/* active users */}
            <div className="flex flex-row items-center gap-[10px] container lg:h-[47px]">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <circle cx="5" cy="5" r="5" fill="#18D166" />
              </svg>
              <span className="font-[Roboto] text-center text-[12px] leading-[14px] text-[#18D166]">
                Online : {"82"}
              </span> */}
            </div>
            {/* <ul className="flex">
              <li>
                <button
                  className={getPath === "/" ? activePath : normalPath}
                  onClick={() => router.push("/")}
                >
                  {t["home"]}
                </button>
              </li>
              <li>
                <button
                  className={getPath === "/ranking" ? activePath : normalPath}
                  onClick={() => router.push("/ranking")}
                >
                  {t["rank"]}
                </button>
              </li>
              <Nav
                className="mt-1 custom-nav-menu z-30 flex"
                appearance="subtle"
              >
                <Nav.Menu title={t["board"]}>
                  {groups?.map((group: GroupType) =>
                    group.boards.map((board: any) => (
                      <Nav.Item
                        key={board.id}
                        as={Link}
                        href={`/board/${board.name}`}
                      >
                        {board.title}
                      </Nav.Item>
                    ))
                  )}
                </Nav.Menu>
              </Nav>
              <li>
                <button
                  className={getPath === "/ads" ? activePath : normalPath}
                  onClick={() => router.push("/ads")}
                >
                  {t["Ads"]}
                </button>
              </li>
            </ul> */}
            <button
              onClick={() => router.push("/add")}
              className={`flex flex-row gap-[4px] items-center 
                bg-primary font-semibold text-white rounded-full py-[6px] px-[12px] text-sm hover:text-white`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
              >
                <path
                  d="M1 5.5H10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.5 1V10"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="whitespace-pre">{t["Add channel"]}</span>
            </button>
            {/* <button
              className={`${
                getPath === "/new-channel"
                  ? activePath + " ml-auto"
                  : normalPath + " ml-auto"
              }`}
              onClick={() => router.push("/add")}
            >
              {t["new-channel-registration"]}
            </button> */}
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
