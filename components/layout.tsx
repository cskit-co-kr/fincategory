import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { useEffect } from 'react';
import { useData } from '../context/context';
import Script from 'next/script';

const Layout = ({ children }: any) => {
  const { sideBar } = useData();

  useEffect(() => {
    if (sideBar) {
      document.body.classList.add('overflow-y-hidden');
    } else {
      document.body.classList.remove('overflow-y-hidden');
    }
  });


  // useEffect(() => {
  //   var _Hasync: any = _Hasync || [];
  //   _Hasync.push(['Histats.start', '1,4764338,4,0,0,0,00010000']);
  //   _Hasync.push(['Histats.fasi', '1']);
  //   _Hasync.push(['Histats.track_hits', '']);
  //   (function () {
  //     var hs = document.createElement('script');
  //     hs.type = 'text/javascript';
  //     hs.async = true;
  //     hs.src = 'https://s10.histats.com/js15_as.js';
  //     (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
  //   })();
  // }, []);

  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='wrapper bg-gray-50'>
        <Header />
        <div className='container px-4 mx-auto'>{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
