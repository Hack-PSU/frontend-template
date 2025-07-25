import React from "react";
import Divider from "../Divider";
import "./rules.css";
import Image from "next/image";

const rules = [
	"All participants must be at least 18 years old and a student of some university (or a recent PSU graduate within less than one year). All participants must bring a valid form of identification.",
	"Teams may be comprised of up to five members. A team may only submit one project, and no participant may be a member of multiple teams.",
	"Projects should be original works created on site. Coming with an idea in mind is perfectly fine, working on an existing project is not.",
	'All projects must be submitted through <a href="http://devpost.hackpsu.org">Devpost</a> by 12PM on Sunday (even if not completed!) and can be edited until 1:45PM Sunday.',
	"All project code must be attached to the project's Devpost submission.",
	"Students are permitted to come and go from the venue as they please.",
	"Anything you create is your work, HackPSU and its partners have no claim over intellectual property produced at the event.",
	'All participants must agree to the <a href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf">MLH Code of Conduct</a>.',
];

const Rules = () => (
	<section className="flex flex-col items-center w-full gap-8 mb-8">
		<div className="w-11/12 md:w-3/4 flex flex-col items-center">
			<h1 className="font-['rye'] text-[#A20021] text-[4rem]">Rules</h1>
			<Divider />
		</div>
		<div className="w-full md:w-full lg:w-2/3 mx-auto relative">
			<Image src="/Text Box.svg" alt="rules-asset" width={1000} height={1000} />
			{/* Center the Rules List */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-auto max-h-[80%] overflow-y-auto p-4 flex justify-center">
				<ul className="list-inside list-disc text-black font-tilt-neon text-md md:text-lg text-left space-y-1">
					{rules.map((rule, index) => (
						<li key={index} dangerouslySetInnerHTML={{ __html: rule }} />
					))}
				</ul>
			</div>
		</div>
	</section>
);

export default Rules;
