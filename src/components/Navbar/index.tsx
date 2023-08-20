"use client";
import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";
import useScroll from "@/lib/hooks/use-scroll";
// import SignInButton from "./SignInButton";

export default function Navbar() {
	const scrolled = useScroll(50);

	return (
		<>
			<div
				className={`fixed top-0 w-full flex flex-row items-center p-2 px-16 justify-between ${
					scrolled
						? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
						: "bg-white/0"
				} z-30 transition-all`}
			>
				<Image src={Logo} width={50} height={50} alt="logo" />
				{/* <SignInButton /> */}
			</div>
		</>
	);
}
