import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'

const Home: NextPage = () => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS

  return (
    <div className='flex flex-col pt-36 bg-gray-50 min-h-screen'>
      <Head>
        <title>FinCategory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />

      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-3 gap-5'>
          <div className='border border-gray-200 rounded-md bg-white'>1</div>
          <div className='border border-gray-200 rounded-md bg-white'>2</div>
          <div className='border border-gray-200 rounded-md bg-white'>3</div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
