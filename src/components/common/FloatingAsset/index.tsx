"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FloatingAssetProps {
	src: string;
	alt: string;
	className?: string;
	width: number;
	height: number;
	isLink?: boolean;
	href?: string;
	delay?: number;
	duration?: number;
}

const FloatingAsset: React.FC<FloatingAssetProps> = ({
	src,
	alt,
	className = "",
	width,
	height,
	isLink = false,
	href,
	delay = 0,
	duration = 5,
}) => {
	const image = (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			className="h-auto w-full"
		/>
	);
	const shouldLink = isLink && Boolean(href);

	return (
		<motion.div
			className={`${shouldLink ? "" : "pointer-events-none"} absolute z-[5] hidden lg:block ${className}`}
			animate={{ y: [0, -16, 0] }}
			transition={{
				duration,
				delay,
				ease: "easeInOut",
				repeat: Infinity,
			}}
		>
			{shouldLink ? (
				<a href={href} title={alt} target="_blank" rel="noopener noreferrer">
					{image}
				</a>
			) : (
				image
			)}
		</motion.div>
	);
};

export default FloatingAsset;
