import Image from "next/image";
import Logo from "../../../public/logo.png";
import Register from "./EXPORT - register.png";
import Discord from "./EXPORT - discord.png";

import settings from "@/lib/config/settings.json";
import countdown from "./HACKPSU Countdown.svg";
import CountdownTimer from "./CountdownTimer";
import BigButton from "@/components/common/BigButton";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";

const Hero = () => {
	const { isAuthenticated, userDataLoaded } = useFirebase();
	const router = useRouter();

	return (
		<section
			id="hero"
			className="flex flex-col items-center justify-center w-4/5 h-[35rem] mt-[6rem] mb-8"
		>
			{/* Countdown Asset with Timer */}
			<div className="relative flex flex-col items-center">
				<Image src={countdown} width={700} height={400} alt="Countdown" />

				{/* Position the Countdown Timer inside the countdown image */}
				<div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
					<CountdownTimer />
				</div>
			</div>

			{/* Register & Discord Buttons Positioned Below */}
			<div className="flex justify-center gap-4 mt-6">
				<BigButton
					background={Register}
					onClick={() => router.push("/signin")}
					className="w-48"
				/>
				<BigButton
					background={Discord}
					onClick={() => window.open("http://discord.hackpsu.org", "_blank")}
					className="w-48"
				/>
			</div>
		</section>
	);
};

export default Hero;
