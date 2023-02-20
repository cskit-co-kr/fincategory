import axios from 'axios'
import Head from 'next/head'
import React, { useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import { useRouter } from 'next/router'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

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

    const [input, setInput] = useState<string>('')
    const [selectedCountry, setSelectedCountry] = useState<string>('')
    const [selectedLanguage, setSelectedLanguage] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    const [errorInput, setErrorInput] = useState<string | null>(null)
    const [errorCountry, setErrorCountry] = useState<string | null>(null)
    const [errorLanguage, setErrorLanguage] = useState<string | null>(null)
    const [errorCategory, setErrorCategory] = useState<string | null>(null)

    const [resultState, setResultState] = useState<string | null>(null)

    async function handleSubmit(){
        input === '' ? setErrorInput(t['please-username']) : setErrorInput(null)
        selectedCountry === '' ? setErrorCountry(t['please-country']) : setErrorCountry(null)
        selectedLanguage === '' ? setErrorLanguage(t['please-language']) : setErrorLanguage(null)
        selectedCategory === '' ? setErrorCategory(t['please-category']) : setErrorCategory(null)

        let text = ''
        let arr = []
        if(input.includes('@')){
            arr = input.split('@')
            text = arr.reverse()[0]
        } else if(input.includes('/')){
            arr = input.split('/')
            text = arr.reverse()[0]
        } else {
            text = input
        }
        if(input !== '' && selectedCountry !== '' && selectedLanguage !== '' && selectedCategory !== ''){
            const data = {
                title: text.trim(),
                country: selectedCountry,
                language: selectedLanguage,
                category: selectedCategory
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/addchannel`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data)
            })
            const result = await response.json()
            if(result === 'OK') {
                setResultState(`${text} ${t['channel-add']}`)
                setInput('')
                setSelectedCountry('')
                setSelectedLanguage('')
                setSelectedCategory('')
            }
        }

    }

  return (
    <div className='flex flex-col pt-36 bg-gray-50 min-h-screen'>
        <Head>
            <title>FinCategory - Add channel</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Header />

        <div className='md:flex md:flex-col w-full xl:w-[1280px] mx-auto'>
            <div className='text-xl font-bold text-center'>{t['add-channel']}</div>
            <div className='p-5 gap-3 border flex flex-col border-gray-200 rounded-md bg-white md:w-2/4 mx-auto mt-4'>
                {resultState !== null ? <div className='flex items-center gap-2 p-3 bg-gray-50 rounded-md font-semibold justify-center'><CheckCircleIcon className='h-6' />{resultState}</div> : ''}
                <label>{t['link-to']}</label>
                <input 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    type='text' 
                    placeholder='@username, t.me/ASRJIfjdk...' 
                    className='border border-gray-200 rounded-md p-2 outline-none' 
                />
                {errorInput !== null ? <div className='text-red-500 -mt-3 italic'>{errorInput}</div> : ''}
                <label>{t['country']}</label>
                <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className='border border-gray-200 rounded-md p-2 outline-none'>
                    <option value=''>{t['choose-country']}</option>
                    {
                        countries.map((country:any, index:number) => {
                            return <option value={country.id} key={index}>{country.nicename}</option>
                        })
                    }
                </select>
                {errorCountry !== null ? <div className='text-red-500 -mt-3 italic'>{errorCountry}</div> : ''}
                <label>{t['channel-language']}</label>
                <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)} className='border border-gray-200 rounded-md p-2 outline-none' name='language'>
                    <option value=''>{t['choose-language']}</option>
                    {
                        languages.map((language:any, index:number) => {
                            return <option value={language.id} key={index}>{language.value}</option>
                        })
                    }
                </select>
                {errorLanguage !== null ? <div className='text-red-500 -mt-3 italic'>{errorLanguage}</div> : ''}
                <label>{t['channel-category']}</label>
                <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className='border border-gray-200 rounded-md p-2 outline-none' name='category'>
                    <option value=''>{t['choose-category']}</option>
                    {
                        cats.map((cat:any, index:number) => {
                            return <option value={cat.value} key={index}>{cat.label}</option>
                        })
                    }
                </select>
                {errorCategory !== null ? <div className='text-red-500 -mt-3 italic'>{errorCategory}</div> : ''}
                <button onClick={() => handleSubmit()} className='bg-primary px-10 rounded-full text-sm py-2 w-fit self-center text-white active:bg-[#143A66]'>
                    {t['send']}
                </button>
            </div>
        </div>
        
            <Footer />
        
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