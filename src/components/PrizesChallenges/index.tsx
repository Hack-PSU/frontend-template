import React from "react";
import Divider from "../common/Divider";
import "./PrizesChallenges.css";

const PrizesChallenges = () => {
	return (
		<section id="prizes" className="flex flex-col items-center w-full mt-20">
			<div className="w-full max-w-6xl flex flex-col items-center">
				{" "}
				<h1 className="cornerstone-font font-bold text-6xl text-center">
					Prizes & Challenges
				</h1>
				<Divider />
				<div className="w-full grid md:grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
					{" "}
					<AwardBox
						title="HackPSU Grand Prize"
						description="The standard HackPSU experience: work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally."
						prizes={[
							{ place: "1st Place", amount: "$300" },
							{ place: "2nd Place", amount: "$150" },
							{ place: "3rd Place", amount: "$100" },
						]}
						extra="Winners will also receive MLH winner pins."
					/>
					<AwardBox
						title="Entrepreneurship Award"
						description="Awarded to the hack with the most sustainable business model, including considerations of monetization, target audience, and future growth. A total of $750 will be paid out via Amazon gift cards split evenly among the winning team members."
					/>
					<AwardBox
						title="Sustainability Award"
						description="Awarded to the team that demonstrates the most innovative use of technology to promote sustainability and environmental stewardship. A total of $150 will be distributed as Amazon gift cards, divided equally among the members of the winning team."
					/>
					<AwardBox
						title="Generative AI Award"
						description="Awarded to the hack with the best use of generative artificial intelligence. A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members."
					/>
				</div>
			</div>
		</section>
	);
};

interface Prize {
	place: string;
	amount: string;
}

interface AwardBoxProps {
	title: string;
	description: string;
	prizes?: Prize[]; // Now explicitly typed as an array of Prize objects
	extra?: string;
}

const AwardBox: React.FC<AwardBoxProps> = ({
	title,
	description,
	prizes = [],
	extra,
}) => {
	return (
		<div className="p-3 bg-[rgba(0,0,0,0.75)] border-[green] border-4 rounded-lg text-center">
			<h2 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">
				{title}
			</h2>
			<p className="text-base md:text-lg text-white mb-2">{description}</p>
			{prizes.length > 0 && (
				<table className="table-auto mt-2 text-white mx-auto">
					<tbody>
						{prizes.map((prize, index) => (
							<tr key={index}>
								<td className="text-base md:text-lg px-4">{prize.place}:</td>
								<td className="text-base md:text-lg">{prize.amount}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
			{extra && (
				<div className="text-base md:text-lg text-white mt-2">{extra}</div>
			)}
		</div>
	);
};

export default PrizesChallenges;
