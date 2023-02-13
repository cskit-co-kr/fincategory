import axios from "axios"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { useState } from "react"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import { enUS } from '../../lang/en-US'
import { koKR } from '../../lang/ko-KR'


 
 function Channel({ channel }: any) {
    const router = useRouter()
    
    const { locale }:any = router
    const t = locale === 'ko' ? koKR : enUS
    
    const { id } = router.query
    
    const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`
    const [error, setError] = useState<boolean>(false)
    
    return (
        <div className='flex flex-col pt-36 bg-gray-50'>
            <Head>
            <title>FinCategory - {channel.title}</title>
            <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />

            <div className='flex w-[1280px] mx-auto'>
                <div className='w-[954px] flex flex-col gap-4 justify-items-stretch content-start'>
                    <div className='p-[30px] gap-4 border flex border-gray-200 rounded-md bg-white min-h-[262px]'>
                        <div className='p-1 border border-gray-200 rounded-full justify-center items-center flex box-border min-w-fit'>
                            <Image
                                src={error ? '/telegram-icon-96.png' : avatar}
                                alt={ channel.title }
                                width={190}
                                height={190}
                                className='rounded-full object-contain'
                                onError={() => setError(true)}
                            />
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className='text-xl font-bold'>{channel.title}</div>
                            <button className='w-min border border-gray-400 px-4 py-2 rounded-md text-primary text-sm'>@{channel.username}</button>
                            <p>{channel.description}</p>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-[310px] ml-4 '>
                    <div className='flex flex-col gap-4 border border-gray-200 rounded-md p-[30px] bg-white min-h-[262px]'>
                        <h2 className='text-sm font-bold'>{t['subscribers']}</h2>
                        <span className="font-bold text-xl">{channel.subscription}</span>
                        
                        <div className="flex justify-between text-[12px]">
                            <span className="text-gray-400">{t['category']}</span>
                            <span className="text-primary">{JSON.parse(channel.category.name)[locale]}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                            <span className="text-gray-400">{t['channel-region-and-language']}</span>
                            <span>{channel.country.nicename}, {channel.language && channel.language.value}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='relative flex pt-[450px]'>
                <Footer />
            </div>
        </div>
    )
 }

 export const getServerSideProps = async (context: any) => {
    const getId = context.query["id"]
    const result = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/client/telegram/getDetail`, { "detail": getId })
    const channel = result.data

    return {
        props: {
            channel
        },
    }
  }

 export default Channel