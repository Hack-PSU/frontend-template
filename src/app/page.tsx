"use client";
import { useEffect, useState, useRef } from "react";
import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import FAQ from "@/components/FAQ";
import PrizesChallenges from "@/components/PrizesChallenges";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import InfoSections from "@/components/InfoSections";
import PhotoGallery from "@/components/PhotoGallery";
import MemoryGame from "@/components/MemoryGame";

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
			if (target?.closest?.("input, textarea") || target?.getAttribute?.("contenteditable") === "true") {
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
				<section className="hero-bg w-full">
					<Hero />
				</section>
				<section className="info-bg w-full">
					<InfoSections />
				</section>
				<section className="prizes-bg w-full">
					<PrizesChallenges />
				</section>
				<section className="schedule-bg w-full">
					<Schedule />
				</section>
				<section className="faq-bg w-full">
					<FAQ />
				</section>
				<section className="gallery-bg w-full">
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
				<section className="sponsors-bg w-full">
					<Sponsors />
				</section>
				<section className="footer-bg w-full">
					<Footer />
				</section>
			</main>
		</>
	);
}
