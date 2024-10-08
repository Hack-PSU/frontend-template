"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import useScroll from "@/lib/hooks/use-scroll";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import Logo from "../../../public/FA24_logo.png";
import blankButton from "../../../public/navbar_button_FINAL.png";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";

import "./navbar.css";

interface NavbarButtonProps {
	href: string;
	alt: string;
	src?: any;
	isExternal?: boolean;
	children?: React.ReactNode;
	onClick?: () => void;
}

const NavbarButton: React.FC<NavbarButtonProps> = ({
	href,
	src = blankButton,
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
		>
			<button className="relative transition-transform duration-300 hover:scale-110 hover:-translate-y-1.5 mt-[-20px]">
				<Image
					src={src}
					width={150}
					height={50}
					alt={alt}
					className="navbar-button w-full h-full"
				/>
				<span
					className="absolute inset-0 mt-[-5px] flex items-center justify-center rye-font text-xs md:text-sm xl:text-md transition-transform duration-300 hover:scale-110 hover:-translate-y-1.5"
					style={{ color: "#800000" }}
				>
					{(children as string).toUpperCase()}
				</span>
			</button>
		</a>
	);
};

export default function Navbar() {
	const scrolled = useScroll(50);
	const { logout, isAuthenticated, userDataLoaded } = useFirebase();

	const pathname = usePathname();
	const isHome: boolean = pathname === "/";

	const router = useRouter();

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
	];

	// Uncomment this to enable registration on Navbar
	if (userDataLoaded && isAuthenticated) {
		buttonImages.push({
			href: "/profile",
			alt: "profile",
			text: "profile",
			isExternal: false,
		});
	} else {
		buttonImages.push({
			href: "/signin",
			alt: "register",
			text: "register",
			isExternal: false,
		});
	}

	return (
		<nav
			className={`navbar ${
				scrolled ? "navbar-scrolled" : ""
			} sticky top-0 w-full p-2 justify-evenly md:h-24 md:block ${
				scrolled ? "border-b border-gray-200 backdrop-blur-xl" : "bg-white/0"
			} z-30 transition-all`}
		>
			<div className="flex flex-row md:justify-evenly md:mr-[150px] md:px-0">
				<a href="/">
					<Image src={Logo} width={90} height={90} alt="logo" />
				</a>

				{/* Home button for mobile */}
				<div className="md:hidden flex justify-end w-full">
					<button
						className="text-white"
						onClick={() => router.push("/")}
						aria-label="Toggle Menu"
					>
						<HomeIcon fontSize="large" />
					</button>
				</div>

				<div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8">
					{buttonImages.map(({ href, alt, text, isExternal }, index) => (
						<NavbarButton
							key={index}
							href={href}
							alt={alt}
							isExternal={isExternal}
							onClick={text === "signout" ? logout : undefined}
						>
							{text}
						</NavbarButton>
					))}
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
