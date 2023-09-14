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

import {
	readFromDatabase,
	writeToDatabase,
	deleteFromDatabase,
	updateInDatabase,
} from "@/utils/database";
import { User } from "@/interfaces/Schema";

export default function Home() {
	// Example GET request
	const TEST_ID = "ENTER A FIREBASE USER ID HERE";

	const fetchData = async () => {
		const res: any = await readFromDatabase("users");
		console.log(res);
	};

	const writeData = async () => {
		const user: User = {
			id: TEST_ID,
			firstName: "Aaron",
			lastName: "Test",
			gender: "male",
			shirtSize: "L",
			university: "Test State College",
			email: "aarontest@hack.com",
			major: "Computer Science",
			phone: "(123) 456 7890",
			country: "USA",
		};

		const res: any = await writeToDatabase("users", user);
		console.log(res);
	};

	const deleteData = async () => {
		const res: any = await deleteFromDatabase("users", TEST_ID);
		console.log(res);
	};

	const patchData = async () => {
		const res: any = await updateInDatabase("users", {
			id: TEST_ID,
			firstName: "Jake",
		});
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

				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					onClick={writeData}
				>
					Write Data
				</button>

				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					onClick={deleteData}
				>
					Delete Data
				</button>

				<button
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
					onClick={patchData}
				>
					Patch Data
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
