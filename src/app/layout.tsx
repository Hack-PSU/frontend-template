import Navbar from "@/components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import FirebaseProvider from "@/lib/providers/FirebaseProvider";
import { auth } from "@/lib/config";

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
				<Navbar />
				{children}
			</body>
		</html>
	);
}
