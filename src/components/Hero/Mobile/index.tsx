"use client";
import Register from "@/public/textbox-register.png";
import Discord from "@/public/textbox-discord.png";

import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import CountdownTimer from "../CountdownTimer";
import BigButton from "@/components/common/BigButton";
import { useRouter } from "next/navigation";

const Hero = () => {
	const router = useRouter();

	return (
		<section
			id="hero"
			className="flex flex-col items-center justify-center w-4/5 mt-8 mb-8"
		>
			<div className=" flex p-8 bg-[#00000040] border-4 border-[darkred] rounded-lg">
				<div className="flex flex-col gap-2">
					<CountdownTimer />

					<div className="bg-sky-500 opacity-90 rounded-md p-2">
						<h2 className="font-bold text-2xl text-center cornerstone-font text-white">
							<p className="mb-1">Penn State University</p>
							<p className="mb-1">Business Building</p>
							<p className="mb-1">{settings.hackathonDateRepr}</p>
						</h2>
						{settings.isLive ? <h2>12 Hours Left</h2> : <></>}
					</div>

					<div>
						<div className="flex flex-col items-center justify-center">
							<div className="p-4 flex flex-wrap justify-center">
								<BigButton
									background={Register}
									onClick={() => {
										router.push("/signin");
									}}
									className="mb-2 w-full"
								></BigButton>

								<BigButton
									background={Discord}
									onClick={() => {
										window.open("http://discord.hackpsu.org", "_blank");
									}}
									className="mb-4 w-full"
								></BigButton>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
