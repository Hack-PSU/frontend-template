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
	const { isAuthenticated, isLoading } = useFirebase();
	const router = useRouter();

	return (
		<section
			id="hero"
			className="flex flex-col items-center justify-center w-4/5 h-[35rem] mt-[15rem] mb-8"
		>
			{/* Countdown Asset with Timer */}
			<div className="relative flex flex-col items-center">
				<Image src={countdown} width={1000} height={600} alt="Countdown" />

				{/* Position the Countdown Timer inside the countdown image */}
				<div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/4">
					<div style={{ scale: 1.3 }}>
						<CountdownTimer />
					</div>
				</div>
			</div>

			{/* Register & Discord Buttons Positioned Below */}
			<div className="flex justify-center gap-12 mt-6 mb-12">
				<div className="w-50 h-40 mb-12">
					<BigButton
						background={Register}
						onClick={() => router.push("/signin")}
						className="w-full h-full"
					/>
				</div>
				<div className="w-50 h-40">
					<BigButton
						background={Discord}
						onClick={() => window.open("http://discord.hackpsu.org", "_blank")}
						className="w-full h-full"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
