import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "HackPSU Spring 2025",
	description: "Main website for HackPSU",
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
				<LayoutProvider>
					<Navbar />
					{children}
				</LayoutProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
