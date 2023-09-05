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

import { readFromDatabase } from "@/utils/database";

export default function Home() {
	// Example GET request
	const fetchData = async () => {
		const res: any = await readFromDatabase("users");
		console.log(res);
	};

	return (
		<main className="flex min-h-screen flex-col items-center w-full gap-6">
			<Hero />

			<div className="border border-gray-300 p-4 m-2 rounded-lg shadow-md">
				<p>API TESTING</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					onClick={fetchData}
				>
					Fetch Data
				</button>
			</div>

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
