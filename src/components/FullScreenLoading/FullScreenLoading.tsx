"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Wheel component displaying the ferris wheel image.
const WheelSVG: React.FC = () => {
	return (
		<Image
			src="/wheel_new.png"
			alt="Ferris Wheel"
			width={500}
			height={500}
			unoptimized={true}
		/>
	);
};

// Base component displaying the ferris wheel base.
const BaseSVG: React.FC = () => {
	return (
		<Image
			src="/base_new.png"
			alt="Ferris Wheel Base"
			width={300}
			height={300}
			unoptimized={true}
		/>
	);
};

const FullScreenLoading: React.FC = () => {
	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				overflow: "hidden",
				position: "relative",
				background: "darkred",
			}}
		>
			{/* Rotating ferris wheel */}
			<motion.div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}
				animate={{ rotate: 360 }}
				transition={{ duration: 8, ease: "linear", repeat: Infinity }}
			>
				<WheelSVG />
			</motion.div>
		</div>
	);
};

export default FullScreenLoading;
