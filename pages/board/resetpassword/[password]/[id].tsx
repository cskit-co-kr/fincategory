import { getSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useState } from "react";
import { Loader } from "rsuite";
import { enUS } from "../../../../lang/en-US";
import { koKR } from "../../../../lang/ko-KR";
import { message } from "antd";

const ResetPassword = () => {
  const router = useRouter();
  const [isVisiblePassword2, setIsVisiblePassword2] = useState(false);
  const [isVisiblePassword1, setIsVisiblePassword1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [seccussfully, setSeccussfully] = useState(false);
  const { locale }: any = router;
  const t = locale === "ko" ? koKR : enUS;

  const onChangePassword = async () => {
    if (password1 === password2) {
      if (password1.length < 6) {
        setErrorMessage("no to min 6");
        return;
      }
      if (password1.length > 20) {
        setErrorMessage("no to max 20");
        return;
      }
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=updatepassword`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            old: router.query.password,
            password: password1,
            userid: router.query.id,
          }),
        }
      );
      const result = await response.json();
      setLoading(false);
      if (result.code === 200 && result.message === "Password Changed") {
        setSeccussfully(true);
      } else if (result.code === 201) {
        setErrorMessage(t["Password don’t match"]);
      }
    } else {
      setErrorMessage(t["Password don’t match"]);
    }
  };
  return (
    <>
      <NextSeo
        title={`핀카텔레 | ${t["reset password"]}`}
        titleTemplate={`핀카텔레 | ${t["reset password"]}`}
        description={`핀카텔레 | ${t["reset password"]}`}
      />
      <div className="gap-4 pt-7 h-[calc(100vh-250px)] flex items-center justify-center bg-gray-50">
        {seccussfully ? (
          <div className="w-full xl:w-[500px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm">
            <div className="flex w-full justify-center ">
              <img src="/done.svg" alt="" />
            </div>
            <div className="font-semibold font-raleway text-base mt-6 text-black text-center">
              {t["Password changed successfully !"]}
            </div>
            <div className="font-medium font-raleway text-sm mt-6 text-[#00000080] text-center">
              {t["Please login to your email account again"]}
            </div>
            <button
              onClick={() =>
                router.push(
                  "/board/signin?callbackUrl=https%3A%2F%2Ffinca.co.kr"
                )
              }
              className={`cursor-pointer bg-primary font-semibold text-white py-3 px-5 text-base mt-10 w-full rounded-md flex gap-1 items-center justify-center`}
            >
              {!!loading && <Loader />}
              <div>{t["Login now"]}</div>
            </button>
          </div>
        ) : (
          <div className="w-full xl:w-[500px] mx-auto border border-gray-200 bg-white rounded-md p-[30px] shadow-sm">
            <div className="flex gap-[10px] items-center border-b border-gray-200 pb-2.5">
              <img src="/LockSimple.svg" />
              <span className="font-semibold text-base">
                {t["Set password"]}
              </span>
            </div>

            <div className="mt-6">
              <div className="w-full border border-gray-200 rounded-t-md px-4 py-2 flex items-center gap-[10px]">
                <img src="/Key.svg" />
                <input
                  onChange={(e) => {
                    setPassword1(e.target.value);
                    setErrorMessage("");
                  }}
                  value={password1}
                  type={isVisiblePassword1 ? "text" : "password"}
                  placeholder={t["Create Password"]}
                  className="w-full outline-none p-1"
                />
                <img
                  src="/eye.svg"
                  onClick={() => setIsVisiblePassword1(!isVisiblePassword1)}
                  className={`cursor-pointer ${
                    isVisiblePassword1
                      ? "opacity-100 hover:opacity-80"
                      : "opacity-20 hover:opacity-50"
                  }`}
                />
              </div>
              <div className="w-full border border-gray-200 rounded-b-md px-4 py-2 flex items-center gap-[10px] -mt-[1px]">
                <img src="/Key.svg" />
                <input
                  onChange={(e) => {
                    setPassword2(e.target.value);
                    setErrorMessage("");
                  }}
                  value={password2}
                  type={isVisiblePassword2 ? "text" : "password"}
                  placeholder={t["Re-enter Password"]}
                  className="w-full outline-none p-1"
                />
                <img
                  src="/eye.svg"
                  onClick={() => setIsVisiblePassword2(!isVisiblePassword2)}
                  className={`cursor-pointer  ${
                    isVisiblePassword2
                      ? "opacity-100 hover:opacity-80"
                      : "opacity-20 hover:opacity-50"
                  }`}
                />
              </div>
              <div className="font-raleway mt-3 text-[#FF2828] text-sm font-medium h-5">
                {errorMessage}
              </div>
              <button
                disabled={!password1 || !password2}
                onClick={() => onChangePassword()}
                className={`${
                  !password1 || !password2
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                } bg-primary font-semibold text-white py-3 px-5 text-base mt-6 w-full rounded-md flex gap-1 items-center justify-center`}
              >
                {!!loading && <Loader />}
                <div>{t["Set password"]}</div>
              </button>
              <div className="flex w-full justify-center mt-6 font-raleway font-medium text-[#00000080]">
                <button onClick={() => router.push("/")}>{t["Cancel"]}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/board/profile",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

// function encryptData(data: any, secretKey: any) {
//   const dataString = JSON.stringify(data);
//   const encryptedData = CryptoJS.AES.encrypt(dataString, secretKey).toString();
//   return encryptedData;
// }
// function decryptData(encryptedData: any, secretKey: any) {
//   const decryptedData = CryptoJS.AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
//   const dataObject = JSON.parse(decryptedData);
//   return dataObject;
// }

export default ResetPassword;
