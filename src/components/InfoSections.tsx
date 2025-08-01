"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Section = {
	id: string;
	label: string;
	content: string;
	textColor: string;
};

const SECTIONS: Section[] = [
	{
		id: "about",
		label: "About",
		content:
			"HackPSU is a bi-annual collegiate hackathon at Penn State with workshops, speakers, and a community of creators. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows.",
		textColor: "#FFFFFF",
	},
	{
		id: "rules",
		label: "Rules",
		content:
			"All code must be written during the 48-hour hackathon window. No pre-built assets except open-source libraries.",
		textColor: "#FFFFFF",
	},
	{
		id: "prepare",
		label: "How to Prepare",
		content:
			"Form a team, brush up on your stack, check out prior projects, and come with an open mind to learn and build!",
		textColor: "#FFFFFF",
	},
];

const STATS = [
	{ label: "Hackers", value: 500 },
	{ label: "Universities", value: 120 },
	{ label: "Prizes", value: "$10K+" },
	{ label: "Hours", value: 48 },
];

const InfoSections: React.FC = () => {
	const [order, setOrder] = useState(SECTIONS);

	function rotateLeft(steps: number) {
		setOrder((prev) => {
			const k = steps % prev.length;
			return [...prev.slice(k), ...prev.slice(0, k)];
		});
	}

	function onClickSection(idx: number) {
		if (idx !== 0) rotateLeft(idx);
	}

	return (
		<section
			id="info"
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw] overflow-hidden"
			style={{ minHeight: "60vw", backgroundColor: "#B1E8FF" }}
		>
			{/* Animated Float Elements */}
			<motion.div
				className="absolute"
				style={{
					width: "clamp(80px, 12vw, 200px)",
					height: "clamp(80px, 12vw, 200px)",
					left: "clamp(20px, 3vw, 60px)",
					bottom: "clamp(100px, 15vw, 250px)",
				}}
				animate={{
					rotate: [0, 15, 0],
					y: [0, -20, 0],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.5,
				}}
			>
				<Image
					src="/f25/f1.png"
					alt="Duck Float"
					fill
					className="object-contain"
				/>
			</motion.div>

			<motion.div
				className="absolute"
				style={{
					width: "clamp(70px, 10vw, 180px)",
					height: "clamp(70px, 10vw, 180px)",
					right: "clamp(20px, 4vw, 80px)",
					top: "clamp(100px, 15vw, 200px)",
				}}
				animate={{
					rotate: [0, -30, 0],
					x: [0, 10, 0],
				}}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			>
				<Image
					src="/f25/f2.png"
					alt="Donut Float"
					fill
					className="object-contain"
				/>
			</motion.div>

			<motion.div
				className="absolute"
				style={{
					width: "clamp(90px, 14vw, 220px)",
					height: "clamp(90px, 14vw, 220px)",
					right: "clamp(40px, 6vw, 120px)",
					bottom: "clamp(80px, 12vw, 200px)",
				}}
				animate={{
					rotate: [180, 210, 180],
					y: [0, 15, 0],
				}}
				transition={{
					duration: 7,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1.5,
				}}
			>
				<Image
					src="/f25/f3.png"
					alt="Flamingo Float"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Main Content Container */}
			<div className="w-full max-w-7xl mx-auto space-y-[8vw]">
				{/* Hexagon Section + Info Panel */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-[4vw]">
					{/* Hexagon Container */}
					<motion.div
						className="relative flex items-center justify-center md:left-0 left-[-6vw]"
						style={{
							width: "clamp(300px, 40vw, 500px)",
							height: "clamp(300px, 40vw, 500px)",
						}}
						animate={{
							rotate: order.findIndex((s) => s.id === order[0].id) * -120,
						}}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 25,
							duration: 0.8,
						}}
					>
						{order.map((section, idx) => {
							const containerRotation =
								order.findIndex((s) => s.id === order[0].id) * -120;
							return (
								<Hex
									key={section.id}
									section={section}
									slot={idx}
									containerRotation={containerRotation}
									onClick={() => onClickSection(idx)}
								/>
							);
						})}
					</motion.div>

					{/* Info Panel */}
					<div
						key={order[0].id}
						className="rounded-xl shadow-lg p-[3vw] bg-white/90 backdrop-blur-sm"
						style={{
							width: "clamp(300px, 35vw, 450px)",
							minHeight: "clamp(200px, 25vw, 320px)",
							borderLeft: `clamp(4px, 0.8vw, 8px) solid #86CFFC`,
						}}
					>
						<h3
							className="font-semibold mb-[1vw]"
							style={{
								fontSize: "clamp(18px, 3vw, 32px)",
								fontFamily: "Monomaniac One, monospace",
								color: "#00DAB7",
							}}
						>
							{order[0].label}
						</h3>
						<p
							className="text-gray-700"
							style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
						>
							{order[0].content}
						</p>
					</div>
				</div>

				{/* Stats Section */}
				<div className="flex flex-wrap justify-center gap-[4vw]">
					{STATS.map((s, i) => {
						const colors = ["#86CFFC", "#048A81"];
						return (
							<div key={s.label} className="text-center">
								<div
									className="font-bold"
									style={{
										fontSize: "clamp(24px, 5vw, 48px)",
										color: colors[i % colors.length],
										fontFamily: "Monomaniac One, monospace",
									}}
								>
									{s.value}
								</div>
								<p
									className="uppercase mt-[0.5vw] text-gray-600"
									style={{ fontSize: "clamp(10px, 1.5vw, 16px)" }}
								>
									{s.label}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
};

interface HexProps {
	section: Section;
	slot: number;
	containerRotation: number;
	onClick: () => void;
}

function Hex({ section, slot, containerRotation, onClick }: HexProps) {
	// Fixed triangle vertex positions with rotation angles
	const positions = [
		{ x: "-80%", y: "-60%", rotation: 0 }, // vertex 0: top-left
		{ x: "80%", y: "-60%", rotation: 0 }, // vertex 1: top-right
		{ x: "0%", y: "70%", rotation: 0 }, // vertex 2: bottom-center
	];

	const isSelected = slot === 0;
	const scale = isSelected ? 1.6 : 0.8;
	const position = positions[slot];

	return (
		<motion.div
			onClick={onClick}
			className="absolute cursor-pointer flex items-center justify-center"
			style={{
				width: "clamp(100px, 18vw, 180px)",
				height: "clamp(100px, 18vw, 180px)",
				zIndex: isSelected ? 10 : 5,
				left: "50%",
				top: "50%",
			}}
			animate={{
				x: position.x,
				y: position.y,
				scale: scale,
			}}
			transition={{
				type: "spring",
				stiffness: 200,
				damping: 25,
				duration: 0.8,
			}}
		>
			<Image
				src="/f25/abouthex.png"
				alt="Hexagon"
				fill
				className="object-contain"
			/>
			<motion.span
				className="relative z-10 font-medium text-center px-2 absolute inset-0 flex items-center justify-center"
				style={{
					color: section.textColor,
					fontSize: isSelected
						? "clamp(16px, 3vw, 24px)"
						: "clamp(12px, 2vw, 16px)",
					fontFamily: "Monomaniac One, monospace",
				}}
				animate={{ rotate: -(position.rotation + containerRotation) }}
				transition={{
					type: "spring",
					stiffness: 200,
					damping: 25,
					duration: 0.8,
				}}
			>
				{section.label}
			</motion.span>
		</motion.div>
	);
}

export default InfoSections;
