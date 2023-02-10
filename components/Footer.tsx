import Link from 'next/link'
import React from 'react'

function Footer() {
  return (
    <div className='bg-white py-8 bottom-0 absolute w-full'>
        <div className='mx-auto max-w-7xl grid grid-cols-5'>
            <div>
                <div className='mb-8 font-raleway text-lg'>
                    <a href='/' className='hover:no-underline hover:text-current'>
                        <span className='font-bold text-primary'>Fin</span>
                        Category
                    </a>
                </div>
                <h2 className='font-bold text-base'>Contact Us</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='/'>Support</Link></li>
                    <li><Link href='/'>E-mail</Link></li>
                </ul>
            </div>
            <div>
                <h2 className='font-bold text-base'>Miscellaneous</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='/'>Terms and conditions</Link></li>
                    <li><Link href='/'>Privacy policy</Link></li>
                </ul>
            </div>
            <div>
                <h2 className='font-bold text-base'>Our bots</h2>
                <ul className='list-none mt-3 leading-7'>
                    <li><Link href='/'>@HHGYSBot</Link></li>
                    <li><Link href='/'>@cskitjopaint_bot</Link></li>
                    <li><Link href='/'>@FinCategoryBot</Link></li>
                    <li><Link href='/'>@GGFTSSBot</Link></li>
                </ul>
            </div>
        </div>
        <div className='mx-auto max-w-7xl mt-10 font-semibold'>
            © 2023 FinCategory. All rights reserved
        </div>
    </div>
  )
}

export default Footer