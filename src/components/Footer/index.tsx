"use client";

import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import Image from "next/image";
import { useState, useEffect } from "react";

const Footer = () => {
	const [isChasing, setIsChasing] = useState(false);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [fishPosition, setFishPosition] = useState({ x: 0, y: 0 });
	const [fishRotation, setFishRotation] = useState(0);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isChasing) {
				setIsChasing(false);
			}
		};

		if (isChasing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('keydown', handleKeyPress);
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('keydown', handleKeyPress);
			};
		}
	}, [isChasing]);

	useEffect(() => {
		if (isChasing) {
			let animationId: number;
			
			const animate = () => {
				setFishPosition(prev => {
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
			const fishElement = document.querySelector('.scary-fish');
			if (fishElement) {
				const rect = fishElement.getBoundingClientRect();
				setFishPosition({ 
					x: rect.left + rect.width / 2, 
					y: rect.top + rect.height / 2 
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
		<footer className="relative w-full overflow-hidden bg-[#215172]">
			{/* Floating Bubbles */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{[...Array(120)].map((_, i) => {
					const size = Math.random() * 12 + 6;
					const leftPos = Math.random() * 100;
					const delay = Math.random() * 15;
					const duration = Math.random() * 10 + 15;
					
					return (
						<div
							key={i}
							className="absolute rounded-full animate-float-up"
							style={{
								left: `${leftPos}%`,
								width: `${size}px`,
								height: `${size}px`,
								background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0.1))`,
								boxShadow: `
									inset 0 0 ${size/3}px rgba(255,255,255,0.3),
									0 0 ${size/2}px rgba(255,255,255,0.1)
								`,
								animationDelay: `${delay}s`,
								animationDuration: `${duration}s`,
								bottom: '-30px',
								backdropFilter: 'blur(1px)',
							}}
						/>
					);
				})}
			</div>

			{/* Social Links Section */}
			<div className="relative z-20 flex flex-col items-center gap-4 pb-[12vw] md:pb-[8vw] pt-[4vw]">
				<div className="relative w-full flex justify-center">
					<div className="flex flex-row gap-[2vw]">
						<a
							href="https://www.instagram.com/hack_psu/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<InstagramIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#dbeafe",
								}}
							/>
						</a>
						<a
							href="https://www.linkedin.com/company/hackpsuofficial/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<LinkedInIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#dbeafe",
								}}
							/>
						</a>
						<a
							href="https://github.com/Hack-PSU"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<GitHubIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#dbeafe",
								}}
							/>
						</a>
						<a
							href="mailto:team@hackpsu.org"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:scale-110 transition-transform duration-300"
						>
							<EmailIcon
								style={{
									fontSize: `clamp(32px, 4vw, 48px)`,
									color: "#dbeafe",
								}}
							/>
						</a>
					</div>

					{/* Deep Fish - Bobbing animation on the right */}
					<motion.div
						animate={isChasing ? false : fishAnimation}
						className={`scary-fish absolute ${isChasing ? 'cursor-pointer' : ''}`}
						onClick={handleFishClick}
						style={isChasing ? {
							left: `${fishPosition.x - 60}px`,
							top: `${fishPosition.y - 60}px`,
							width: '120px',
							height: '120px',
							filter: "drop-shadow(0 0 12px rgba(255,255,255,0.9))",
							position: 'fixed',
							zIndex: 9999,
							pointerEvents: 'auto',
							transform: `rotate(${fishRotation}deg)`,
							transition: 'none'
						} : {
							right: '4vw',
							top: '50%',
							transform: 'translateY(-50%)',
							width: `clamp(60px, 8vw, 120px)`,
							height: `clamp(60px, 8vw, 120px)`,
							filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
						}}
					>
						<Image
							src="/f25/deepfish.png"
							alt="Deep-sea fish"
							width={120}
							height={120}
							className={`w-full h-full object-contain cursor-pointer ${isChasing ? '' : 'hover:scale-110 transition-transform'}`}
							priority
						/>
						{isChasing && (
							<div className="absolute inset-0 pointer-events-none">
								<div className="w-full h-full animate-pulse bg-blue-400 opacity-20 rounded-full blur-sm"></div>
							</div>
						)}
					</motion.div>
				</div>

				{/* Privacy Policy */}
				<a
					href="/privacy"
					className="font-bold hover:underline transition-all duration-300 text-blue-100"
					style={{ fontSize: `clamp(14px, 2vw, 18px)` }}
				>
					Privacy Policy
				</a>

				{/* Made with love text */}
				<p
					className="font-bold text-blue-100"
					style={{ fontSize: `clamp(14px, 2vw, 18px)` }}
				>
					Made with ❤️ in Happy Valley.
				</p>
			</div>

			{/* Underwater Plants at Bottom */}
			<div className="absolute bottom-0 left-0 w-full">
				{/* Green Plants with Varied Z-Index for Layering */}
				<motion.div
					animate={leftRightSway(0, 6)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "0vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 3, // Behind some coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(0.3, 5)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "8vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 8, // In front of some coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(0.6, 7)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "16vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 2, // Behind most coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(0.9, 4)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "24vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 9, // In front of most coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.2, 6)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "32vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 4, // Mixed layering
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.5, 8)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "40vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 7, // In front of some coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.8, 5)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "48vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 1, // Behind all coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.1, 7)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "56vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 6, // Mixed layering
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.4, 6)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "64vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 11, // In front of all coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.7, 4)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "72vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 3, // Behind some coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(3.0, 8)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "80vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 8, // In front of some coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(3.3, 5)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "88vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 2, // Behind most coral
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>

				{/* Coral Plants with Varied Z-Index for Layering */}
				<motion.div
					animate={leftRightSway(0.5, 8)}
					className="absolute"
					style={{
						left: "5vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 5, // Behind some green seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.0, 6)}
					className="absolute"
					style={{
						left: "25vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 10, // In front of most seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.5, 9)}
					className="absolute"
					style={{
						left: "45vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 3, // Behind some green seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.0, 7)}
					className="absolute"
					style={{
						left: "65vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 12, // In front of all seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.5, 5)}
					className="absolute"
					style={{
						left: "85vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 4, // Behind some green seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>

				{/* Additional 5 Red Coral Plants */}
				<motion.div
					animate={leftRightSway(0.8, 7)}
					className="absolute"
					style={{
						left: "12vw",
						bottom: "0.5vw",
						width: "12vw",
						height: "10vw",
						zIndex: 6, // Mixed layering
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.3, 4)}
					className="absolute"
					style={{
						left: "35vw",
						bottom: "1.5vw",
						width: "13vw",
						height: "11vw",
						zIndex: 2, // Behind most seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(1.7, 6)}
					className="absolute"
					style={{
						left: "52vw",
						bottom: "0.8vw",
						width: "14vw",
						height: "11.5vw",
						zIndex: 9, // In front of most seaweed
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.2, 8)}
					className="absolute"
					style={{
						left: "75vw",
						bottom: "1.2vw",
						width: "13.5vw",
						height: "10.5vw",
						zIndex: 7, // Mixed layering
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
				<motion.div
					animate={leftRightSway(2.8, 5)}
					className="absolute"
					style={{
						left: "92vw",
						bottom: "0.3vw",
						width: "11vw",
						height: "9vw",
						zIndex: 11, // In front of most elements
					}}
				>
					<Image
						src="/f25/7.png"
						alt="Underwater coral plant"
						fill
						className="object-contain"
					/>
				</motion.div>
			</div>
		</footer>
	);
};

export default Footer;
