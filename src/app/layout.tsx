import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";
import ScrollingGradient from "@/components/ScrollGradient/scroll-gradient";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "HackPSU Fall 2024",
	description: "Main website for HackPSU",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
			<ScrollingGradient />
				<LayoutProvider>
					<Navbar />
					{children}
				</LayoutProvider>
			</body>
		</html>
	);
}
