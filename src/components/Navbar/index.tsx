"use client";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";

import useScroll from "@/lib/hooks/use-scroll";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import Logo from "../../../public/images/LOGO_SP24_OLD_NoBG.png";
import infoButton from "../../../public/images/buttons/BUTTON_INFO.png";
import scheduleButton from "../../../public/images/buttons/BUTTON_SCHEDULE.png";
import prizesButton from "../../../public/images/buttons/BUTTON_PRIZES.png";
import registerButton from "../../../public/images/buttons/BUTTON_REGISTER.png";
import sponsorsButton from "../../../public/images/buttons/BUTTON_SPONSORS.png";
import workshopsButton from "../../../public/images/buttons/BUTTON_WORKSHOPS.png";
import loginButton from "../../../public/images/buttons/BUTTON_LOGIN.png";
import blankButton from "../../../public/images/buttons/BUTTON_BLANK.png";
import "./navbar.css";

const buttonImages = [
	{
		href: "#faq",
		src: infoButton,
		alt: "info",
		isExternal: false,
	},
	{
		href: "#schedule",
		src: scheduleButton,
		alt: "schedule",
		isExternal: false,
	},
	{
		href: "#prizes",
		src: prizesButton,
		alt: "prizes",
		isExternal: false,
	},
	{
		href: "#sponsors",
		src: sponsorsButton,
		alt: "sponsors",
		isExternal: false,
	},
	{
		href: "#schedule",
		src: workshopsButton,
		alt: "workshops",
		isExternal: false,
	},
	{
		href: "https://register.hackpsu.org/register",
		src: registerButton,
		alt: "register",
		isExternal: true,
	},
];

const NavbarButton = ({
	href,
	src,
	alt,
	isExternal = false,
}: {
	href: string;
	src: any;
	alt: string;
	isExternal?: boolean;
}) => (
	<a
		href={href}
		target={isExternal ? "_blank" : "_self"}
		rel={isExternal ? "noopener noreferrer" : undefined}
	>
		<button>
			<Image
				src={src}
				width={150}
				height={50}
				alt={alt}
				className="navbar-button"
			/>
		</button>
	</a>
);

export default function Navbar() {
	const scrolled = useScroll(50);
	const { logout, isAuthenticated } = useFirebase();

	return (
		<nav
			className={`navbar ${
				scrolled ? "navbar-scrolled" : ""
			} sticky top-0 w-full p-2 justify-evenly md:h-24 hidden md:block  ${
				scrolled
					? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
					: "bg-white/0"
			} z-30 transition-all`}
		>
			<div className="flex flex-row justify-evenly mr-10">
				<a>
					<Image src={Logo} width={100} height={100} alt="logo" />
				</a>

				{buttonImages.map(({ href, src, alt, isExternal }, index) => (
					<NavbarButton
						key={index}
						href={href}
						src={src}
						alt={alt}
						isExternal={isExternal}
					/>
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
