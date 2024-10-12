import React from "react";
import Divider from "../common/Divider";

// Main Component
const PrizesChallenges: React.FC = () => {
  return (
    <section id="prizes" className="flex flex-col items-center w-full mt-20">
      <div className="w-full max-w-6xl flex flex-col items-center">
        <h1 className="section-header-text">Prizes & Challenges</h1>
        <Divider />
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

          {/* Peraton Challenge */}
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

          {/* Smeal Challenge */}
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

          {/* Snap Challenge */}
          <AwardBox
            title="Snap Challenge"
            description="Create a Lens on Spectacles that pushes the boundaries of wearable AR. Showcase innovative ways Spectacles can enhance real-world experiences."
            prizes={[
              { place: "1st Place", amount: "Nintendo Switch" },
              { place: "2nd Place", amount: "Beats Solo Buds" },
              { place: "3rd Place", amount: "Alexa Power Bank" },
            ]}
          />

          {/* ICDS Challenge */}
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

          {/* Nittany AI Challenge */}
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

// Interfaces for props
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

// AwardBox Component
const AwardBox: React.FC<AwardBoxProps> = ({
  title,
  description,
  prizes = [],
  extra,
}) => {
  return (
    <div className="relative w-full h-[600px]">
      <img
        src="/HACKPSU2024_BOOTH-removebg.png"
        alt="Booth"
        className="w-full h-full object-cover"
      />

      {/* Top Box - Description */}
      <div className="absolute inset-x-0 top-[120px] flex flex-col items-center p-4">
        <div className="bg-black/70 p-4 rounded-[8px] max-w-[80%] mx-auto text-white">
          <p className="font-noto-serif text-base md:text-xl mb-4">
            {description}
          </p>

          {/* Prizes Table */}
          {prizes.length > 0 && (
            <table className="table-auto mt-4 mx-auto">
              <tbody>
                {prizes.map((prize, index) => (
                  <tr key={index}>
                    <td className="text-base md:text-xl px-4">
                      {prize.place}:
                    </td>
                    <td className="text-base md:text-xl">{prize.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Extra Info */}
          {extra && (
            <div className="text-base md:text-xl mt-4">{extra}</div>
          )}
        </div>
      </div>

      {/* Bottom Box - Title */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center p-4">
        <div className="bg-black/70 py-2 px-4 rounded-t-[8px] text-white max-w-[80%] mx-auto">
          <h2 className="font-rye text-2xl md:text-5xl font-bold text-center">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PrizesChallenges;
