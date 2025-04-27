// components/FAQs.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import clsx from "clsx";

/**
 * Each FAQ has its own positioning class for absolute placement
 */
interface FAQ {
	id: string;
	question: string;
	answer: string;
	posClass: string;
}

const faqs: FAQ[] = [
	{
		id: "faq1",
		question: "Where can I go to get help?",
		answer:
			"We have an info booth in the Business Building lobby! You can also see any member of the HackPSU organizing team at the event.",
		posClass: "absolute top-[0%] left-[0%]",
	},
	{
		id: "faq2",
		question: "Do I need to stay at the event the whole time?",
		answer:
			"You are free to come and go as you please to get some rest, fresh air, or take a break! If you feel like throwing in the towel for the weekend, that's fine too! All that we ask is that you only work on your project while on the premises.",
		posClass: "absolute top-[15%] left-[15%]",
	},
	{
		id: "faq3",
		question: "Can I sleep at the hackathon?",
		answer:
			"Yes! We have air mattresses for checkout at the registration table starting at 10pm. All we ask is that you treat them nicely and please return them when you're done!",
		posClass: "absolute top-[30%] left-[0%]",
	},
	{
		id: "faq4",
		question: "Can I be reimbursed for travel?",
		answer:
			"Travel reimbursements will be handled at the registration table Saturday after 3pm and Sunday from 11am-1pm. Please submit your reimbursements via the profile page on the website. For more information, please refer to our Travel Reimbursement Policy.",
		posClass: "absolute top-[45%] left-[15%]",
	},
	{
		id: "faq5",
		question: "How does extra credit work?",
		answer:
			"If your professor is offering extra credit for attending HackPSU, please sign up for extra credit for your class in your profile page here. If your professor requires workshop attendance, please see a HackPSU organizer outside the workshop so that we can record your attendance and confirm that you participated at the event. Click here to sign up for extra credit!",
		posClass: "absolute top-[0%] right-[0%]",
	},
	{
		id: "faq6",
		question: "How should I submit a project?",
		answer:
			"All projects will be submitted through the HackPSU Devpost. We will then have a judging expo in the building main area. Do NOT submit your project via email, Discord, DM, messenger pigeon, drone, etc. Both hardware and software projects are allowed. Only one Devpost submission per team is needed.",
		posClass: "absolute top-[15%] right-[15%]",
	},
	{
		id: "faq7",
		question: "What is Devpost?",
		answer:
			"Devpost is a project submission platform used by many hackathons and technology-focused events. You and/or your team will be asked to submit your project through our Spring 2025 Devpost. For those who have never used Devpost before or would like a refresher, head over to the info booth!",
		posClass: "absolute top-[30%] right-[0%]",
	},
	{
		id: "faq8",
		question: "When are project submissions due?",
		answer:
			"You must have a Devpost submission created by Sunday 12pm (even if not completed) on our Devpost page. However, you can continue editing the submission until hacking ends on Sunday at 1:45pm.",
		posClass: "absolute top-[45%] right-[15%]",
	},
];

/**
 * FAQs section with blur & overlay behavior
 */
export default function FAQs() {
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const toggle = (id: string) => {
		setSelectedId((prev) => (prev === id ? null : id));
	};

	/**
	 * Customizable Tailwind classes for the answer box size
	 */
	const answerBoxClass = "max-w-md"; // adjust this string to control width/height

	return (
		<section className="relative w-full h-[800px] bg-[#86CFFC] overflow-hidden">
			{/* Whale background wrapped in Framer Motion for control */}
			<motion.div
				animate={{
					filter: selectedId ? "blur(0px)" : "blur(0px)",
					scale: selectedId ? 1 : 0.8,
					rotate: [-29],
				}}
				transition={{ duration: 0.4 }}
				// center the whale image
				className="absolute  inset-0 flex items-center justify-center"
			>
				<Image
					src="/whale.png" // your whale image path
					alt="Whale background"
					height={600}
					width={600}
					className="h-[700px] w-auto"
				/>
			</motion.div>

			{/* Overlay answer text when selected */}
			{selectedId && (
				<motion.div
					className={clsx(
						answerBoxClass,
						"backdrop-blur-[8px] bg-[#004F8A] rounded-2xl absolute w-[200px] left-[42%] top-[10%]"
					)}
					key={selectedId}
					initial={{ scale: 0.8, opacity: 0, y: 50 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<p className="text-center text-black text-base ">
						{faqs.find((f) => f.id === selectedId)?.answer}
					</p>
				</motion.div>
			)}

			{/* FAQ hex question cards */}
			{faqs.map((faq) => (
				<div
					key={faq.id}
					className={clsx(
						faq.posClass,
						"w-60 h-60 cursor-pointer",
						selectedId && selectedId !== faq.id ? "opacity-50" : "opacity-100"
					)}
					onClick={() => toggle(faq.id)}
				>
					{/* Hex outline */}
					<svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full">
						<path
							d="M38,2 L82,2 A12,12 0 0,1 94,10 L112,44 A12,12 0 0,1 112,56 L94,90 A12,12 0 0,1 82,98 L38,98 A12,12 0 0,1 26,90 L8,56 A12,12 0 0,1 8,44 L26,10 A12,12 0 0,1 38,2"
							fill="transparent"
							stroke="#3689CB"
							strokeWidth={4}
						/>
					</svg>

					{/* Question text */}
					<div className="absolute inset-0 flex items-center justify-center p-4 text-center">
						<p className="font-semibold text-base text-white">{faq.question}</p>
					</div>
				</div>
			))}
		</section>
	);
}
