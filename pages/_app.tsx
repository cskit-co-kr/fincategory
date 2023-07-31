import 'rsuite/dist/rsuite.min.css';
// import '../styles/widget-frame.css';
// import '../styles/telegram-web.css';
import '../styles/globals.css';

import axios from 'axios';
import { hasCookie, setCookie } from 'cookies-next';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import { useEffect } from 'react';
import Layout from '../components/layout';
import { DataProvider } from '../context/context';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const env = process.env.NODE_ENV;
  const setVisit = async () => {
    if (env !== 'development') {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/visit`);
      const data = await res.data;
      if (data.code === 200) {
        const today = new Date();
        setCookie('visit', today.getTime());
      }
    }
  };

  useEffect(() => {
    if (!hasCookie('visit')) {
      setVisit();
    }
  }, []);

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <DefaultSeo
        title='핀카'
        titleTemplate='%s | FinCa'
        description='가장 큰 한국 텔레그램 채널정보는 핀카 | finca'
        additionalMetaTags={[
          {
            name: 'author',
            content: 'FinCa',
          },
          {
            name: 'keywords',
            content:
              'telegram catalog, catalog, telegram, telegram channels, best channels, 텔레그램 카탈로그, 텔레그램 채널, 텔레그램, 한국 텔레그램 채널들, 텔레그램 그룹 카탈로그, 주식, 금융, 암호화폐, 해외선물, 경제, 부동산, 네오, 대시, 도지코인, 라이트코인, 루나, 루프링, 리플, 바이낸스코인, 베이직 어텐션 토큰, 비트코인 골드, 솔라나, 시바이누, 아비트럼,이더리움, 테더',
          },
          {
            property: 'og:locale',
            content: 'ko_KR',
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:rich_attachment',
            content: 'true',
          },
          {
            property: 'og:site_name',
            content: 'FinCa',
          },
          {
            property: 'og:title',
            content: 'FinCa | 텔레그램 채널정보, 핀카',
          },
          {
            property: 'og:description',
            content: '가장 큰 한국 텔레그램 채널정보는 핀카 | finca',
          },
          {
            property: 'og:keywords',
            content:
              'telegram catalog, catalog, telegram, telegram channels, best channels, 텔레그램 카탈로그, 텔레그램 채널, 텔레그램, 한국 텔레그램 채널들, 텔레그램 그룹 카탈로그, 주식, 금융, 암호화폐, 해외선물, 경제, 부동산, 네오, 대시, 도지코인, 라이트코인, 루나, 루프링, 리플, 바이낸스코인, 베이직 어텐션 토큰, 비트코인 골드, 솔라나, 시바이누, 아비트럼,이더리움,  테더 ',
          },
          {
            property: 'og:url',
            content: 'https://fincategory.com',
          },
          {
            property: 'og:image',
            content: 'https://fincategory.com/logo.png',
          },
          {
            property: 'og:image:type',
            content: 'png',
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
          {
            name: 'twitter:site',
            content: 'FinCa',
          },
          {
            name: 'twitter:title',
            content: 'FinCa | 텔레그램 채널정보, 핀카',
          },
          {
            name: 'twitter:description',
            content: '가장 큰 한국 텔레그램 채널정보는 핀카 | finca',
          },
          {
            name: 'twitter:keywords',
            content:
              'telegram catalog, catalog, telegram, telegram channels, best channels, 텔레그램 카탈로그, 텔레그램 채널, 텔레그램, 한국 텔레그램 채널들, 텔레그램 그룹 카탈로그, 주식, 금융, 암호화폐, 해외선물, 경제, 부동산, 네오, 대시, 도지코인, 라이트코인, 루나, 루프링, 리플, 바이낸스코인, 베이직 어텐션 토큰, 비트코인 골드, 솔라나, 시바이누, 아비트럼,이더리움,  테더',
          },
          {
            name: 'twitter:image',
            content: 'https://fincategory.com/logo.png',
          },
          {
            name: 'twitter:creator',
            content: 'FinCa',
          },
        ]}
        twitter={{
          site: 'fincategory.com',
        }}
      />

      {env === 'development' ? '' : <GoogleAnalytics />}
      <SessionProvider session={session}>
        <DataProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </DataProvider>
      </SessionProvider>
      {/* <Script
        id='hi-stat'
        dangerouslySetInnerHTML={{
          __html: `
            var _Hasync= _Hasync|| [];
            _Hasync.push(['Histats.start', '1,4764338,4,0,0,0,00010000']);
            _Hasync.push(['Histats.fasi', '1']);
            _Hasync.push(['Histats.track_hits', '']);
            (function() {
            var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
            hs.src = ('//s10.histats.com/js15_as.js');
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
            })();
          `,
        }}
      />
      <noscript>
        <a href='/' target='_blank' className='hidden'>
          <img src='//sstatic1.histats.com/0.gif?4764338&101' alt='free stats' />
        </a>
      </noscript> */}
    </>
  );
}

export default MyApp;
