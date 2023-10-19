import Divider from "../common/Divider";
import "./PrizesChallenges.css"; // Import CSS file for styling

const PrizesChallenges = () => {
  return (
    <section className="flex flex-col items-center w-full">
      <div className="w-5/12 flex flex-col items-center">
        <h1 className="font-bold text-6xl text-center">Prizes & Challenges</h1>
        <Divider />
        {/* Your content inside the div */}
        <div className="w-10/12">
          <ChallengesCarousel />
        </div>
  
        <div className="w-11/12 text-center mt-4"> {/* Adjusted width from w-10/12 to w-11/12 */}
          <p className="text-lg text-left">
            <span style={{ color: "red", fontWeight: "bold", fontSize: "larger" }}>
              SUBMISSIONS:
            </span>{" "}
            To submit, please visit our Devpost page at{" "}
            <a href="https://hackpsu-fall-2023.devpost.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
              https://hackpsu-fall-2023.devpost.com
            </a>. Make sure to submit your project (even if not completed) on Devpost by 12 PM Sunday! You can edit it until 1:45 PM Sunday. This is a hard deadline - submissions received after 12 PM will not be considered for prizes.
          </p>
        </div>
      </div>
    </section>
  );
};

const ChallengesCarousel = () => {
  const divStyle = {
    backgroundImage: 'url("/SCREEN.png")',
    backgroundSize: 'cover', // Adjust to your preferred size
    backgroundPosition: 'center', // Adjust to your preferred position
    // You can add more background properties here
  };

  return (
    <div className="carousel-container">
      <div className="carousel" style={{ animation: `rotateChallenges 36s infinite` }}>
        {/* Challenge Slide 1 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left" style={divStyle}>
            <h2 className="text-4xl font-bold text-center mb-2">
              HackPSU Grand Prize
            </h2>
            <div className="text-lg common-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p>
              The standard HackPSU experience - work together alone or in a team to build something awesome! All monetary prizes will be split among the winning team members equally.
              </p>
            </div>
            <p className="subheading">Prizes:</p>
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="text-lg common-text">1st Place:</td>
                  <td className="text-lg common-text">$200 Amazon Gift Card</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">2nd Place:</td>
                  <td className="text-lg common-text">$150 Amazon Gift Card</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">3rd Place:</td>
                  <td className="text-lg common-text">$100 Amazon Gift Card</td>
                </tr>
              </tbody>
            </table>
            <div className="text-lg common-text" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p>
                All teams award prizes will also be given MLH winner pins.
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Slide 2 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left" style={divStyle}>
            <h2 className="text-4xl font-bold text-center mb-2">
            HackPSU Social Impact
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the best use of technology to address social issues and make a positive worldly impact. A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

        {/* Challenge Slide 3 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left" style={divStyle}>
            <h2 className="text-4xl font-bold text-center mb-2">
              HackPSU Entrepreneurship
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the most sustainable business model, including considerations of monetization, target audience, and future growth. A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

        {/* Continue adding more challenge slides as needed... */}
        {/* Challenge Slide 4 */}
        <div className="slide" style={{ height: '400px' }}>
          <div className="black-box text-left" style={divStyle}>
            <h2 className="text-4xl font-bold text-center mb-2">
              HackPSU Generative AI
            </h2>
            <p className="text-lg common-text">
              Awarded to the hack with the best use of generative artificial intelligence. A total of $150 will be paid out via Amazon gift cards split evenly among the winning team members.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrizesChallenges;
