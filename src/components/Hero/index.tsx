"use client";

import React, {
	useCallback,
	useEffect,
	useMemo,
	useState,
	useRef,
} from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
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
	const [crabClicked, setCrabClicked] = useState<boolean>(false);
	const [crabArmy, setCrabArmy] = useState<
		Array<{
			id: number;
			x: number;
			y: number;
			delay: number;
			endX: number;
			endY: number;
			direction: number;
		}>
	>([]);
	const [showCrabArmy, setShowCrabArmy] = useState<boolean>(false);
	const [showMemoryGame, setShowMemoryGame] = useState<boolean>(false);
	const [crabRaveAudio, setCrabRaveAudio] = useState<HTMLAudioElement | null>(
		null
	);
	const [hackySpeech, setHackySpeech] = useState<string>("");

	const secondsControls = useAnimation();

	// Handle crab click to animate it up and away
	const handleCrabClick = useCallback(() => {
		if (!crabClicked) {
			setCrabClicked(true);
		}
	}, [crabClicked]);

	// Handle HackPSU title click to spawn crab army
	const handleTitleClick = useCallback(() => {
		if (showCrabArmy) return; // Prevent multiple armies

		// Generate 15-25 random crabs
		const numCrabs = Math.floor(Math.random() * 11) + 45;
		const newCrabs = Array.from({ length: numCrabs }, (_, i) => ({
			id: i,
			x: Math.random() * 100, // Random x position (0-100%)
			y: Math.random() * 100, // Random y position (0-100%)
			delay: Math.random() * 2, // Random animation delay (0-2s)
			// Random walking path endpoints
			endX: Math.random() * 100,
			endY: Math.random() * 100,
			// Random walking direction (for facing left/right)
			direction: Math.random() > 0.5 ? 1 : -1,
		}));

		setCrabArmy(newCrabs);
		setShowCrabArmy(true);

		// Play crab rave audio
		if (crabRaveAudio) {
			crabRaveAudio.currentTime = 0;
			crabRaveAudio.play().catch(console.error);
		}

		// Hide crabs and stop audio after 15 seconds
		setTimeout(() => {
			setShowCrabArmy(false);
			setCrabArmy([]);
			if (crabRaveAudio) {
				crabRaveAudio.pause();
				crabRaveAudio.currentTime = 0;
			}
		}, 15000);
	}, [showCrabArmy, crabRaveAudio]);

	// Handle starfish click to show memory game
	const handleStarfishClick = useCallback(() => {
		setShowMemoryGame(true);
	}, []);

	// Handle Chill Hacky click to show random quote
	const handleChillHackyClick = useCallback(() => {
		// Random HackPSU messages
		const speechMessages = [
			"I'm so excited for HackPSU!",
			"Hope to see you at HackPSU!",
			"Have you registered for HackPSU yet?",
			"I can't wait for HackPSU!",
			"What are you most excited for at HackPSU?",
			"Have you checked out the schedule for HackPSU?",
			"Don't forget to register for HackPSU!",
			"Have you joined the HackPSU Discord?",
			"Have you seen the HackPSU sponsors?",
			"Have you applied to be an organizer for HackPSU?",
			"Ready to dive into 24 hours of coding?",
			"The beach vibes are perfect for hacking!",
			"Let's make some waves at HackPSU!",
			"Time to surf the code waves! 🏄‍♂️",
			"Beach + Code = Perfect hackathon!",
		];

		const message =
			speechMessages[Math.floor(Math.random() * speechMessages.length)];
		setHackySpeech(message);

		// Clear speech after 4 seconds
		setTimeout(() => setHackySpeech(""), 4000);
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

	// Initialize crab rave audio
	useEffect(() => {
		const audio = new Audio("/f25/crab_rave.mp3");
		audio.loop = true;
		audio.volume = 0.7;
		setCrabRaveAudio(audio);

		return () => {
			audio.pause();
			audio.src = "";
		};
	}, []);

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
			style={{ minHeight: "45vw", backgroundColor: "#FFEBB8" }}
		>
			{/* Decorative elements - kept at normal size */}
			{/* Animated Starfish Elements */}
			<motion.div
				className="absolute z-10
				top-[clamp(10px, 1.5vw, 20px)]
				left-[0px]
				md:left-[3vw]
				md:top-[6vw]
				"
				style={{
					width: "clamp(80px, 10vw, 150px)",
					height: "clamp(80px, 10vw, 150px)",
					pointerEvents: "none",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Image
					src="/f25/2.png"
					alt="Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			<motion.div
				className="absolute cursor-pointer
				top-[-3vw]
				md:top-[1.8vw]
				"
				style={{
					width: "clamp(80px, 10vw, 150px)",
					height: "clamp(80px, 10vw, 150px)",
					left: "clamp(40px, 5vw, 100px)",
					//top: "clamp(12px, 1.8vw, 25px)",
				}}
				initial={{ opacity: 1, rotate: 0 }}
				animate={{
					opacity: 1,
					rotate: [0, -15, 15, 0],
					x: [0, 5, -5, 0],
				}}
				transition={{
					duration: 2,
					ease: "easeInOut",
				}}
				onClick={handleStarfishClick}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<Image
					src="/f25/3.png"
					alt="Starfish - Click for Memory Game!"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Chill Hacky Character */}
			<motion.div
				className="absolute cursor-pointer z-20"
				style={{
					left: "clamp(-15px, -15px, -15px)",
					bottom: "clamp(60px, 80vw, 200px)",
					width: "clamp(120px, 18vw, 300px)",
					height: "clamp(120px, 18vw, 300px)",
				}}
				initial={{ opacity: 1, rotate: 0 }}
				animate={{
					opacity: 1,
					y: [0, -8, 0], // Gentle floating animation
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
				onClick={handleChillHackyClick}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				title="Click me for a random quote!"
			>
				<Image
					src="/f25/chill_hacky.png"
					alt="Chill Hacky - Click for a quote!"
					fill
					className="object-contain"
				/>

				{/* Speech Bubble */}
				{hackySpeech && (
					<motion.div
						className="absolute left-1/2 transform -translate-x-1/2 z-50"
						style={{
							bottom: "calc(100% + 8px)",
							marginBottom: "0px",
						}}
						initial={{ opacity: 0, scale: 0.8, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 10 }}
						transition={{ duration: 0.3 }}
					>
						<div className="relative bg-white px-4 py-3 rounded-lg shadow-lg border-2 border-[#0066CC] max-w-[200px] min-w-[140px]">
							<p
								className="text-xs font-bold text-[#000080] text-center break-words leading-tight"
								style={{ fontFamily: "Monomaniac One, monospace" }}
							>
								{hackySpeech}
							</p>
							{/* Speech bubble tail */}
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
							<div className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-[-2px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-[#0066CC]"></div>
						</div>
					</motion.div>
				)}
			</motion.div>

			{/* Rotating Beach Ball */}
			<motion.div
				className="absolute z-30"
				style={{
					width: "clamp(150px, 20vw, 1000px)",
					height: "clamp(150px, 20vw, 1000px)",
					bottom: "clamp(-40px, -100vw, 400px)",
					left: "calc(0% - 25px)", // Center horizontally
					pointerEvents: "none", // Make ball transparent for clicks
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
				className="absolute z-10 hidden"
				style={{
					width: "clamp(80px, 10vw, 150px)",
					height: "clamp(80px, 10vw, 150px)",
					left: "clamp(40px, 5vw, 100px)",
					top: "clamp(12px, 1.8vw, 25px)",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6 }}
			>
				<Image
					src="/f25/starfish.png"
					alt="Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Orange Starfish */}
			<motion.div
				className="absolute z-10
				right-[0px]
				md:right-[5vw]
				hidden
				"
				style={{
					width: "clamp(80px, 10vw, 80px)",
					height: "clamp(80px, 10vw, 80px)",
					top: "clamp(12px, 1.8vw, 25px)",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.6, delay: 0.2 }}
			>
				<Image
					src="/f25/starfish-orange.png"
					alt="Orange Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Crab */}
			<motion.div
				className="absolute z-20
				max-sm:hidden
				right-[clamp(15px, 3vw, 60px)]
				md:right-[16vw]
				top-[clamp(60px, 80vw, 200px)] 
				md:top-[12vw]
				cursor-pointer"
				initial={{ opacity: 1, scale: 1 }}
				animate={
					crabClicked
						? {
								y: -300,
								opacity: 1,
								rotate: [
									5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5,
									5, -5, 5,
								],
							}
						: { rotate: [5, -5, 5, -5, 5, -5, 5], y: [20, -20, 20] }
				}
				transition={
					crabClicked
						? { duration: 5, ease: "linear" }
						: {
								duration: 3.5,
								repeat: Infinity,
								ease: "linear",
							}
				}
				style={{
					width: "clamp(60px, 18vw, 100px)",
					height: "clamp(60px, 18vw, 100px)",
				}}
				onClick={handleCrabClick}
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
						backgroundColor: "#FFFFFF",
						border: "4px solid #0066CC",
						borderRadius: "15px",
						position: "relative",
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
							fontFamily: "Monomaniac One, monospace",
							color: "#000080",
						}}
						initial={{ opacity: 0, y: -50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
						onClick={handleTitleClick}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						HackPSU Fall 2025
					</motion.h1>

					{/* Countdown Timer */}
					{state !== 2 ? (
						<div className="flex flex-col items-center mb-[2vw] relative z-10">
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
											color: "#000080",
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
											color: "#000080",
											fontFamily: "Monomaniac One, monospace",
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
										color: "#000080",
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
											color: "#000080",
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
											color: "#000080",
											fontFamily: "Monomaniac One, monospace",
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
										color: "#000080",
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
											color: "#000080",
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
											color: "#000080",
											fontFamily: "Monomaniac One, monospace",
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
										color: "#000080",
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
											color: "#000080",
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
											color: "#000080",
											fontFamily: "Monomaniac One, monospace",
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
										color: "#000080",
										fontFamily: "Monomaniac One, monospace",
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
									color: "#000080",
									fontFamily: "Monomaniac One, monospace",
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
								color: "#000080",
								fontFamily: "Monomaniac One, monospace",
							}}
						>
							{bannerMessage}
						</div>
					)}
				</motion.div>
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

			{/* Crab Army Easter Egg */}
			{showCrabArmy &&
				crabArmy.map((crab) => (
					<motion.div
						key={crab.id}
						className="absolute z-50 pointer-events-none"
						style={{
							width: "clamp(40px, 8vw, 80px)",
							height: "clamp(40px, 8vw, 80px)",
							left: `${crab.x}%`,
							top: `${crab.y}%`,
							transform: `scaleX(${crab.direction})`, // Flip crab based on direction
						}}
						initial={{
							opacity: 0,
							scale: 0,
						}}
						animate={{
							opacity: [0, 1, 1, 1, 0],
							scale: [0, 1, 1, 1, 0],
							// Walking animation - same as existing crab
							rotate: [5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5, -5, 5],
							y: [0, 20, -20, 20, -20, 20, -20, 20, -20, 20, -20, 20, 0],
							// Movement across screen
							left: [`${crab.x}%`, `${crab.endX}%`],
							top: [`${crab.y}%`, `${crab.endY}%`],
						}}
						transition={{
							duration: 15,
							delay: crab.delay,
							ease: "linear",
							times: [0, 0.05, 0.1, 0.9, 1],
							rotate: {
								duration: 1.5,
								repeat: 10,
								ease: "linear",
							},
							y: {
								duration: 1.5,
								repeat: 10,
								ease: "linear",
							},
						}}
					>
						<Image
							src="/f25/5.png"
							alt="Crab Army"
							fill
							className="object-contain"
						/>
					</motion.div>
				))}

			{/* Memory Game Modal */}
			<MemoryGame
				isOpen={showMemoryGame}
				onClose={() => setShowMemoryGame(false)}
			/>
		</section>
	);
};

export default Hero;
