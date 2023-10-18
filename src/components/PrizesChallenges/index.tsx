import Divider from "../common/Divider";
import "./PrizesChallenges.css";

const PrizesChallenges = () => {
  return (
    <section id="prizes" className="flex flex-col items-center w-full">
      <div className="w-full md:w-5/12 flex flex-col items-center">
        <h1 className="cornerstone-font font-bold text-6xl text-center">Prizes & Challenges</h1>
        <Divider />
        <div className="w-full md:w-10/12">
          <ChallengesCarousel />
        </div>
  
        <div className="w-11/12 p-3 bg-black rounded-lg text-center mt-4"> {/* Adjusted width from w-10/12 to w-11/12 */}
          <p className="text-lg text-left text-white">
            <span style={{ color: "red", fontWeight: "bold", fontSize: "larger" }}>
              SUBMISSIONS:
            </span>
            {" "}To submit, please visit our Devpost page at{" "}
            <a href="http://devpost.hackpsu.org" target="_blank" rel="noopener noreferrer" style={{
              textDecoration: "underline"
            }}>
            http://devpost.hackpsu.org
            </a>.
            Make sure to submit your project (even if not completed) on Devpost by 12 PM Sunday! You can edit it until 1:45 PM Sunday. This is a hard deadline - the submission portal closes at 12 PM and any projects not submitted will not be considered for prizes.
          </p>
        </div>
      </div>
    </section>
  );
};

const ChallengesCarousel = () => {
  return (
    <div className="carousel-container">
      <div className="carousel">

        {/* Challenge Slide 1 */}
        <div className="slide">
          <div className="black-box">
            <h2 className="text-4xl font-bold text-center mb-2">HackPSU Grand Prize</h2>
            <div className="text-lg">
              The standard HackPSU experience: work together alone or in a team to build something awesome!
              All monetary prizes will be split among the winning team members equally.
            </div>
            <table className="table-auto mt-2">
              <tbody>
                <tr>
                  <td className="text-lg px-4">1st Place:</td>
                  <td className="text-lg">$300</td>
                </tr>
                <tr>
                  <td className="text-lg px-4">2nd Place:</td>
                  <td className="text-lg">$150</td>
                </tr>
                <tr>
                  <td className="text-lg px-4">3rd Place:</td>
                  <td className="text-lg">$100</td>
                </tr>
              </tbody>
            </table>
            <div className="text-lg common-text mt-2">Winners will also receive MLH winner pins.</div>
          </div>
        </div>

        {/* Challenge Slide 2 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">
              Social Impact Award
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the best use of technology to address social issues
              and make a positive worldly impact.
              A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

        {/* Challenge Slide 3 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">
              Entrepreneurship Award
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the most sustainable business model,
              including considerations of monetization, target audience, and future growth.
              A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

        {/* Continue adding more challenge slides as needed... */}
        {/* Challenge Slide 4 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">
              Generative AI Award
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the best use of generative artificial intelligence.
              A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrizesChallenges;
