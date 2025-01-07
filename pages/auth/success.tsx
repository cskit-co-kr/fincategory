import {
  LockClosedIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { enUS } from "../../lang/en-US";
import { koKR } from "../../lang/ko-KR";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { getSession } from "next-auth/react";
import Image from "next/image";

const MemberSuccess = () => {
  const router = useRouter();
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  return (
    <div className="flex flex-col items-center justify-center gap-[20px] py-[60px] sm:py-[100px] sm:mt-[40px] sm:mb-[90px] bg-gray-50">
      <Image
        src="/img/CheckCircle.svg"
        width={80}
        height={80}
        alt="CheckCircle"
      />
      <h1 className="font-semibold text-[30px] leading-[32px]">
        {t["congratulations"]}
      </h1>
      <div className="flex items-center justify-center max-w-[513px] text-center text-gray-text leading-[20px] h-[90px]">
        {locale === "en" ? (
          <p>
            {t["account-created"]}
            <br /> We have paid you{" "}
            <span className="text-blue-primary">20,000</span> coins to promote
            your channel for free for 1 month.  Check it out on your{" "}
            <Link href={`/${locale}/auth/profile`} className="underline">
              profile page.
            </Link>
          </p>
        ) : (
          <p>
            {t["account-created"]}
            <br />
            귀하의 채널홍보를 위해 한 달간 무료로{" "}
            <span className="text-blue-primary">20,000</span>개의 코인을
            지급했습니다.{" "}
            <Link href={`/${locale}/auth/profile`} className="underline">
              프로필 페이지
            </Link>
            에서 확인하세요.
          </p>
        )}
      </div>
      <Link
        href={`/${locale}/auth/signin?callbackUrl=/auth/profile`}
        className="bg-blue-primary px-[24px] py-[10px] rounded-[35px] text-white font-semibold leading-[20px]"
      >
        {t["go-to-login-page"]}
      </Link>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/auth/profile", // Redirect to the login page if not logged in
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default MemberSuccess;
