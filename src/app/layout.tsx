import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";

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
			<body className={inter.className}>
				<LayoutProvider>
					<Navbar />
					{children}
				</LayoutProvider>
			</body>
		</html>
	);
}
