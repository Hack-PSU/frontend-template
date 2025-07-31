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

export default function Home() {
	return (
		<>
			<main className="flex  flex-col items-center w-full">
				<Footer />
			</main>
		</>
	);
}
