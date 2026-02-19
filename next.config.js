import { withPostHogConfig } from "@posthog/nextjs-config";
/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
			},
			{
				protocol: "https",
				hostname: "storage.googleapis.com",
			},
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
			},
			{
				hostname: "*.vercel.app",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/ingest/static/:path*",
				destination: "https://us-assets.i.posthog.com/static/:path*",
			},
			{
				source: "/ingest/:path*",
				destination: "https://us.i.posthog.com/:path*",
			},
			{
				source: "/ingest/decide",
				destination: "https://us.i.posthog.com/decide",
			},
		];
	},
	skipTrailingSlashRedirect: true,
};

export default withPostHogConfig(nextConfig, {
	personalApiKey: process.env.POSTHOG_API_KEY,
	// envId: process.env.POSTHOG_ENV_ID,
	projectId: process.env.POSTHOG_PROJECT_ID,
});
