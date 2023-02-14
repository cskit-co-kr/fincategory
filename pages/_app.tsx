import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.css'

import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import Router from 'next/router'
import { Loader } from 'rsuite'


function MyApp({ Component, pageProps }: AppProps) {

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url)=>{
      setIsLoading(true)
    });

    Router.events.on("routeChangeComplete", (url)=>{
      setIsLoading(false)
    });

    Router.events.on("routeChangeError", (url) =>{
      setIsLoading(false)
    });

  }, [Router])


  return (
    <>
    {isLoading && Loaders}

    <Component {...pageProps} />
    </>
  )
}

const Loaders = () => {
  return (
      <div className='absolute top-0 left-0 flex justify-center items-center p-4 bg-gray-400 rounded-md -z-50'>
        <Loader />
      </div>
   )
}

export default MyApp
