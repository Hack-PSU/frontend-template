"use client";
import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import MobileHero from "@/components/Hero/Mobile";
import Schedule from "@/components/Schedule";
import FAQRules from "@/components/FAQRules";
import Rules from "@/components/common/Rules/index";
import FAQ from "@/components/common/FAQ";
import PrizesChallenges from "@/components/PrizesChallenges";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import Submissions from "@/components/common/Submissions";

export default function Home() {
	const [isRendering, setIsRendering] = useState(true);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const updateIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};
		updateIsMobile();

		// Event listener if window is resized
		window.addEventListener("resize", () => {
			updateIsMobile();
		});

		setIsRendering(false);
	}, []);

	if (isRendering) {
		return null;
	}

	if (isMobile) {
		const components = [
			MobileHero,
			Schedule,
			Rules,
			FAQ,
			PrizesChallenges,
			Sponsors,
			Footer,
		];

		return (
			<>
				<main className="mobile-container">
					{components.map((Component, index) => (
						<div className="mobile-content" key={index}>
							<Component />
						</div>
					))}
				</main>
			</>
		);
	}

	return (
		<>
			<main className="flex min-h-screen flex-col items-center w-full gap-6">
				<Hero />
				<Schedule />
				<FAQRules />
				<PrizesChallenges />
				<Submissions />
				<Sponsors />
				<Footer />
			</main>
		</>
	);
}
