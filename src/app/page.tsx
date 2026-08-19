"use client";
import { useEffect, useState, useRef } from "react";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import FAQRules from "@/components/FAQRules";
import Rules from "@/components/common/Rules/index";
import FAQ from "@/components/FAQ";
import PrizesChallenges from "@/components/PrizesChallenges";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import InfoSections from "@/components/InfoSections";
import PhotoGallery from "@/components/PhotoGallery";
import MemoryGame from "@/components/MemoryGame";
import FloatingAsset from "@/components/common/FloatingAsset";

const KONAMI_SEQUENCE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
];

export default function Home() {
	const [isMobile, setIsMobile] = useState(false);
	const [showMemoryGame, setShowMemoryGame] = useState(false);
	const konamiIndexRef = useRef(0);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// ↑↑↓↓←→←→BA to open the memory game
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			const target = e.target as HTMLElement;
			if (
				target?.closest?.("input, textarea") ||
				target?.getAttribute?.("contenteditable") === "true"
			) {
				return;
			}
			const expected = KONAMI_SEQUENCE[konamiIndexRef.current];
			const key = e.key;
			if (key === expected) {
				konamiIndexRef.current += 1;
				if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
					setShowMemoryGame(true);
					konamiIndexRef.current = 0;
				}
			} else {
				konamiIndexRef.current = 0;
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<MemoryGame
				isOpen={showMemoryGame}
				onClose={() => setShowMemoryGame(false)}
			/>
			<main className="flex flex-col items-center w-full">
				<section className="hero-bg relative w-full pt-24 md:pt-28 lg:pt-32">
					<FloatingAsset
						src="/fa26/logo+assets/satellite.png"
						alt="Hop aboard!"
						width={1024}
						height={1024}
						isLink={true}
						href="https://en.wikipedia.org/wiki/International_Space_Station"
						className="left-[5%] top-[36%] w-24 sm:w-32 lg:right-[3%] lg:w-52"
						duration={6}
					/>
					<Hero />
				</section>
				<section className="info-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/robot.png"
						alt="HackGPT"
						width={225}
						height={353}
						isLink={true}
						href="https://en.wikipedia.org/wiki/Artificial_intelligence"
						className="right-[2%] top-[8%] w-16 sm:w-24 lg:right-[4%] lg:w-32"
						delay={0.5}
					/>
					<InfoSections />
				</section>
				<section className="prizes-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/hexagon.png"
						alt="Get the inside scoop!"
						width={287}
						height={277}
						isLink={true}
						href="https://www.psucollegian.com/news/campus/a-great-opportunity-ahead-of-annual-hack-a-thon-students-highlight-its-impact-benefits/article_93035a7d-71e2-4d62-b277-e9a808a9d6c7.html"
						className="right-[1%] top-[10%] w-16 sm:w-24 lg:right-[4%] lg:w-32"
						delay={1}
						duration={5.5}
					/>
					<PrizesChallenges />
				</section>
				<section className="schedule-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/pose_rocket_wave.PNG"
						alt="What's astrophage?"
						width={625}
						height={665}
						isLink={true}
						href="https://en.wikipedia.org/wiki/Project_Hail_Mary_(film)"
						className="left-[4%] top-[38%] w-24 sm:w-36 lg:left-[2%] lg:w-56"
						delay={0.75}
						duration={6.5}
					/>
					<Schedule />
				</section>
				<section className="faq-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/hexagonal_storm.png"
						alt="Saturn.exe"
						width={512}
						height={512}
						isLink={true}
						href="https://en.wikipedia.org/wiki/Saturn"
						className="right-[1%] top-[12%] w-20 sm:w-28 lg:right-[5%] lg:w-40"
						delay={1.25}
						duration={5}
					/>
					<FAQ />
				</section>
				<section className="gallery-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/astronaut_moon.PNG"
						alt="Houston, we have a hackathon"
						width={400}
						height={200}
						isLink={true}
						href="https://en.wikipedia.org/wiki/Neil_Armstrong"
						className="left-[1%] top-[5%] w-24 sm:w-36 lg:left-[4%] lg:w-52"
						delay={0.25}
						duration={5.75}
					/>
					<PhotoGallery
						images={[
							"/event/event_13.webp",
							"/event/event_14.webp",
							"/event/event_15.webp",
							"/event/event_16.webp",
							"/event/event_17.webp",
							"/event/event_18.webp",
							"/event/event_19.webp",
							"/event/event_20.webp",
							"/event/event_21.webp",
							"/event/event_22.webp",
							"/event/event_23.webp",
							"/event/event_24.webp",
							"/event/event_1.jpg",
							"/event/event_2.jpg",
							"/event/event_3.jpg",
							"/event/event_4.jpg",
							"/event/event_5.jpg",
							"/event/event_6.jpg",
							"/event/event_7.jpg",
							"/event/event_8.jpg",
							"/event/event_9.jpg",
							"/event/event_10.jpg",
							"/event/event_11.jpg",
							"/event/event_12.jpg",
						]}
					/>
				</section>
				<section className="sponsors-bg relative w-full">
					<FloatingAsset
						src="/fa26/logo+assets/ufo.png"
						alt="Are we alone?"
						width={533}
						height={343}
						isLink={true}
						href="https://en.wikipedia.org/wiki/Area_51"
						className="right-[1%] top-[8%] w-24 sm:w-36 lg:right-[4%] lg:w-52"
						delay={1.5}
						duration={6}
					/>
					<Sponsors />
				</section>
				<section className="footer-bg w-full">
					<Footer />
				</section>
			</main>
		</>
	);
}
