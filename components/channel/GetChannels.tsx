import React, { FunctionComponent, useState } from 'react'
import { Channel } from '../../typings'
import { enUS } from '../../lang/en-US'
import { koKR } from '../../lang/ko-KR'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  channels: Channel,
}


const GetChannels:FunctionComponent<Props> = ({channels}) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS
  const avatar = `${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channels.channel_id}/avatar.jfif`
  const [error, setError] = useState<boolean>(false)

  return (
    <Link href={{ pathname: "/telegram/"+channels.username }} className='hover:no-underline'>
      <div className='flex items-start border border-gray-200 rounded-md bg-white p-4 gap-[10px] text-black max-h-[140px]'>
        <Image
          src={error ? '/telegram-icon-96.png' : avatar}
          alt={ 'avatar of '+channels.title }
          width={50}
          height={50}
          className='object-contain rounded-full'
          onError={() => setError(true)}
        />
        <div className='flex flex-col gap-2'>
          <h2 className='font-semibold text-sm truncate w-[213px]'>{ channels.title }</h2>
          <p className='text-[12px] h-9 w-[213px] overflow-hidden'>{ channels.description }</p>
          <p className='text-[12px] m-0 text-gray-400'>{t['subscribers']} <b>{ channels.subscription }</b></p>
        </div>
      </div>
    </Link>
  )
}

export default GetChannels