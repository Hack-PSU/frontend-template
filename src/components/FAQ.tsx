"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface FAQItem {
	question: string;
	answer: string;
	link?: {
		target: string;
		text: string;
	};
}

const faqs: FAQItem[] = [
	{
		question: "Where can I go to get help?",
		answer:
			"We have an info booth in the ECoRE Building lobby! You can also see any member of the HackPSU organizing team at the event.",
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
			"If your professor is offering extra credit for attending HackPSU, please sign up for extra credit for your class in your profile page here. If your professor requires workshop attendance, please see a HackPSU organizer outside the workshop so that we can record your attendance and confirm that you participated at the event.",
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
			"Devpost is a project submission platform used by many hackathons and technology-focused events. You and/or your team will be asked to submit your project through our Fall 2025 Devpost. For those who have never used Devpost before or would like a refresher, head over to the info booth!",
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
	{
		question: "Is there a code of conduct?",
		answer: "All participants are expected to follow the MLH Code of Conduct",
		link: {
			target: "http://mlh.io/code-of-conduct",
			text: "MLH Code of Conduct",
		},
	},
];

interface AccordionItemProps {
	faq: FAQItem;
	isOpen: boolean;
	onToggle: () => void;
	index: number;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
	faq,
	isOpen,
	onToggle,
	index,
}) => {
	return (
		<motion.div
			className="border-b border-white/20 last:border-b-0"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.1 }}
		>
			<motion.button
				onClick={onToggle}
				className="w-full py-6 px-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors duration-200 group"
				whileHover={{ x: 4 }}
				transition={{ duration: 0.2 }}
			>
				<h3
					className="text-white font-medium pr-4 group-hover:text-[#86CFFC] transition-colors duration-200"
					style={{
						fontSize: "clamp(16px, 2.5vw, 20px)",
						fontFamily: "Monomaniac One, monospace",
					}}
				>
					{faq.question}
				</h3>
				<motion.div
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.2 }}
					className="text-[#86CFFC] text-2xl font-bold flex-shrink-0 ml-4"
				>
					+
				</motion.div>
			</motion.button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6">
							<motion.p
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.2, delay: 0.1 }}
								className="text-white/90 leading-relaxed mb-4"
								style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
							>
								{faq.answer}
							</motion.p>
							{faq.link && (
								<motion.a
									href={faq.link.target}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block text-[#86CFFC] hover:text-white underline decoration-[#86CFFC] hover:decoration-white transition-colors duration-200"
									style={{ fontSize: "clamp(14px, 2vw, 16px)" }}
									initial={{ y: -10, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.2, delay: 0.2 }}
									whileHover={{ x: 4 }}
								>
									{faq.link.text} →
								</motion.a>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

const FAQ: React.FC = () => {
	const [openItems, setOpenItems] = useState<Set<number>>(new Set());
	const [fishClicked, setFishClicked] = useState(false);

	const toggleItem = (index: number) => {
		setOpenItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(index)) {
				newSet.delete(index);
			} else {
				newSet.add(index);
			}
			return newSet;
		});
	};

	const handleFishClick = () => {
		setFishClicked(true);
	};

	return (
		<section
			className="relative w-full"
			style={{ backgroundColor: "#85CEFF" }}
			id="faq"
		>
			{/* Centered Header */}
			<div className="w-full px-[4vw] pt-[8vw] pb-[4vw] text-center relative">
				<motion.div
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1
						className="text-5xl md:text-6xl font-bold text-[#A20021] mb-6"
						style={{ fontFamily: "Rye, serif" }}
					>
						FAQ
					</h1>
					<div className="w-20 h-1 bg-[#A20021] rounded-full mx-auto"></div>
				</motion.div>

				{/* Fish Animation */}
				<motion.div
					className="absolute cursor-pointer"
					style={{
						right: "-10%",
						top: "-40%",
						width: "clamp(40px, 300vw, 600px)",
						height: "clamp(30px, 300vw, 600px)",
						zIndex: 10,
					}}
					initial={{ x: 0, y: 0, opacity: 1 }}
					animate={
						fishClicked
							? {
									x: "-100vw",
									y: [0, -20, 0, -15, 0, -10, 0],
									opacity: [1, 1, 1, 1, 0],
							  }
							: {
									y: [0, -8, 0, -5, 0],
							  }
					}
					transition={
						fishClicked
							? {
									duration: 3,
									ease: "easeInOut",
									times: [0, 0.2, 0.4, 0.6, 1],
							  }
							: {
									duration: 4,
									repeat: Infinity,
									ease: "easeInOut",
							  }
					}
					onClick={handleFishClick}
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.95 }}
				>
					<Image
						src="/f25/fish.png"
						alt="Swimming Fish"
						fill
						className="object-contain"
					/>
				</motion.div>
			</div>

			<div className="w-full flex flex-col lg:flex-row">
				{/* Left side - Image on desktop, hidden on mobile */}
				<div className="hidden lg:flex lg:w-1/2 items-center justify-center px-[4vw] pb-[8vw]">
					<motion.div
						className="relative"
						style={{
							width: "clamp(200px, 50vw, 800px)",
							height: "clamp(200px, 50vw, 800px)",
						}}
						initial={{ opacity: 1, scale: 1, rotate: -90}}
						animate={{ scale:[0.9, 1, 0.9], opacity:[0.8, 1, 0.8]}}
						transition={{ duration: 6,
							repeat: Infinity,
							ease: "easeInOut",
							delay: 0.2,
						}}
					>
						<Image
							src="/f25/4.png"
							alt="FAQ Illustration"
							fill
							className="object-contain"
						/>
					</motion.div>
				</div>

				{/* FAQ Content - Right half on desktop, full width on mobile */}
				<div className="w-full lg:w-1/2 px-[4vw] pb-[8vw] flex flex-col justify-center">

					{/* Accordion Container */}
					<motion.div
						className="bg-[#215172] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/10"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								faq={faq}
								isOpen={openItems.has(index)}
								onToggle={() => toggleItem(index)}
								index={index}
							/>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default FAQ;