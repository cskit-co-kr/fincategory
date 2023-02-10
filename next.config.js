/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localeDetection: false,
  },
  images: {
    domains: ['fincategory.com'],
  },
  env: {
    API_GET_CATEGORY: process.env.API_GET_CATEGORY
  },
  async redirects() {
    return [
        {
            source: '/',
            destination: '/search',
            permanent: true,
        }]
  }
}
