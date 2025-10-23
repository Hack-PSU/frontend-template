"use client";

import React, { useState, useEffect } from "react";
import { m, motion } from "framer-motion";
import Image from "next/image";
import { useFlagState } from "@/lib/api/flag/hook";

type Section = {
	id: string;
	label: string;
	content: string;
	textColor: string;
	color: string;
};

const SECTIONS: Section[] = [
	{
		id: "about",
		label: "About",
		content:
			"HackPSU is a bi-annual collegiate hackathon at Penn State with workshops, speakers, and a community of creators. Join us for an incredible weekend of building, learning, and connecting with fellow hackers from universities across the region!",
		textColor: "#048A81",
		color: "#FFE4B5",
	},
	{
		id: "eligibility",
		label: "Team Formation",
		content:
			"All participants must be at least 18 years old and a student of some university (or a recent PSU graduate within less than one year).\n\nTeams may be comprised of up to five members. A team may only submit one project, and no participant may be a member of multiple teams.\n\nAll participants must bring a valid form of identification.",
		textColor: "#8B4513",
		color: "#E6F3FF",
	},
	{
		id: "guidelines",
		label: "Project Guidelines",
		content:
			"Projects should be original works created on site. Coming with an idea in mind is perfectly fine, working on an existing project is not.\n\nAll projects must be submitted through Devpost by 12PM on Sunday and can be edited until 1:45PM Sunday. All project code must be attached to the project's Devpost submission.\n\nAnything you create is your work - HackPSU and its partners have no claim over intellectual property produced at the event.",
		textColor: "#2E8B57",
		color: "#F0FFF0",
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
	const { data: statsSectionFlag } = useFlagState("StatsSectionEnabled");

	// Easter egg; spinning the floaties
	const [clicked1, setClicked1] = useState(false);
	const [clicked2, setClicked2] = useState(false);
	const [clicked3, setClicked3] = useState(false);

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
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw] "
			style={{ minHeight: "60vw", backgroundColor: "#B1E8FF" }}
		>
			{/* Animated Float Elements */}
			<motion.div
				key={1}
				className="absolute
				left-[clamp(20px, 4vw, 80px)]
				top-[clamp(100px, 15vw, 200px)]
				md:left-[10px]
				md:top-[-100px]"
				style={{
					width: "clamp(80px, 30vw, 400px)",
					height: "clamp(80px, 30vw, 400px)",
				}}
				animate={
					clicked1
						? {
								rotate: [0, 360, 0],
								y: [-130, -30, -130],
								scale: [1, 0.9, 1],
								transition: {
									rotate: { duration: 1, ease: "easeInOut" }, // one-off spin
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
						: {
								rotate: [0, 15, 0],
								y: [-130, -30, -130],
								scale: [1, 0.9, 1],
								transition: {
									rotate: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
				}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0,
				}}
				onClick={() => {
					setClicked1(true);
					setTimeout(() => setClicked1(false), 1000);
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
				key={2}
				className="absolute max-sm:hidden"
				style={{
					width: "clamp(80px, 30vw, 400px)",
					height: "clamp(80px, 30vw, 400px)",
					right: "clamp(20px, 4vw, 80px)",
					top: "clamp(0px, 1vw, 100px)",
				}}
				animate={
					clicked2
						? {
								rotate: [0, 360, 0],
								y: [0, -20, 0],
								scale: [1, 0.8, 1],
								transition: {
									rotate: { duration: 1, ease: "easeInOut" }, // one-off spin
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
						: {
								rotate: [0, 15, 0],
								y: [0, -20, 0],
								scale: [1, 0.8, 1],
								transition: {
									rotate: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
				}
				transition={{
					duration: 5,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
				onClick={() => {
					setClicked2(true);
					setTimeout(() => setClicked2(false), 1000);
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
				key={3}
				className="absolute
				right-[clamp(20px, 4vw, 80px)]
				top-[clamp(100px, 15vw, 200px)]
				md:right-[20vw]
				md:top-[0vw]"
				style={{
					width: "clamp(80px, 30vw, 300px)",
					height: "clamp(80px, 30vw, 300px)",
				}}
				animate={
					clicked3
						? {
								rotate: [0, 360, 0],
								y: [0, -20, 0],
								scale: [1, 0.8, 1],
								transition: {
									rotate: { duration: 1, ease: "easeInOut" }, // one-off spin
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
						: {
								rotate: [0, 15, 0],
								y: [0, -20, 0],
								scale: [1, 0.8, 1],
								transition: {
									rotate: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									y: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
									scale: {
										duration: 5,
										repeat: Infinity,
										ease: "easeInOut",
										delay: 1,
									},
								},
							}
				}
				transition={{
					duration: 6.67,
					repeat: Infinity,
					ease: "linear",
					delay: 3,
				}}
				onClick={() => {
					setClicked3(true);
					setTimeout(() => setClicked3(false), 1000);
				}}
			>
				<Image
					src="/f25/f3.png"
					alt="Flamingo Float"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Header */}
			<div className="absolute top-[2vw] left-1/2 transform -translate-x-1/2 z-10">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center"
				>
					<h1
						className="text-4xl md:text-5xl font-bold text-[#000080] mb-3"
						style={{ fontFamily: "Monomaniac One, monospace" }}
					>
						Info
					</h1>
					<div className="w-16 h-1 bg-[#000080] rounded-full mx-auto"></div>
				</motion.div>
			</div>

			{/* Main Content Container */}
			<div className="w-full max-w-7xl mx-auto mt-[-100px] md:mt-0">
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
							className="text-gray-700 whitespace-pre-line"
							style={{ fontSize: "clamp(14px, 2vw, 18px)" }}
						>
							{order[0].content}
						</p>
					</div>
				</div>

				{/* Stats Section - Conditionally Rendered */}
				{statsSectionFlag?.isEnabled && (
					<div className="flex flex-wrap justify-center gap-[4vw] pt-4">
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
				)}
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
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Desktop: triangle positions, Mobile: horizontal line
	const desktopPositions = [
		{ x: "-50%", y: "-80%", rotation: 0 }, // vertex 0: top-left
		{ x: "90%", y: "-80%", rotation: 0 }, // vertex 1: top-right
		{ x: "30%", y: "30%", rotation: 0 }, // vertex 2: bottom-center
	];

	const mobilePositions = [
		{ x: "-100%", y: "0%", rotation: 0 }, // left
		{ x: "0%", y: "0%", rotation: 0 }, // center
		{ x: "100%", y: "0%", rotation: 0 }, // right
	];

	const isSelected = slot === 0;

	// Different scaling for desktop vs mobile
	const desktopScale = isSelected ? 1.6 : 1;
	const mobileScale = isSelected ? 1.0 : 0.8;

	const position = isMobile ? mobilePositions[slot] : desktopPositions[slot];
	const scale = isMobile ? mobileScale : desktopScale;

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
			<svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full">
				<path
					d="M38,2 L82,2 A12,12 0 0,1 94,10 L112,44 A12,12 0 0,1 112,56 L94,90 A12,12 0 0,1 82,98 L38,98 A12,12 0 0,1 26,90 L8,56 A12,12 0 0,1 8,44 L26,10 A12,12 0 0,1 38,2"
					fill={section.color}
					fillOpacity={0.1}
					stroke="#86CFFC"
					strokeWidth={7}
				/>
			</svg>
			<motion.span
				className="relative z-10 font-bold text-center px-2 absolute inset-0 flex items-center justify-center"
				style={{
					color: "#000080",
					fontSize: isSelected
						? "clamp(17px, 2.5vw, 17px)"
						: "clamp(13px, 2vw, 13px)",
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
