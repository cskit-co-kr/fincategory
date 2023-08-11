import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }: any) => {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='wrapper bg-gray-50'>
        <Header />
        <main>
          <div className='container' id='main'>
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
