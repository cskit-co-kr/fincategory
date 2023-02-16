import axios from 'axios'
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { GetChannelsByCategory } from '../components/channel/GetChannelsByCategory'
import CustomImage from '../components/channel/CustomImage'
import Link from 'next/link'

const Home: NextPage = ({ channels, categories }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channels.channel_id}/avatar.jfif`
  const [error, setError] = useState<boolean>(false)

  const cats = categories?.map((item:any) => {
    const obj = JSON.parse(item.name)
    return(
        {
        value: item.id,
        label: locale === "ko" ? obj.ko : obj.en
        }
    )
  })
  const [category, setCategory] = useState<any>([])

  useEffect(() => {
    setCategory(cats)
  }, [locale])

  return (
    <div className='flex flex-col pt-36 bg-gray-50 min-h-screen'>
      <Head>
        <title>FinCategory</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />

      <div className='md:flex md:flex-col xl:w-[1280px] mx-auto'>

        <div className='grid grid-cols-3 gap-5'>
          {
            channels.map((channel:any, index:number) => (
              <div key={index} className='flex border border-gray-200 rounded-md bg-white w-[420px] p-4'>
                <Link href={"/channel/"+channel.username} className='hover:no-underline text-black hover:text-black'>
                <div className='flex gap-[10px]'>
                  <div className='flex flex-col items-center min-w-[100px] gap-3'>
                    <CustomImage 
                      className='rounded-full' 
                      alt={channel.title} 
                      src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`} 
                      width={100}
                      height={100}
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
                      {channel.country && channel.country.nicename}, {channel.language && channel.language.value}
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            ))
          }
        </div>

        <div className='grid grid-cols-3 mt-4 gap-5'>
          {
            category?.map((category:any, index:number) => (
              <div key={index}>
                <div className='flex items-center w-[420px]'>
                  <h2 className='font-bold'>{category.label}</h2>
                  <a href='' className='ml-auto flex gap-1 items-center text-xs text-primary'>{t['see-more']}<ChevronRightIcon className='h-3' /></a>
                </div>
                <div className='md:grid md:grid-cols-3 border border-gray-200 rounded-md bg-white w-[420px] p-4'>
                  { <GetChannelsByCategory value={category.value} label={category.label} /> }
                </div>
              </div>
            ))
          }
        </div>

      </div>
      <div className='relative flex pt-[320px]'>
        <Footer />
      </div>
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
    paginate: {limit: 3, offset: 0},
    sort: {field: 'subscription', order: 'desc'}
  }

  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/searchChannel`, data)
  const channels = await response.data.channel

  const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`)
  const categories = await result.data

  return {
      props: { channels, categories }
  }
}



export default Home
