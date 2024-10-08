import Image from "next/image";
import Register from "@/../public/textbox-register.png";
import Discord from "@/../public/textbox-discord.png";
import settings from "@/lib/config/settings.json";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import CountdownTimer from "./CountdownTimer";
import BigButton from "@/components/common/BigButton";
import { useRouter } from "next/navigation";

const Hero = () => {
	const { isAuthenticated, userDataLoaded } = useFirebase();
	const router = useRouter();

	return (
		<section id="hero" className="w-full max-w-5xl mx-auto px-8 py-2">
			{/* Hero Image Wrapper */}
			<div className="relative w-full h-[50rem]"> {/* Adjusted height */}
				<Image
					src="/ticketbooth_hero.svg"
					layout="fill"
					objectFit="contain"
					alt="Ticket Booth Hero"
					className="rounded-lg absolute top-[-70%] left-0" // Moved image further up
				/>

				{/* Countdown Timer Overlay */}
				<div className="absolute inset-x-0 flex items-center justify-center" style={{ top: '58%' }}> {/* Adjusted top value */}
					<CountdownTimer />
				</div>

				{/* Text Overlay */}
				<div className="absolute left-1/2 transform -translate-x-1/2 text-center text-white" style={{ top: '79%' }}> {/* Moved text down */}
					<h2 className="font-bold text-2xl cornerstone-font">
						Penn State University • Business Building • {settings.hackathonDateRepr}
					</h2>
					{settings.isLive && <h2>12 Hours Left</h2>}
				</div>
			</div>

			{/* Buttons Container */}
			<div className="flex flex-col items-center justify-center mt-8">
				<div className="sm:w-3/5 p-4 flex flex-wrap justify-center">
					<BigButton
						background={Register}
						onClick={() => router.push("/signin")}
						className="mb-4 w-full"
					/>

					<BigButton
						background={Discord}
						onClick={() => {
							window.open("http://discord.hackpsu.org", "_blank");
						}}
						className="mb-4 w-full"
					/>
				</div>
			</div>
		</section>
	);
};

export default Hero;
