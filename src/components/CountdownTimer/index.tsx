import { useEffect, useState } from "react";
import settings from "@/lib/config/settings.json";
import { motion, useAnimation } from "framer-motion";

const CountdownTimer = () => {
	const [days, setDays] = useState(-1);
	const [hours, setHours] = useState(-1);
	const [minutes, setMinutes] = useState(-1);
	const [seconds, setSeconds] = useState(-1);

	const daysControls = useAnimation();
	const hoursControls = useAnimation();
	const minutesControls = useAnimation();
	const secondsControls = useAnimation();

	useEffect(() => {
		const target = new Date(settings.hackathonDate);

		const interval = setInterval(() => {
			const now = new Date();
			const difference = target.getTime() - now.getTime();

			if (difference <= 0) {
				clearInterval(interval);
				return;
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

			if (d !== -1) {
				secondsControls.start({ scaleY: 1 });
				setTimeout(() => {
					setSeconds(s);
					secondsControls.start({ scaleY: 0 });
				}, 500);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (days === -1 || hours === -1 || minutes === -1 || seconds === -1) {
		return null;
	}

	return (
		<div className="text-center">
			<motion.div
				className="flex space-x-2 text-6xl font-bold font-mono text-white bg-black justify-between px-6 py-2 border-black rounded-sm"
				initial={{ scaleY: 0 }}
				animate={{ scaleY: 1 }}
			>
				<motion.div className="flex">
					<span className="time">{days}</span>
				</motion.div>
				<motion.div className="flex">
					<span className="time">{hours}</span>
				</motion.div>
				<motion.div className="flex">
					<span className="time">{minutes}</span>
				</motion.div>
				<motion.div className="flex" animate={secondsControls}>
					<span className="time">{seconds}</span>
				</motion.div>
			</motion.div>
			<div>
				Some label that says Days, Hours, Minutes, Seconds until Hackathon!
			</div>
		</div>
	);
};

export default CountdownTimer;
