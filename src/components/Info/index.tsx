"use client";

// components/InfoSections.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";

// --- Section type & data ---
type Section = {
	id: string;
	label: string;
	content: string;
	color: string; // brand color (hex or rgba)
	textColor: string; // text contrast color
};

const SECTIONS: Section[] = [
	{
		id: "about",
		label: "About",
		content:
			"HackPSU is a bi-annual collegiate hackathon at Penn State with workshops, speakers, and a community of creators. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. Lets add a lot of text here to see how it looks when it overflows. continue adding text here to see how it looks when it overflows.",
		color: "#ffffff",
		textColor: "#000000",
	},
	{
		id: "rules",
		label: "Rules",
		content:
			"All code must be written during the 48-hour hackathon window. No pre-built assets except open-source libraries.",
		color: "#ffffff",
		textColor: "#000000",
	},
	{
		id: "prepare",
		label: "How to Prepare",
		content:
			"Form a team, brush up on your stack, check out prior projects, and come with an open mind to learn and build!",
		color: "#ffffff",
		textColor: "#000000",
	},
];

const STATS = [
	{ label: "Hackers", value: 500 },
	{ label: "Universities", value: 120 },
	{ label: "Prizes", value: "$10K+" },
	{ label: "Hours", value: 48 },
];

// responsive absolute positions via Tailwind classes
const SLOT_CLASSES: string[] = [
	// slot 0: top-left
	"absolute top-0 left-4 sm:left-8 md:left-12 lg:left-[25%] xl:left-[25%]",
	// slot 1: top-right
	"absolute top-0 right-4 sm:right-8 md:right-12 lg:-right-[67%] lg:-top-[17%] xl:-right-[58%] xl:-top-[17%]",
	// slot 2: bottom-center
	"absolute bottom-0 left-1/2 sm:bottom-4 md:bottom-8 lg:bottom-[31%] lg:left-[25%] xl:bottom-[35%] xl:left-[25%]",
];

const InfoSections: React.FC = () => {
	const [order, setOrder] = useState(SECTIONS);

	// rotate array left by `steps`
	function rotateLeft(steps: number) {
		setOrder((prev) => {
			const k = steps % prev.length;
			return [...prev.slice(k), ...prev.slice(0, k)];
		});
	}

	// clicking slot idx spins it into position 0
	function onClickSection(idx: number) {
		if (idx !== 0) rotateLeft(idx);
	}

	return (
		<div className="bg-[#D8FFFC]">
			<motion.div
				className="absolute sm:bottom-0 sm:left-0 md:bottom-0 md:left-0 lg:bottom-[0%] lg:left-[0%] xl:bottom-[0%] xl:left-[0%]"
				animate={{
					rotate: [0, 15, 0],
					x: ["0"],
					y: ["0px", "75px", "0px"],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<Image
					src="/duck.png"
					alt="Ball"
					width={200}
					height={200}
					className=""
				/>
			</motion.div>
			<motion.div
				className="absolute sm:bottom-0 sm:right-0 md:bottom-0 md:right-0 lg:bottom-[0%] lg:right-[0%] xl:bottom-[-3%] xl:right-[20%]"
				animate={{
					rotate: [0, -30, 0],
					x: ["0"],
					y: ["0px", "0px", "0px"],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<Image
					src="/donut.png"
					alt="Ball"
					width={200}
					height={200}
					className=""
				/>
			</motion.div>
			<motion.div
				className="absolute sm:bottom-0 sm:right-0 md:bottom-0 md:right-0 lg:bottom-[0%] lg:right-[0%] xl:bottom-[-10%] xl:right-[3%]"
				animate={{
					rotate: [180, 210, 180],
					x: ["0"],
					y: ["0px", "0px", "0px"],
				}}
				transition={{
					duration: 6,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<Image
					src="/flamingo.png"
					alt="Ball"
					width={200}
					height={200}
					className=""
				/>
			</motion.div>

			<div className="max-w-7xl mx-auto px-6 py-12 space-y-16 bg-[#D8FFFC]">
				{/* top: hex ring + info box */}
				<div className="flex flex-col md:flex-row items-center justify-between">
					{/* hexagon container (relative) */}
					<div className="relative w-full md:w-1/2 h-64 md:h-[450px]">
						{order.map((section, idx) => (
							<Hex
								key={section.id}
								section={section}
								slot={idx}
								onClick={() => onClickSection(idx)}
							/>
						))}
					</div>

					{/* info panel shows whichever is in slot 0 */}
					<motion.div
						key={order[0].id}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 20 }}
						className="w-full md:w-1/3 rounded-xl shadow-lg p-6 bg-white/90 backdrop-blur-sm mt-8 md:mt-0"
						style={{ borderLeft: `6px solid #86CFFC` }}
					>
						<h3 className="text-2xl font-semibold mb-2">{order[0].label}</h3>
						<p className="text-gray-700">{order[0].content}</p>
					</motion.div>
				</div>

				{/* bottom stats */}
				<div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
					{STATS.map((s, i) => {
						const colors = ["#86CFFC", "#048A81"];
						return (
							<div key={s.label} className="text-center w-1/2 sm:w-auto">
								<span
									className="text-3xl sm:text-4xl font-bold comic-relief"
									style={{ color: colors[i % colors.length] }}
								>
									{s.value}
								</span>
								<p className="text-sm uppercase mt-1 text-gray-600">
									{s.label}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

// Hexagon component with absolute positioning and responsive classes
interface HexProps {
	section: Section;
	slot: number;
	onClick: () => void;
}

function Hex({ section, slot, onClick }: HexProps) {
	const scale = slot === 0 ? 1.6 : 1;

	return (
		<motion.div
			layout
			transition={{ type: "spring", stiffness: 200, damping: 20 }}
			animate={{ scale }}
			onClick={onClick}
			className={clsx(
				SLOT_CLASSES[slot],
				"cursor-pointer w-24 h-24 sm:w-48 sm:h-48 flex items-center justify-center relative"
			)}
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
			<span
				className="relative z-10 px-2 font-medium text-center text-sm sm:text-xl"
				style={{ color: section.textColor }}
			>
				{section.label}
			</span>
		</motion.div>
	);
}

export default InfoSections;