import React from "react";
import Divider from "../Divider";
import "./rules.css";

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
	<section className="flex flex-col items-center w-full gap-8 my-4">
		<div className="w-11/12 md:w-5/12 flex flex-col items-center">
			<h1 className="custom-font">Rules</h1>
			<Divider />
		</div>
		<div className="w-10/12">
			<div className="rules-border rounded-lg shadow-lg bg-cover bg-center p-4 bg-[#00000040]">
				<ul className="list-inside list-disc text-white font-lato text-md md:text-lg ">
					{rules.map((rule, index) => (
						<li key={index} dangerouslySetInnerHTML={{ __html: rule }} />
					))}
				</ul>
			</div>
		</div>
	</section>
);

export default Rules;
