/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      // TODO: Set up Next.js SVG handling.
      // {
      //   protocol: "https",
      //   hostname: "tools.applemediaservices.com",
      //   pathname: "/api/badges/download-on-the-app-store/**"
      // },
      {
        protocol: "https",
        hostname: "play.google.com",
        pathname: "/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      }
    ]
  }
};

module.exports = nextConfig;
