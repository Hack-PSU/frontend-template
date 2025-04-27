// components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<nav
			className={clsx(
				"fixed inset-x-0 top-0 z-50 transition-colors duration-100 ease-in-out",
				scrolled ? "bg-white/30 backdrop-blur-md" : "bg-transparent"
			)}
		>
			<div className="relative max-w-6xl mx-auto px-6 py-4">
				{/* Left: Logo */}
				<div className="absolute top-0 left-[0%]">
					<Link href="/">
						<Image
							src="/logo.png" // your logo
							alt="Logo"
							width={120}
							height={80}
							className="h-[75px] w-auto"
						/>
					</Link>
				</div>

				{/* Center: Nav Buttons */}
				<div className="flex justify-center space-x-6">
					{[
						"Info",
						"Schedule",
						"Prizes",
						"Sponsors",
						"Workshops",
						"Register",
					].map((label) => (
						<Link
							key={label}
							href={
								label === "Register" ? "/register" : `#${label.toLowerCase()}`
							}
							className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-md text-black font-medium hover:bg-opacity-40 transition"
						>
							{label}
						</Link>
					))}
				</div>

				{/* Right: MLH Trust Badge */}
				<div className="absolute top-0 right-[-10%]">
					<a
						id="mlh-trust-badge"
						href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2025-season&utm_content=white"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-white.svg"
							alt="MLH Trust Badge"
							width={100}
							height={40}
							className="h-[200px] w-auto"
						/>
					</a>
				</div>
			</div>
		</nav>
	);
}
