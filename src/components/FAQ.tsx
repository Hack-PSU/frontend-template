"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";

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
			"All projects will be submitted through the HackPSU Devpost AND through the HackPSU main website. To submit on the main website, go to the profile page and select Submit Project. We will then have a judging expo in the building main area. Do NOT submit your project via email, Discord, DM, messenger pigeon, drone, etc. Both hardware and software projects are allowed. Only one Devpost submission per team is needed.",
		link: {
			target: "http://devpost.hackpsu.org/",
			text: "devpost.hackpsu.org",
		},
	},
	{
		question: "What is Devpost?",
		answer:
			"Devpost is a project submission platform used by many hackathons and technology-focused events. You and/or your team will be asked to submit your project through our {{hackathonName}} Devpost. For those who have never used Devpost before or would like a refresher, head over to the info booth!",
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
			className="rounded-2xl border border-white/20 bg-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl overflow-hidden"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.1 }}
		>
			<motion.button
				onClick={onToggle}
				className="w-full py-4 px-5 text-left flex justify-between items-center hover:bg-white/10 transition-colors duration-200 group"
				whileHover={{ x: 4 }}
				transition={{ duration: 0.2 }}
			>
				<h3
					className="text-[#EEE5CD] font-medium pr-4 group-hover:text-[#86CFFC] transition-colors duration-200"
					style={{
						fontSize: "clamp(15px, 2.2vw, 18px)",
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
						<div className="px-5 pb-4">
							<motion.p
								initial={{ y: -10, opacity: 0 }}
								animate={{ y: 0, opacity: 1 }}
								transition={{ duration: 0.2, delay: 0.1 }}
								className="text-[#EEE5CD] leading-relaxed mb-3"
								style={{
									fontFamily: "'DM Sans', sans-serif",
									fontSize: "clamp(13px, 1.8vw, 15px)",
								}}
							>
								{faq.answer}
							</motion.p>
							{faq.link && (
								<motion.a
									href={faq.link.target}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block text-[#86CFFC] hover:text-white underline decoration-[#86CFFC] hover:decoration-white transition-colors duration-200"
									style={{
										fontSize: "clamp(13px, 1.8vw, 15px)",
										fontFamily: "Orbitron, monospace",
									}}
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

function playRobotSound() {
	const audio = new Audio("/fa26/ufo_beam_sound.mp3");

	// Configurable parameters
	audio.volume = 0.5; // 0.0 = silent, 1.0 = full volume
	audio.loop = false; // Make sure the audio does not loop

	// Start from the beginning every time the button is clicked
	audio.currentTime = 0;

	audio.play().catch(() => {
		// Ignore if audio is blocked by the browser
	});
}

const FAQ: React.FC = () => {
	const [openItems, setOpenItems] = useState<Set<number>>(new Set());
	const { data: activeHackathon } = useActiveHackathonForStatic();
	const [fishClicked, setFishClicked] = useState(false);
	const [robotDance, setRobotDance] = useState(false);
	const hackathonName = activeHackathon?.name || "the current HackPSU";
	const renderedFaqs = faqs.map((faq) => ({
		...faq,
		answer: faq.answer.replace("{{hackathonName}}", hackathonName),
	}));

	const handleRobotClick = () => {
		playRobotSound();
		setRobotDance(true);
		setTimeout(() => setRobotDance(false), 800);
	};

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
		<section className="relative w-full" id="faq" style={{}}>
			{/* Centered Header */}
			<div className="w-full px-[4vw] pt-[5vw] pb-[2vw] text-center relative">
				<motion.div
					initial={{ opacity: 0, y: -30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1
						className="text-4xl md:text-8xl font-bold text-[#EEE5CD] mb-3"
						style={{
							fontFamily: "Barlow Condensed",
							borderRadius: "12px",
							padding: "0.5rem 1rem",
						}}
					>
						<span style={{ color: "#EEE5CD" }}>Space Station</span>{" "}
						<span style={{ color: "#64A5C3" }}>FAQ</span>{" "}
					</h1>
					<div
						className=""
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "clamp(15px, 1.8vw, 20px)",
							lineHeight: 1.5,
							color: "#EEE5CD",
						}}
					>
						Mission control has answers to your most pressing questions.
					</div>
					<div className="w-20 h-1 rounded-full mx-auto"></div>
				</motion.div>
			</div>

			<div className="w-full flex flex-col lg:flex-row">
				{/* Left side - Image on desktop, hidden on mobile */}
				<div className="hidden lg:flex lg:w-1/2 items-center justify-center px-[4vw] pb-[8vw]">
					<motion.div
						className="relative cursor-pointer select-none"
						style={{
							width: "clamp(200px, 50vw, 800px)",
							height: "clamp(200px, 50vw, 800px)",
						}}
						initial={{ opacity: 1, scale: 1, rotate: 0 }}
						animate={
							robotDance
								? {
										scale: [1, 1.15, 0.95, 1],
										rotate: [0, -12, 12, -8, 8, 0],
										transition: {
											duration: 0.8,
											ease: "easeOut",
										},
									}
								: {
										scale: [0.9, 1, 0.9],
										opacity: [0.8, 1, 0.8],
										rotate: 0,
										transition: {
											duration: 6,
											repeat: Infinity,
											ease: "easeInOut",
											delay: 0.2,
										},
									}
						}
						onClick={handleRobotClick}
						title="Click me!"
					>
						<Image
							src="/fa26/logo+assets/ufo_beams.png"
							alt="FAQ Illustration"
							fill
							className="object-contain pointer-events-none"
							draggable={false}
						/>
					</motion.div>
				</div>

				{/* FAQ Content - Right half on desktop, full width on mobile */}
				<div className="w-full lg:w-1/2 px-[4vw] pb-[5vw] flex flex-col justify-center">
					{/* Accordion Container */}
					<motion.div
						className="flex flex-col gap-3"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						{renderedFaqs.map((faq, index) => (
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
