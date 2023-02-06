import Image from "next/image";
import Logo from "../../assets/HackPSUBWLogo2.png";

const Navbar = () => {
	return (
		<div className="fixed w-full bg-black flex flex-row items-center p-2 px-16 justify-between">
			<Image src={Logo} width={50} height={50} alt="logo" />
			<p className="text-white">LOGIN</p>
		</div>
	);
};

export default Navbar;
