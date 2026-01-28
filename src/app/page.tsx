"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function Home() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<>
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
