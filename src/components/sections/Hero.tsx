import Image from "next/image";
import Logo from "../../../assets/HackPSUBWLogo1.png";
import Countdown from "react-countdown";

const Hero = () => {
	return (
		<section className="flex flex-col items-center justify-center w-full h-[35rem]">
			<Image src={Logo} width={250} height={250} alt="logo" />
			<h1 className="font-bold text-6xl">HackPSU</h1>
			<h2 className="font-bold text-2xl text-center">
				Pennsylvania State University • April 1-2, 2023
			</h2>
			<Countdown
				date={new Date("2023-05-01T00:00:00")}
				className="font-bold text-black text-6xl"
			/>
		</section>
	);
};

export default Hero;
