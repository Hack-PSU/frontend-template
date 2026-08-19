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
		<section className={`w-full overflow-hidden py-8 md:py-16`} style={{}}>
			{/* Header */}
			<div className="text-center mb-8">
				<h1
					className="text-4xl md:text-8xl font-bold text-[#EEE5CD] mb-3"
					style={{
						fontFamily: "Barlow Condensed",
						borderRadius: "12px",
						padding: "0.5rem 1rem",
					}}
				>
					<span style={{ color: "#EEE5CD" }}>Mission</span>{" "}
					<span style={{ color: "#E2C75E" }}>Memories</span>{" "}
				</h1>
				<div
						className=""
						style={{
							fontFamily: "'DM Sans', sans-serif",
							fontSize: "clamp(15px, 1.8vw, 20px)",
							lineHeight: 1.5,
							color: "#EEE5CD",
						}}
						
					>
						Photographs taken during previous expeditions. Proof that something extraordinary happens there.
					</div>
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
