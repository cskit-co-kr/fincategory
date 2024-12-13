import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { SelectPicker } from "rsuite";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { Language } from "../typings";
import { NextSeo } from "next-seo";

// type Languages = Array<Language>;

type AddComponentProps = {
  _categories: any;
  _countries: any;
  _languages: any;
};

const add = ({ _categories, _countries, _languages }: AddComponentProps) => {
  const router = useRouter();

  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const cats = _categories?.map((item: any) => {
    const obj = JSON.parse(item.name);
    return {
      label: locale === "ko" ? obj.ko : obj.en,
      value: item.id,
    };
  });

  const countries = _countries?.map((item: any) => {
    return {
      label: t[item.iso as keyof typeof t],
      value: item.id,
    };
  });
  const languages = _languages?.map((item: any) => {
    return {
      label: t[item.value as keyof typeof t],
      value: item.id,
    };
  });

  const [input, setInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [selectedCountry, setSelectedCountry] = useState<any>("");
  const [selectedLanguage, setSelectedLanguage] = useState<any>("");

  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [errorCountry, setErrorCountry] = useState<string | null>(null);
  const [errorLanguage, setErrorLanguage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  const [resultState, setResultState] = useState<string | null>(null);

  async function handleSubmit() {
    input === ""
      ? setErrorInput(t["please-username"])
      : errorInput === ""
      ? setErrorInput(null)
      : null;
    selectedCountry === ""
      ? setErrorCountry(t["please-country"])
      : setErrorCountry(null);
    selectedLanguage === ""
      ? setErrorLanguage(t["please-language"])
      : setErrorLanguage(null);
    selectedCategory === ""
      ? setErrorCategory(t["please-category"])
      : setErrorCategory(null);

    if (!errorInput && !errorCountry && !errorLanguage && !errorCategory) {
      let text = extractUsername(input);
      if (
        input !== "" &&
        selectedCountry !== "" &&
        selectedLanguage !== "" &&
        selectedCategory !== ""
      ) {
        const data = {
          title: text.trim(),
          country: selectedCountry,
          language: selectedLanguage,
          category: selectedCategory,
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/addchannel`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = await response.json();
        if (result === "OK") {
          setResultState(`${text} ${t["channel-add"]}`);
          setInput("");
          setSelectedCountry("");
          setSelectedLanguage("");
          setSelectedCategory("");
        } else {
          setResultState(`"${text}" ${t["channel-add-error"]}`);
        }
      }
    }
  }
  const extractUsername = (input: any) => {
    let arr = [];
    let text = "";

    if (input.includes("@")) {
      arr = input.split("@");
      text = arr.reverse()[0];
    } else if (input.includes("/")) {
      arr = input.split("/");
      text = arr.reverse()[0];
    } else {
      text = input;
    }
    return text;
  };

  const checkUsername = async (e: any) => {
    if (e.target.value !== "") {
      const username = extractUsername(e.target.value);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/resolvechannel?username=${username}`
      );
      const data = await res.data;
      if (data.existed) {
        setErrorInput(t["username-existed"]);
      }
    }
  };

  const onChangeInput = (e: any) => {
    setInput(e.target.value);
    setErrorInput(null);
  };

  return (
    <div className="flex flex-col pt-7 bg-gray-50 min-h-screen">
      <NextSeo
        title={`광고 | ${t["add-channel"]}`}
        titleTemplate={`광고 | ${t["add-channel"]}`}
        description={
          "채널 그룹을 누구나 자유롭게 추가할수 있습니다. 채널, 그룹은 관리자의 승인 후 등록됩니다."
        }
      />
      <div className="md:flex md:flex-col w-full xl:w-[1280px] mx-auto">
        <div className="text-xl font-bold text-center">{t["add-channel"]}</div>
        <div className="p-5 md:p-10 gap-4 grid rounded-lg bg-white md:w-2/4 mx-5 md:mx-auto mt-4">
          {resultState !== null ? (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md font-semibold justify-center">
              {resultState}
            </div>
          ) : (
            ""
          )}
          <div className="font-semibold">
            {t["link-to"]}
            <span className="text-red-500">*</span>
          </div>
          <input
            value={input}
            onChange={onChangeInput}
            onMouseLeave={(e) => checkUsername(e)}
            type="text"
            placeholder="@username, t.me/ASRJIfjdk..., t.me/+ABCD12345"
            className="border border-gray-200 rounded-md p-2 outline-non"
          />
          {errorInput !== null ? (
            <div className="text-red-500 -mt-3 italic">{errorInput}</div>
          ) : (
            ""
          )}
        </div>
        <div className="p-5 md:p-10 gap-4 grid rounded-lg bg-white md:w-2/4 mx-5 md:mx-auto mt-4">
          <div className="flex items-center">
            <div className="font-semibold min-w-[140px]">
              {t["country"]}
              <span className="text-red-500">*</span>
            </div>
            <SelectPicker
              className="w-full"
              onChange={setSelectedCountry}
              name="country"
              data={countries}
              placeholder={t["choose-country"]}
              searchable={false}
            />
          </div>
          {errorCountry !== null ? (
            <div className="text-red-500 -mt-3 italic ml-auto">
              {errorCountry}
            </div>
          ) : (
            ""
          )}
          <div className="flex items-center">
            <div className="font-semibold min-w-[140px]">
              {t["contents-language"]}
              <span className="text-red-500">*</span>
            </div>
            <SelectPicker
              className="w-full"
              onChange={setSelectedLanguage}
              name="language"
              data={languages}
              placeholder={t["choose-language"]}
              searchable={false}
            />
          </div>
          {errorLanguage !== null ? (
            <div className="text-red-500 -mt-3 italic ml-auto">
              {errorLanguage}
            </div>
          ) : (
            ""
          )}
          <div className="flex items-center">
            <div className="font-semibold min-w-[140px]">
              {t["category"]}
              <span className="text-red-500">*</span>
            </div>
            <SelectPicker
              className="w-full"
              onChange={setSelectedCategory}
              name="category"
              data={cats}
              placeholder={t["select-topic"]}
              searchable={false}
            />
          </div>
          {errorCategory !== null ? (
            <div className="text-red-500 -mt-3 italic ml-auto">
              {errorCategory}
            </div>
          ) : (
            ""
          )}
          <button
            onClick={() => handleSubmit()}
            className="mt-2 bg-primary px-10 rounded-md text-sm py-2 w-fit mx-auto text-white active:bg-[#143A66]"
          >
            {t["등록"]}
          </button>
        </div>
        <div className="mx-auto mt-8 px-5  text-[#3687E2] font-medium">
          * {t["채널/그룹을 추가하면 1시간 이내 자동추가 됩니다."]}
          <br />* {t["채널 정보를 불러올 수 없으면 자동추가되지 않습니다."]}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`
  );
  const _categories = await result.data;

  const resCountry = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`
  );
  const _countries = await resCountry.data;

  const resLanguage = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`
  );
  const _languages = await resLanguage.data;
  // console.log("--------------------------------------->");
  // console.log(_languages);

  return {
    props: { _categories, _countries, _languages },
  };
};

export default add;
