import "rsuite/dist/rsuite.min.css";
import "../styles/globals.css";

import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { GoogleAnalytics } from "nextjs-google-analytics";
import Layout from "../components/layout";
import { DataProvider } from "../context/context";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  const env = process.env.NODE_ENV;
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DefaultSeo
        title="핀카테고리"
        titleTemplate="%s | FinCategory"
        description="가장 큰 한국 텔레그램 채널정보는 핀카테고리 | fincategory."
        additionalMetaTags={[
          {
            name: "title",
            content: "핀카테고리 | FinCategory",
          },
          {
            name: "description",
            content: "가장 큰 한국 텔레그램 채널정보는 핀카테고리 | fincategory.",
          },
          {
            name: "author",
            content: "FinCategory",
          },
          {
            name: "keywords",
            content:
              "telegram catalog, catalog, telegram, telegram channels, best channels, 텔레그램 카탈로그, 텔레그램 채널, 텔레그램, 한국 텔레그램 채널들, 텔레그램 그룹 카탈로그, 주식, 금융, 암호화폐, 해외선물, 경제, 부동산, 네오, 대시, 도지코인, 라이트코인, 루나, 루프링, 리플, 바이낸스코인, 베이직 어텐션 토큰, 비트코인 골드, 솔라나, 시바이누, 아비트럼,이더리움,  테더",
          },
          {
            property: "og:locale",
            content: "ko_KR",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:rich_attachment",
            content: "true",
          },
          {
            property: "og:site_name",
            content: "FinCategory",
          },
          {
            property: "og:title",
            content: "Fincategory",
          },
          {
            property: "og:description",
            content: "keywords",
          },
          {
            property: "og:keywords",
            content: "keywords ",
          },
          {
            property: "og:url",
            content: "https://fincategory.com",
          },
          {
            property: "og:image",
            content: "https://fincategory.com/logo.png",
          },
          {
            property: "og:image:type",
            content: "png",
          },
          {
            name: "twitter:card",
            content: "summary_large_image",
          },
          {
            name: "twitter:site",
            content: "Fincategory",
          },
          {
            name: "twitter:title",
            content: "Fincategory",
          },
          {
            name: "twitter:description",
            content: "Fincategory",
          },
          {
            name: "twitter:keywords",
            content: "twitter keywords",
          },
          {
            name: "twitter:image",
            content: "https://fincategory.com/logo.png",
          },
          {
            name: "twitter:creator",
            content: "FinCategory",
          },
        ]}
        twitter={{
          site: "fincategory.com",
        }}
      />

      {env === "development" ? "" : <GoogleAnalytics />}
      <DataProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </DataProvider>
    </>
  );
}

export default MyApp;
