"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Menu, X } from "lucide-react";

interface NavItemProps {
	href: string;
	text: string;
	isExternal?: boolean;
	onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
	href,
	text,
	isExternal = false,
	onClick,
}) => {
	const content = (
		<motion.span
			className="relative px-6 py-3 rounded-full bg-[#FFE4E6] hover:bg-[#FFB6D9] text-[#A20021] font-bold transition-all duration-300"
			style={{
				fontFamily: "Orbitron, monospace",
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -3px 6px #ff88e9cc, 0 3px 6px #ff88e9cc, inset 0 -3px 3px rgba(255, 136, 233, 0.05), inset 0 3px 3px rgba(255, 136, 233, 0.05)",
			}}
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.92 }}
		>
			{text}
		</motion.span>
	);

	if (isExternal) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClick}
				className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
			>
				{content}
			</a>
		);
	}

	return (
		<Link
			href={href}
			onClick={onClick}
			className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
		>
			{content}
		</Link>
	);
};

const MobileNavItem: React.FC<NavItemProps> = ({
	href,
	text,
	isExternal = false,
	onClick,
}) => {
	const content = (
		<motion.div
			className="w-full px-6 py-4 text-center bg-[#FFE4E6] hover:bg-[#FFB6D9] text-[#A20021] font-bold rounded-2xl mt-6"
			style={{
				fontFamily: "Orbitron, monospace",
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -3px 6px #ff88e9cc, 0 3px 6px #ff88e9cc, inset 0 -3px 3px rgba(255, 136, 233, 0.05), inset 0 3px 3px rgba(255, 136, 233, 0.05)",
			}}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
		>
			{text.toUpperCase()}
		</motion.div>
	);

	if (isExternal) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={onClick}
				className="block w-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
			>
				{content}
			</a>
		);
	}

	return (
		<Link
			href={href}
			onClick={onClick}
			className="block w-full focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
		>
			{content}
		</Link>
	);
};

const MLHBanner: React.FC = () => (
	<motion.a
		href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=white"
		target="_blank"
		rel="noopener noreferrer"
		className="focus:outline-none focus:ring-4 focus:ring-[#FFB6D9]/50 rounded-lg"
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		initial={{ opacity: 0, x: 20 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.6, delay: 0.4 }}
	>
		<Image
			src="https://s3.amazonaws.com/logged-assets/trust-badge/2026/mlh-trust-badge-2026-white.svg"
			alt="Major League Hacking 2026 Hackathon Season"
			width={120}
			height={120}
			className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 drop-shadow-2xl"
		/>
	</motion.a>
);

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isAuthenticated, isLoading } = useFirebase();
	const pathname = usePathname();
	const router = useRouter();
	const isHome = pathname === "/";

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	useEffect(() => {
		if (isMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isMenuOpen]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isMenuOpen]);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	const getNavItems = (): NavItemProps[] => {
		const baseItems: NavItemProps[] = [
			{ href: isHome ? "#info" : "/#info", text: "About" },
			{ href: isHome ? "#schedule" : "/#schedule", text: "Schedule" },
			{ href: isHome ? "#prizes" : "/#prizes", text: "Prizes" },
			{ href: isHome ? "#sponsors" : "/#sponsors", text: "Sponsors" },
			{ href: isHome ? "#faq" : "/#faq", text: "FAQ" },
		];

		const authItem: NavItemProps =
			!isLoading && isAuthenticated
				? { href: "/profile", text: "Profile" }
				: { href: "/profile", text: "Register" };

		// Only show photos link for authenticated users (keeps homepage clean for guests)
		const photosItem =
			!isLoading && isAuthenticated
				? {
						href: "https://go.hackpsu.org/photos",
						text: "Photos",
						isExternal: true,
					}
				: null;

		return photosItem
			? [...baseItems, photosItem, authItem]
			: [...baseItems, authItem];
	};

	const navItems = getNavItems();

	return (
		<>
			{/* Main Navbar */}
			<motion.nav
				className="relative w-full bg-[#180249] backdrop-blur-md z-40"
				style={{
					borderBottom: "2px solid #ff88e9ff",
					boxShadow:
						"0 8px 15px #ff88e9ff, inset 0 8px 8px rgba(255, 136, 233, 0.1)",
				}}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-24">
						{/* Logo */}
						<motion.div
							className="flex-shrink-0"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<Link
								href="/"
								className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-xl"
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Image
										src="/logo.png"
										alt="HackPSU Logo"
										width={100}
										height={100}
										className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
										priority
									/>
								</motion.div>
							</Link>
						</motion.div>

						{/* Desktop Navigation */}
						<motion.div
							className="hidden md:flex items-center space-x-6"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							{navItems.map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
								>
									<NavItem
										href={item.href}
										text={item.text}
										isExternal={item.isExternal}
									/>
								</motion.div>
							))}
						</motion.div>

						{/* MLH Banner (Desktop) */}
						<div className="hidden lg:block translate-y-[18%]">
							<MLHBanner />
						</div>

						{/* Mobile Menu Button */}
						<motion.button
							onClick={toggleMenu}
							className="md:hidden p-3 rounded-full bg-[#FFE4E6] hover:bg-[#FFB6D9] border-2 border-[#FF91A4] text-[#A20021] shadow-lg focus:outline-none focus:ring-4 focus:ring-[#FFB6D9]/50"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<AnimatePresence mode="wait">
								{isMenuOpen ? (
									<motion.div
										key="close"
										initial={{ rotate: -90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: 90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<X size={24} />
									</motion.div>
								) : (
									<motion.div
										key="menu"
										initial={{ rotate: 90, opacity: 0 }}
										animate={{ rotate: 0, opacity: 1 }}
										exit={{ rotate: -90, opacity: 0 }}
										transition={{ duration: 0.2 }}
									>
										<Menu size={24} />
									</motion.div>
								)}
							</AnimatePresence>
						</motion.button>
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu Overlay */}
			<AnimatePresence>
				{isMenuOpen && (
					<motion.div
						className="fixed inset-0 z-50 md:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						{/* Backdrop */}
						<motion.div
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={toggleMenu}
						/>

						{/* Menu Content */}
						<motion.div
							className="absolute top-24 left-0 right-0 bottom-0 bg-[#180249] border-t-4 border-[#FFB6D9] shadow-2xl overflow-y-auto"
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className="px-6 py-8 space-y-4 min-h-full">
								{navItems.map((item, index) => (
									<motion.div
										key={index}
										initial={{ x: -20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={{ delay: index * 0.1, duration: 0.3 }}
									>
										<MobileNavItem
											href={item.href}
											text={item.text}
											isExternal={item.isExternal}
											onClick={toggleMenu}
										/>
									</motion.div>
								))}

								{/* MLH Banner for Mobile */}
								<motion.div
									className="flex justify-center pt-4"
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
								>
									<MLHBanner />
								</motion.div>

								{/* Close instruction */}
								<motion.p
									className="text-center text-[#A20021]/70 text-sm pt-4"
									style={{ fontFamily: "Orbitron, monospace" }}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{
										delay: (navItems.length + 1) * 0.1,
										duration: 0.3,
									}}
								>
									Tap outside or press ESC to close
								</motion.p>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
