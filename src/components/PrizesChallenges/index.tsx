import React from "react";
import Image from "next/image";
import Divider from "../common/Divider";
import { useFlagState } from "../../lib/api/flag/hook";

interface Prize {
	place: string;
	amount: string;
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
			<div style={{ fontFamily: "Monomaniac One, monospace" }}>
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

const PrizesChallenges: React.FC = () => {
	const { data: prizesAndChallengesFlag } = useFlagState("PrizesEnabled");

	return (
		<section
			id="prizes"
			className="flex flex-col items-center w-full px-4 md:px-8"
			style={{
				backgroundColor: "#B1E8FF",
				minHeight: "50vh",
				paddingTop: "5rem",
				paddingBottom: "5rem",
			}}
		>
			<div className="w-full max-w-7xl flex flex-col items-center">
				<h1
					className="text-4xl md:text-5xl font-bold text-[#000080] mb-3"
					style={{ fontFamily: "Monomaniac One, monospace" }}
				>
					Prizes & Challenges
				</h1>
				<div className="w-20 h-1.5 bg-[#000080] rounded-full mx-auto mb-10"></div>

				{/* {prizesAndChallengesFlag?.isEnabled ? ( */}
				{prizesAndChallengesFlag?.isEnabled ? (
					<div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<AwardBox
							title="HackPSU Grand Prize"
							description="The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally."
							prizes={[
								{ place: "1st Place", amount: "$500 in cash" },
								{ place: "2nd Place", amount: "$300 in cash" },
								{ place: "3rd Place", amount: "$100 in cash" },
							]}
						/>
						<AwardBox
							title="Best UX/UI Design"
							description="Create a project where the user interface is accessible, functional, and intuitive. Information can be perceived in multiple ways, such as adjustable color contrast, font size, or captions. Navigation is operable and user-friendly. Content is understandable and robust across devices and assistive technologies."
							prizes={[
								{
									place: "Prize",
									amount:
										"Peraton swag bag and Beats Headphones for each team member",
								},
							]}
						/>
						<AwardBox
							title="Nittany AI Challenge"
							description="Use the power of AI to address real-world problems in: Health, Humanitarianism, Education, Environment, and Agriculture."
							prizes={[
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
							]}
							extra="Total prize pool: $870 in cash"
						/>
					</div>
				) : (
					<div className="w-full">
						{/* Small Coming Soon Message */}
						<div className="w-full max-w-md mx-auto mb-6">
							<div className="p-4 rounded-lg text-center bg-white/90 backdrop-blur-sm border-2 border-[#0066CC] shadow-md">
								<h3
									className="text-lg font-bold text-[#000080] mb-1"
									style={{ fontFamily: "Monomaniac One, monospace" }}
								>
									Coming Soon!
								</h3>
								<p className="text-sm text-gray-600">
									Prizes & challenges will be announced soon. Stay tuned!
								</p>
							</div>
						</div>

						{/* Placeholder Cards - Hidden on mobile */}
						<div className="w-full hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
							{/* Card 1 - Click Side */}
							<div className="relative aspect-[3/4] rounded-lg overflow-hidden hover:scale-105 transition-transform">
								<Image
									src="/f25/challengesCardClickSide.png"
									alt="Challenge Card Placeholder"
									fill
									className="object-cover"
								/>
							</div>

							{/* Card 2 - Write Side */}
							<div className="relative aspect-[3/4] rounded-lg overflow-hidden hover:scale-105 transition-transform">
								<Image
									src="/f25/challengesCardWriteSide.png"
									alt="Challenge Card Placeholder"
									fill
									className="object-cover"
								/>
							</div>

							{/* Card 3 - Click Side */}
							<div className="relative aspect-[3/4] rounded-lg overflow-hidden hover:scale-105 transition-transform">
								<Image
									src="/f25/challengesCardClickSide.png"
									alt="Challenge Card Placeholder"
									fill
									className="object-cover"
								/>
							</div>

							{/* Card 4 - Write Side */}
							<div className="relative aspect-[3/4] rounded-lg overflow-hidden hover:scale-105 transition-transform">
								<Image
									src="/f25/challengesCardWriteSide.png"
									alt="Challenge Card Placeholder"
									fill
									className="object-cover"
								/>
							</div>

							{/* Card 5 - Click Side */}
							<div className="relative aspect-[3/4] rounded-lg overflow-hidden hover:scale-105 transition-transform">
								<Image
									src="/f25/challengesCardClickSide.png"
									alt="Challenge Card Placeholder"
									fill
									className="object-cover"
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default PrizesChallenges;
