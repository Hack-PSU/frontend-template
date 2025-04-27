// components/Challenges.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface Challenge {
	id: string;
	name: string;
	prize: string;
	description: string;
}
interface Challenge {
	id: string;
	name: string;
	prize: string;
	description: string;
}

const challenges: Challenge[] = [
	{
		id: "1",
		name: "HackPSU Grand Prize",
		prize:
			"1st Place: $350 in cash; 2nd Place: $200 in cash; 3rd Place: $150 in cash",
		description:
			"The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally.",
	},
	{
		id: "2",
		name: "Machine Learning",
		prize: "$100 in cash (team–split among members)",
		description:
			"Engineer an innovative, efficient, and scalable model to effectively address a real-world problem.",
	},
	{
		id: "3",
		name: "Entrepreneurship",
		prize: "$100 in cash (team–split among members)",
		description:
			"From hackathon to startup? Develop a technical solution with a robust and viable business strategy.",
	},
	{
		id: "4",
		name: "10th Anniversary: Timeless Tech",
		prize: "$100 in cash (team–split among members)",
		description:
			"Draw inspiration from groundbreaking tech, media, and trends of the past and transform them into something entirely new, pushing boundaries beyond imitation.",
	},
	{
		id: "5",
		name: "ICDS LIDAR Classification",
		prize: "See ICDS press release & promotion package",
		description:
			"Utilizing the point cloud provided by the ICDS for the Center for Immersive Experience lab, create a script to automatically classify distinct objects within the space.\n\n" +
			"• ICDS press release on winning submission" +
			"• Social media promotion on ICDS channels" +
			"• LinkedIn endorsement for winning team" +
			"• Presentation invite at future ICDS Lunch & Learn",
	},
];

export default function Challenges() {
	const [flipped, setFlipped] = useState<Record<string, boolean>>({});
	const toggle = (id: string) =>
		setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));

	return (
		<section className=" px-6 py-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
				{challenges.map((ch) => {
					const isFlipped = !!flipped[ch.id];
					return (
						<div
							key={ch.id}
							className="relative perspective-[1000px] w-full h-80"
							onClick={() => toggle(ch.id)}
						>
							<motion.div
								animate={{ rotateY: isFlipped ? 180 : 0 }}
								transition={{ duration: 0.6, ease: "easeInOut" }}
								className="relative w-full h-full [transform-style:preserve-3d]"
							>
								{/* Front face */}
								<div
									className={clsx(
										"absolute inset-0 bg-white bg-opacity-40 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center cursor-pointer",
										"[backface-visibility:hidden]"
									)}
								>
									<h3 className="text-2xl font-semibold mb-2">{ch.name}</h3>
									<p className="text-lg text-teal-600 font-bold">{ch.prize}</p>
									<p className="mt-4 text-sm text-gray-600">
										Click to see details
									</p>
								</div>

								{/* Back face */}
								<div
									className={clsx(
										"absolute inset-0 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center cursor-pointer",
										"[transform:rotateY(180deg)]",
										"[backface-visibility:hidden]"
									)}
								>
									<p className="text-base text-gray-700 text-center">
										{ch.description}
									</p>
								</div>
							</motion.div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
