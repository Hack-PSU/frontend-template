"use client";

import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import Rules from "@/components/Rules";
import FAQ from "@/components/FAQ";
import MobileApp from "@/components/MobileApp";
import PrizesChallenges from "@/components/PrizesChallenges";
import Workshops from "@/components/Workshops";
import Sponsors from "@/components/Sponsers";
import Footer from "@/components/Footer";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center w-full gap-6">
			<Hero />
			<Schedule />
			<Rules />
			<FAQ />
			<MobileApp />
			<PrizesChallenges />
			<Workshops />
			<Sponsors />
			<Footer />
		</main>
	);
}
