import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";

const CountdownTimer: React.FC = () => {
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
		return metric.toString();
	};

	if (hackathonLoading) {
		return <div>Loading...</div>;
	}

	if (hackathonError) {
		return <div>Error loading hackathon data.</div>;
	}

	return (
		<div className="text-center border-black rounded-sm px-6 py-2">
			{state !== 2 ? (
				<motion.div
					className="flex space-x-4 text-4xl font-bold text-white justify-between"
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 1 }}
				>
					<div className="w-1/2">
						<motion.div className="limelight-regular mb-4">
							{renderTime(days)}
						</motion.div>
						<div className="limelight-regular text-base">
							{days === 1 ? "Day" : "Days"}
						</div>
					</div>
					<div className="w-1/6">
						<motion.div className="limelight-regular mb-4">
							{renderTime(hours)}
						</motion.div>
						<div className="limelight-regular text-base">
							{hours === 1 ? "Hour" : "Hours"}
						</div>
					</div>
					<div className="limelight-regular mb-4">:</div>
					<div className="w-1/6">
						<motion.div className="limelight-regular mb-4">
							{renderTime(minutes)}
						</motion.div>
						<div className="limelight-regular text-base">
							{minutes === 1 ? "Minute" : "Minutes"}
						</div>
					</div>
					<div className="limelight-regular mb-4">:</div>
					<div className="w-1/6">
						<motion.div
							className="limelight-regular mb-4"
							animate={secondsControls}
						>
							{renderTime(seconds)}
						</motion.div>
						<div className="limelight-regular text-base">
							{seconds === 1 ? "Second" : "Seconds"}
						</div>
					</div>
				</motion.div>
			) : null}
			<div className="sm:text-2xl md:text-3xl font-bold text-[darkred] cornerstone-font mt-3 ">
				{bannerMessage}
			</div>
		</div>
	);
};

export default CountdownTimer;