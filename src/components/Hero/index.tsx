"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import settings from "@/lib/config/settings.json";
import MemoryGame from "@/components/MemoryGame";
import { useFlagState } from "@/lib/api/flag/hook";

const Hero = () => {
	const { isAuthenticated, isLoading } = useFirebase();
	const router = useRouter();
	const { data: registrationsFlagData, isLoading: isLoadingRegistrationsFlag } =
		useFlagState("Registrations");

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
	const [showMemoryGame, setShowMemoryGame] = useState<boolean>(false);
	const [glitchActive, setGlitchActive] = useState<boolean>(false);
	const [flyKey, setFlyKey] = useState(0);
	const [isDroneFlying, setIsDroneFlying] = useState(false);
	const glitchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
		null
	);

	const handleTitleClick = useCallback(() => {
		// Trigger drone fly across screen (one at a time)
		if (!isDroneFlying) {
			setFlyKey((k) => k + 1);
			setIsDroneFlying(true);
		}
		setGlitchActive((prev) => {
			if (prev) {
				if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
				return false;
			}
			glitchTimeoutRef.current = setTimeout(() => setGlitchActive(false), 500);
			return true;
		});
	}, [isDroneFlying]);

	React.useEffect(
		() => () => {
			if (glitchTimeoutRef.current) clearTimeout(glitchTimeoutRef.current);
		},
		[]
	);

	const secondsControls = useAnimation();

	// Handle starfish click to show memory game
	const handleStarfishClick = useCallback(() => {
		setShowMemoryGame(true);
	}, []);

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

	// Console easter egg - show on component mount
	useEffect(() => {
		const showConsoleMessage = () => {
			const asciiLogo = `                                                                  
                               -#@@@@#-                               
                            +@@@@@@@@@@@@+                            
                        .*@@@@@@*-%@=#@@@@@@*.                        
                     :*@@@@@%+.  .%%.  .*%@@@@@*:                     
                  :#@@@@@%:      .%%.      -%@@@@@#:                  
               :%@@@@@*.   .*    .%%.         :*@@@@@%:               
            =%@@@@%@@    .%@@    .%%.    @%=     @@@@@@@%=            
        .=@@@@@#:  @@    .%@@    .%%.    @@%.    @@  :#@@@@@=.        
      +@@@@@@.     @@    .%@%    .%@:    @@@+    @@      @@@@@@+      
   +@@@@%: @@      @@     :      .%%.    @@@@@@#-@@      @@:-%@@@@+   
 :@@@*:    @@      @@      .+    .%%:    @@@@@@@@@@      @@    :*@@@: 
:@@@@      @@      @@    .%@@    .%@:    @@@@@@@@@@      @@      @@@@:
#@@@@      @@      @%    .%@@    .%@.    @@%=%@@@@@      @@      @@@@#
%@@@@      %=      @@    .%@@    :@@:    .=#.  :*@@      =#      @@@@%
%@@@@              @%    .%@@ :+@@@@@@*:         @@              @@@@%
%@@@@      *@      @%    .%@@@@@@+  *@@@@%:      @@      @#   .+@@@@@%
%@@@@      @@      @%   +@@@@%-        -%@@@@+   @@      @@.   :%@@@@%
%@@@@      @@      @@*@@@@*:              :*@@@@%@@      @@.     @@@@%
%@@@@      @@   .=%@@@@@:        .++.        :@@@@@%=.   @@      @@@@%
%@@@@      @@ *@@@@%:@@%.      *@@@@@@*      :@@@@@@@@@*:@@      @@@@%
%@@@@     =@@@@@=.   @@%.      @@@@@@@@      :@@@   .+@@@@@=     @@@@%
%@@@@ :+@@@@#=       @@%.      @@@@@@@@      :@@@      :%@@@@@+: @@@@%
%@@@@@@@@#.          @@%.      @@@@@@@@      :@@@      .%@@*#@@@@@@@@%
%@@@@@-      -%%.    @@%.      @@@@@@@@+     :@@@      .%@@    =@@@@@%
%@@@@      %@@@%.    @@%.      @@@@@@@@@@@*. :@@@      .%@@      @@@@%
%@@@@      %@@@%.    @@%.       -#@@@@@@@@@@@%@@@      .%@@      @@@@%
%@@@@        :%%.    @@%.          .*@@@@@@@@@@@@      .%@@      @@@@%
%@@@@                @@@#:             -%@@@@@@@@      .%@@      @@@@%
%@@@@      @%=       @@@@@@%=             :*@@@@@      .%@@      @@@@%
%@@@@      @@@@@*:  .@@@@@@@@@@+:            :@@@      .%@@      @@@@%
#@@@@      @@@@@@@@@@@@%.=@@@@@@@@%:         .%@@      .%@@      @@@@#
:@@@@      @@@@@@@@@@@@%.   :#@@@@@@@%+      .%@@       :        @@@@:
 :@@@%=.   @@@@@@@@@@@@%.      @@@@@@@@      .%@@               :@@@: 
   *@@@@@*-@@@@@@@@@@@@%.      @@@@@@@@      .%@@            :*@@@*   
      *@@@@@@@@@@@@@@@@%.      @@@@@@@@      .%@@         =@@@@*      
        .=@@@@@@@@@@@@@%.      @@@@@@@@      .%@@     :*@@@@=.        
            =%@@@@@@@@@%.       -#@@#-       .%@@  -#@@@%=            
               -%@@@@@@@:                    :@@@@@@@%:               
                  :%@@@@@@*.              .*@@@@@@%:                  
                     :*@@@@@@#-        -#@@@@@@*:                     
                        .*@@@@@@@=::=@@@@@@@*.                        
                            *@@@@@@@@@@@@*                            
                              .-#@@@@#-.                                                                                                                                 
`;

			const recruitmentMessage = `
Hello from the Team at HackPSU!

We see you poking around in the console... that's exactly the kind of
curiosity and technical skills we love on the HackPSU organizing team!

We're always looking for passionate developers, designers, and tech 
enthusiasts to join our team and help create amazing experiences for 
thousands of hackers.

If you are interested in joining us, we would love to hear from you!
Our applications can by going to https://go.hackpsu.org/apply
You can also reach out to us directly:
   • Email: team@hackpsu.org
   • Discord: http://discord.hackpsu.org
   • Mention you found this console message!

Happy hacking!
- The HackPSU Team
`;

			console.log(
				"%c" + asciiLogo,
				"color: #00DAB7; font-family: monospace; font-weight: bold;"
			);
			console.log(
				"%c" + recruitmentMessage,
				"color: #fffff; font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5;"
			);
		};

		// Show message after a short delay to ensure console is ready
		const timer = setTimeout(showConsoleMessage, 1000);
		return () => clearTimeout(timer);
	}, []);

	// Utility: render the time or a blank if uninitialized.
	const renderTime = (metric: number): string => {
		if (Math.abs(metric) === Infinity) return "⠀";
		return metric.toString().padStart(2, "0");
	};

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
			style={{
				minHeight: "45vw",
				backgroundColor: "transparent",
			}}
		>
			{/* Flying drone across screen when hero title is clicked */}
			<AnimatePresence>
				{flyKey > 0 && (
					<motion.div
						key={flyKey}
						className="fixed inset-0 z-[9999] pointer-events-none flex items-center"
						initial={false}
					>
						<motion.div
							className="absolute flex items-center justify-center"
							style={{
								left: 0,
								top: "50%",
								transform: "translateY(-50%)",
								width: "clamp(80px, 15vw, 180px)",
								height: "auto",
							}}
							initial={{ x: "-120%" }}
							animate={{ x: "120vw" }}
							transition={{
								duration: 2.5,
								ease: "linear",
							}}
							onAnimationComplete={() => setIsDroneFlying(false)}
						>
							<Image
								src="/fa26/logo+assets/meteor_horizontal.png"
								alt=""
								width={180}
								height={120}
								className="object-contain w-full h-auto"
								unoptimized
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			{/* Container for scaled content (title and countdown only) */}
			<div
				style={{
					transform: "scale(0.75) translateY(-5vw)",
					transformOrigin: "center",
				}}
			>
				{/* Simple Border Container */}
				<motion.div
					className="relative px-[4vw] py-[3vw] mb-[1vw]"
					style={{
						backgroundColor: "rgba(17, 16, 34, 0.55)",
						border: "1px solid rgba(226, 199, 94, 0.2)",
						borderRadius: "18px",
						position: "relative",
						boxShadow:
							"0 20px 50px rgba(0, 0, 0, 0.25), inset 0 0 0 1px rgba(100, 165, 195, 0.12)",
						backdropFilter: "blur(3px)",
					}}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.3 }}
				>
					{/* Title - click for glitch easter egg */}
					<style>{`
						@keyframes hero-glitch {
							0%, 100% {
								text-shadow: none;
								opacity: 1;
								filter: none;
								transform: scale(1) skewX(0deg);
							}
							12% {
								text-shadow: -10px 0 rgba(226, 199, 94, 1), 10px 0 rgba(182, 102, 60, 1), -5px 0 rgba(100, 165, 195, 1);
								opacity: 0.95;
								filter: contrast(1.3) saturate(1.08);
								transform: scale(1) skewX(0deg);
							}
							25% {
								text-shadow: none;
								opacity: 1;
								filter: none;
								transform: scale(1) skewX(0deg);
							}
							37% {
								text-shadow: 12px 0 rgba(100, 165, 195, 0.95), -12px 0 rgba(226, 199, 94, 0.95), 6px 0 rgba(182, 102, 60, 0.75);
								opacity: 0.9;
								filter: contrast(1.4) brightness(1.08) saturate(1.15);
								transform: scale(1.02) skewX(-1.5deg);
							}
							50% {
								text-shadow: none;
								opacity: 0.7;
								filter: contrast(1.2) brightness(0.95) saturate(1.2);
								transform: scale(1) skewX(0deg);
							}
							62% {
								text-shadow: -8px 0 rgba(182, 102, 60, 0.95), 8px 0 rgba(100, 165, 195, 0.95), -4px 0 rgba(226, 199, 94, 0.7);
								opacity: 1;
								filter: none;
								transform: scale(1) skewX(0deg);
							}
							75% {
								text-shadow: 14px 0 rgba(226, 199, 94, 1), -14px 0 rgba(100, 165, 195, 1), 0 0 8px rgba(182, 102, 60, 0.6);
								opacity: 0.95;
								filter: contrast(1.35) saturate(1.1);
								transform: scale(1.01) skewX(1deg);
							}
							87% {
								text-shadow: none;
								opacity: 1;
								filter: none;
								transform: scale(1) skewX(0deg);
							}
						}
						.hero-title-glitch {
							animation: hero-glitch 0.35s steps(1) infinite;
						}
					`}</style>
					<div
						role="button"
						tabIndex={0}
						onClick={handleTitleClick}
						className="relative z-10 mb-[2vw]"
						style={{ cursor: "pointer" }}
					>
						<motion.h1
							className={`text-center font-extrabold hover:scale-105 transition-transform duration-200 ${glitchActive ? "hero-title-glitch" : ""}`}
							style={{
								fontSize: "clamp(56px, 10vw, 132px)",
								fontFamily: "'Barlow Condensed', sans-serif",
								letterSpacing: "0.06em",
								lineHeight: 0.88,
								color: "#EEE5CD",
							}}
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1 }}
							whileHover={!glitchActive ? { scale: 1.05 } : undefined}
							whileTap={!glitchActive ? { scale: 0.95 } : undefined}
						>
							<span>HACK</span>
							<span style={{ color: "#B6663C" }}>PSU</span>
							<span className="block">
								<span style={{ color: "#EEE5CD" }}>{hackathon?.name}</span>
							</span>
						</motion.h1>
					</div>

					<div
						className="text-center mx-auto max-w-3xl mb-[2vw]"
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "clamp(15px, 1.8vw, 24px)",
							lineHeight: 1.5,
							color: "#EEE5CD",
						}}
					>
						<a href="https://en.wikipedia.org/wiki/Mission:_Impossible_(film)" title="What could this be?" target="_blank" rel="noopener noreferrer" className="hover:text-[#B6663C] transition-colors duration-200">
							Your mission, should you choose to accept it:&nbsp;
						</a>
						24 hours to build
							something that bends reality.
					</div>

					{/* Countdown Timer */}
					{state !== 2 ? (
						<div className="flex flex-col items-center mb-[2vw] relative z-10">
							{/* Countdown Numbers */}
							<div
								className="flex items-center justify-center gap-[1.5vw] mb-[1.5vw]"
								style={{ fontFamily: "Orbitron, monospace" }}
							>
								{/* Days */}
								<div className="flex flex-col items-center">
									<motion.div
										className="font-bold"
										style={{
											fontSize: "clamp(24px, 6vw, 80px)",
											color: "#EEE5CD",
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
											color: "#EEE5CD",
											fontFamily: "Orbitron, monospace",
										}}
									>
										{days === 1 ? "Day" : "Days"}
									</div>
								</div>

								{/* Colon */}
								<div
									className="font-bold mb-[2vw]"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#EEE5CD",
									}}
								>
									:
								</div>

								{/* Hours */}
								<div className="flex flex-col items-center">
									<motion.div
										className="font-bold"
										style={{
											fontSize: "clamp(24px, 6vw, 80px)",
											color: "#EEE5CD",
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
											color: "#EEE5CD",
											fontFamily: "Orbitron, monospace",
										}}
									>
										{hours === 1 ? "Hour" : "Hours"}
									</div>
								</div>

								{/* Colon */}
								<div
									className="font-bold mb-[2vw]"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#EEE5CD",
									}}
								>
									:
								</div>

								{/* Minutes */}
								<div className="flex flex-col items-center">
									<motion.div
										className="font-bold"
										style={{
											fontSize: "clamp(24px, 6vw, 80px)",
											color: "#EEE5CD",
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
											color: "#EEE5CD",
											fontFamily: "Orbitron, monospace",
										}}
									>
										{minutes === 1 ? "Minute" : "Minutes"}
									</div>
								</div>

								{/* Colon */}
								<div
									className="font-bold mb-[2vw]"
									style={{
										fontSize: "clamp(24px, 6vw, 80px)",
										color: "#EEE5CD",
									}}
								>
									:
								</div>

								{/* Seconds */}
								<div className="flex flex-col items-center">
									<motion.div
										className="font-bold"
										style={{
											fontSize: "clamp(24px, 6vw, 80px)",
											color: "#EEE5CD",
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
											color: "#EEE5CD",
											fontFamily: "Orbitron, monospace",
										}}
									>
										{seconds === 1 ? "Second" : "Seconds"}
									</div>
								</div>
							</div>

							{/* Banner Message - only show when event is running or completed */}
							{(state === 1 || state === 2) && (
								<div
									className="text-center font-bold mb-[1.5vw]"
									style={{
										fontSize: "clamp(14px, 2.5vw, 32px)",
										color: "#EEE5CD",
										fontFamily: "Orbitron, monospace",
									}}
								>
									{bannerMessage}
								</div>
							)}

							{/* Date and Location */}
							<motion.div
								className="text-center font-semibold"
								style={{
									fontSize: "clamp(16px, 3vw, 24px)",
									color: "#EEE5CD",
									fontFamily: "Orbitron, monospace",
								}}
								initial={{ opacity: 0, y: -30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 1, delay: 0.2 }}
							>
								<div>
									{settings.hackathonDateRepr} • ECoRE Building, Penn State
								</div>
							</motion.div>
						</div>
					) : (
						<div
							className="text-center font-bold mb-[2vw] relative z-10"
							style={{
								fontSize: "clamp(14px, 2.5vw, 32px)",
								color: "#EEE5CD",
								fontFamily: "Orbitron, monospace",
							}}
						>
							{bannerMessage}
						</div>
					)}
				</motion.div>
			</div>

			{/* Register & Discord Buttons - kept at original size */}
			<motion.div
				className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 md:w-full mt-[-2vw]"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 1, delay: 0.6 }}
			>
				{/* Register Button */}
				{registrationsFlagData?.isEnabled && (
					<motion.button
						onClick={() => router.push("/profile")}
						className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center px-10 py-4 shadow-lg"
						style={{
							minWidth: "clamp(220px, 24vw, 260px)",
							backgroundColor: "#B6663C",
							border: "1px solid rgba(238, 229, 205, 0.2)",
						}}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<div
							className="flex items-center justify-center text-center font-black z-10"
							style={{
								fontSize: "clamp(14px, 2vw, 18px)",
								color: "#EEE5CD",
								fontFamily: "Orbitron, monospace",
							}}
						>
							REGISTER
						</div>
					</motion.button>
				)}
				{/* Discord Button */}
				<motion.button
					onClick={() => window.open("http://discord.hackpsu.org", "_blank")}
					className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center px-10 py-4 shadow-lg"
					style={{
						minWidth: "clamp(220px, 24vw, 260px)",
						backgroundColor: "transparent",
						border: "1px solid rgba(238, 229, 205, 0.28)",
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<div
						className="flex items-center justify-center text-center font-black z-10"
						style={{
							fontSize: "clamp(14px, 2vw, 18px)",
							color: "#EEE5CD",
							fontFamily: "Orbitron, monospace",
						}}
					>
						DISCORD
					</div>
				</motion.button>
			</motion.div>

			{/* Memory Game Modal */}
			<MemoryGame
				isOpen={showMemoryGame}
				onClose={() => setShowMemoryGame(false)}
			/>
		</section>
	);
};

export default Hero;
