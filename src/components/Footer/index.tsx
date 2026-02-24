"use client";

import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Image from "next/image";
import { useState, useEffect } from "react";

const Footer = () => {
	const [isChasing, setIsChasing] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [fishPosition, setFishPosition] = useState({ x: 0, y: 0 });
	const [fishRotation, setFishRotation] = useState(0);

	const [hoverInstagram, setHoverInstagram] = useState(false);
	const [hoverLinkedIn, setHoverLinkedIn] = useState(false);
	const [hoverGitHub, setHoverGitHub] = useState(false);
	const [hoverEmail, setHoverEmail] = useState(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isChasing) {
				setIsChasing(false);
			}
		};

		if (isChasing) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("keydown", handleKeyPress);
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("keydown", handleKeyPress);
			};
		}
	}, [isChasing]);

	useEffect(() => {
		if (isChasing) {
			let animationId: number;

			const animate = () => {
				setFishPosition((prev) => {
					const dx = mousePosition.x - prev.x;
					const dy = mousePosition.y - prev.y;

					// Calculate rotation angle to point toward cursor
					const angle = Math.atan2(dy, dx) * (180 / Math.PI);
					setFishRotation(angle);

					// Smooth chasing with slight lag
					const speed = 0.08;
					const newX = prev.x + dx * speed;
					const newY = prev.y + dy * speed;

					return { x: newX, y: newY };
				});

				animationId = requestAnimationFrame(animate);
			};

			animationId = requestAnimationFrame(animate);
			return () => cancelAnimationFrame(animationId);
		}
	}, [isChasing, mousePosition]);

	const handleFishClick = () => {
		if (!isChasing) {
			const fishElement = document.querySelector(".scary-fish");
			if (fishElement) {
				const rect = fishElement.getBoundingClientRect();
				setFishPosition({
					x: rect.left + rect.width / 2,
					y: rect.top + rect.height / 2,
				});
			}
		}
		setIsChasing(!isChasing);
	};

	const leftRightSway = (delay: number = 0, distance: number = 10) => ({
		x: [-distance, distance, -distance],
		transition: {
			duration: 3 + Math.random() * 2,
			repeat: Infinity,
			ease: "easeInOut" as const,
			delay,
		},
	});

	const bobAnimation = {
		y: [-8, 8, -8],
		transition: {
			duration: 2.5,
			repeat: Infinity,
			ease: "easeInOut" as const,
		},
	};

	const fishAnimation = {
		y: [-8, 8, -8],
		filter: [
			"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
			"drop-shadow(0 0 12px rgba(255,255,255,0.8))",
			"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
		],
		transition: {
			duration: 2.5,
			repeat: Infinity,
			ease: "easeInOut" as const,
		},
	};

	return (
		<footer className="relative w-full overflow-hidden bg-[#2A145C]">
			{/* Social Links Section */}
			<div className="relative z-20 flex flex-col items-center gap-4 pb-[12vw] md:pb-[8vw] pt-[4vw]">
				<div className="relative w-full flex justify-center">
					<div className="flex flex-row gap-[2vw]">
						<a
							href="https://www.instagram.com/hack_psu/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
							style={{ transition: "transform 0.3s, filter 0.3s" }}
							onMouseEnter={() => setHoverInstagram(true)}
							onMouseLeave={() => setHoverInstagram(false)}
						>
							<InstagramIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#ff88e9ff",
									filter: hoverInstagram
										? "drop-shadow(0 0 8px rgba(255,136,233,0.8))"
										: "drop-shadow(0 0 4px rgba(255,136,233,0.6))",
								}}
							/>
						</a>
						<a
							href="https://www.linkedin.com/company/hackpsuofficial/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
							style={{ transition: "transform 0.3s, filter 0.3s" }}
							onMouseEnter={() => setHoverLinkedIn(true)}
							onMouseLeave={() => setHoverLinkedIn(false)}
						>
							<LinkedInIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#ff88e9ff",
									filter: hoverLinkedIn
										? "drop-shadow(0 0 8px rgba(255,136,233,0.8))"
										: "drop-shadow(0 0 4px rgba(255,136,233,0.6))",
								}}
							/>
						</a>
						<a
							href="https://github.com/Hack-PSU"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
							style={{ transition: "transform 0.3s, filter 0.3s" }}
							onMouseEnter={() => setHoverGitHub(true)}
							onMouseLeave={() => setHoverGitHub(false)}
						>
							<GitHubIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#ff88e9ff",
									filter: hoverGitHub
										? "drop-shadow(0 0 8px rgba(255,136,233,0.8))"
										: "drop-shadow(0 0 4px rgba(255,136,233,0.6))",
								}}
							/>
						</a>
						<a
							href="mailto:team@hackpsu.org"
							target="_blank"
							
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
							style={{ transition: "transform 0.3s, filter 0.3s" }}
							onMouseEnter={() => setHoverEmail(true)}
							onMouseLeave={() => setHoverEmail(false)}
						>
							<EmailIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#ff88e9ff",
									filter: hoverEmail
										? "drop-shadow(0 0 8px rgba(255,136,233,0.8))"
										: "drop-shadow(0 0 4px rgba(255,136,233,0.6))",
								}}
							/>
						</a>
					</div>
				</div>

				{/* Privacy Policy */}
				<a
					href="/privacy"
					className="font-medium hover:underline transition-all duration-300"
					style={{
						fontSize: `clamp(14px, 2vw, 18px)`,
						fontFamily:
							'"IBM Plex Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
						color: "#ff88e9ff",
						letterSpacing: "0.05em",
						textShadow: "0 0 3px rgba(255,136,233,0.6)",
					}}
				>
					{'>'} privacy_policy
				</a>

				{/* Made with love text */}
				<p
					className="font-medium"
					style={{
						fontSize: `clamp(14px, 2vw, 18px)`,
						fontFamily:
							'"IBM Plex Mono", ui-monospace, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
						color: "#ff88e9ff",
						letterSpacing: "0.05em",
						textShadow: "0 0 3px rgba(255,136,233,0.6)",
					}}
				>
					<>
						Made with{" "}
						<FavoriteBorderIcon
							style={{
								fontSize: "1em",
								verticalAlign: "middle",
								margin: "0 0.25px",
								color: "#88ffff",
							}}
						/>{" "}in Happy Valley.
					</>
				</p>
			</div>
		</footer>
	);
};

export default Footer;
