"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import settings from "@/lib/config/settings.json";

const Hero = () => {
	const { isAuthenticated, isLoading } = useFirebase();
	const router = useRouter();

	// Use React Query to fetch the active hackathon data.
	const {
		data: hackathon,
		isLoading: hackathonLoading,
		error: hackathonError,
	} = useActiveHackathonForStatic();

	// Local state for the countdown values and display configuration.
	const [days, setDays] = useState<number>(Infinity);
	const [hours, setHours] = useState<number>(Infinity);
	const [minutes, setMinutes] = useState<number>(Infinity);
	const [seconds, setSeconds] = useState<number>(Infinity);
	const [bannerMessage, setBannerMessage] = useState<string>("");
	const [targetDate, setTargetDate] = useState<Date>(new Date());
	const [state, setState] = useState<number>(-1); // -1 = uninitialized, 0 = before hackathon, 1 = during hackathon, 2 = after hackathon

	const secondsControls = useAnimation();

	// This function initializes the timer fields based on hackathon data.
	const initializeFields = useCallback((data: any) => {
		let initialDate = new Date(data.startTime);
		let initialState = 0;
		if (initialDate.getTime() - new Date().getTime() <= 0) {
			// If the start date is in the past, target the hackathon end.
			initialDate = new Date(data.endTime);
			initialState = 1;
			if (initialDate.getTime() - new Date().getTime() <= 0) {
				// Hackathon is over.
				initialState = 2;
			}
		}

		let initialMessage = "until HackPSU!";
		if (initialState === 1) {
			initialMessage = "until the end of the Hackathon!";
		} else if (initialState === 2) {
			initialMessage = "The Hackathon is over. See you next semester!";
		}

		setBannerMessage(initialMessage);
		setTargetDate(initialDate);
		setState(initialState);
	}, []);

	const endDate = useMemo(() => {
		return new Date(hackathon?.endTime || new Date());
	}, [hackathon?.endTime]);

	useEffect(() => {
		if (hackathon) {
			initializeFields(hackathon);
		}
	}, [hackathon, initializeFields]);

	// The countdown updater recalculates days/hours/minutes/seconds.
	const updateCountdown = useCallback(() => {
		if (!hackathon) return;

		const now = new Date();
		let difference = targetDate.getTime() - now.getTime();

		if (difference <= 0) {
			if (state === 0) {
				// The hackathon has started; switch the target to the end time.
				setBannerMessage("until the end of the Hackathon!");
				setTargetDate(endDate);
				setState(1);
				difference = endDate.getTime() - now.getTime();
			} else {
				// The hackathon is over.
				setBannerMessage("The Hackathon is over. See you next semester!");
				setState(2);
				setDays(-Infinity);
				setHours(-Infinity);
				setMinutes(-Infinity);
				setSeconds(-Infinity);
				return;
			}
		}

		const d = Math.floor(difference / (1000 * 60 * 60 * 24));
		setDays(d);

		const h = Math.floor(
			(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		setHours(h);

		const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		setMinutes(m);

		const s = Math.floor((difference % (1000 * 60)) / 1000);
		// Animate the seconds update.
		if (d !== Infinity) {
			secondsControls.start({ scaleY: 1 });
			setTimeout(() => {
				setSeconds(s);
				secondsControls.start({ scaleY: 0 });
			}, 500);
		}
	}, [hackathon, targetDate, endDate, state, secondsControls]);

	// Run the countdown updater every second.
	useEffect(() => {
		const interval = setInterval(updateCountdown, 1000);
		return () => clearInterval(interval);
	}, [updateCountdown]);

	// Utility: render the time or a blank if uninitialized.
	const renderTime = (metric: number): string => {
		if (Math.abs(metric) === Infinity) return "⠀";
		return metric.toString().padStart(2, "0");
	};

	if (hackathonLoading) {
		return (
			<section
				className="flex items-center justify-center"
				style={{ height: "50vw", minHeight: "400px" }}
			>
				<div style={{ fontSize: "clamp(16px, 3vw, 24px)" }}>Loading...</div>
			</section>
		);
	}

	if (hackathonError) {
		return (
			<section
				className="flex items-center justify-center"
				style={{ height: "50vw", minHeight: "400px" }}
			>
				<div style={{ fontSize: "clamp(16px, 3vw, 24px)" }}>
					Error loading hackathon data.
				</div>
			</section>
		);
	}

	return (
		<section
			id="hero"
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[4vw] overflow-hidden"
			style={{ minHeight: "45vw", backgroundColor: "#FFEBB8" }}
		>
			{/* Decorative elements - kept at normal size */}
			{/* Animated Starfish Elements */}
			<motion.div
				className="absolute"
				style={{
					width: "clamp(100px, 15vw, 400px)",
					height: "clamp(100px, 15vw, 400px)",
					left: "clamp(20px, 3vw, 60px)",
					top: "clamp(10px, 1.5vw, 20px)",
				}}
				initial={{ opacity: 1, rotate: 0 }}
				animate={{
					opacity: 1,
					rotate: [0, 10, -10, 0],
					y: [0, -10, 0],
				}}
			>
				<Image
					src="/f25/2.png"
					alt="Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			<motion.div
				className="absolute"
				style={{
					width: "clamp(80px, 10vw, 150px)",
					height: "clamp(80px, 10vw, 150px)",
					left: "clamp(40px, 5vw, 100px)",
					top: "clamp(12px, 1.8vw, 25px)",
				}}
				initial={{ opacity: 1, rotate: 0 }}
				animate={{
					opacity: 1,
					rotate: [0, -15, 15, 0],
					x: [0, 5, -5, 0],
				}}
			>
				<Image
					src="/f25/3.png"
					alt="Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Chill Hacky Character */}
			<motion.div
				className="absolute "
				style={{
					width: "clamp(120px, 18vw, 300px)",
					height: "clamp(120px, 18vw, 300px)",
					left: "clamp(15px, 3vw, 60px)",
					bottom: "clamp(60px, 80vw, 200px)",
				}}
				initial={{ opacity: 1, rotate: 0 }}
				animate={{
					opacity: 1,
				}}
				transition={{
					duration: 4,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				<Image
					src="/f25/chill_hacky.png"
					alt="Chill Hacky"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Rotating Beach Ball */}
			<motion.div
				className="absolute z-50"
				style={{
					width: "clamp(150px, 20vw, 1000px)",
					height: "clamp(150px, 20vw, 1000px)",
					bottom: "clamp(-40px, -100vw, 400px)",
					left: "calc(0% - 25px)", // Center horizontally
				}}
				initial={{
					x: "calc(-10vw - 50px)",
					rotate: 0,
				}}
				animate={{
					x: "calc(100vw + 50px)",
					rotate: 360 * 6,
				}}
				transition={{
					duration: 30,
					repeat: Infinity,
					ease: "linear",
					delay: 2,
				}}
			>
				<Image
					src="/f25/ball.png"
					alt="Beach Ball"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Additional Decorative Images */}
			{/* Starfish */}
			<motion.div
				className="absolute z-10"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
			>
				<Image
					src="/f25/starfish.png"
					alt="Starfish"
					width={200}
					height={200}
					className="object-contain"
					style={{
						width: "clamp(80px, 12vw, 200px)",
						height: "auto",
					}}
				/>
			</motion.div>

			{/* Orange Starfish */}
			<motion.div
				className="absolute z-10"
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Image
					src="/f25/starfish-orange.png"
					alt="Orange Starfish"
					width={200}
					height={200}
					className="object-contain"
					style={{
						width: "clamp(80px, 12vw, 200px)",
						height: "auto",
					}}
				/>
			</motion.div>

			{/* Crab */}
			<motion.div
				className="absolute z-20
				max-sm:hidden
				right-[clamp(15px, 3vw, 60px)]
				md:right-[16vw]
				top-[clamp(60px, 80vw, 200px)] 
				md:top-[12vw]"
				initial={{ opacity: 1, scale: 1 }}
				animate={{ rotate: [5, -5, 5, -5, 5, -5, 5], y: [20, -20, 20] }}
				transition={{
					duration: 3.5,
					repeat: Infinity,
					ease: "linear",
				}}
				style={{
					width: "clamp(60px, 18vw, 100px)",
					height: "clamp(60px, 18vw, 100px)",
				}}
			>
				<Image
					src="/f25/5.png"
					alt="Number 5"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Sand */}
			<motion.div
				className="absolute z-10
				max-sm:hidden
				right-[clamp(15px, 3vw, 60px)]
				md:right-[18vw]
				top-[clamp(60px, 80vw, 200px)] 
				md:top-[2vw]
				"
				initial={{ opacity: 1, scale: 1 }}
				style={{
					width: "clamp(60px, 18vw, 200px)",
					height: "clamp(60px, 18vw, 200px)",
				}}
			>
				<Image src="/f25/sand.png" alt="Sand" fill className="object-contain" />
			</motion.div>

			{/* Container for scaled content (title and countdown only) */}
			<div style={{ transform: "scale(0.75)", transformOrigin: "center" }}>
				{/* Title */}
				<motion.h1
					className="text-center mb-[2vw] font-bold"
					style={{
						fontSize: "clamp(32px, 8vw, 80px)",
						fontFamily: "Monomaniac One, monospace",
						color: "#00DAB7",
					}}
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					HackPSU Fall 2025
				</motion.h1>

				{/* Countdown Timer */}
				{state !== 2 ? (
					<motion.div
						className="flex flex-col items-center mb-[2vw]"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 1, delay: 0.3 }}
					>
						{/* Countdown Numbers */}
						<div
							className="flex items-center justify-center gap-[1.5vw] mb-[1.5vw]"
							style={{ fontFamily: "Monomaniac One, monospace" }}
						>
							{/* Days */}
							<div className="flex flex-col items-center">
								<motion.div
									className="font-bold"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#00DAB7",
									}}
									initial={{ scaleY: 0 }}
									animate={{ scaleY: 1 }}
								>
									{renderTime(days)}
								</motion.div>
								<div
									className="font-semibold"
									style={{
										fontSize: "clamp(10px, 1.5vw, 18px)",
										color: "#00DAB7",
										fontFamily: "Monomaniac One, monospace",
									}}
								>
									{days === 1 ? "Day" : "Days"}
								</div>
							</div>

							{/* Colon */}
							<div
								className="font-bold mb-[2vw]"
								style={{ fontSize: "clamp(24px, 6vw, 80px)", color: "#00DAB7" }}
							>
								:
							</div>

							{/* Hours */}
							<div className="flex flex-col items-center">
								<motion.div
									className="font-bold"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#00DAB7",
									}}
									initial={{ scaleY: 0 }}
									animate={{ scaleY: 1 }}
								>
									{renderTime(hours)}
								</motion.div>
								<div
									className="font-semibold"
									style={{
										fontSize: "clamp(10px, 1.5vw, 18px)",
										color: "#00DAB7",
										fontFamily: "Monomaniac One, monospace",
									}}
								>
									{hours === 1 ? "Hour" : "Hours"}
								</div>
							</div>

							{/* Colon */}
							<div
								className="font-bold mb-[2vw]"
								style={{ fontSize: "clamp(24px, 6vw, 80px)", color: "#00DAB7" }}
							>
								:
							</div>

							{/* Minutes */}
							<div className="flex flex-col items-center">
								<motion.div
									className="font-bold"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#00DAB7",
									}}
									initial={{ scaleY: 0 }}
									animate={{ scaleY: 1 }}
								>
									{renderTime(minutes)}
								</motion.div>
								<div
									className="font-semibold"
									style={{
										fontSize: "clamp(10px, 1.5vw, 18px)",
										color: "#00DAB7",
										fontFamily: "Monomaniac One, monospace",
									}}
								>
									{minutes === 1 ? "Minute" : "Minutes"}
								</div>
							</div>

							{/* Colon */}
							<div
								className="font-bold mb-[2vw]"
								style={{ fontSize: "clamp(24px, 6vw, 80px)", color: "#00DAB7" }}
							>
								:
							</div>

							{/* Seconds */}
							<div className="flex flex-col items-center">
								<motion.div
									className="font-bold"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#00DAB7",
									}}
									animate={secondsControls}
									initial={{ scaleY: 1 }}
								>
									{renderTime(seconds)}
								</motion.div>
								<div
									className="font-semibold"
									style={{
										fontSize: "clamp(10px, 1.5vw, 18px)",
										color: "#00DAB7",
										fontFamily: "Monomaniac One, monospace",
									}}
								>
									{seconds === 1 ? "Second" : "Seconds"}
								</div>
							</div>
						</div>

						{/* Banner Message */}
						<div
							className="text-center font-bold mb-[1.5vw]"
							style={{
								fontSize: "clamp(14px, 2.5vw, 32px)",
								color: "#00DAB7",
								fontFamily: "Monomaniac One, monospace",
							}}
						>
							{bannerMessage}
						</div>

						{/* Date and Location */}
						<motion.div
							className="text-center font-semibold"
							style={{
								fontSize: "clamp(16px, 3vw, 24px)",
								color: "#00DAB7",
								fontFamily: "Monomaniac One, monospace",
							}}
							initial={{ opacity: 0, y: -30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, delay: 0.2 }}
						>
							<div className="mb-[1vw]">{settings.hackathonDateRepr}</div>
							<div>ECore Building, Penn State</div>
						</motion.div>
					</motion.div>
				) : (
					<div
						className="text-center font-bold mb-[2vw]"
						style={{
							fontSize: "clamp(14px, 2.5vw, 32px)",
							color: "#00DAB7",
							fontFamily: "Monomaniac One, monospace",
						}}
					>
						{bannerMessage}
					</div>
				)}
			</div>

			{/* Register & Discord Buttons - kept at original size */}
			<motion.div
				className="flex flex-col md:flex-row items-center justify-center gap-0 md:gap-[0vw] md:w-full mt-[-8vw]"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.6 }}
			>
				{/* Register Button */}
				<motion.button
					onClick={() => router.push("/profile")}
					className="relative overflow-hidden rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center"
					style={{
						width: "clamp(400px, 50vw, 700px)",
						height: "clamp(160px, 20vw, 280px)",
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Image
						src="/f25/register.png"
						alt="Register Now"
						fill
						className="object-contain"
						priority
					/>
					<div
						className="absolute inset-0 flex items-center justify-center text-center font-black z-10"
						style={{
							fontSize: "clamp(21px, 3.75vw, 42px)",
							color: "#FFFFFF",
							fontFamily: "Monomaniac One, monospace",
							transform: "translate(-10px, 4px)",
						}}
					>
						Register now
					</div>
				</motion.button>

				{/* Discord Button */}
				<motion.button
					onClick={() => window.open("http://discord.hackpsu.org", "_blank")}
					className="relative overflow-hidden rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center mt-[-60px] md:mt-0"
					style={{
						width: "clamp(400px, 50vw, 700px)",
						height: "clamp(160px, 20vw, 280px)",
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Image
						src="/f25/register.png"
						alt="Join Discord"
						fill
						className="object-contain"
						priority
					/>
					<div
						className="absolute inset-0 flex items-center justify-center text-center font-black z-10"
						style={{
							fontSize: "clamp(21px, 3.75vw, 42px)",
							color: "#FFFFFF",
							fontFamily: "Monomaniac One, monospace",
							transform: "translate(-10px, 4px)",
						}}
					>
						Discord
					</div>
				</motion.button>
			</motion.div>
		</section>
	);
};

export default Hero;
