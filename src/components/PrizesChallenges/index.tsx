import React from "react";
import Divider from "../common/Divider";
import "./PrizesChallenges.css";

const PrizesChallenges = () => {
	return (
		<section id="prizes" className="flex flex-col items-center w-full mt-20">
			<div className="w-full max-w-6xl flex flex-col items-center">
				<h1 className="section-header-text">Prizes & Challenges</h1>
				<Divider />

				<div className="w-full p-8 mt-4">
					<div className="p-6 bg-[rgba(0,0,0,0.75)] border-[green] border-4 rounded-lg text-center">
						<p className="text-xl text-white ">
							New prizes and challenges will be released soon!
						</p>
					</div>
				</div>

				{/* Commented out the following code to hide the prizes and challenges */}
				{/*
        <div className="w-full grid md:grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
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
			description="Most Creative Implementation of Generative AI"
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
            */}
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
								<td className="text-base md:text-lg text-left">
									{prize.amount}
								</td>
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
