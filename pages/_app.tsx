import "rsuite/dist/rsuite-no-reset.min.css";
import "../styles/globals.css";

import axios from "axios";
import { hasCookie, setCookie } from "cookies-next";
import { SessionProvider } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import Head from "next/head";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { DataProvider } from "../context/context";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import { url } from "inspector";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const env = process.env.NODE_ENV;

  const session = pageProps?.session;
  useEffect(() => {
    const setVisit = async () => {
      if (env !== "development") {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/visit`);
        const data = await res.data;
        if (data.code === 200) {
          const today = new Date();
          setCookie("visit", today.getTime());
        }
      }
    };
    if (!hasCookie("visit")) {
      setVisit();
    }
    // const getMeta = async () => {
    //   const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/meta/read`);
    //   const result = await response.data;
    //   const parsedMeta = result.meta[0].meta.replace(/\n/g, '').replace(/'/g, '"');
    //   setAdditionalMeta(JSON.parse(parsedMeta));
    //   setTitle(result.meta[0].title);
    //   setTitleTemplate(result.meta[0].titleTemplate);
    //   setDescription(result.meta[0].description);
    // };
    // getMeta();
  }, []);

  return (
    <>
      <DefaultSeo
        title={"핀카텔레"}
        additionalLinkTags={[
          { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
          { rel: "apple-touch-icon", href: "/logo.png" },
        ]}
        openGraph={{
          type: "website",
          url: "https://www.finca.co.kr",
          title: "핀카텔레",
          description: "2000개 이상의 대한민국 코인, 금융, 정보취미, 정치사회 텔레그램 채널이 한자리에",
          images: [{ url: "/favicon.ico" }],
          site_name: "핀카텔레",
        }}
        additionalMetaTags={[
          { name: "naver-site-verification", content: "42d7d5e1feda204b892be0e4ef58262cc9de279b" },
          { name: "author", content: "핀카" },
          {
            name: "keywords",
            content:
              "텔레그램, 유빈아카이브, 코인텔레그램, 주식, 취미, k pop,  비트코인, 메타버스, NFT, 취미생활방, 코인왕, DeFi 농부 조선생, 크립토 트랜드, 코인 공지방, 주식급등일보, 가치투자클럽, 여의도스토리, 야뎊저장용, 🤍여캠&인스타&인플 모음🤍, 로직파일, 지옥열차, 심기불편한 시팡이 공부방",
          },
        ]}
        titleTemplate={"핀카텔레"}
        description={"2000개 이상의 대한민국 코인, 금융, 정보취미, 정치사회 텔레그램 채널이 한자리에"}
        twitter={{
          site: "finca.co.kr",
        }}
      />

      {env === "development" ? "" : <GoogleAnalytics />}
      <SessionProvider session={session}>
        <DataProvider>
          <Layout>
            <NextNProgress color='#3886E2' height={2} options={{ showSpinner: false }} />
            <Component key={router.asPath} {...pageProps} />
          </Layout>
        </DataProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
