"use client";
import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";
import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "../common/Button";
import CountdownTimer from "../CountdownTimer";

const Hero = () => {
	const { isAuthenticated } = useFirebase();
	return (
		<section className="flex flex-col items-center justify-center w-full h-[35rem]">
			<div className="flex">
				<div>
					<Image src={Logo} width={350} height={350} alt="logo" />
				</div>
				<div>
					<CountdownTimer />
					<h1 className="font-bold text-6xl">HackPSU</h1>
					<h2 className="font-bold text-2xl text-center mb-4">
						Pennsylvania State University • April 1-2, 2023
					</h2>
					{settings.isLive ? <h2>12 Hours Left</h2> : <></>}
					{!isAuthenticated ? <Button>Register</Button> : <></>}
				</div>
			</div>
		</section>
	);
};

export default Hero;
