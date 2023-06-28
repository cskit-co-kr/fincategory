import Head from 'next/head';
import Footer from './Footer';
import Header from './Header';
import { getSession } from 'next-auth/react';

const Layout = ({ children, memberInfo }: any) => {
  return (
    <>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div className='wrapper bg-gray-50'>
        <Header memberInfo={memberInfo} />
        <main>
          <div className='container'>{children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export const getServerSideProps = async (context: any) => {
  // Get Member Information
  let memberInfo = '';
  const session = await getSession(context);
  if (session?.user) {
    const responseMember = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API_URL}/api/member?f=getuser`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    memberInfo = await responseMember.json();
  }
  // Return
  return {
    props: { memberInfo },
  };
};

export default Layout;
