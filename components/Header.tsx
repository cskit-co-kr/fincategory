import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { enUS } from '../lang/en-US'
import { koKR } from '../lang/ko-KR'
import LanguageSelector from './LanguageSelector'

function Header() {
  const router = useRouter()
  const getPath = useRouter().pathname
  const { locale } = router
  const t = locale === 'ko' ? koKR : enUS

  const normalPath = 'px-5 py-3 font-bold text-[14px] hover:text-primary'
  const activePath = normalPath+' border-b-2 border-primary'

  const [searchField, setSearchField] = useState<string | null>(null)
  
  const handleSubmit = () => {
    console.log(searchField)
    if(searchField !== null) {
        router.replace(`/search?q=${searchField}`)
        //setSearchField(null)
    }
  }

  const handleKeyDown = (e:any) => {
    if(e.key === 'Enter') {
        handleSubmit()
        e.target.blur()
    }
  }

  return (
    <div className='absolute w-full top-0 h-[117px] bg-white'>
        <div className='flex pt-4 justify-between items-center border-b pb-4 mx-auto max-w-7xl'>
            <div className='font-raleway text-lg'>
                <a href='/' className='hover:no-underline hover:text-current'>
                    <span className='font-bold text-primary'>Fin</span>
                    Category
                </a>
            </div>
            <div className='relative flex bg-neutral-100 items-center py-2 px-3 rounded-full'>
                <MagnifyingGlassIcon className='h-5 text-neutral-500' />
                <input 
                    type='text'
                    value={searchField ?? ''}
                    onChange={e => setSearchField(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className='outline-none bg-neutral-100 pl-3 w-24 md:w-80 xl:w-96 text-sm'
                />
            </div>
            <div className='flex gap-4 items-center'>
                <div>
                    <LanguageSelector />
                </div>
                <div>
                    <button
                        className='bg-primary font-semibold text-white rounded-full py-1 px-5 text-sm'>
                        {t['sign-in']}
                    </button>
                </div>
            </div>
        </div>
        <nav className='flex mx-auto max-w-7xl'>
            <ul className='flex'>
                <li className='hidden'>
                    <button className={getPath === '/' ? activePath : normalPath } onClick={() => router.push('/')}>
                        {t['home']}
                    </button>
                </li>
                <li>
                    <button className={getPath === '/search' ? activePath : normalPath } onClick={() => router.push('/search')}>
                        {t['search']}
                    </button>
                </li>
            </ul>
        </nav>
    </div>
  )
}

export default Header