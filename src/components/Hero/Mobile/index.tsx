"use client";
import Register from "@/../public/images/TEXTBOX_register.png";
import Discord from "@/../public/images/TEXTBOX_discord.png";

import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import CountdownTimer from "../CountdownTimer";
import BigButton from "@/components/common/BigButton";

const Hero = () => {
	const { isAuthenticated, userDataLoaded } = useFirebase();

	return (
		<section
			id="hero"
			className="flex flex-col items-center justify-center w-4/5 mt-8 mb-8"
		>
			<div className=" flex p-8 bg-[#00000040] border-4 border-[green] rounded-lg">
				<div className="flex flex-col gap-2">
					<CountdownTimer />

					<div className="bg-sky-500 opacity-90 rounded-md p-2">
						<h2 className="font-bold text-2xl text-center cornerstone-font">
							<p className="mb-1">Penn State University</p>
							<p className="mb-1">Business Building</p>
							<p className="mb-1">{settings.hackathonDateRepr}</p>
						</h2>
						{settings.isLive ? <h2>12 Hours Left</h2> : <></>}
					</div>

					<div>
						{!isAuthenticated ? (
							<div className="flex flex-col items-center justify-center">
								<div className="p-4 flex flex-wrap justify-center">
									<BigButton
										background={Register}
										onClick={() => window.open("/register", "_self")}
										className="mb-2 w-full"
									></BigButton>

									<BigButton
										background={Discord}
										onClick={() => {
											window.open(
												userDataLoaded && isAuthenticated
													? "/register"
													: "/signup",
												"_self"
											);
										}}
										className="mb-4 w-full"
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
