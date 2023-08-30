import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import LayoutProvider from "@/lib/providers/LayoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "HackPSU Template",
	description: "description",
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
