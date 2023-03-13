"use client";
import "./globals.css";
import React from "react";
import Navbar from "@/components/Navbar";
import FirebaseProvider from "@/lib/providers/FirebaseProvider";
import { auth } from "@/lib/config";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<body>
				<FirebaseProvider auth={auth}>
					<Navbar />
					{children}
				</FirebaseProvider>
			</body>
		</html>
	);
}
