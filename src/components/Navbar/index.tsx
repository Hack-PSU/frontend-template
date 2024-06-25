"use client";
import Image from "next/image";

import useScroll from "@/lib/hooks/use-scroll";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import Logo from "../../../public/logo.png";
import blankButton from "../../../public/images/buttons/BUTTON_BLANK.png";

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
			<button className="relative">
				<Image
					src={src}
					width={150}
					height={50}
					alt={alt}
					className="navbar-button w-full h-full"
				/>
				<span
					className="absolute inset-0 transform -translate-y-2.5 flex items-center justify-center cornerstone-font font-bold text-xs md:text-sm xl:text-lg pointer-events-none"
					style={{ color: "#2d82a1" }}
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

	const buttonImages = [
		{
			href: "#faq",
			alt: "info",
			text: "info",
			isExternal: false,
		},
		{
			href: "#schedule",
			alt: "schedule",
			text: "schedule",
			isExternal: false,
		},
		{
			href: "#prizes",
			alt: "prizes",
			text: "prizes",
			isExternal: false,
		},
		{
			href: "#sponsors",
			alt: "sponsors",
			text: "sponsors",
			isExternal: false,
		},
		{
			href: "#workshops",
			alt: "workshops",
			text: "workshops",
			isExternal: false,
		},
	];

  // Uncomment this to enable registration on Navbar
	/*if (userDataLoaded && isAuthenticated) {
		buttonImages.push({
			href: "/register",
			alt: "register",
			text: "register",
			isExternal: false,
		});
		buttonImages.push({
			href: "/",
			alt: "signout",
			text: "signout",
			isExternal: false,
		});
	} else {
		buttonImages.push({
			href: "/signin",
			alt: "signin",
			text: "signin",
			isExternal: false,
		});
		buttonImages.push({
			href: "/signup",
			alt: "signup",
			text: "signup",
			isExternal: false,
		});
	}*/

	return (
		<nav
			className={`navbar ${
				scrolled ? "navbar-scrolled" : ""
			} sticky top-0 w-full p-2 justify-evenly md:h-24 hidden md:block ${
				scrolled ? "border-b border-gray-200 backdrop-blur-xl" : "bg-white/0"
			} z-30 transition-all`}
		>
			<div className="flex flex-row justify-evenly mr-[150px]">
				<a href="/">
					<Image src={Logo} width={90} height={90} alt="logo" />
				</a>

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
		</nav>
	);
}

const MLHBadge = () => (
	<a
		id="mlh-trust-badge"
		className="mlh-badge"
		href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2024-season&utm_content=white"
		target="_blank"
		rel="noopener noreferrer"
	>
		<Image
			src="https://s3.amazonaws.com/logged-assets/trust-badge/2024/mlh-trust-badge-2024-white.svg"
			alt="Major League Hacking 2024 Hackathon Season"
			width={100}
			height={100}
		/>
	</a>
);
