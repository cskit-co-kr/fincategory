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

interface CustomAppProps extends AppProps {
  meta: any; // Replace 'any' with the actual type of your 'meta' property
}

function MyApp({ Component, pageProps, meta }: CustomAppProps) {
  const router = useRouter();
  const env = process.env.NODE_ENV;

  const session = pageProps?.session;

  // const [additionalMeta, setAdditionalMeta] = useState([]);
  // const [title, setTitle] = useState('');
  // const [titleTemplate, setTitleTemplate] = useState('');
  // const [description, setDescription] = useState('');

  const parsedMeta = meta.meta[0].meta.replace(/\n/g, "").replace(/'/g, '"');
  const additionalMeta = JSON.parse(parsedMeta);
  const title = meta.meta[0].title;
  const titleTemplate = meta.meta[0].titleTemplate;
  const description = meta.meta[0].description;

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
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/logo.png' />
        <meta name='naver-site-verification' content='42d7d5e1feda204b892be0e4ef58262cc9de279b' />
      </Head>
      <DefaultSeo
        title={title}
        titleTemplate={titleTemplate}
        description={description}
        additionalMetaTags={additionalMeta}
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

MyApp.getInitialProps = async () => {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/meta/read`);
  const meta = await res.data;
  return { meta };
};

export default MyApp;
