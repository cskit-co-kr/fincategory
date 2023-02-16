import axios from 'axios'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import CustomImage from './CustomImage'

export const GetChannelsByCategory = ( { value, label }:any ) => {
    const [channels, setChannels] = useState([])

    useEffect(() => {
        (async () =>{
            const data = {
                query: null,
                withDesc: false,
                category: [{value: value, label: label}],
                country: [],
                language: [],
                channel_type: null,
                channel_age: 0,
                erp: 0,
                subscribers_from: null,
                subscribers_to: null,
                paginate: {limit: 10, offset: 0}
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/search`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data)
            })
            const result = await response.json();
            setChannels(result.channel)
        })();
    },[])
    
  return (
    <div className='w-[386px] gap-2 flex flex-col'>
      {channels.map((channel:any, index:number) => (
        <div key={index} className='flex flex-col gap-4'>
            <Link href={"/channel/"+channel.username} className='hover:no-underline'>
            <div className='flex items-center gap-2'>
                <CustomImage 
                    className='rounded-full' 
                    width={28}
                    height={28}
                    alt={channel.title} src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/telegram/files/${channel.channel_id}/avatar.jfif`} 
                />
                <span className='truncate'>{channel.title}</span>
                <span className='ml-auto text-xs'>{channel.subscription}</span>
            </div>
            </Link>
        </div>
      ))}
    </div>
  )
}