import Divider from "../common/Divider";
import "./PrizesChallenges.css"; // Import CSS file for styling

const PrizesChallenges = () => {
  return (
    <section className="flex flex-col items-center w-full">
      <div className="w-5/12 flex flex-col items-center">
        <h1 className="font-bold text-6xl text-center">Prizes & Challenges</h1>
        <Divider />
      </div>
      <div className="w-10/12">
        <ChallengesCarousel />
      </div>
      <div className="w-10/12 text-center mt-4">
        <p className="text-lg text-left"> {/* Align text to the left */}
          SUBMISSIONS: To submit, please visit our Devpost page at{" "}
          <a href="https://devpost.hackpsu.org">devpost.hackpsu.org</a>. Make sure
          to submit your project (even if not completed) on Devpost by 12PM
          Sunday! You can edit it until 1:45PM Sunday. This is a hard deadline -
          submissions received after 12PM will not be considered for prizes.
        </p>
      </div>
    </section>
  );
};

const ChallengesCarousel = () => {
  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="slide">
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">Challenge 1</h2>
            <p className="subheading">Description:</p>
            <p className="text-lg common-text">Description of Challenge 1 goes here...</p>
            <p className="subheading">Sponsor:</p>
            <p className="text-lg common-text">Sponsor of Challenge 1 goes here...</p>
            <p className="subheading">Prizes:</p>
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="text-lg common-text">1st Place:</td>
                  <td className="text-lg common-text">Prize details for 1st Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">2nd Place:</td>
                  <td className="text-lg common-text">Prize details for 2nd Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">3rd Place:</td>
                  <td className="text-lg common-text">Prize details for 3rd Place</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="slide">
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">Challenge 2</h2>
            <p className="subheading">Description:</p>
            <p className="text-lg common-text">Description of Challenge 2 goes here...</p>
            <p className="subheading">Sponsor:</p>
            <p className="text-lg common-text">Sponsor of Challenge 2 goes here...</p>
            <p className="subheading">Prizes:</p>
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="text-lg common-text">1st Place:</td>
                  <td className="text-lg common-text">Prize details for 1st Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">2nd Place:</td>
                  <td className="text-lg common-text">Prize details for 2nd Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">3rd Place:</td>
                  <td className="text-lg common-text">Prize details for 3rd Place</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="slide">
          <div className="black-box text-left">
            <h2 className="text-4xl font-bold text-center mb-2">Challenge 3</h2>
            <p className="subheading">Description:</p>
            <p className="text-lg common-text">Description of Challenge 3 goes here...</p>
            <p className="subheading">Sponsor:</p>
            <p className="text-lg common-text">Sponsor of Challenge 3 goes here...</p>
            <p className="subheading">Prizes:</p>
            <table className="table-auto">
              <tbody>
                <tr>
                  <td className="text-lg common-text">1st Place:</td>
                  <td className="text-lg common-text">Prize details for 1st Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">2nd Place:</td>
                  <td className="text-lg common-text">Prize details for 2nd Place</td>
                </tr>
                <tr>
                  <td className="text-lg common-text">3rd Place:</td>
                  <td className="text-lg common-text">Prize details for 3rd Place</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};



export default PrizesChallenges;
