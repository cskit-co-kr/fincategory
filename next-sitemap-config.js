/** @type {import('next-sitemap').IConfig} */
// Default code you can customize according to your requirements.
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_CLIENT_API_URL || "https://fincago.com",
  generateRobotsTxt: true, // (optional)
  exclude: [
    "/ranking",
    "/board/post",
    "/board",
    "/board/wallet",
    "/board/ads-history",
    "/board/ads-purchase",
    "/board/fincoin-purchase",
    "/board/stock",
    "/board/success",
    "/board/write",
    "/ads",
    // "/auth/wallet",
    "/privacy-policy",
    "/terms",
  ], // Exclude specific pages (optional)
  // REST CODE READ DOCS  ...
};
