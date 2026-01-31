"use client";
import React from "react";
import { motion } from "framer-motion";

const FullScreenLoading: React.FC = () => {
	return (
		<div
			className="w-full h-screen overflow-hidden relative flex items-center justify-center"
			style={{
				background:
					"linear-gradient(to bottom, #1a0033 0%, #2d1b4e 50%, #0a001a 100%)",
			}}
		>
			{/* Loading Text */}
			<motion.div
				className="absolute text-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: [0, 1, 0] }}
				transition={{
					duration: 2,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			>
				<h2
					className="text-2xl md:text-4xl font-bold text-white mb-4"
					style={{
						textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
					}}
				>
					Loading...
				</h2>
				<div className="flex justify-center space-x-2">
					{[0, 1, 2].map((index) => (
						<motion.div
							key={index}
							className="w-3 h-3 bg-white rounded-full"
							initial={{ scale: 0.8, opacity: 0.5 }}
							animate={{
								scale: [0.8, 1.2, 0.8],
								opacity: [0.5, 1, 0.5],
							}}
							transition={{
								duration: 1.5,
								ease: "easeInOut",
								repeat: Infinity,
								delay: index * 0.2,
							}}
						/>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default FullScreenLoading;
