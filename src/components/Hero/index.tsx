"use client";
import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";
import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "../common/Button";

const Hero = () => {
	const { isAuthenticated } = useFirebase();
	return (
		<section className="flex flex-col items-center justify-center w-full h-[35rem]">
			<Image src={Logo} width={250} height={250} alt="logo" />
			<h1 className="font-bold text-6xl">HackPSU</h1>
			<h2 className="font-bold text-2xl text-center mb-4">
				Pennsylvania State University • April 1-2, 2023
			</h2>
			{settings.isLive ? <h2>12 Hours Left</h2> : <></>}
			{!isAuthenticated ? <Button>Register</Button> : <></>}
		</section>
	);
};

export default Hero;
