import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <DefaultSeo
        title='Title'
        titleTemplate='%s | FinCategory'
        description="2500명의 금융 유튜브가 매일 업데이트, 150명의 미녀 룩북 섹시 컨텐트가 있습니다."
        additionalMetaTags={[
          {
            name: 'author',
            content: 'FinCategory CSKIT'
          },
          {
            name: 'keywords',
            content: 'fincategory, telegram, channel, crypto, stock, finance, currencies, exchange'
          },
          {
            property: 'og:locale',
            content: 'ko_KR'
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:rich_attachment',
            content: 'true'
          },
          {
            property: 'og:site_name',
            content: 'FinCategory'
          },
          {
            property: 'og:title',
            content: 'Fincategory'
          },
          {
            property: 'og:description',
            content: 'keywords'
          },
          {
            property: 'og:keywords',
            content: 'keywords '
          },
          {
            property: 'og:url',
            content: 'https://fincategory.com'
          },
          {
            name: 'twitter:card',
            content: 'summary_large_image'
          },
          {
            name: 'twitter:site',
            content: 'Fincategory'
          },
          {
            name: 'twitter:title',
            content: 'Fincategory'
          },
          {
            name: 'twitter:description',
            content: 'Fincategory'
          },
          {
            name: 'twitter:keywords',
            content: 'twitter keywords'
          },
          {
            name: 'twitter:image',
            content: ''
          },
          {
            name: 'twitter:creator',
            content: 'FinCategory'
          },
        ]
        }
        twitter={{
          site: 'fincategory.com'
        }}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
