/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true, // Apple App Store badge is SVG.
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
				pathname:
					"/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",
			},
			{
				hostname: "*googleusercontent.com",
			},
			{
				hostname: "tools.applemediaservices.com",
			},
			{
				hostname: "s3.amazonaws.com",
			},
			{
				hostname: "avatars.githubusercontent.com",
			}
		],
	},
};

module.exports = nextConfig;
