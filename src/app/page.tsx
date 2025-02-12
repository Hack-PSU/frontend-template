"use client";
import { useEffect, useState } from "react";
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

export default function Home() {
	const [isRendering, setIsRendering] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const updateIsMobile = () => {
			setIsMobile(window.innerWidth < 1024);
		};

		const handleScroll = () => {
			setScrollY(window.scrollY); // Track scroll position
		};

		window.addEventListener("resize", updateIsMobile);
		window.addEventListener("scroll", handleScroll);

		updateIsMobile();
		setIsRendering(false);

		return () => {
			window.removeEventListener("resize", updateIsMobile);
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (isRendering) {
		return null;
	}

	const arcFactorBase = 0.7; // Initial factor for arc size
	const moonOffsetX = scrollY * -1.5; // Horizontal movement based on scroll

	// Create a growing downward arc using a quadratic function
	const arcFactor = arcFactorBase + scrollY * 0.004; // Gradually increase the arc's "deepness"
	const moonOffsetY = Math.pow(scrollY * arcFactor, 1.5) * 0.002;

	let sunOffsetX = 0;
	let sunOffsetY = 0;

	const sunStartScroll = 1000;

	if (scrollY >= sunStartScroll) {
		sunOffsetX = (scrollY - sunStartScroll) * -0.12;
	}

	const moonStyle = {
		transform: `translateX(${moonOffsetX}px) translateY(${moonOffsetY}px)`,
	};

	const sunStyle = {
		transform: `translateX(${sunOffsetX}px) translateY(${sunOffsetY}px)`,
	};

	const mobileComponents = [
		MobileHero,
		Schedule,
		Rules,
		FAQ,
		MobileApp,
		PrizesChallenges,
		Sponsors,
		Footer,
	];

	return (
		<>
			<div className="background-container">
				<div className="moon" style={moonStyle}></div>
				<div className="sun" style={sunStyle}></div>
			</div>
			{isMobile ? (
				<main className="mobile-container">
					{mobileComponents.map((Component, index) => (
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
							acceleration: 1.05,
							friction: 0.97,
							gravity: 1.5,
							particles: 50,
							traceLength: 3,
							traceSpeed: 10,
							explosion: 5,
							intensity: 30,
							flickering: 50,
							lineStyle: "round",
							hue: {
								min: 0,
								max: 360,
							},
							delay: {
								min: 30,
								max: 60,
							},
							rocketsPoint: {
								min: 50,
								max: 50,
							},
							lineWidth: {
								explosion: {
									min: 1,
									max: 3,
								},
								trace: {
									min: 1,
									max: 2,
								},
							},
							brightness: {
								min: 50,
								max: 80,
							},
							decay: {
								min: 0.015,
								max: 0.03,
							},
							mouse: {
								click: true,
								move: false,
								max: 1,
							},
						}}
						style={{
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							position: "fixed",
							zIndex: -1,
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
