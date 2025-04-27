// components/Hero.tsx
"use client";

import React, { useEffect, useState } from "react";
import { DateTime, Duration } from "luxon";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";
import clsx from "clsx";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
	const { data: hackathon, isLoading } = useActiveHackathonForStatic();
	const [countdown, setCountdown] = useState<Duration>(Duration.fromObject({}));

	useEffect(() => {
		if (!hackathon) return;
		const timer = setInterval(() => {
			const now = DateTime.now();
			const start = DateTime.fromMillis(hackathon.startTime);
			const diff = start.diff(now, ["days", "hours", "minutes", "seconds"]);
			setCountdown(
				diff.shiftTo("days", "hours", "minutes", "seconds").normalize()
			);
		}, 1000);
		return () => clearInterval(timer);
	}, [hackathon]);

	if (isLoading || !hackathon) {
		return <div className="py-24 text-center">Loading…</div>;
	}

	const start = DateTime.fromMillis(hackathon.startTime);
	const end = DateTime.fromMillis(hackathon.endTime);
	const dateRange = start.hasSame(end, "month")
		? `${start.toFormat("LLLL d")}–${end.toFormat("d, yyyy")}`
		: `${start.toFormat("LLLL d, yyyy")}–${end.toFormat("LLLL d, yyyy")}`;

	return (
		<section className="relative bg-[#FFD79E] pt-8 ">
			<Image
				src="/starfish.png"
				alt="Starfish"
				width={200}
				height={200}
				className="absolute sm:top-0 sm:left-0 md:top-0 md:left-0 lg:top-[20%] lg:left-[20%] xl:top-[20%] xl:left-[10%]"
			/>
			<Image
				src="/starfish-orange.png"
				alt="Starfish Orange"
				width={100}
				height={100}
				className="absolute sm:top-0 sm:left-0 md:top-0 md:left-0 lg:top-[17%] lg:left-[23%] xl:top-[13%] xl:left-[23%]"
			/>
			<Image
				src="/sand.png"
				alt="Sand"
				width={400}
				height={400}
				className="absolute sm:top-0 sm:right-0 md:top-0 md:right-0 lg:top-[20%] lg:right-[20%] xl:top-[5%] xl:right-[5%]"
			/>
			<motion.div
				className="absolute sm:bottom-0 sm:left-0 md:bottom-0 md:left-0 lg:bottom-[0%] lg:left-[0%] xl:bottom-[-15%] xl:left-[0%] z-[3] pointer-events-none"
				animate={{
					rotate: [0, 360 * 6],
					x: ["-10vw", "100vw"],
					y: [
						"0vh",
						"5vh",
						"0vh",
						"5vh",
						"0vh",
						"5vh",
						"0vh",
						"5vh",
						"0vh",
						"5vh",
						"0vh",
						"5vh",
					],
				}}
				transition={{
					duration: 30,
					repeat: Infinity,
					ease: "linear",
				}}
			>
				<Image
					src="/ball.png"
					alt="Ball"
					width={150}
					height={150}
					className=""
				/>
			</motion.div>
			<div className="max-w-4xl mx-auto pt-12 px-6 text-center space-y-4">
				<h1 className="text-8xl font-handwriting text-[#01DBB8]">HackPSU</h1>
				<p className="text-4xl font-handwriting text-black">{dateRange}</p>
				<p className="text-lg font-handwriting text-black/80">
					Business Building • State College, PA
				</p>

				<div className="flex justify-center space-x-4 mt-8">
					<Counter unit="Days" value={Math.max(0, countdown.days)} />
					<Counter unit="Hours" value={countdown.hours} />
					<Counter unit="Minutes" value={countdown.minutes} />
					<Counter unit="Seconds" value={Math.floor(countdown.seconds)} />
				</div>

				<div className="flex justify-center gap-6 mt-12 z-10">
					<a
						href={`/signin`}
						className="px-8 py-3 bg-white text-teal-500 font-bold rounded-xl shadow-md hover:shadow-lg transition z-10"
					>
						Register
						<ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
					</a>
					<a
						href="discord.hackpsu.org"
						target="_blank"
						rel="noopener"
						className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/30 transition z-10"
					>
						Discord
						<ArrowRightIcon className="w-5 h-5 inline-block ml-2" />
					</a>
				</div>
			</div>
		</section>
	);
}

function Counter({ unit, value }: { unit: string; value: number }) {
	return (
		<div className="flex flex-col items-center z-10">
			<div className="text-6xl text-black">
				{String(value).padStart(2, "0")}
			</div>
			<div className="mt-1 text-sm font-handwriting text-black/70">{unit}</div>
		</div>
	);
}
