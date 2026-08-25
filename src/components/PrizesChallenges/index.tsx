import React, { useState } from "react";
import Image from "next/image";
import Divider from "../common/Divider";
import { useFlagState } from "../../lib/api/flag/hook";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
} from "../ui/dialog";

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

const PrizeCard: React.FC<{
	award: AwardData;
	onClick: (award: AwardData) => void;
}> = ({ award, onClick }) => {
	return (
		<button
			onClick={() => onClick(award)}
			className="w-full rounded-2xl bg-[#1a1734]/80 border border-white/5 p-6 md:p-7 flex flex-col items-center text-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.3)]"
		>
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
		</button>
	);
};

const TerminalModal: React.FC<{
	award: AwardData | null;
	isOpen: boolean;
	onClose: () => void;
}> = ({ award, isOpen, onClose }) => {
	if (!award) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-black border-2 border-[#00ff00] max-w-2xl">
				<DialogHeader className="border-b-2 border-[#00ff00] pb-2">
					<div className="flex items-center justify-between w-full">
						<DialogTitle
							className="text-[#00ff00] font-mono text-lg"
							style={{ fontFamily: "Courier New, monospace" }}
						>
							&gt; {award.title.toUpperCase()}
						</DialogTitle>
						<DialogClose
							className="relative h-6 w-6 opacity-100 hover:opacity-100 hover:bg-transparent p-0 text-[#00ff00] hover:text-[#ff0000] transition-colors"
							asChild
						>
							<button className="text-2xl font-bold leading-none">×</button>
						</DialogClose>
					</div>
				</DialogHeader>

				<div
					className="space-y-4 font-mono text-[#00ff00]"
					style={{ fontFamily: "Courier New, monospace" }}
				>
					{award.description && (
						<div className="text-sm leading-relaxed">
							<span className="text-[#ffff00]">&gt; Description:</span>
							<p className="ml-4 mt-1">{award.description}</p>
						</div>
					)}

					{award.prizes && award.prizes.length > 0 && (
						<div className="text-sm">
							<span className="text-[#ffff00]">&gt; Prize Breakdown:</span>
							<div className="ml-4 mt-1 space-y-1">
								{award.prizes.map((prize, index) => (
									<div key={index} className="flex justify-between">
										<span>{prize.place}:</span>
										<span className="text-[#ff30f8]">{prize.amount}</span>
									</div>
								))}
							</div>
						</div>
					)}

					{award.extra && (
						<div className="text-sm">
							<span className="text-[#ffff00]">&gt; Additional Info:</span>
							<p className="ml-4 mt-1">{award.extra}</p>
						</div>
					)}

					<div className="pt-4 border-t-2 border-[#00ff00] text-xs">
						<span className="text-[#00ff00]">&gt; _</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

const PrizesChallenges: React.FC = () => {
	const { data: prizesAndChallengesFlag } = useFlagState("PrizesEnabled");
	const [selectedAward, setSelectedAward] = useState<AwardData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const awards: AwardData[] = [
		{
			id: 1,
			title: "HackPSU Grand Prize",
			displayAmount: "$3000",
			planetIcon: "/fa26/003/4.png",
			description:
				"The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally.",
			prizes: [
				{ place: "1st Place", amount: "$1500 in cash" },
				{ place: "2nd Place", amount: "$1000 in cash" },
				{ place: "3rd Place", amount: "$500 in cash" },
			],
		},
		{
			id: 2,
			title: "Base44 Challenge",
			displayAmount: "$50",
			planetIcon: "/fa26/003/2.png",
			description:
				"Social media connects billions of people, but it also faces issues like misinformation, mental health impacts, privacy concerns, and lack of meaningful engagement. How can technology improve social media experiences for users while addressing these challenges?",
			prizes: [
				{
					place: "Prize",
					amount:
						"Ketone-IQ Prize Bundle: 1 of Each Variant of the Energy Shots, Towel, Water Bottle, Performance Hat, $50 Target Gift Card",
				},
			],
		},
		{
			id: 3,
			title: "College of IST Challenge",
			displayAmount: "Top 3 Teams",
			planetIcon: "/fa26/003/13.png",
			description:
				"Build the future with Open Claw at this HackPSU challenge. Create innovative AI-powered tools, applications, and experiments using the OpenClaw platform. Explore bold ideas, collaborate with fellow hackers, and turn prototypes into real projects. Whether you're learning or pushing boundaries, this is your chance to shape what comes next with OpenClaw.",
			prizes: [
				{
					place: "1st Place",
					amount: "1 shared 3 month Claude Pro subscription for the team",
				},
				{
					place: "2nd Place",
					amount: "1 shared 2 month Claude Pro subscription for the team",
				},
				{
					place: "3rd Place",
					amount: "1 shared 1 month Claude Pro subscription for the team",
				},
			],
		},
	];

	const handleAwardClick = (award: AwardData) => {
		setSelectedAward(award);
		setIsModalOpen(true);
	};

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
					<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{awards.slice(0, 3).map((award) => (
							<PrizeCard
								key={award.id}
								award={award}
								onClick={handleAwardClick}
							/>
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
								<p className="text-sm text-[#EEE5CD]">
									Prizes & challenges will be announced soon. Stay tuned!
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			<TerminalModal
				award={selectedAward}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</section>
	);
};

export default PrizesChallenges;
