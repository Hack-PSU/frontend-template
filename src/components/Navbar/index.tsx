"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useScroll from "@/lib/hooks/use-scroll";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";

interface NavbarButtonProps {
	href: string;
	alt: string;
	isExternal?: boolean;
	children: string;
	onClick?: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
	href,
	alt,
	isExternal = false,
	children,
	onClick,
}) => {
	return (
		<a
			href={href}
			target={isExternal ? "_blank" : "_self"}
			rel={isExternal ? "noopener noreferrer" : undefined}
			onClick={onClick}
			className="relative transition-all duration-150 ease-in-out hover:scale-105"
		>
			<div className="relative w-40 h-24">
				{/* Using Next.js 13 "fill" prop to cover the container */}
				<Image
					src="/Navbar.svg"
					alt={alt}
					fill
					className="rounded-md object-cover"
				/>
				<span className="absolute inset-0 flex items-center justify-center font-rye text-[10px] md:text-[10px] xl:text-[12px] text-black">
					{children.toUpperCase()}
				</span>
			</div>
		</a>
	);
};

export default function Navbar() {
	const [menuOpen, setMenuOpen] = useState(false);
	const scrolled = useScroll(50);
	const { logout, isAuthenticated, isLoading, user } = useFirebase();
	const pathname = usePathname();
	const router = useRouter();
	const isHome = pathname === "/";

	const buttonImages = [
		{
			href: isHome ? "#faq" : "/#faq",
			alt: "info",
			text: "info",
			isExternal: false,
		},
		{
			href: isHome ? "#schedule" : "/#schedule",
			alt: "schedule",
			text: "schedule",
			isExternal: false,
		},
		{
			href: isHome ? "#prizes" : "/#prizes",
			alt: "prizes",
			text: "prizes",
			isExternal: false,
		},
		{
			href: isHome ? "#sponsors" : "/#sponsors",
			alt: "sponsors",
			text: "sponsors",
			isExternal: false,
		},
		{
			href: isHome ? "#workshops" : "/#workshops",
			alt: "workshops",
			text: "workshops",
			isExternal: false,
		},
		{
			href: "/signin",
			alt: "register",
			text: "register",
			isExternal: false,
		},
	];

	// Replace "register" with "profile" for authenticated users.
	if (!isLoading && isAuthenticated) {
		buttonImages.splice(5, 1, {
			href: "/profile",
			alt: "profile",
			text: "profile",
			isExternal: false,
		});
	}

	return (
		<nav
			className={`sticky top-0 w-full bg-customRed border-b-4 border-customYellow z-30 transition-all ${
				scrolled ? "shadow-md" : ""
			}`}
		>
			{/* Mobile Navbar */}
			<div className="md:hidden flex items-center justify-between h-16 px-4">
				<button
					onClick={() => router.push("/")}
					className="text-white"
					aria-label="Go Home"
				>
					<HomeIcon fontSize="large" />
				</button>
				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className="text-white"
					aria-label="Toggle Menu"
				>
					<MenuIcon fontSize="large" />
				</button>
			</div>
			{menuOpen && (
				<div className="md:hidden bg-customRed border-t border-customYellow">
					<div className="flex flex-col items-center space-y-2 p-2">
						{buttonImages.map(({ href, alt, text, isExternal }, idx) => (
							<NavbarButton
								key={idx}
								href={href}
								alt={alt}
								isExternal={isExternal}
								onClick={() => setMenuOpen(false)}
							>
								{text}
							</NavbarButton>
						))}
					</div>
				</div>
			)}

			{/* Desktop Navbar */}
			<div className="hidden md:flex items-center justify-center relative h-16">
				<div className="flex flex-row space-x-1 items-center">
					{buttonImages.slice(0, 3).map(({ href, alt, text, isExternal }, index) => (
						<NavbarButton
							key={index}
							href={href}
							alt={alt}
							isExternal={isExternal}
						>
							{text}
						</NavbarButton>
					))}
				</div>
				<a href="/" className="mx-8">
					<Image
						src="/logo.png"
						alt="Logo Background"
						width={140}
						height={140}
						className="w-auto pt-20"
					/>
				</a>
				<div className="flex flex-row space-x-1 items-center">
					{buttonImages.slice(3).map(({ href, alt, text, isExternal }, index) => (
						<NavbarButton
							key={index + 3}
							href={href}
							alt={alt}
							isExternal={isExternal}
						>
							{text}
						</NavbarButton>
					))}
				</div>
				{/* Positioned at the right */}
				<div className="absolute right-4">
					<MLHBadge />
				</div>
			</div>
		</nav>
	);
}

const MLHBadge = () => (
	<a
		id="mlh-trust-badge"
		className="mlh-badge"
		href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2025-season&utm_content=white"
		target="_blank"
		rel="noopener noreferrer"
	>
		<Image
			src="https://s3.amazonaws.com/logged-assets/trust-badge/2025/mlh-trust-badge-2025-white.svg"
			alt="Major League Hacking 2024 Hackathon Season"
			width={100}
			height={100}
		/>
	</a>
);
