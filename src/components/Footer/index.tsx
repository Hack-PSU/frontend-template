"use client";

import { motion } from "framer-motion";
import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Image from "next/image";

const Footer = () => {
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
									color: "#0077B5",
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
									color: "#0077B5",
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
									color: "#0077B5",
								}}
							/>
						</a>
					</div>

					{/* Deep Fish - Bobbing animation on the right */}
					<motion.div
						animate={fishAnimation}
						className="absolute right-[4vw] top-1/2 transform -translate-y-1/2"
						style={{
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
							className="w-full h-full object-contain"
							priority
						/>
					</motion.div>
				</div>

				{/* Privacy Policy */}
				<a
					href="/privacy"
					className="font-bold hover:underline transition-all duration-300"
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
				{/* Green Plants Background Layer - Individual positioned */}
				<motion.div
					animate={leftRightSway(0, 6)}
					className="absolute bottom-[-2vw]"
					style={{
						left: "0vw",
						width: "clamp(12vw, 16vw, 20vw)",
						height: "clamp(18vw, 24vw, 18vw)",
						zIndex: 1,
					}}
					//style={{ left: "0vw", width: "12vw", height: "18vw", zIndex: 1 }}
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
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
						zIndex: 1,
					}}
				>
					<Image
						src="/f25/8.png"
						alt="Underwater seaweed plant"
						fill
						className="object-contain"
					/>
				</motion.div>

				{/* Coral Plants Foreground Layer - Individual positioned */}
				<motion.div
					animate={leftRightSway(0.5, 8)}
					className="absolute"
					style={{
						left: "5vw",
						bottom: "1vw",
						width: "15vw",
						height: "12vw",
						zIndex: 10,
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
						zIndex: 10,
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
						zIndex: 10,
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
						zIndex: 10,
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
						zIndex: 10,
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
