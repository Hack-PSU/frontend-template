// components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
	return (
		<footer className="bg-[#215172] text-white py-6 px-8">
			<div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
				{/* Animated fish logo */}
				<motion.div
					className="flex-shrink-0 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
					animate={{
						x: [-20, 20, -20],
						y: [10, -10, 10],
						scale: [1.1, 1, 1.1],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<Image
						src="/scary-fish.svg"
						alt="Scary Fish"
						width={160}
						height={80}
						priority
					/>
				</motion.div>

				{/* Center text */}
				<div className="text-center text-base space-x-2">
					<span>
						Made with <span className="text-red-500">♥</span> in Hacky Valley
					</span>
					<span>•</span>
					<Link href="/privacy" className="hover:underline">
						Privacy Policy
					</Link>
				</div>

				{/* Social icons */}
				<div className="flex items-center space-x-4">
					<a
						href="http://instagram.hackpsu.org"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-400 transition"
					>
						<InstagramIcon fontSize="large" />
					</a>
					<a
						href="http://linkedin.hackpsu.org"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-400 transition"
					>
						<LinkedInIcon fontSize="large" />
					</a>
					<a
						href="mailto:team@hackpsu.org"
						className="hover:text-gray-400 transition"
					>
						<EmailIcon fontSize="large" />
					</a>
					<a
						href="http://discord.hackpsu.org"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-400 transition"
					>
						<Image
							src="/discord-logo-white.svg"
							alt="Discord"
							width={32}
							height={32}
						/>
					</a>
				</div>
			</div>
		</footer>
	);
}
