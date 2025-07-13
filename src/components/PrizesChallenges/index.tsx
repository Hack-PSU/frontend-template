import React from "react";
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
		<div className="p-6 rounded-xl text-center bg-white/30 backdrop-blur-sm border-2 border-[#EFA00B] shadow-lg transition-transform hover:scale-105">
			<div className="mx-4 py-6">
				<h2 className="text-2xl md:text-3xl font-bold text-[#A20021] mb-3">
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
									<td className="text-base md:text-lg px-4 py-1 font-semibold text-[#A20021]">
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
	const { data: flag } = useFlagState("PrizesEnabled");
	if (!flag?.isEnabled) {
		return null;
	}

	return (
		<section
			id="prizes"
			className="flex flex-col items-center w-full mt-20 px-4"
		>
			<div className="w-full max-w-6xl flex flex-col items-center">
				<h1 className="md:text-5xl font-['rye'] text-[#A20021] text-[4rem] mb-3">
					Prizes & Challenges
				</h1>
				<Divider />
				<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
					<AwardBox
						title="HackPSU Grand Prize"
						description="The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally."
						prizes={[
							{ place: "1st Place", amount: "$350 in cash" },
							{ place: "2nd Place", amount: "$200 in cash" },
							{ place: "3rd Place", amount: "$150 in cash" },
						]}
					/>
					<AwardBox
						title="Machine Learning"
						description="Engineer an innovative, efficient, and scalable model to effectively address a real world problem."
						prizes={[
							{
								place: "Prize",
								amount:
									"$100 in cash, won by the team and split among the members",
							},
						]}
					/>
					<AwardBox
						title="Entrepreneurship"
						description="From hackathon to startup? Develop a technical solution with a robust and viable business strategy."
						prizes={[
							{
								place: "Prize",
								amount:
									"$100 in cash, won by the team and split among the members",
							},
						]}
					/>
					<AwardBox
						title="10th Anniversary: Timeless Tech"
						description="Draw inspiration from groundbreaking tech, media, and trends of the past and transform them into something entirely new, pushing boundaries beyond imitation."
						prizes={[
							{
								place: "Prize",
								amount:
									"$100 in cash, won by the team and split among the members",
							},
						]}
					/>
					<AwardBox
						title="ICDS Challenge - Classification of LIDAR Data for Digital Twin Creation and 3D Modeling of Spaces on Campus."
						description="Utilizing the point cloud provided by the ICDS for the Center for Immersive Experience lab, create a script to automatically classify distinct objects within the space."
						extra={`ICDS developed press release on winning team’s submission from HackPSU weekend to be published on ICDS website and other Penn State media channels.\n
							Social media promotion on ICDS branded channels for winning team’s submission.\n
							LinkedIn endorsement referencing winning team’s submission.\n
							Presentation invite to a future ICDS Lunch and Learn where winning team will present their winning submission to ICDS leadership team and discuss careers in HPC.\n`}
					/>
				</div>
			</div>
		</section>
	);
};

export default PrizesChallenges;
