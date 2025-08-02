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
import Submissions from "@/components/common/Submissions";
import { Fireworks } from "@fireworks-js/react";
import FerrisWheel from "@/components/FerrisWheel";
import InfoSections from "@/components/InfoSections";
import Wave from "@/components/Wave";
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

	const wavePoints = isMobile ? 3 : 6;

	return (
		<>
			<main className="flex flex-col items-center w-full">
				<Hero />
				{/* Wave transition after Hero */}
				<Wave
					height={200}
					fill="#B1E8FF"
					borderColor="#ffffff"
					borderOffset={-30}
					waveHeight={50}
					waveDelta={50}
					speed={0.15}
					wavePoints={wavePoints}
					className="w-full"
					style={{ backgroundColor: "#FFEBB8", marginTop: "-50px" }}
				/>
				<InfoSections />
				<PrizesChallenges />
				<Wave
					height={200}
					fill="#84cefe"
					borderColor="#ffffff"
					borderOffset={-20}
					waveHeight={50}
					waveDelta={50}
					speed={0.15}
					wavePoints={wavePoints}
					className="w-full"
					style={{ backgroundColor: "#B1E8FF" }}
				/>
				<Schedule />
				<FAQ />
				<Wave
					height={120}
					fill="#215172"
					borderColor="#9eadbd"
					borderOffset={-10}
					waveHeight={50}
					waveDelta={50}
					speed={0.15}
					wavePoints={wavePoints}
					className="w-full"
					style={{ backgroundColor: "#84cefe" }}
				/>{" "}
				<PhotoGallery
					images={[
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
				<Sponsors />
				<Footer />
			</main>
		</>
	);
}
