import axios from 'axios'
import Head from 'next/head'
import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import { useRouter } from 'next/router'

const add = ({ categories, countries, languages }:any) => {
    const router = useRouter()
    
    const { locale }:any = router
    const t = locale === 'ko' ? koKR : enUS

    const cats = categories?.map((item:any) => {
        const obj = JSON.parse(item.name)
        return(
            {
            value: item.id,
            label: locale === "ko" ? obj.ko : obj.en
            }
        )
    })
  return (
    <div className='flex flex-col pt-36 bg-gray-50 min-h-screen'>
        <Head>
            <title>FinCategory - Add channel</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Header />

        <div className='md:flex md:flex-col xl:w-[1280px] mx-auto'>
            <div className='text-xl font-bold text-center'>{t['add-channel']}</div>
            <div className='p-5 gap-3 border flex flex-col border-gray-200 rounded-md bg-white w-2/4 mx-auto mt-4'>
                <label>{t['link-to']}</label>
                <input type='text' placeholder='@username, t.me/joinchat/ASRJIfjdk...' className='border border-gray-200 rounded-md p-2 outline-none' />
                <label>{t['country']}</label>
                <select className='border border-gray-200 rounded-md p-2 outline-none'>
                    <option value=''>{t['choose-country']}</option>
                    {
                        countries.map((country:any) => {
                            return <option value={country.id}>{country.nicename}</option>
                        })
                    }
                </select>
                <label>{t['channel-language']}</label>
                <select className='border border-gray-200 rounded-md p-2 outline-none'>
                    <option value=''>{t['choose-language']}</option>
                    {
                        languages.map((language:any) => {
                            return <option value={language.id}>{language.value}</option>
                        })
                    }
                </select>
                <label>{t['channel-category']}</label>
                <select className='border border-gray-200 rounded-md p-2 outline-none'>
                    <option value=''>{t['choose-category']}</option>
                    {
                        cats.map((cat:any) => {
                            return <option value={cat.value}>{cat.label}</option>
                        })
                    }
                </select>
                <button className='bg-primary px-10 rounded-full text-sm py-2 w-fit self-center text-white active:bg-[#143A66]'>{t['send']}</button>
            </div>
        </div>

        <div className='relative flex pt-[320px]'>
            <Footer />
        </div>
    </div>
  )
}

export const getServerSideProps = async () => {

    const result = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCategory`)
    const categories = await result.data
  
    const resCountry = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getCountry`)
    const countries = await resCountry.data
  
    const resLanguage = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getLanguages`)
    const languages = await resLanguage.data
  
    return {
        props: { categories, countries, languages }
    }
  }

export default add