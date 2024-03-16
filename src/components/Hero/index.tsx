import Image from "next/image";
import Logo from "../../../public/logo.png";
import Register from "@/../public/images/TEXTBOX_register.png";
import Discord from "@/../public/images/TEXTBOX_discord.png";

import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import CountdownTimer from "./CountdownTimer";
import BigButton from "@/components/common/BigButton";

const Hero = () => {
	const { isAuthenticated } = useFirebase();

	return (
		<section
			id="hero"
			className="flex flex-col items-center justify-center w-4/5 h-[35rem] mt-8 mb-8"
		>
			<div className="flex p-8 bg-[#00000080] border-4 border-[green] rounded-lg">
				<div className="hidden md:block ">
					<Image src={Logo} width={500} height={500} alt="logo" />
				</div>
				<div className="flex flex-col gap-4">
					<CountdownTimer />

					<div className="bg-[rgba(0,113,188,255)] opacity-90 rounded-md p-2">
						<h2 className="font-bold text-2xl text-center cornerstone-font">
							Penn State University • Business Building •{" "}
							{settings.hackathonDateRepr}
						</h2>
						{settings.isLive && <h2>12 Hours Left</h2>}
					</div>

					<div className="flex flex-col items-center justify-center">
						<div className="sm:w-3/5 p-4 flex flex-wrap justify-center">
							<BigButton
								background={Register}
								onClick={() =>
									window.open("https://register.hackpsu.org/register", "_blank")
								}
								className="mb-4 w-full"
							/>

							<BigButton
								background={Discord}
								onClick={() =>
									window.open("http://discord.hackpsu.org", "_blank")
								}
								className="mb-4 w-full"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
