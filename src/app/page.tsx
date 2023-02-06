"use client";

import FAQ from "@/components/sections/FAQ";
import Hero from "@/components/sections/Hero";
import Schedule from "@/components/sections/Schedule";
import Rules from "@/components/sections/Rules";
import MobileApp from "@/components/sections/MobileApp";
import PrizesChallenges from "@/components/sections/PrizesChallenges";
import Workshops from "@/components/sections/Workshops";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/sections/Footer";

const Home = () => {
	return (
		<main className="flex flex-col items-center w-full gap-6">
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
};

export default Home;
