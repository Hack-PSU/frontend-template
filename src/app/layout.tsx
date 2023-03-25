"use client";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import FirebaseProvider from "@/lib/providers/FirebaseProvider";
import { auth } from "@/lib/config";
import { usePathname } from "next/navigation";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const path = usePathname();
	const routesWithoutNavbar = ["signup", "profile"];

	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>
				<FirebaseProvider auth={auth}>
					{routesWithoutNavbar.includes(path?.slice(1) ?? "") ? (
						<></>
					) : (
						<Navbar />
					)}
					{children}
				</FirebaseProvider>
			</body>
		</html>
	);
}
