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
	glowColor: string;
};

const SECTIONS: Section[] = [
	{
		id: "about",
		label: "About",
		content:
			"HackPSU is a bi-annual collegiate hackathon at Penn State with workshops, speakers, and a community of creators. Join us for an incredible weekend of building, learning, and connecting with fellow hackers from universities across the region!",
		textColor: "#048A81",
		color: "#FFE4B5",
		glowColor: "#ff88e9ff",
	},
	{
		id: "eligibility",
		label: "Team Formation",
		content:
			"All participants must be at least 18 years old and a student of some university (or a recent PSU graduate within less than one year).\n\nTeams may be comprised of up to five members. A team may only submit one project, and no participant may be a member of multiple teams.\n\nAll participants must bring a valid form of identification.",
		textColor: "#8B4513",
		color: "#E6F3FF",
		glowColor: "#ffffaaff",
	},
	{
		id: "guidelines",
		label: "Project Guidelines",
		content:
			"Projects should be original works created on site. Coming with an idea in mind is perfectly fine, working on an existing project is not.\n\nAll projects must be submitted through Devpost by 12PM on Sunday and can be edited until 1:45PM Sunday. All project code must be attached to the project's Devpost submission.\n\nAnything you create is your work - HackPSU and its partners have no claim over intellectual property produced at the event.",
		textColor: "#2E8B57",
		color: "#F0FFF0",
		glowColor: "#8cfff9ff",
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
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw]"
			style={{
				minHeight: "60vw",
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -8px 15px #ff88e9ff, 0 8px 15px #ff88e9ff, inset 0 -8px 8px rgba(255, 136, 233, 0.1), inset 0 8px 8px rgba(255, 136, 233, 0.1)",
			}}
		>
			{/* Header */}
			<div className="absolute top-[2vw] left-1/2 transform -translate-x-1/2 z-10">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center"
				>
					<h1
						className="text-4xl md:text-5xl font-bold text-[#2f234bff] mb-3 "
						style={{
							fontFamily: "Orbitron, monospace",
							backgroundColor: "#ffffff",
							borderRadius: "12px",
							padding: "0.5rem 1rem",
						}}
					>
						Info
					</h1>
				</motion.div>
			</div>

			{/* Main Content Container */}
			<div className="w-full max-w-7xl mx-auto md:mt-10">
				{/* Hexagon Section + Info Panel */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-[4vw] mt-12">
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
						className="rounded-xl shadow-lg p-[3vw] bg-[#2f234bff] backdrop-blur-sm mt-12"
						style={{
							width: "clamp(300px, 35vw, 450px)",
							minHeight: "clamp(200px, 25vw, 320px)",
							border: `clamp(4px, 0.4vw, 6px) solid ${order[0].glowColor}`,
							boxShadow: `0 0 10px ${order[0].glowColor}, 0 0 20px ${order[0].glowColor}, inset 0 0 10px rgba(${
								order[0].glowColor === "#FF4444"
									? "255, 68, 68"
									: order[0].glowColor === "#FFFF00"
										? "255, 255, 0"
										: "0, 255, 68"
							}, 0.2)`,
						}}
					>
						<h3
							className="font-semibold mb-[1vw]"
							style={{
								fontSize: "clamp(18px, 3vw, 32px)",
								fontFamily: "Orbitron, monospace",
								color: order[0].glowColor,
							}}
						>
							{order[0].label}
						</h3>
						<p
							className="text-white whitespace-pre-line"
							style={{
								fontSize: "clamp(14px, 2vw, 18px)",
							}}
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
											fontFamily: "Orbitron, monospace",
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
			<svg
				viewBox="0 0 120 100"
				className="absolute inset-0 w-full h-full"
				style={{
					filter: `drop-shadow(0 0 4px ${section.glowColor}) drop-shadow(0 0 8px ${section.glowColor})`,
				}}
			>
				<path
					d="M38,2 L82,2 A12,12 0 0,1 94,10 L112,44 A12,12 0 0,1 112,56 L94,90 A12,12 0 0,1 82,98 L38,98 A12,12 0 0,1 26,90 L8,56 A12,12 0 0,1 8,44 L26,10 A12,12 0 0,1 38,2"
					fill="#2f234bff"
					fillOpacity={1}
					stroke={section.glowColor}
					strokeWidth={7}
				/>
			</svg>
			<motion.span
				className="relative z-10 font-bold text-center px-2 absolute inset-0 flex items-center justify-center"
				style={{
					color: "#ffffffff",
					fontSize: isSelected
						? "clamp(14px, 2.5vw, 14px)"
						: "clamp(13px, 2vw, 13px)",
					fontFamily: "Orbitron, monospace",
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
