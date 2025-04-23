"use client";

// components/InfoSections.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Image from "next/image";

type Section = {
	id: string;
	label: string;
	content: string;
	color: string; // brand color with opacity
	textColor: string; // for contrast
};

const SECTIONS: Section[] = [
	{
		id: "about",
		label: "About",
		content:
			"HackPSU is a bi-annual collegiate hackathon at Penn State with workshops, speakers, and a community of creators.",
		color: "rgba(242, 92, 84, 0.8)", // #F25C54 + 80% opacity
		textColor: "#ffffff",
	},
	{
		id: "rules",
		label: "Rules",
		content:
			"All code must be written during the 48-hour hackathon window. No pre-built assets except open-source libraries.",
		color: "rgba(24, 56, 92, 0.8)", // #18385C + 80% opacity
		textColor: "#ffffff",
	},
	{
		id: "prepare",
		label: "How to Prepare",
		content:
			"Form a team, brush up on your stack, check out prior projects, and come with an open mind to learn and build!",
		color: "rgba(218, 183, 133, 0.8)", // #DAB785 + 80% opacity
		textColor: "#000000",
	},
];

const STATS = [
	{ label: "Hackers", value: 500 },
	{ label: "Universities", value: 120 },
	{ label: "Prizes", value: "$10K+" },
	{ label: "Hours", value: 48 },
];

// inverted-triangle slots on a 3-column grid
const SLOT_CLASSES = [
	"col-start-1 row-start-1 justify-self-center", // top-left
	"col-start-3 row-start-1 justify-self-center", // top-right
	"col-start-2 row-start-2 justify-self-center", // bottom-center
];

// hexagon clip-path
const HEX_CLIP =
	"polygon(25% 6.7%,75% 6.7%,100% 50%,75% 93.3%,25% 93.3%,0% 50%)";

export const InfoSections: React.FC = () => {
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
		<div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
			{/* top: hex ring + info box */}
			<div className="flex items-center justify-between">
				<div className="relative w-1/2 h-[350px]">
					<div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2">
						{order.map((section, idx) => (
							<Hex
								key={section.id}
								section={section}
								slot={idx}
								onClick={() => onClickSection(idx)}
							/>
						))}
					</div>
				</div>

				{/* info panel shows whichever is in slot 0 */}
				<motion.div
					key={order[0].id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					className="w-1/3 rounded-xl shadow-lg p-6 bg-white/90 backdrop-blur-sm"
					style={{ borderLeft: `4px solid ${order[0].color}` }}
				>
					<h3 className="text-xl font-semibold mb-2">{order[0].label}</h3>
					<p className="text-gray-700">{order[0].content}</p>
				</motion.div>
			</div>

			{/* bottom stats */}
			<div className="flex justify-center space-x-12">
				{STATS.map((s, i) => {
					// alternate two remaining brand colors for stats
					const colors = ["#B9E6FF", "#048A81"];
					return (
						<div key={s.label} className="text-center">
							<span
								className="text-4xl font-bold"
								style={{ color: colors[i % colors.length] }}
							>
								{s.value}
							</span>
							<p className="text-sm uppercase mt-1 text-gray-600">{s.label}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

function Hex({
	section,
	slot,
	onClick,
}: {
	section: Section;
	slot: number;
	onClick: () => void;
}) {
	// scale up the selected (slot 0) hex
	const scale = slot === 0 ? 1.8 : 1;

	return (
		<motion.div
			layout
			transition={{ type: "spring", stiffness: 200, damping: 20 }}
			animate={{ scale }}
			onClick={onClick}
			className={clsx(
				SLOT_CLASSES[slot],
				"cursor-pointer shadow-md w-36 h-36 flex items-center justify-center"
			)}
			style={{
				clipPath: HEX_CLIP,
				backgroundColor: section.color,
			}}
		>
			<span
				className="text-center px-2 font-medium"
				style={{ color: section.textColor }}
			>
				{section.label}
			</span>
		</motion.div>
	);
}

export default InfoSections;
