"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero from "@/components/Hero";
import MobileHero from "@/components/Hero/Mobile";
import Schedule from "@/components/Schedule";
import FAQRules from "@/components/FAQRules";
import Rules from "@/components/common/Rules/index";
import FAQ from "@/components/common/FAQ";
import MobileApp from "@/components/MobileApp";
import PrizesChallenges from "@/components/PrizesChallenges";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import Submissions from "@/components/common/Submissions";
import { Fireworks } from "@fireworks-js/react";
import Image from "next/image";

export default function Home() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const updateIsMobile = () => setIsMobile(window.innerWidth < 1024);
		window.addEventListener("resize", updateIsMobile);
		updateIsMobile();
		return () => window.removeEventListener("resize", updateIsMobile);
	}, []);

	const { scrollYProgress } = useScroll();
	const progress = useTransform(scrollYProgress, [0, 0.99], [0, 1]);

	const moonLeft = useTransform(progress, [0, 0.5], ["5px", "110vw"]);
	const moonRotate = useTransform(progress, [0, 1], [0, 0]);

	const sunLeft = useTransform(
		progress,
		[0.5, 1],
		["-15vw", "85vw"]
	);
	const sunRotate = useTransform(progress, [0, 1], [0, 0]);

	return (
		<>
			{/* Background container for the assets */}
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					zIndex: -1,
				}}
			>
				<motion.div
					style={{
						position: "absolute",
						top: "120px",
						left: moonLeft,
						rotate: moonRotate,
					}}
				>
					<Image src="/moon.png" alt="Moon" width={150} height={150} />
				</motion.div>
				<motion.div
					style={{
						position: "absolute",
						top: "120px",
						left: sunLeft,
						rotate: sunRotate,
					}}
				>
					<Image src="/sun.png" alt="Sun" width={200} height={200} />
				</motion.div>
			</div>

			{isMobile ? (
				<main className="mobile-container">
					{[
						MobileHero,
						Schedule,
						Rules,
						FAQ,
						MobileApp,
						PrizesChallenges,
						Sponsors,
						Footer,
					].map((Component, index) => (
						<div className="mobile-content" key={index}>
							<Component />
						</div>
					))}
				</main>
			) : (
				<>
					<Fireworks
						options={{
							autoresize: true,
							opacity: 0.7,
							acceleration: 1.02,
							friction: 0.97,
							gravity: 1.5,
							particles: 50,
							traceLength: 3,
							traceSpeed: 10,
							explosion: 5,
							intensity: 10,
							flickering: 50,
							lineStyle: "round",
							hue: { min: 0, max: 360 },
							delay: { min: 30, max: 60 },
							rocketsPoint: { min: 50, max: 50 },
							lineWidth: {
								explosion: { min: 1, max: 3 },
								trace: { min: 1, max: 2 },
							},
							brightness: { min: 50, max: 80 },
							decay: { min: 0.015, max: 0.03 },
							mouse: { click: false, move: true, max: 1 },
						}}
						style={{
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							position: "fixed",
							zIndex: -2,
							willChange: "transform, opacity",
						}}
					/>
					<main className="flex min-h-screen flex-col items-center w-full gap-6">
						<Hero />
						<Schedule />
						<FAQRules />
						<MobileApp />
						<PrizesChallenges />
						<Submissions />
						<Sponsors />
						<Footer />
					</main>
				</>
			)}
		</>
	);
}
