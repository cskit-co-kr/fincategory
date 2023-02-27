import axios from "axios"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import { enUS } from '../../lang/en-US'
import { koKR } from '../../lang/ko-KR'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid'
import { EyeIcon, ShareIcon, LinkIcon } from "@heroicons/react/24/outline"


 
 function Channel({ channel }: any) {
    const router = useRouter()
    
    const { locale }:any = router
    const t = locale === 'ko' ? koKR : enUS
    
    const { id } = router.query
    
    const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`
    const [error, setError] = useState<boolean>(false)
    
    return (
        <div className='pt-36 bg-gray-50'>
            <Head>
            <title>{`FinCategory - ${channel.title}`}</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <div className='md:flex xl:w-[1280px] mx-auto'>
                <div className='w-full md:w-[954px] flex flex-col gap-4 justify-items-stretch content-start'>
                    <div className='p-[30px] gap-4 border md:flex border-gray-200 rounded-md bg-white min-h-[262px]'>
                        <div className='p-1 border border-gray-200 rounded-full justify-center items-center md:inline-flex box-border min-w-fit w-fit mb-4 md:mb-0'>
                            <Image
                                src={error ? '/telegram-icon-96.png' : avatar}
                                alt={ channel.title }
                                width={190}
                                height={190}
                                className='rounded-full object-contain w-20 h-20 md:w-[190px] md:h-[190px]'
                                onError={() => setError(true)}
                            />
                        </div>
                        <div className="flex flex-col gap-4 w-full">
                            <div className='text-xl font-bold'>{channel.title}</div>
                            <a href={`https://t.me/${channel.username}`} target='_blank'
                                className='flex items-center gap-1 w-min border-2 border-primary px-3 py-1 rounded-full text-primary text-sm 
                                transition ease-in-out duration-300 hover:bg-primary hover:no-underline hover:text-white'
                            >
                                @{channel.username}
                                <ArrowTopRightOnSquareIcon className="h-4" />
                            </a>
                            <p>{channel.description}</p>
                        </div>
                        <div className="md:w-96 text-end flex md:flex-col gap-4 md:place-content-end mt-4 md:mt-0">
                            <div className="flex flex-col justify-between text-[12px]">
                                <span className="text-gray-400 font-semibold">{t['category']}</span>
                                <span className="text-primary">{channel.category && JSON.parse(channel.category.name)[locale]}</span>
                            </div>
                            <div className="flex flex-col justify-between text-[12px] ml-auto md:m-0">
                                <span className="text-gray-400 font-semibold">{t['channel-region-and-language']}</span>
                                <span>{channel.country.nicename}, {channel.language && channel.language.value}</span>
                            </div>
                            
                        </div>
                    </div>
                    {/*
                    <div className="px-[30px] py-4 gap-4 border flex flex-col border-gray-200 rounded-md bg-white">
                        <div className="flex gap-4 border-b border-gray-200 pb-2 w-full">
                            <div className="border border-gray-200 p-1 rounded-full">
                                <Image
                                    src={error ? '/telegram-icon-96.png' : avatar}
                                    alt={ channel.title }
                                    width={30}
                                    height={30}
                                    className='rounded-full object-contain'
                                    onError={() => setError(true)}
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <div className='text-sm font-bold'>{channel.title}</div>
                                <div className="text-xs text-gray-500">1월 8, 07:50</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <div>Image</div>
                            <div>
                                <h2>Title</h2>
                                <p>Description</p>
                            </div>
                            <div className="flex gap-2 border-t border-gray-200 pt-3">
                                <a href="" className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline">
                                    <EyeIcon className="h-4" />100
                                </a>
                                <a href="" className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline">
                                    <ShareIcon className="h-4" />100
                                </a>
                                <a href="" className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 hover:no-underline ml-auto">
                                    <LinkIcon className="h-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                    */}
                </div>

                <div className='flex flex-col w-full md:w-[310px] mt-4 md:mt-0 md:ml-4 '>
                    <div className='flex flex-col gap-4 border border-gray-200 rounded-md p-[30px] bg-white min-h-[262px]'>
                        <div className="flex space-between items-center">
                            <h2 className='text-sm font-bold'>{t['subscribers']}</h2>
                            <span className="font-bold text-base ml-auto">{channel.subscription?.toLocaleString()}</span>
                        </div>
                        <img src='/image-8.png' alt='fake graphic' />
                    </div>
                    <div className='flex gap-4 border border-gray-200 rounded-md p-[30px] bg-white mt-4'>
                        <span>Views:</span>
                        <span className="ml-auto">오늘{channel.counter.today}/누적{channel.counter.total}</span>
                    </div>
                </div>
            </div>
            
                <Footer />
            
        </div>
    )
 }

 export const getServerSideProps = async (context: any) => {
    const getId = context.query["id"]
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { "detail": getId })
    const channel = response.data

    return {
        props: {
            channel
        },
    }
  }

 export default Channel