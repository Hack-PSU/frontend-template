"use client";

import React from "react";
import Image from "next/image";
import { Marquee } from "./marquee";

interface CarouselProps {
	/** Array of image URLs (e.g. ['/images/carousel/1.jpg', '/images/carousel/2.jpg', ...]) */
	images: string[];
	/** Variant for different styling - 'default' for home page, 'photos' for photos page */
	variant?: "default" | "photos";
}

const PhotoGallery: React.FC<CarouselProps> = ({
	images,
	variant = "default",
}) => {
	// Split images into two rows: first 12 for row 1, next 12 for row 2
	const firstRow = images.slice(0, 12);
	const secondRow = images.slice(12, 24);

	return (
		<section
			className={`w-full overflow-hidden py-8 md:py-16`}
			style={{
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -8px 15px #ff88e9ff, 0 8px 15px #ff88e9ff, inset 0 -8px 8px rgba(255, 136, 233, 0.1), inset 0 8px 8px rgba(255, 136, 233, 0.1)",
			}}
		>
			{/* Header */}
			<div className="text-center mb-8">
				<h1
					className={`text-4xl md:text-5xl font-bold mb-3 text-[#2f234bff] mx-auto`}
					style={{
						fontFamily: "Orbitron, monospace",
						backgroundColor: "#ffffff",
						borderRadius: "12px",
						padding: "0.5rem 1rem",
						width: "fit-content",
					}}
				>
					Gallery
				</h1>
				<div className={`w-16 h-1 rounded-full mx-auto`}></div>
			</div>

			{/* First Row */}
			<Marquee pauseOnHover={true} repeat={4}>
				{firstRow.map((src, idx) => (
					<div key={idx} className="relative h-48 w-64 flex-shrink-0">
						<Image
							src={src}
							alt={`Event photo ${idx + 1}`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover rounded-xl shadow-lg"
							loading="lazy"
						/>
					</div>
				))}
			</Marquee>

			{/* Second Row */}
			<Marquee pauseOnHover={true} repeat={4} reverse>
				{secondRow.map((src, idx) => (
					<div key={idx + 12} className="relative h-48 w-64 flex-shrink-0">
						<Image
							src={src}
							alt={`Event photo ${idx + 13}`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover rounded-xl shadow-lg"
							loading="lazy"
						/>
					</div>
				))}
			</Marquee>
		</section>
	);
};

export default PhotoGallery;
