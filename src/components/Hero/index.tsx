import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";

const Hero = () => {
	return (
		<section className="flex flex-col items-center justify-center w-full h-[35rem]">
			<Image src={Logo} width={250} height={250} alt="logo" />
			<h1 className="font-bold text-6xl">HackPSU</h1>
			<h2 className="font-bold text-2xl text-center">
				Pennsylvania State University • April 1-2, 2023
			</h2>
		</section>
	);
};

export default Hero;
