import React, { useState, useEffect } from "react";
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
	prizes?: Prize[];
	extra?: string;
}

interface AwardBoxProps {
	title: string;
	description: string;
	prizes?: Prize[];
	extra?: string;
}

const AwardBox: React.FC<AwardBoxProps> = ({
	title,
	description,
	prizes = [],
	extra,
}) => {
	return (
		<div className="p-6 rounded-xl bg-white/95 backdrop-blur-sm border-2 border-[#0066CC] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
			<div style={{ fontFamily: "Orbitron, monospace" }}>
				<h2 className="text-xl md:text-2xl font-bold text-[#000080] mb-4 text-center">
					{title}
				</h2>
				{description && (
					<p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed text-left">
						{description}
					</p>
				)}
				{prizes.length > 0 && (
					<div className="mt-4 space-y-2">
						{prizes.map((prize, index) => (
							<div
								key={index}
								className="p-3 bg-blue-50 rounded-lg border border-blue-100"
							>
								<div className="text-sm md:text-base font-semibold text-[#000080] mb-1">
									{prize.place}
								</div>
								<div className="text-sm md:text-base text-gray-900 font-medium">
									{prize.amount}
								</div>
							</div>
						))}
					</div>
				)}
				{extra && (
					<div className="text-sm md:text-base text-gray-700 mt-4 leading-relaxed text-left whitespace-pre-line">
						{extra}
					</div>
				)}
			</div>
		</div>
	);
};

const PrizeButton: React.FC<{
	award: AwardData;
	onClick: (award: AwardData) => void;
	style?: React.CSSProperties;
	width?: string;
	height?: string;
	isModalOpen?: boolean;
	selectedAwardId?: number;
}> = ({
	award,
	onClick,
	style,
	width = "6rem",
	height = "6rem",
	isModalOpen = false,
	selectedAwardId,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const isAwardSelected = selectedAwardId === award.id;
	const showOpen = isHovered || (isModalOpen && isAwardSelected);

	return (
		<button
			onClick={() => onClick(award)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{
				...style,
				width,
				height,
			}}
			className="relative transition-transform duration-200 hover:scale-110 focus:outline-none"
		>
			<Image
				src={showOpen ? "/sp26/BoxOpened2.png" : "/sp26/BoxClosed3.png"}
				alt={award.title}
				fill
				className="object-contain"
			/>
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
										<span className="text-[#ff00ff]">{prize.amount}</span>
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
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		// Check initial screen size
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();

		// Add resize listener
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Configurable button sizes
	const mobileButtonWidth = "6.5rem";
	const mobileButtonHeight = "6.5rem";
	const desktopButtonWidth = "12rem";
	const desktopButtonHeight = "12rem";

	const awards: AwardData[] = [
		{
			id: 1,
			title: "HackPSU Grand Prize",
			description:
				"The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally.",
			prizes: [
				{ place: "1st Place", amount: "$500 in cash" },
				{ place: "2nd Place", amount: "$300 in cash" },
				{ place: "3rd Place", amount: "$100 in cash" },
			],
		},
		{
			id: 2,
			title: "Best UX/UI Design",
			description:
				"Create a project where the user interface is accessible, functional, and intuitive. Information can be perceived in multiple ways, such as adjustable color contrast, font size, or captions. Navigation is operable and user-friendly. Content is understandable and robust across devices and assistive technologies.",
			prizes: [
				{
					place: "Prize",
					amount: "Peraton swag bag and Beats Headphones for each team member",
				},
			],
		},
		{
			id: 3,
			title: "Nittany AI Challenge",
			description:
				"Use the power of AI to address real-world problems in: Health, Humanitarianism, Education, Environment, and Agriculture.",
			prizes: [
				{
					place: "1st Place",
					amount: "$99 Amazon Gift Card per team member (up to 5)",
				},
				{
					place: "2nd Place",
					amount: "$50 Amazon Gift Card per team member (up to 5)",
				},
				{
					place: "3rd Place",
					amount: "$25 Amazon Gift Card per team member (up to 5)",
				},
			],
			extra: "Total prize pool: $870 in cash",
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
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -6px 10px #ff88e9cc, 0 6px 10px #ff88e9cc, inset 0 -6px 6px rgba(255, 136, 233, 0.05), inset 0 6px 6px rgba(255, 136, 233, 0.05)",
			}}
		>
			<div className="text-center mb-20 mt-[-3rem]">
				<h1
					className="text-4xl md:text-5xl font-bold text-[#3D5EAB] mb-3"
					style={{
						fontFamily: "Orbitron, monospace",
						backgroundColor: "#ffffff",
						borderRadius: "12px",
						padding: "0.5rem 1rem",
					}}
				>
					Prizes & Challenges
				</h1>
				<div className="w-20 h-1.5 rounded-full mx-auto mb-10"></div>
			</div>
			<div className="w-full max-w-7xl flex flex-col items-center mb-[-8rem]">
				{prizesAndChallengesFlag?.isEnabled ? (
					<div className="w-full h-96 md:h-[500px] relative flex items-center justify-center">
						{/* Diagonal Button Container */}
						{awards.map((award, index) => {
							// Desktop alignment values
							const desktopBaseLeft = index * 12;
							const desktopBaseTop = index * 35;
							const desktopHorizontalOffset = 39;

							// Mobile alignment values - adjust these as needed
							const mobileBaseLeft = index * 30;
							const mobileBaseTop = index * 27;
							const mobileHorizontalOffset = 15;

							// Select values based on screen size
							const baseLeft = isMobile ? mobileBaseLeft : desktopBaseLeft;
							const baseTop = isMobile ? mobileBaseTop : desktopBaseTop;
							const horizontalOffset = isMobile
								? mobileHorizontalOffset
								: desktopHorizontalOffset;
							const buttonWidth = isMobile
								? mobileButtonWidth
								: desktopButtonWidth;
							const buttonHeight = isMobile
								? mobileButtonHeight
								: desktopButtonHeight;

							return (
								<PrizeButton
									key={award.id}
									award={award}
									onClick={handleAwardClick}
									width={buttonWidth}
									height={buttonHeight}
									isModalOpen={isModalOpen}
									selectedAwardId={selectedAward?.id}
									style={{
										position: "absolute",
										left: `${baseLeft + horizontalOffset}%`,
										top: `${baseTop}%`,
										transform: "translate(-50%, -50%)",
									}}
								/>
							);
						})}
					</div>
				) : (
					<div className="w-full mb-60">
						{/* Small Coming Soon Message */}
						<div className="w-full max-w-md mx-auto mb-40">
							<div className="p-4 rounded-lg text-center bg-white/90 backdrop-blur-sm border-2 border-[#0066CC] shadow-md">
								<h3
									className="text-lg font-bold text-[#000080] mb-1"
									style={{ fontFamily: "Orbitron, monospace" }}
								>
									Coming Soon!
								</h3>
								<p className="text-sm text-gray-600">
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
