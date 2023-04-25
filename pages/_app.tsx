import 'rsuite/dist/rsuite.min.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout';
import { DataProvider } from '../context/context';

function MyApp({ Component, pageProps }: AppProps) {

  return (
      <DataProvider>
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </DataProvider>
  )
}

export default MyApp
