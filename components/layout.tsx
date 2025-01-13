import Footer from "./Footer";
import Header from "./Header";
import { ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";

const Layout = ({ children }: any) => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;
  return (
    <>
      <div className={`relative wrapper bg-gray-50`}>
        {/* <Link
          href='https://t.me/fincatele'
          target='_blank'
          className='hidden md:block fixed right-10 bottom-10 rounded-full shadow-lg bg-primary p-3 group z-[9999]'
        >
          <ChatBubbleLeftEllipsisIcon className='h-6 text-white group-hover:animate-spin' />
        </Link> */}
        <Header />
        <main>
          {/* PROMOTION */}
          <div
            className={`flex gap-[6px] justify-center py-[10px] items-center rouded-[25px] bg-blue-gradient my-[15px] leading-[20px] text-black
        text-[12px] md:text-[15px] md:gap-[8px] md:py-[12px] md:my-[20px] ${
          router.pathname === "/auth/signin" ||
          router.pathname === "/auth/signup"
            ? "hidden sm:flex"
            : ""
        }`}
          >
            <Image src={"/img/Gift.svg"} width={20} height={20} alt="Gift" />
            {locale === "en" ? (
              <p className="">
                Free <span className="font-semibold">1 {t["month"]}</span>{" "}
                channel promotion.{" "}
                <Link href={`/auth/signup`} className="underline">
                  {t["sign-up"]}
                </Link>{" "}
                and get{" "}
                <span className="text-dark-primary font-semibold">
                  20,000 coins
                </span>
              </p>
            ) : (
              <p className="">
                <span className="font-semibold">1 {t["month"]}</span> 간 채널
                무료홍보. 지금{" "}
                <Link href={`/auth/signup`} className="underline">
                  가입
                </Link>{" "}
                하고{" "}
                <span className="text-dark-primary font-semibold">
                  20,000 coins
                </span>{" "}
                받으세요.
              </p>
            )}
          </div>
          {/*  */}
          <div className="container" id="main">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
