"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const FullScreenLoading: React.FC = () => {
	return (
		<div
			className="w-full h-screen overflow-hidden relative flex items-center justify-center"
			style={{
				background: "linear-gradient(to bottom, #B1E8FF 0%, #84cefe 50%, #215172 100%)"
			}}
		>
			{/* Animated Beach Ball */}
			<motion.div
				className="absolute z-20"
				style={{
					width: "clamp(80px, 12vw, 120px)",
					height: "clamp(80px, 12vw, 120px)",
				}}
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{
					duration: 3,
					ease: "linear",
					repeat: Infinity,
				}}
			>
				<Image
					src="/f25/ball.png"
					alt="Beach Ball Loading"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Floating Starfish */}
			<motion.div
				className="absolute z-10"
				style={{
					width: "clamp(60px, 8vw, 80px)",
					height: "clamp(60px, 8vw, 80px)",
					left: "20%",
					top: "30%",
				}}
				initial={{ opacity: 0.7, y: 0 }}
				animate={{ 
					opacity: [0.7, 1, 0.7],
					y: [0, -20, 0],
					rotate: [0, 10, -10, 0]
				}}
				transition={{
					duration: 4,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			>
				<Image
					src="/f25/starfish.png"
					alt="Floating Starfish"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Swimming Fish */}
			<motion.div
				className="absolute z-10"
				style={{
					width: "clamp(50px, 7vw, 70px)",
					height: "clamp(50px, 7vw, 70px)",
					right: "25%",
					top: "40%",
				}}
				initial={{ x: -100, opacity: 0 }}
				animate={{ 
					x: [0, 50, 0],
					opacity: [0, 1, 0.8, 1],
					y: [0, -10, 5, 0]
				}}
				transition={{
					duration: 5,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			>
				<Image
					src="/f25/fish.png"
					alt="Swimming Fish"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Dancing Crab */}
			<motion.div
				className="absolute z-10"
				style={{
					width: "clamp(40px, 6vw, 60px)",
					height: "clamp(40px, 6vw, 60px)",
					left: "70%",
					bottom: "35%",
				}}
				initial={{ rotate: 0 }}
				animate={{ 
					rotate: [5, -5, 5, -5, 5],
					y: [0, -8, 0],
					scale: [1, 1.1, 1]
				}}
				transition={{
					duration: 2,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			>
				<Image
					src="/f25/5.png"
					alt="Dancing Crab"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Floating Surfboard */}
			<motion.div
				className="absolute z-5"
				style={{
					width: "clamp(70px, 10vw, 100px)",
					height: "clamp(70px, 10vw, 100px)",
					left: "15%",
					bottom: "25%",
				}}
				initial={{ rotate: -10 }}
				animate={{ 
					rotate: [-10, 10, -10],
					y: [0, -15, 0],
					x: [0, 10, 0]
				}}
				transition={{
					duration: 6,
					ease: "easeInOut",
					repeat: Infinity,
				}}
			>
				<Image
					src="/f25/surfboard.png"
					alt="Floating Surfboard"
					fill
					className="object-contain"
				/>
			</motion.div>

			{/* Loading Text */}
			<motion.div
				className="absolute bottom-20 text-center"
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
						fontFamily: "Monomaniac One, monospace",
						textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
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
								opacity: [0.5, 1, 0.5]
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

			{/* Animated Waves at Bottom */}
			<div className="absolute bottom-0 w-full h-32 overflow-hidden">
				<motion.div
					className="absolute bottom-0 w-full h-full"
					style={{
						background: "linear-gradient(to top, rgba(33,81,114,0.8) 0%, transparent 100%)"
					}}
					initial={{ x: "-100%" }}
					animate={{ x: "100%" }}
					transition={{
						duration: 8,
						ease: "linear",
						repeat: Infinity,
					}}
				/>
				<motion.div
					className="absolute bottom-0 w-full h-3/4"
					style={{
						background: "linear-gradient(to top, rgba(0,218,183,0.6) 0%, transparent 100%)"
					}}
					initial={{ x: "100%" }}
					animate={{ x: "-100%" }}
					transition={{
						duration: 6,
						ease: "linear",
						repeat: Infinity,
					}}
				/>
			</div>
		</div>
	);
};

export default FullScreenLoading;
