import React from "react";
import Image from "next/image";
import Divider from "../common/Divider";
import "./PrizesChallenges.css";
import awardBoxBg from "../../../public/Text Box.svg";

const PrizesChallenges = () => {
	return (
		<section id="prizes" className="flex flex-col items-center w-full mt-20">
			<div className="w-full max-w-6xl flex flex-col items-center">
				<h1 className="section-header-text">Prizes & Challenges</h1>
				<Divider />
				<div className="w-full grid md:grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
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
						title="Peraton Challenge"
						description="Create the best web hack using React. Judging will consider overall user experience and UI design."
						prizes={[
							{
								place: "Prize",
								amount:
									"Peraton Backpack with Swag and $100 Amazon Gift Card for each team member",
							},
						]}
					/>
					<AwardBox
						title="Smeal Challenge"
						description="Build a platform that helps students identify steps to achieve their career goals based on educational backgrounds."
						prizes={[
							{
								place: "Prize",
								amount: "$300 in gift cards split among team members",
							},
						]}
					/>
					<AwardBox
						title="Snap Challenge"
						description="Create a Lens on Spectacles that pushes the boundaries of wearable AR. Showcase innovative ways Spectacles can enhance real-world experiences."
						prizes={[
							{ place: "1st Place", amount: "Nintendo Switch" },
							{ place: "2nd Place", amount: "Beats Solo Buds" },
							{ place: "3rd Place", amount: "Alexa Power Bank" },
						]}
					/>
					<AwardBox
						title="ICDS Challenge"
						description="Develop a RAG chatbot to answer questions based on the ICDS user guide. Judged on quiz performance and design principles."
						prizes={[
							{
								place: "Prize",
								amount:
									"Endorsement package including press release, social media promotion, LinkedIn endorsement, and presentation invite",
							},
						]}
					/>
					<AwardBox
						title="Nittany AI Challenge"
						description="Use AI/ML/GenAI to address problems in health, humanitarianism, education, or the environment."
						prizes={[
							{
								place: "1st Place",
								amount:
									"$99 Amazon gift card for each team member (up to 5 members)",
							},
							{
								place: "2nd Place",
								amount:
									"$50 Amazon gift card for each team member (up to 5 members)",
							},
							{
								place: "3rd Place",
								amount:
									"$25 Amazon gift card for each team member (up to 5 members)",
							},
						]}
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
		<div className="relative p-3 rounded-lg text-center overflow-hidden">
			{/* Next.js background image */}
			<Image
				src={awardBoxBg}
				alt="Award Box Background"
				fill
				className="z-[-1] object-cover"
				priority
			/>

			{/* Award Box Content */}
			<div className="relative z-10 mx-10 py-[60px] px-10">
				<h2 className="text-4xl md:text-5xl font-bold text-center mb-3 text-grey">
					{title}
				</h2>
				<p className="text-lg md:text-xl text-grey mb-3">{description}</p>
				{prizes.length > 0 && (
					<table className="table-auto mt-2 text-grey mx-auto">
						<tbody>
							{prizes.map((prize, index) => (
								<tr key={index}>
									<td className="text-lg md:text-xl px-4">{prize.place}:</td>
									<td className="text-lg md:text-xl text-left">
										{prize.amount}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
				{extra && (
					<div className="text-lg md:text-xl text-grey mt-3">{extra}</div>
				)}
			</div>
		</div>
	);
};


export default PrizesChallenges;
