"use client";
import Image from "next/image";
import Logo from "../../../public/images/LOGO_FA23_NoBG.png";
import useScroll from "@/lib/hooks/use-scroll";
import Link from "next/link";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import infoButton from "../../../public/images/buttons/BUTTON_INFO.png";
import scheduleButton from "../../../public/images/buttons/BUTTON_SCHEDULE.png";
import prizesButton from "../../../public/images/buttons/BUTTON_PRIZES.png";
import registerButton from "../../../public/images/buttons/BUTTON_REGISTER.png";
import sponsorsButton from "../../../public/images/buttons/BUTTON_SPONSORS.png";
import workshopsButton from "../../../public/images/buttons/BUTTON_WORKSHOPS.png";
import loginButton from "../../../public/images/buttons/BUTTON_LOGIN.png";
import blankButton from "../../../public/images/buttons/BUTTON_BLANK.png";

export default function Navbar() {
	const scrolled = useScroll(50);
	const { logout, isAuthenticated } = useFirebase();

	const size = 150;

	return (
		<nav
			className={`sticky top-0 w-full flex flex-row items-center p-2 px-16 justify-between ${
				scrolled
					? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
					: "bg-white/0"
			} z-30 transition-all`}
		>
			<Link href="/">
				<Image src={Logo} width={100} height={100} alt="logo" />
			</Link>

			<div className="flex flex-row gap-8">
				<a href="#schedule">
					<button>
						<Image src={scheduleButton} width={size} height={50} alt="schedule" className="navbar-button"/>
					</button>
				</a>

				<a href="#faq">
					<button>
						<Image src={infoButton} width={size} height={50} alt="info" className="navbar-button"/>
					</button>
				</a>

				<a href="#prizes">
					<button>
						<Image src={prizesButton} width={size} height={50} alt="prizes" className="navbar-button"/>
					</button>
				</a>
				<a href="#workshops">
					<button>
						<Image src={workshopsButton} width={size} height={50} alt="workshops" className="navbar-button"/>
					</button>
				</a>
				<a href="#sponsors">
					<button>
						<Image src={sponsorsButton} width={size} height={50} alt="sponsors" className="navbar-button"/>
					</button>
				</a>
				<a href="/register">
					<button>
						<Image src={registerButton} width={size} height={50} alt="register" className="navbar-button"/>
					</button>
				</a>

			</div>

			{isAuthenticated ? (
				<div className="flex flex-row h-full items-center gap-8">
					<Link href="/profile">
						<UserCircleIcon className="h-12 w-12 mt-1" />
					</Link>
					<button onClick={() => logout()}>
						<Image src={blankButton} width={size} height={50} alt="signOut" className="navbar-button"/>
					</button>
				</div>
			) : (
				<a href="/signin">
				<button>
					<Image src={loginButton} width={size} height={50} alt="signIn" className="navbar-button"/>
				</button>
				</a>
			)}
		</nav>
	);
}
