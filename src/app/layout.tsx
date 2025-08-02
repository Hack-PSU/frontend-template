import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "HackPSU Fall 2025 - Penn State's Premier Hackathon",
		template: "%s | HackPSU Fall 2025",
	},
	description:
		"Join HackPSU Fall 2025 at Penn State University for 24 hours of innovation, coding, and collaboration. Open to all skill levels with workshops, mentorship, and amazing prizes.",
	authors: [
		{
			name: "HackPSU Team",
			url: "https://hackpsu.org",
		},
	],
	creator: "HackPSU",
	publisher: "HackPSU",
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},
	metadataBase: new URL("https://hackpsu.org"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://hackpsu.org",
		siteName: "HackPSU Fall 2025",
		title: "HackPSU Fall 2025 - Penn State's Premier Hackathon",
		description:
			"Join HackPSU Fall 2025 at Penn State University for 24 hours of innovation, coding, and collaboration. Open to all skill levels with workshops, mentorship, and amazing prizes.",
		images: [
			{
				url: "/logo.png",
				alt: "HackPSU Fall 2025 Logo",
			},
		],
	},
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: false,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	category: "technology",
	classification: "Education, Technology, Events",
	referrer: "origin-when-cross-origin",
	colorScheme: "light dark",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 5,
		userScalable: true,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<GoogleAnalytics gaId="G-C6W09RB27P" />
			<body className={inter.className}>
				<LayoutProvider>{children}</LayoutProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
