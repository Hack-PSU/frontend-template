import React from "react";
import Card from "../Card";
import { useMediaQuery } from "react-responsive";
import CustomCollapsible from "../CustomCollapsible";
import Divider from "../Divider";
import "./index.css";
// FAQ text
const faqs = [
	{
		question: "Where can I go to get help?",
		answer:
			"We have an info booth in the Business Building lobby! You can also see any member of the HackPSU organizing team at the event.",
	},
	{
		question: "Do I need to stay at the event the whole time?",
		answer:
			"You are free to come and go as you please to get some rest, fresh air, or take a break! If you feel like throwing in the towel for the weekend, that's fine too! All that we ask is that you only work on your project while on the premises.",
	},
	{
		question: "Can I sleep at the hackathon?",
		answer:
			"Yes! We have air mattresses for checkout at the registration table starting at 10pm. All we ask is that you treat them nicely and please return them when you're done!",
	},
	{
		question: "Can I be reimbursed for travel?",
		answer:
			"Travel reimbursements will be handled at the registration table Saturday after 3pm and Sunday from 11am-1pm. Please submit your reimbursements via the profile page on the website. For more information, please refer to our Travel Reimbursement Policy.",
		link: {
			target: "/travel",
			text: "Travel Reimbursement Policy",
		},
	},
	{
		question: "How does extra credit work?",
		answer:
			"If your professor is offering extra credit for attending HackPSU, please sign up for extra credit for your class in your profile page here. If your professor requires workshop attendance, please see a HackPSU organizer outside the workshop so that we can record your attendance and confirm that you participated at the event. Click here to sign up for extra credit!",
	},
	{
		question: "How should I submit a project?",
		answer:
			"All projects will be submitted through the HackPSU Devpost. We will then have a judging expo in the building main area. Do NOT submit your project via email, Discord, DM, messenger pigeon, drone, etc. Both hardware and software projects are allowed. Only one Devpost submission per team is needed.",
		link: {
			target: "http://devpost.hackpsu.org/",
			text: "devpost.hackpsu.org",
		},
	},
	{
		question: "What is Devpost?",
		answer:
			"Devpost is a project submission platform used by many hackathons and technology-focused events. You and/or your team will be asked to submit your project through our Spring 2025 Devpost. For those who have never used Devpost before or would like a refresher, head over to the info booth!",
		link: {
			target: "http://devpost.hackpsu.org/",
			text: "devpost.hackpsu.org",
		},
	},
	{
		question: "When are project submissions due?",
		answer:
			"You must have a Devpost submission created by Sunday 12pm (even if not completed) on our Devpost page. However, you can continue editing the submission until hacking ends on Sunday at 1:45pm.",
		link: {
			target: "http://devpost.hackpsu.org/",
			text: "devpost.hackpsu.org",
		},
	},
];

const FAQ = () => {
	const isMobile = useMediaQuery({ query: "(max-width: 1300px)" });
	if (isMobile) {
		return (
			<section className="faq-section mt-4 mb-20 md:mb-0">
				<div className="faq-header">
					<h1 className="font-rye text-white text-7xl mb-5">FAQ</h1>
					<Divider />
					<dl className="faq-list">
						{faqs.map((faq, index) => (
							<React.Fragment key={index}>
								<div className="faq-button-container font-tiltneon text-black">
									<CustomCollapsible
										question={faq.question}
										answer={faq.answer}
										link={faq.link}
									/>
								</div>
							</React.Fragment>
						))}
					</dl>
				</div>
			</section>
		);
	}

	return (
		<div className="faq-container flex flex-col items-center min-h-screen px-4 md:px-8 lg:px-16">
			<h1 className="text-center text-7xl text-[#A20021] font-rye  mb-8">FAQ</h1>
			<Divider />
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full mt-8">
				{faqs.map((faq, index) => (
					<div key={index} className="col-span-1 w-full">
						<Card question={faq.question} answer={faq.answer} link={faq.link} />
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQ;
