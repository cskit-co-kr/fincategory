import axios, { AxiosResponse } from 'axios'
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'

const Home: NextPage = ({ channels }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channels.channel_id}/avatar.jfif`
  const [error, setError] = useState<boolean>(false)

  return (
    <div className='flex flex-col pt-36 bg-gray-50 min-h-screen'>
      <Head>
        <title>FinCategory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />

      <div className='flex w-[1300px] mx-auto'>

        <div className='grid grid-cols-3 gap-5'>
          {
            channels.map((channel:any, index:number) => (
              <div key={index} className='flex border border-gray-200 rounded-md bg-white w-[420px] p-4'>
                <div className='flex gap-[10px]'>
                  <div className='flex flex-col items-center min-w-[100px]'>
                    <Image
                      src={error ? '/telegram-icon-96.png' : avatar}
                      alt={ 'avatar of '+channels.title }
                      width={100}
                      height={100}
                      className='object-contain rounded-full'
                      onError={() => setError(true)}
                    />
                    <div className='flex flex-col items-center text-[12px] text-gray-400'>
                      {t['subscribers']}
                      <span className='font-bold'>{channel.subscription}</span>
                    </div>
                  </div>
                  <div className='flex flex-col'>
                    <h1 className='font-semibold text-sm truncate'>{channel.title}</h1>
                    <p className='text-[12px]'>{channel.description}</p>
                    <div>
                      {channel.country.nicename}, {channel.language && channel.language.value}
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>

      </div>

      <Footer />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const data = {
    query: null,
    withDesc: false,
    category: [],
    country: [],
    language: [],
    channel_type: null,
    channel_age: 0,
    erp: 0,
    subscribers_from: null,
    subscribers_to: null,
    paginate: {limit: 3, offset: 0}
  }

  const response = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, data)
  const channels = await response.data.channel

  return {
      props: { channels }
  }
}

export default Home
