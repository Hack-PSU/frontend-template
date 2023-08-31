"use client";
import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";
import useScroll from "@/lib/hooks/use-scroll";
import Link from "next/link";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "@/components/common/Button";
import { UserCircleIcon } from "@heroicons/react/20/solid";

export default function Navbar() {
	const scrolled = useScroll(50);

	const { logout, isAuthenticated } = useFirebase();

	return (
		<nav
			className={`fixed top-0 w-full flex flex-row items-center p-2 px-16 justify-between ${
				scrolled
					? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
					: "bg-white/0"
			} z-30 transition-all`}
		>
			<Link href="/">
				<Image src={Logo} width={50} height={50} alt="logo" />
			</Link>
			{isAuthenticated ? (
				<div className="flex flex-row h-full items-center gap-8">
					<Link href="/profile">
						<UserCircleIcon className="h-12 w-12 mt-1" />
					</Link>
					<Button onClick={() => logout()}>Sign Out</Button>
				</div>
			) : (
				<Link href="/signin">
					<Button>Sign In</Button>
				</Link>
			)}
		</nav>
	);
}
