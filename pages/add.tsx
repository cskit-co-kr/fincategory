import axios from "axios";
import { NextSeo } from "next-seo";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal, SelectPicker } from "rsuite";
import { enUS } from "../lang/en-US";
import { koKR } from "../lang/ko-KR";
import { Button } from "antd";

// type Languages = Array<Language>;

type AddComponentProps = {
  _categories: any;
  _languages: any;
};

const add = ({ _categories, _languages }: AddComponentProps) => {
  const router = useRouter();

  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const cats = _categories
    ?.map((item: any) => {
      const obj = JSON.parse(item.name);
      return {
        label: locale === "ko" ? obj.ko : obj.en,
        value: item.id,
        icon: item.image_path,
      };
    })
    ?.sort((a: any, b: any) => a.label.localeCompare(b.label, locale));

  // console.log(_languages);
  const languages = _languages
    ?.map((item: { value: string; id: any }) => {
      let icon = undefined;

      switch (item?.value) {
        case "English":
          icon = "US.png";
          break;
        case "Korean":
          icon = "KR.png";
          break;
        // case "Chinese":
        //   icon = "CN.png";
        //   break;
        // case "Japanese":
        //   icon = "JP.png";
        //   break;
        // case "Kazakh":
        //   icon = "KZ.png";
        //   break;
        // case "Hindi":
        //   icon = "IN.png";
        //   break;
        // case "German":
        //   icon = "DE.png";
        //   break;
        // case "Mongolian":
        //   icon = "MN.png";
        //   break;
        // case "Russian":
        //   icon = "RU.png";
        //   break;
        default:
          break;
      }

      if (icon != undefined) {
        return {
          // label: t[item?.value as keyof typeof t], // Safely access the label
          label: item?.value,
          value: item.id,
          icon: icon,
        };
      }
      return null; // Return null for items without icons
    })
    .filter((item: { value: string; id: any }) => item !== null); // Filter out null values

  const [input, setInput] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<any>("");
  const [isSeccuss, setIsSeccuss] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorInput, setErrorInput] = useState<string | null>(null);
  const [errorCountry, setErrorCountry] = useState<string | null>(null);
  const [errorLanguage, setErrorLanguage] = useState<string | null>(null);
  const [errorCategory, setErrorCategory] = useState<string | null>(null);

  async function handleSubmit() {
    input === ""
      ? setErrorInput(t["please-username"])
      : errorInput === ""
      ? setErrorInput(null)
      : null;
    selectedLanguage === ""
      ? setErrorLanguage(t["please-language"])
      : setErrorLanguage(null);
    selectedCategory === ""
      ? setErrorCategory(t["please-category"])
      : setErrorCategory(null);

    if (!errorInput && !errorCountry && !errorLanguage && !errorCategory) {
      setLoading(true);
      let text = extractUsername(input);
      if (input !== "" && selectedLanguage !== "" && selectedCategory !== "") {
        const data = {
          title: text.trim(),
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
        if (!!result?.message && response.status === 200) {
          setInput("");
          setSelectedLanguage("");
          setSelectedCategory("");
          setLoading(false);
          setIsSeccuss(result?.message);
        } else {
          setInput("");
          setSelectedLanguage("");
          setLoading(false);
          setSelectedCategory("");
          setErrorMessage(result?.message);
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
    <div className="flex text-[#1C1E21] flex-col pt-7 bg-gray-50 min-h-screen">
      <NextSeo
        title={`${t["add-channel-seo"]}`}
        titleTemplate={`${t["add-channel-seo"]}`}
        // description={
        //   "채널 그룹을 누구나 자유롭게 추가할수 있습니다. 채널, 그룹은 관리자의 승인 후 등록됩니다."
        // }
      />
      <div className="md:flex w-full xl:w-[1300px] gap-4 mx-auto">
        {/* <div className="text-xl font-bold text-center">{t["add-channel"]}</div> */}
        <div className="p-5 md:p-[30px] gap-3 grid rounded-lg bg-white md:w-2/4 mx-5 md:mx-auto mt-4">
          <div className="w-full flex justify-center items-center gap-4 mb-5 flex-col">
            <img src="/addChannel.png" className="h-[150px] w-[150px]" />
            <div className="font-semibold text-xl">{t["Add channel"]}</div>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="font-semibold leading-5 h-5">{t["link-to"]}</div>
            <input
              value={input}
              onChange={onChangeInput}
              onMouseLeave={(e) => checkUsername(e)}
              type="text"
              placeholder="@username, t.me/ASRJIfjdk..., t.me/+ABCD12345"
              className="border border-gray-200 rounded-md px-2 h-[45px] outline-non"
            />
            {errorInput !== null ? (
              <div className="text-red-500 -mt-3 italic">{errorInput}</div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col md:flex-row md:mt-5 w-full gap-4">
            <div className="flex w-full flex-col gap-2">
              <div className="font-semibold min-w-[140px]">{t["category"]}</div>
              <SelectPicker
                className="w-full"
                placement="topStart"
                value={selectedCategory}
                renderMenuItem={(label, item) => (
                  <div className="flex gap-3 py-2 text-[#1C1E21]">
                    <Image
                      className="max-h-[20px] max-w-[20px]"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/files/getImage?image_path=${item?.icon}`}
                      alt="image_path"
                      height={20}
                      width={20}
                    />
                    {label}
                  </div>
                )}
                menuClassName="scrollThin flex-col-reverse"
                onChange={setSelectedCategory}
                name="category"
                data={cats}
                placeholder={t["select-topic"]}
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="font-semibold ">{t["contents-language"]}</div>
              <SelectPicker
                className="w-full"
                placement="topStart"
                menuClassName="scrollThin"
                renderMenuItem={(label, item) => (
                  <div className="flex gap-2 py-2 text-[#1C1E21]">
                    <Image
                      className="max-h-[20px] max-w-[20px]"
                      src={`/flag/${item?.icon}`}
                      alt="image_path"
                      height={20}
                      width={20}
                    />
                    {label}
                  </div>
                )}
                onChange={setSelectedLanguage}
                name="language"
                data={languages}
                value={selectedLanguage}
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

            {errorCategory !== null ? (
              <div className="text-red-500 -mt-3 italic ml-auto">
                {errorCategory}
              </div>
            ) : (
              ""
            )}
          </div>
          <Button
            loading={loading}
            disabled={loading}
            type="primary"
            onClick={() => handleSubmit()}
            className="mt-5 bg-primary px-8 rounded-full text-sm h-[44px] w-fit mx-auto text-white active:bg-[#143A66]"
          >
            {t["등록"]}
          </Button>
        </div>
        <div className="p-5 md:p-10 md:pb-0 gap-4 mb-10 flex flex-col items-center rounded-lg bg-white md:w-2/4 mx-5 md:mx-auto mt-4">
          <div className="w-full text-center font-semibold text-xl">
            Copy channel link
          </div>
          <div className="text-[#666F79] text-sm leading-6">
            Open the Telegram application and find the desired channel.  
            <p>
              Copy the channel's link, and paste this link into the search field
            </p>
          </div>
          <img src="/iphoneWithLink.png" className="mt-5" />
        </div>
        {/* <div className="mx-auto mt-8 px-5  text-[#3687E2] font-medium">
          * {t["채널/그룹을 추가하면 1시간 이내 자동추가 됩니다."]}
          <br />* {t["채널 정보를 불러올 수 없으면 자동추가되지 않습니다."]}
        </div> */}
      </div>
      <Modal
        backdrop="static"
        backdropClassName=""
        dialogStyle={{ width: "495px" }}
        role="contentinfo"
        open={!!isSeccuss}
        onClose={() => setIsSeccuss(null)}
        size="xs"
      >
        <Modal.Body className="flex items-center flex-col !overflow-visible relative w-full p-5 pt-0 gap-5">
          <img
            onClick={() => setIsSeccuss(null)}
            src="/X.png"
            className="absolute cursor-pointer -top-5 right-0"
          />
          <img src="/done.png" />
          <div className="text-2xl text-center text-[#1C1E21] font-semibold">
            The channel has been successfully added.
          </div>
          <div className="text-base text-[#666F79] text-center">
            Go to the channel page right now.
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center py-5 gap-2">
          <button
            onClick={() => router.push("/channel/" + isSeccuss)}
            className="bg-primary px-10 py-2 rounded-full text-white hover:underline"
          >
            {t["ok"]}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        backdrop="static"
        backdropClassName=""
        dialogStyle={{ width: "495px" }}
        role="contentinfo"
        open={!!errorMessage}
        onClose={() => setErrorMessage("")}
        size="xs"
      >
        <Modal.Body className="flex items-center flex-col !overflow-visible relative w-full p-5 pt-0 gap-5">
          <img
            onClick={() => setErrorMessage("")}
            src="/X.png"
            className="absolute cursor-pointer -top-5 right-0"
          />
          <img src="/errorIcon.png" />
          <div className="text-2xl text-center text-[#1C1E21] font-semibold">
            Channel addition failed
          </div>
          <div className="text-base text-[#666F79] text-center">
            {errorMessage}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center py-5 gap-2">
          <button
            onClick={() => setErrorMessage("")}
            className="border-[#E7EAED] bg-white px-10 py-2 rounded-full text-black border hover:underline"
          >
            {t["Cancel"]}
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-[#FF7171] px-10 py-2 rounded-full text-white hover:underline"
          >
            Main page
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export const getServerSideProps = async () => {
  const result = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`
  );
  const _categories = await result.data;

  const resLanguage = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`
  );
  const _languages = await resLanguage.data;
  // console.log("--------------------------------------->");
  // console.log(_languages);

  return {
    props: { _categories, _languages },
  };
};

export default add;
