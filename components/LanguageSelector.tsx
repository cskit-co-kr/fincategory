import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

function LanguageSelector() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === "ko" ? koKR : enUS;

  const [isOpen, setIsOpen] = useState(false);

  const browseRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(event: any) {
      if (
        browseRef.current &&
        !browseRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    window.addEventListener("click", handleClick, true);
    return () => window.removeEventListener("click", handleClick, true);
  }, [isOpen]);

  const handleClick = (lang: string) => {
    // console.log("router.asPath", router.asPath);
    router.push(router.asPath, router.asPath, { locale: lang });
    // console.log("router", router);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex gap-1 lg:min-w-[66px] items-center text-[12px] font-bold px-[12px] lg:px-[0px]"
      >
        {locale !== "en" ? (
          <div className="flex gap-[6px] items-center">
            <Image src="/south-korea.png" width={20} height={20} alt="Korean" />
            <span className="hidden lg:inline-flex">{t["Korean"]}</span>
          </div>
        ) : (
          <div className="flex gap-[6px]">
            <Image
              src="/united-states.png"
              width={20}
              height={20}
              alt="English"
            />
            <span className="hidden lg:inline-flex">{t["English"]}</span>
          </div>
        )}
        <div className="hidden ml-[6px] lg:inline-flex">
          {!isOpen ? (
            <ChevronDownIcon className="h-3" />
          ) : (
            <ChevronUpIcon className="h-3" />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute -left-[135px] lg:-left-[17px] p-2 top-7 gap-2 z-50 border border-[#EFF2F5] shadow-md bg-white flex flex-col rounded-md w-[181px]"
          ref={browseRef}
        >
          <button
            className={`flex gap-[6px] hover:bg-gray-50 rounded-lg p-2 text-[14px] ${
              locale === "en" ? "bg-[#3687E21A] font-bold" : "font-normal"
            }`}
            onClick={() => handleClick("en")}
          >
            <Image
              src="/united-states.png"
              width={20}
              height={20}
              alt="English"
            />
            {t["English"]}
            <span className="text-[#666F79] font-semibold ml-auto">EN</span>
          </button>
          <button
            className={`flex gap-[6px] hover:bg-gray-50 rounded-lg p-2 text-[14px] ${
              locale === "ko" ? "bg-[#3687E21A] font-bold" : "font-normal"
            }`}
            onClick={() => handleClick("ko")}
          >
            <Image src="/south-korea.png" width={20} height={20} alt="Korean" />
            {t["Korean"]}
            <span className="text-[#666F79] font-semibold ml-auto">KR</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
