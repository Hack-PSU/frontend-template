"use client";
import { ArrowCircleLeft, ArrowCircleRight } from "@mui/icons-material";
import { useState } from "react";

import Divider from "../common/Divider";
import "./PrizesChallenges.css";

const PrizesChallenges = () => {
	return (
		<section id="prizes" className="flex flex-col items-center w-full mt-20">
			<div className="w-11/12 md:w-5/12 flex flex-col items-center">
				<h1 className="cornerstone-font font-bold text-6xl text-center">
					Prizes & Challenges
				</h1>
				<Divider />
			</div>
			<div className="w-full mt-4 md:mt-0">
				<ChallengesCarousel />
			</div>
		</section>
	);
};

// Checked input requires an "onChange" method, but we don't actually have anything for it to do.
const doNothing = () => {};

const ChallengesCarousel = () => {
	const [slideNum, setSlideNum] = useState(0);

	return (
		<section>
			<div className="carousel-container">
				<div className="carousel carousel--translate">
					{/* Hidden radio buttons act as a state machine hook for the CSS animations. */}
					<input
						className="carousel__activator"
						type="radio"
						name="carousel"
						checked={slideNum == 0}
						onChange={doNothing}
					/>
					<input
						className="carousel__activator"
						type="radio"
						name="carousel"
						checked={slideNum == 1}
						onChange={doNothing}
					/>
					<input
						className="carousel__activator"
						type="radio"
						name="carousel"
						checked={slideNum == 2}
						onChange={doNothing}
					/>
					<input
						className="carousel__activator"
						type="radio"
						name="carousel"
						checked={slideNum == 3}
						onChange={doNothing}
					/>

					<div className="carousel__track">
						{/* Challenge Slide 1 */}
						<li className="carousel__slide" key={0}>
							<div className="slide">
								<div className="black-box">
									<h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
										HackPSU Grand Prize
									</h2>
									<div className="text-base md:text-lg">
										The standard HackPSU experience: work together alone or in a
										team to build something awesome! All monetary prizes will be
										split among the winning team members equally.
									</div>
									<table className="table-auto mt-2">
										<tbody>
											<tr>
												<td className="text-base md:text-lg px-4">
													1st Place:
												</td>
												<td className="text-base md:text-lg">$300</td>
											</tr>
											<tr>
												<td className="text-base md:text-lg px-4">
													2nd Place:
												</td>
												<td className="text-base md:text-lg">$150</td>
											</tr>
											<tr>
												<td className="text-base md:text-lg px-4">
													3rd Place:
												</td>
												<td className="text-base md:text-lg">$100</td>
											</tr>
										</tbody>
									</table>
									<div className="text-base md:text-lg common-text mt-2">
										Winners will also receive MLH winner pins.
									</div>
								</div>
							</div>
						</li>

						{/* Challenge Slide 2 */}
						<li className="carousel__slide" key={1}>
							<div className="slide">
								<div className="black-box">
									<h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
										Social Impact Award
									</h2>
									<p className="text-base md:text-lg common-text">
										Awarded to the hack with the best use of technology to
										address social issues and make a positive worldly impact. A
										total of $150 will be paid out via Amazon gift cards split
										evenly among the winning team members.
									</p>
								</div>
							</div>
						</li>

						{/* Challenge Slide 3 */}
						<li className="carousel__slide" key={2}>
							<div className="slide">
								<div className="black-box">
									<h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
										Entrepreneurship Award
									</h2>
									<p className="text-base md:text-lg common-text">
										Awarded to the hack with the most sustainable business
										model, including considerations of monetization, target
										audience, and future growth. A total of $150 will be paid
										out via Amazon gift cards split evenly among the winning
										team members.
									</p>
								</div>
							</div>
						</li>

						{/* Challenge Slide 4 */}
						<li className="carousel__slide" key={3}>
							<div className="slide">
								<div className="black-box">
									<h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
										Generative AI Award
									</h2>
									<p className="text-base md:text-lg common-text">
										Awarded to the hack with the best use of generative
										artificial intelligence. A total of $150 will be paid out
										via Amazon gift cards split evenly among the winning team
										members.
									</p>
								</div>
							</div>
						</li>
					</div>
				</div>
			</div>
			<div className="flex flex-row w-1/2 mx-auto mt-0">
				<ArrowCircleLeft
					className="mx-auto carousel-arrow-icon"
					onClick={() => {
						setSlideNum(slideNum > 0 ? slideNum - 1 : 3);
					}}
				/>
				<ArrowCircleRight
					className="mx-auto carousel-arrow-icon"
					onClick={() => {
						setSlideNum((slideNum + 1) % 4);
					}}
				/>
			</div>
		</section>
	);
};

export default PrizesChallenges;
