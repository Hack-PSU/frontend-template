"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAllSponsors } from "@/lib/api/sponsor/hook";
import { SponsorEntity } from "@/lib/api/sponsor/entity";

// Define sponsor tier levels and their visual properties
const TIER_CONFIG = {
	title: {
		priority: 1,
		maxLogos: 1,
		logoSize: "w-80 h-32 md:w-96 md:h-40 lg:w-[28rem] lg:h-48",
		containerBg: "bg-white",
		borderColor: "border-[#FFE4B5]",
		shadowColor: "shadow-lg",
	},
	platinum: {
		priority: 2,
		maxLogos: 2,
		logoSize: "w-64 h-24 md:w-72 md:h-28 lg:w-80 lg:h-32",
		containerBg: "bg-white",
		borderColor: "border-[#E6E6FA]",
		shadowColor: "shadow-lg",
	},
	gold: {
		priority: 3,
		maxLogos: 3,
		logoSize: "w-56 h-20 md:w-64 md:h-24 lg:w-72 lg:h-28",
		containerBg: "bg-white",
		borderColor: "border-[#FFE4B5]",
		shadowColor: "shadow-lg",
	},
	silver: {
		priority: 4,
		maxLogos: 4,
		logoSize: "w-48 h-16 md:w-56 md:h-20 lg:w-64 lg:h-24",
		containerBg: "bg-white",
		borderColor: "border-[#F0F0F0]",
		shadowColor: "shadow-lg",
	},
	bronze: {
		priority: 5,
		maxLogos: 6,
		logoSize: "w-40 h-12 md:w-48 md:h-16 lg:w-56 lg:h-20",
		containerBg: "bg-white",
		borderColor: "border-[#FFEFD5]",
		shadowColor: "shadow-lg",
	},
	partner: {
		priority: 6,
		maxLogos: 8,
		logoSize: "w-32 h-10 md:w-40 md:h-12 lg:w-48 lg:h-16",
		containerBg: "bg-white",
		borderColor: "border-[#FFE4E6]",
		shadowColor: "shadow-lg",
	},
};

interface SponsorCardProps {
	sponsor: SponsorEntity;
	tierConfig: (typeof TIER_CONFIG)[keyof typeof TIER_CONFIG];
	index: number;
}

const SponsorCard: React.FC<SponsorCardProps> = ({
	sponsor,
	tierConfig,
	index,
}) => {
	const handleClick = () => {
		if (sponsor.link) {
			window.open(sponsor.link, "_blank", "noopener,noreferrer");
		}
	};

	return (
		<motion.div
			className={`
				relative p-6 rounded-2xl border-2 ${tierConfig.borderColor} ${tierConfig.containerBg} 
				${tierConfig.shadowColor} cursor-pointer transition-all duration-300
				hover:shadow-xl hover:scale-105 active:scale-95
			`}
			onClick={handleClick}
			initial={{ opacity: 0, y: 20, scale: 0.9 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{
				duration: 0.6,
				delay: index * 0.1,
				type: "spring",
				stiffness: 100,
			}}
			whileHover={{
				scale: 1.05,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.95 }}
		>
			{/* Logo container */}
			<div className="flex items-center justify-center h-full">
				<div
					className={`relative ${tierConfig.logoSize} flex items-center justify-center`}
				>
					<Image
						src={sponsor.darkLogo || sponsor.lightLogo || ""}
						alt={sponsor.name}
						fill
						className="object-contain drop-shadow-lg"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			</div>
		</motion.div>
	);
};

interface SponsorTierProps {
	tierKey: keyof typeof TIER_CONFIG;
	sponsors: SponsorEntity[];
	index: number;
}

const SponsorTier: React.FC<SponsorTierProps> = ({
	tierKey,
	sponsors,
	index,
}) => {
	const tierConfig = TIER_CONFIG[tierKey];

	if (sponsors.length === 0) return null;

	// Create grid layout based on number of sponsors and tier configuration
	const getGridCols = () => {
		const count = Math.min(sponsors.length, tierConfig.maxLogos);
		if (count === 1) return "grid-cols-1";
		if (count === 2) return "grid-cols-1 md:grid-cols-2";
		if (count <= 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
		if (count <= 4) return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
		if (count <= 6)
			return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";
		return "grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8";
	};

	return (
		<motion.div
			className="w-full mb-16"
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8, delay: index * 0.2 }}
		>
			{/* Sponsors Grid */}
			<div
				className={`grid ${getGridCols()} gap-8 justify-items-center max-w-7xl mx-auto`}
			>
				{sponsors.slice(0, tierConfig.maxLogos).map((sponsor, sponsorIndex) => (
					<SponsorCard
						key={sponsor.id}
						sponsor={sponsor}
						tierConfig={tierConfig}
						index={sponsorIndex}
					/>
				))}
			</div>
		</motion.div>
	);
};

const Sponsors: React.FC = () => {
	const { data: sponsors, isLoading, error } = useAllSponsors();

	// Group sponsors by tier level
	const sponsorsByTier = useMemo(() => {
		if (!sponsors) return {};

		const grouped: Record<string, SponsorEntity[]> = {};

		sponsors.forEach((sponsor) => {
			const level = sponsor.level.toLowerCase();
			if (!grouped[level]) {
				grouped[level] = [];
			}
			grouped[level].push(sponsor);
		});

		// Sort each tier by order
		Object.keys(grouped).forEach((tier) => {
			grouped[tier].sort((a, b) => a.order - b.order);
		});

		return grouped;
	}, [sponsors]);

	if (isLoading) {
		return (
			<section
				id="sponsors"
				className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw] min-h-[20vh]"
				style={{ backgroundColor: "white" }}
			>
				<motion.div
					className="text-xl text-[#048A81] font-medium"
					style={{ fontFamily: "Monomaniac One, monospace" }}
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					Loading...
				</motion.div>
			</section>
		);
	}

	if (error || !sponsors) {
		return null;
	}

	return (
		<section
			id="sponsors"
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw]"
			style={{ backgroundColor: "#215172" }}
		>
			{/* Hacky Diver Image */}
			<motion.div
				className="absolute top-1/2 transform -translate-y-1/2 z-10"
				style={{
					left: "clamp(0.5rem, 2vw, 2rem)",
				}}
				initial={{ opacity: 0, x: -50 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8, delay: 0.5 }}
			>
				<Image
					src="/f25/hacky_diver.png"
					alt="Hacky Diver"
					width={200}
					height={300}
					className="object-contain"
					style={{
						width: "clamp(80px, 12vw, 200px)",
						height: "auto",
					}}
				/>
			</motion.div>

			{/* Glowing Decorative Images - f25/1.png */}
			<motion.div
				className="absolute z-10"
				style={{
					top: "clamp(2rem, 8vw, 8rem)",
					right: "clamp(1rem, 6vw, 6rem)",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{
					opacity: 1,
					scale: 1,
					y: [-8, 8, -8],
					filter: [
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
						"drop-shadow(0 0 12px rgba(255,255,255,0.8))",
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					],
				}}
				transition={{
					duration: 2.5,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			>
				<Image
					src="/f25/1.png"
					alt="Glowing decoration"
					width={120}
					height={120}
					className="object-contain"
					style={{
						width: "clamp(60px, 8vw, 120px)",
						height: "auto",
						filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					}}
				/>
			</motion.div>

			<motion.div
				className="absolute z-10"
				style={{
					bottom: "clamp(2rem, 8vw, 8rem)",
					left: "clamp(1rem, 3vw, 3rem)",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{
					opacity: 1,
					scale: 1,
					y: [-6, 6, -6],
					filter: [
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
						"drop-shadow(0 0 12px rgba(255,255,255,0.8))",
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 0.5,
				}}
			>
				<Image
					src="/f25/1.png"
					alt="Glowing decoration"
					width={120}
					height={120}
					className="object-contain"
					style={{
						width: "clamp(50px, 7vw, 100px)",
						height: "auto",
						filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					}}
				/>
			</motion.div>

			<motion.div
				className="absolute z-10"
				style={{
					top: "clamp(12rem, 25vw, 25rem)",
					right: "clamp(8rem, 15vw, 15rem)",
				}}
				initial={{ opacity: 0, scale: 0.8 }}
				animate={{
					opacity: 1,
					scale: 1,
					y: [-10, 10, -10],
					filter: [
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
						"drop-shadow(0 0 12px rgba(255,255,255,0.8))",
						"drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					],
				}}
				transition={{
					duration: 2.8,
					repeat: Infinity,
					ease: "easeInOut",
					delay: 1,
				}}
			>
				<Image
					src="/f25/1.png"
					alt="Glowing decoration"
					width={120}
					height={120}
					className="object-contain"
					style={{
						width: "clamp(40px, 6vw, 80px)",
						height: "auto",
						filter: "drop-shadow(0 0 4px rgba(255,255,255,0.4))",
					}}
				/>
			</motion.div>

			{/* Main Content */}
			<div className="w-full max-w-7xl mx-auto">
				{/* Sponsor Pyramid */}
				<div className="space-y-8">
					{Object.entries(TIER_CONFIG).map(([tierKey, config], index) => {
						const tierSponsors = sponsorsByTier[tierKey] || [];
						return (
							<SponsorTier
								key={tierKey}
								tierKey={tierKey as keyof typeof TIER_CONFIG}
								sponsors={tierSponsors}
								index={index}
							/>
						);
					})}
				</div>

				{/* Call to Action */}
				<motion.div
					className="text-center mt-16"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1 }}
				>
					<motion.button
						className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
						style={{ fontFamily: "Monomaniac One, monospace" }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => window.open("https://sponsor.hackpsu.org", "_blank")}
					>
						Click here to become a sponsor!
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
};

export default Sponsors;
