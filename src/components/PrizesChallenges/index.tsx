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
		<div className="p-6 rounded-xl text-center bg-white/90 backdrop-blur-sm border-4 border-[#0066CC] shadow-lg transition-transform hover:scale-105">
			<div className="mx-4 py-6">
				<h2 className="text-2xl md:text-3xl font-bold text-[#000080] mb-3">
					{title}
				</h2>
				{description && (
					<p className="text-base md:text-lg text-gray-800 mb-3">
						{description}
					</p>
				)}
				{prizes.length > 0 && (
					<table className="table-auto mt-4 w-full">
						<tbody>
							{prizes.map((prize, index) => (
								<tr key={index}>
									<td className="text-base md:text-lg px-4 py-1 font-semibold text-[#000080]">
										{prize.place}:
									</td>
									<td className="text-base md:text-lg px-4 py-1 text-gray-900">
										{prize.amount}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{extra && (
					<div className="text-base md:text-lg text-gray-800 mt-3 whitespace-pre-line">
						{extra}
					</div>
				)}
			</div>
		</div>
	);
};

const PrizesChallenges: React.FC = () => {
	const { data: prizesAndChallengesFlag } = useFlagState("PrizeEnable");
	const isFlagEnabled = true;

	return (
		<section
			id="prizes"
			className="flex flex-col items-center w-full px-4"
			style={{
				backgroundColor: "#B1E8FF",
				minHeight: "50vh",
				paddingTop: "4rem",
				paddingBottom: "4rem",
			}}
		>
			<div className="w-full max-w-6xl flex flex-col items-center">
				<h1
					className="text-4xl md:text-5xl font-bold text-[#000080] mb-3"
					style={{ fontFamily: "Monomaniac One, monospace" }}
				>
					Prizes & Challenges
				</h1>
				<div className="w-16 h-1 bg-[#000080] rounded-full mx-auto mb-8"></div>

				{/* {prizesAndChallengesFlag?.isEnabled ? ( */}
				{isFlagEnabled ? (
					<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
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
							description="Best UX/UI Design 
										(Pages present information that can be perceived in different ways, 
										where a user can adjust color contrast or font size, 
										or view captions for videos)

										User interface components and navigation are functional for users in ways they can operate.

										Information and user interface operation are understandable.

										Content is robust enough that it can be interpreted reliably 
										by a wide variety of users and assistive technologies.
										"
							prizes={[
								{
									place: "Prize",
									amount:
										"A bag of Peraton swag plus a pair of Beats Headphones for each team member",
								},
							]}
						/>
						<AwardBox
							title="Nittany AI Challenge"
							description="Use the power of artificial intelligence to address a problem in the fields of Health, Humanitarianism, Education, Environment, and/or Agriculture."
							prizes={[
								{
									place: "Prize",
									amount:
										"$870 in cash",
								},
							]}
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