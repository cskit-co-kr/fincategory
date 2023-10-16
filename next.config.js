/** @type {import('next').NextConfig} */

const webpack = require('webpack');

module.exports = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localeDetection: false,
  },
  images: {
    // domains: ['fincategory.com', 'cdn5.telegram-cdn.org'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.telegram-cdn.org',
      },
      {
        protocol: 'https',
        hostname: '**.fincategory.com',
      },
    ],
  },
  env: {
    API_GET_CATEGORY: process.env.API_GET_CATEGORY,
    PUBLIC_URL: '/',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/search',
        permanent: true,
      },
    ];
  },
  poweredByHeader: false,
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: '*' },
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
  //         },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  //         },
  //       ],
  //     },
  //   ];
  // },
};
