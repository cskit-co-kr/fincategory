import { useRouter } from 'next/router'
import React, { FunctionComponent } from 'react'
import { enUS } from '../../lang/en-US'
import { koKR } from '../../lang/ko-KR'

type FData = {
    total: number
  }

const ChannelFilter: FunctionComponent<FData> = ({ total }) => {
  const router = useRouter()
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS
  return (
    <div className='md:flex items-center w-full bg-white rounded-md px-4 py-3 col-span-3 border border-gray-200 mt-4 md:mt-0'>
        <span className='text-xs'>{t['total-search-results1']}{total}{t['total-search-results2']}</span>
        <div className='ml-auto'>
            <select className='border rounded-md pl-2 pr-5 py-1 mt-4 md:mt-0'>
                <option>Sort by: Subscribers</option>
                <option>Name A-Z</option>
                <option>Name Z-A</option>
            </select>
        </div>
    </div>
  )
}

export default ChannelFilter