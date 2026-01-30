"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import settings from "@/lib/config/settings.json";
import MemoryGame from "@/components/MemoryGame";

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
	const [showMemoryGame, setShowMemoryGame] = useState<boolean>(false);

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
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -6px 10px #ff88e9cc, 0 6px 10px #ff88e9cc, inset 0 -6px 6px rgba(255, 136, 233, 0.05), inset 0 6px 6px rgba(255, 136, 233, 0.05)",
			}}
		>
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
						backgroundColor: "#2f234bff",
						border: "8px solid #ff88e9ff",
						borderRadius: "15px",
						position: "relative",
						boxShadow:
							"0 -15px 30px #ff88e9ff, 0 15px 30px #ff88e9ff, inset 0 -15px 15px rgba(255, 136, 233, 0.2), inset 0 15px 15px rgba(255, 136, 233, 0.2)",
					}}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.3 }}
				>
					{/* Title */}
					<motion.h1
						className="text-center mb-[2vw] font-bold cursor-pointer hover:scale-105 transition-transform duration-200 relative z-10"
						style={{
							fontSize: "clamp(32px, 8vw, 80px)",
							fontFamily: "Orbitron, monospace",
							color: "#ffffff",
						}}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						HackPSU Spring 2026
					</motion.h1>

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
											color: "#ffffff",
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
											color: "#ffffff",
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
										color: "#ffffff",
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
											color: "#ffffffff",
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
											color: "#ffffffff",
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
										color: "#ffffffff",
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
											color: "#ffffff",
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
											color: "#ffffff",
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
										color: "#ffffff",
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
											color: "#ffffff",
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
											color: "#ffffff",
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
										color: "#ffffff",
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
									color: "#ffffff",
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
								color: "#ffffff",
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
				className="flex flex-col md:flex-row items-center justify-center md:gap-[0vw] md:w-full mt-[-8vw]"
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
						height: "clamp(80px, 20vw, 280px)",
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Image
						src="/sp26/register3.png"
						alt="Register Now"
						fill
						className="object-contain"
						priority
					/>
					<div
						className="absolute inset-0 flex items-center justify-center text-center font-black z-10"
						style={{
							fontSize: "clamp(14px, 3.75vw, 42px)",
							color: "#FFFFFF",
							fontFamily: "Orbitron, monospace",
						}}
					>
						Register now
					</div>
				</motion.button>

				{/* Discord Button */}
				<motion.button
					onClick={() => window.open("http://discord.hackpsu.org", "_blank")}
					className="relative overflow-hidden rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center"
					style={{
						width: "clamp(400px, 50vw, 700px)",
						height: "clamp(80px, 20vw, 280px)",
					}}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Image
						src="/sp26/register3.png"
						alt="Join Discord"
						fill
						className="object-contain"
						priority
					/>
					<div
						className="absolute inset-0 flex items-center justify-center text-center font-black z-10"
						style={{
							fontSize: "clamp(14px, 4vw, 42px)",
							color: "#FFFFFF",
							fontFamily: "Orbitron, monospace",
						}}
					>
						<div className="flex items-center gap-2">
							<svg
								width="clamp(24px, 4vw, 48px)"
								height="clamp(24px, 4vw, 48px)"
								viewBox="0 0 71 55"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<g clipPath="url(#clip0)">
									<path
										d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
										fill="currentColor"
									/>
								</g>
								<defs>
									<clipPath id="clip0">
										<rect width="71" height="55" fill="white" />
									</clipPath>
								</defs>
							</svg>
							Discord
						</div>
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
