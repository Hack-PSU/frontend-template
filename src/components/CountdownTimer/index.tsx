import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { getActiveHackathon } from "@/lib/common";

const CountdownTimer = () => {
	// Get Hackathon data
	const [hackathon, setHackathon] = useState<any>(null);
	useEffect(() => {
		getActiveHackathon()
			.then((data) => {
				setHackathon(data);
				initializeFields(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const [days, setDays] = useState(Infinity);
	const [hours, setHours] = useState(Infinity);
	const [minutes, setMinutes] = useState(Infinity);
	const [seconds, setSeconds] = useState(Infinity);
	const [bannerMessage, setBannerMessage] = useState("");
	const [targetDate, setTargetDate] = useState<Date>(new Date());
	const [state, setState] = useState(-1); // 0 = before hackathon, 1 = during hackathon, 2 = after hackathon

	const initializeFields = (data: any) => {
		// Initialize fields
		let initialDate = new Date(data.startTime);
		let initialState = 0;
		if (initialDate.getTime() - new Date().getTime() <= 0) {
			initialDate = new Date(data.endTime);
			initialState = 1;
			if (initialDate.getTime() - new Date().getTime() <= 0) {
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
	};

	const secondsControls = useAnimation();
	const endDate = new Date(hackathon?.endTime || new Date());

	const updateCountdown = () => {
		const now = new Date();
		let difference = targetDate.getTime() - now.getTime();

		if (difference <= 0) {
			if (state === 0) {
				setBannerMessage("until the end of the Hackathon!");
				setTargetDate(endDate);
				setState(1);
				difference = targetDate.getTime() - now.getTime();
			} else {
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
		setSeconds(s);

		if (d !== Infinity) {
			secondsControls.start({ scaleY: 1 });
			setTimeout(() => {
				setSeconds(s);
				secondsControls.start({ scaleY: 0 });
			}, 500);
		}
	};

	useEffect(() => {
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [state]);

	// Ensure everything loaded before rendering
	if (hackathon === null || state === -1) return null;

	if (
		days === Infinity ||
		hours === Infinity ||
		minutes === Infinity ||
		seconds === Infinity
	) {
		return null;
	}

	return (
		<div className="text-center bg-black border-black rounded-sm px-6 py-2">
			{state !== 2 ? (
				<motion.div
					className="flex space-x-2 text-6xl font-bold text-white justify-between"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 1 }}
				>
					<div className="w-1/4">
						<motion.div className="cyberspace-front-font mb-4">
							{days}
						</motion.div>
						<div className="text-base">{days === 1 ? "Day" : "Days"}</div>
					</div>
					<div className="w-1/4">
						<motion.div className="cyberspace-front-font mb-4">
							{hours}
						</motion.div>
						<div className="text-base">{hours === 1 ? "Hour" : "Hours"}</div>
					</div>
					<div className="w-1/4">
						<motion.div className="cyberspace-front-font mb-4">
							{minutes}
						</motion.div>
						<div className="text-base">
							{minutes === 1 ? "Minute" : "Minutes"}
						</div>
					</div>
					<div className="w-1/4">
						<motion.div
							className="cyberspace-front-font mb-4"
							animate={secondsControls}
						>
							{seconds}
						</motion.div>
						<div className="text-base">
							{seconds === 1 ? "Second" : "Seconds"}
						</div>
					</div>
				</motion.div>
			) : (
				<></>
			)}
			<div className="text-3xl font-bold text-white">{bannerMessage}</div>
		</div>
	);
};

export default CountdownTimer;
