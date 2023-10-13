"use client";
import Image from "next/image";
import Logo from "../../../public/images/LOGO_FA23_NoBG.png";
import Register from "@/../public/images/TEXTBOX_register.png";
import Discord from "@/../public/images/TEXTBOX_discord.png";

import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import CountdownTimer from "../CountdownTimer";
import BigButton from "@/components/common/BigButton";

const Hero = () => {
	const { isAuthenticated } = useFirebase();

	return (
		<section className="flex flex-col items-center justify-center w-4/5 h-[35rem]">
			<div className="frame flex p-8 rounded-md border-black border-2">
				<div>
					<Image src={Logo} width={500} height={500} alt="logo" />
				</div>
				<div className="flex flex-col gap-4">
					<CountdownTimer />

					<div className="bg-sky-500 opacity-90 rounded-md p-2">
						<h2 className="font-bold text-2xl text-center">
							Pennsylvania State University • {settings.hackathonDateRepr}
						</h2>
						{settings.isLive ? <h2>12 Hours Left</h2> : <></>}
					</div>

					<div>
						{!isAuthenticated ? (
							<div className="flex flex-col items-center justify-center">
								<div className="w-3/5 h-1/2 p-4">
									<BigButton
										background={Register}
										onClick={() => {
											window.location.href = "/register";
										}}
									></BigButton>
								</div>
								<div className="w-3/5 h-1/2 p-4">
									<BigButton
										background={Discord}
										onClick={() => {
											window.open("http://discord.hackpsu.org", "_blank");
										}}
									></BigButton>
								</div>
							</div>
						) : (
							<></>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
