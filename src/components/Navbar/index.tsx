"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Menu, X } from "lucide-react";
import { useFlagState } from "@/lib/api/flag/hook";

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
			className="relative px-3 py-3 rounded-full bg-transparent hover:text-[#E2C75E] text-[#EEE5CD] font-bold transition-all duration-300"
			style={{
				fontFamily: "Orbitron, monospace",
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
			className="w-full px-6 py-4 text-center bg-[rgba(17,16,34,0.72)] hover:bg-[rgba(182,102,60,0.18)] text-[#EEE5CD] font-bold rounded-2xl mt-6 border border-[rgba(226,199,94,0.18)] shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
			style={{
				fontFamily: "Orbitron, monospace",
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
		href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
		target="_blank"
		rel="noopener noreferrer"
		className="focus:outline-none focus:ring-4 focus:ring-[rgba(100,165,195,0.35)] rounded-lg"
		whileHover={{ scale: 1.05 }}
		whileTap={{ scale: 0.95 }}
		initial={{ opacity: 0, x: 20 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.6, delay: 0.4 }}
	>
		<Image
			src="/fa26/logo+assets/mlh-badge.svg"
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
	const { data: registrationsFlagData, isLoading: isLoadingRegistrationsFlag } =
		useFlagState("Registrations");
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

		const authItem: NavItemProps | null =
			!isLoading && isAuthenticated
				? { href: "/profile", text: "Profile" }
				: !isLoading &&
					  isLoadingRegistrationsFlag === false &&
					  registrationsFlagData?.isEnabled
					? { href: "/profile", text: "Register" }
					: !isLoading &&
						  isLoadingRegistrationsFlag === false &&
						  !registrationsFlagData?.isEnabled &&
						  !isAuthenticated
						? {
								href: "https://auth.hackpsu.org",
								text: "Login",
								isExternal: true,
							}
						: null;

		// Only show photos link for authenticated users (keeps homepage clean for guests)
		const photosItem =
			!isLoading && isAuthenticated
				? {
						href: "https://go.hackpsu.org/photos",
						text: "Photos",
						isExternal: true,
					}
				: null;

		return [
			...baseItems,
			...(photosItem ? [photosItem] : []),
			...(authItem ? [authItem] : []),
		];
	};

	const navItems = getNavItems();

	return (
		<>
			{/* Main Navbar */}
			<motion.nav
				className={`w-full z-40 ${
					isHome
						? "absolute inset-x-0 top-0 bg-transparent backdrop-blur-none"
						: "relative bg-[#180249] backdrop-blur-md"
				}`}
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
										src="/fa26/logo+assets/fa26-logo.png"
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
							className="hidden md:flex items-center space-x-6 ml-14"
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
							className="md:hidden p-3 rounded-full bg-[rgba(17,16,34,0.78)] hover:bg-[rgba(182,102,60,0.22)] border border-[rgba(226,199,94,0.28)] text-[#EEE5CD] shadow-[0_10px_24px_rgba(0,0,0,0.25)] focus:outline-none focus:ring-4 focus:ring-[rgba(100,165,195,0.35)]"
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
										style={{ color: "#B6663C" }}
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
										style={{ color: "#EEE5CD" }}
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
							className="absolute inset-0 bg-[#111022]/70 backdrop-blur-md"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={toggleMenu}
						/>

						{/* Menu Content */}
						<motion.div
							className="absolute top-24 left-0 right-0 overflow-y-auto border-t border-[rgba(226,199,94,0.18)]"
							style={{
								background:
									"linear-gradient(180deg, rgba(17,16,34,0.98) 0%, rgba(47,35,75,0.97) 100%)",
								boxShadow: "0 24px 50px rgba(0,0,0,0.35)",
							}}
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
									className="text-center text-[#EEE5CD]/80 text-sm pt-4"
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
