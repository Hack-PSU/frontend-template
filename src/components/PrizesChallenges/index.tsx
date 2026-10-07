import React from "react";
import Image from "next/image";
import Divider from "../common/Divider";
import { useFlagGetOne } from "@hackpsu/react-sdk";

interface Prize {
	place: string;
	amount: string;
}

interface AwardData {
	id: number;
	title: string;
	description: string;
	displayAmount: string;
	planetIcon: string;
	prizes?: Prize[];
	extra?: string;
}

const ComingSoonCard: React.FC = () => {
	return (
		<div className="w-full rounded-2xl bg-[#1a1734]/80 border border-white/5 p-6 md:p-7 flex flex-col items-center justify-center text-center h-full">
			<h2
				className="text-3xl md:text-4xl leading-none"
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					color: "#EEE5CD",
				}}
			>
				Coming Soon
			</h2>
			<p
				className="mt-5 text-base md:text-lg leading-relaxed"
				style={{
					fontFamily: "'DM Sans', sans-serif",
					color: "#EEE5CD",
				}}
			>
				This challenge hasn&apos;t been announced yet. Stay tuned!
			</p>
		</div>
	);
};

const PrizeCard: React.FC<{ award: AwardData }> = ({ award }) => {
	return (
		<div className="w-full h-full rounded-2xl bg-[#1a1734]/80 border border-white/5 p-6 md:p-7 flex flex-col items-center text-center">
			<div className="relative h-28 w-28 md:h-36 md:w-36 mb-5">
				<Image
					src={award.planetIcon}
					alt={award.title}
					fill
					className="object-contain"
				/>
			</div>
			<h2
				className="text-3xl md:text-4xl leading-none"
				style={{
					fontFamily: "'Barlow Condensed', sans-serif",
					color: "#EEE5CD",
				}}
			>
				{award.title}
			</h2>
			<p
				className="text-3xl md:text-4xl mt-2"
				style={{
					fontFamily: "Orbitron, monospace",
					color: "#B6663C",
				}}
			>
				{award.displayAmount}
			</p>
			<p
				className="mt-5 text-base md:text-lg leading-relaxed"
				style={{
					fontFamily: "'DM Sans', sans-serif",
					color: "#EEE5CD",
				}}
			>
				{award.description}
			</p>

			{award.prizes && award.prizes.length > 0 && (
				<div className="w-full mt-6 pt-5 border-t border-white/10 space-y-2.5">
					{award.prizes.map((prize, index) => (
						<div
							key={index}
							className="flex items-center justify-between gap-4 text-left"
						>
							<span
								className="text-sm md:text-base shrink-0"
								style={{
									fontFamily: "'Barlow Condensed', sans-serif",
									color: "#E2C75E",
								}}
							>
								{prize.place}
							</span>
							<span
								className="text-sm md:text-base leading-snug"
								style={{
									fontFamily: "'DM Sans', sans-serif",
									color: "#EEE5CD",
								}}
							>
								{prize.amount}
							</span>
						</div>
					))}
				</div>
			)}

			{award.extra && (
				<p
					className="w-full mt-4 pt-4 border-t border-white/10 text-sm leading-relaxed"
					style={{
						fontFamily: "'DM Sans', sans-serif",
						color: "#EEE5CD",
					}}
				>
					{award.extra}
				</p>
			)}
		</div>
	);
};

const PrizesChallenges: React.FC = () => {
	const { data: prizesAndChallengesFlag } = useFlagGetOne("PrizesEnabled");

	const awards: AwardData[] = [
		{
			id: 1,
			title: "HackPSU Grand Prize",
			displayAmount: "$3500",
			planetIcon: "/fa26/003/4.png",
			description:
				"The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally.",
			prizes: [
				{ place: "1st Place", amount: "$2000 in cash" },
				{ place: "2nd Place", amount: "$1000 in cash" },
				{ place: "3rd Place", amount: "$500 in cash" },
			],
		},
		{
			id: 2,
			title: "Research Track",
			displayAmount: "$1500",
			planetIcon: "/fa26/003/2.png",
			description:
				"Build a tool that makes scientific research faster. Research is full of avoidable delays: cleaning and reformatting data, digging through papers by hand, re-running the same analysis over and over, or waiting on a workflow that should be automated. Pick one bottleneck and build a tool that removes it.",
			prizes: [{ place: "Winning Team", amount: "$1500" }],
		},
		{
			id: 3,
			title: "AI Strategy Case Challenge",
			displayAmount: "$500",
			planetIcon: "/fa26/003/13.png",
			description:
				"Business & Marketing Strategy: At the opening ceremony, your team receives a realistic business case: a company, its situation, and a decision it needs to make. Use AI throughout your process, whether for research, scenario modeling, or stress-testing your own thinking. Partway through, expect a curveball. New information will change the picture, and your strategy needs to adapt, not restart.",
			prizes: [
				{
					place: "Deliverable",
					amount:
						"A short slide deck and a 5-minute pitch to a panel of Smeal College of Business faculty. Include how you used AI and where you pushed back on it.",
				},
				{ place: "Winning Team", amount: "$500" },
			],
			extra:
				"No code allowed and none required. No business background needed. Open to every major. Bring judgment, and a recommendation you can defend. Case track teams compete only in this track and are not eligible for the Grand Prize.",
		},
		{
			id: 4,
			title: "General Track: The Mystery Stack",
			displayAmount: "$1500",
			planetIcon: "/fa26/003/3.png",
			description:
				"Not every great project starts with a plan. Some start with a surprise. The General Track is a mystery, and it stays that way until the event begins. Bring your curiosity, your adaptability, and your best improvisation. Want to know what you're working with? Be at opening ceremony. That's where the mystery gets revealed.",
			prizes: [{ place: "Winning Team", amount: "$1500" }],
		},
	];

	return (
		<section
			id="prizes"
			className="flex flex-col items-center w-full px-4 md:px-8 relative"
			style={{
				minHeight: "50vh",
				paddingTop: "5rem",
				paddingBottom: "5rem",
			}}
		>
			<div className="text-center mb-20 mt-[-3rem]">
				<h1
					className="text-4xl md:text-8xl font-bold text-[#EEE5CD] mb-3"
					style={{
						fontFamily: "Barlow Condensed",
						borderRadius: "12px",
						padding: "0.5rem 1rem",
					}}
				>
					<span style={{ color: "#EEE5CD" }}>Discover</span>{" "}
					<span style={{ color: "#E2C75E" }}>New Worlds</span>{" "}
				</h1>
				<div
						className=""
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "clamp(15px, 1.8vw, 20px)",
							lineHeight: 1.5,
							color: "#EEE5CD",
						}}
						
					>
						Each planet holds its own prizes, waiting to be claimed by the boldest explorers.
					</div>
				<div className="w-20 h-1.5 rounded-full mx-auto mb-10"></div>
			</div>
			<div className="w-full max-w-7xl flex flex-col items-center">
				{prizesAndChallengesFlag?.isEnabled ? (
					<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
						{awards.map((award) => (
							<PrizeCard key={award.id} award={award} />
						))}
					</div>
				) : (
					<div className="w-full">
						{/* Small Coming Soon Message */}
						<div className="w-full max-w-md mx-auto">
							<div className="p-4 rounded-lg text-center backdrop-blur-sm border-2 border-[#E2C75E] shadow-md">
								<h3
									className="text-lg font-bold text-[#EEE5CD] mb-1"
									style={{ fontFamily: "Orbitron, monospace" }}
								>
									Coming Soon!
								</h3>
								<p 
									className="text-sm text-[#EEE5CD]"
									style={{ fontFamily: "'DM Sans', sans-serif" }}
								>
									Prizes & challenges will be announced soon. Stay tuned!
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default PrizesChallenges;
