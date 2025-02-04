import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import LayoutProvider from "@/lib/providers/LayoutProvider";
import "@/styles/globals.css";

import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";

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
					<Fireworks
						options={{
							autoresize: true,
							opacity: 0.7,
							acceleration: 1.05,
							friction: 0.97,
							gravity: 1.5,
							particles: 50,
							traceLength: 3,
							traceSpeed: 10,
							explosion: 5,
							intensity: 30,
							flickering: 50,
							lineStyle: "round",
							hue: {
								min: 0,
								max: 360,
							},
							delay: {
								min: 30,
								max: 60,
							},
							rocketsPoint: {
								min: 50,
								max: 50,
							},
							lineWidth: {
								explosion: {
									min: 1,
									max: 3,
								},
								trace: {
									min: 1,
									max: 2,
								},
							},
							brightness: {
								min: 50,
								max: 80,
							},
							decay: {
								min: 0.015,
								max: 0.03,
							},
							mouse: {
								click: true,
								move: false,
								max: 1,
							},
						}}
						style={{
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							position: "fixed",
						}}
					/>
				</LayoutProvider>
			</body>
		</html>
	);
}
