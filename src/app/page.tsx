"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
import { Fireworks } from "@fireworks-js/react";
import FerrisWheel from "@/components/FerrisWheel";
import InfoSections from "@/components/InfoSections";
import Wave from "@/components/Wave";

export default function Home() {
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
					waveHeight={100}
					waveDelta={50}
					speed={0.2}
					wavePoints={6}
					className="w-full"
					style={{ backgroundColor: "#FFEBB8" }}
				/>
				<InfoSections />
				<Wave
					height={120}
					fill="#215172"
					waveHeight={60}
					waveDelta={20}
					speed={0.3}
					wavePoints={6}
					inverted={false}
					className="w-full"
					style={{ backgroundColor: "#D8FFFC" }}
				/>
				<Footer />
			</main>
		</>
	);
}
