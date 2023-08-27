"use client";
import Image from "next/image";
import Logo from "../../../public/HackPSUBWLogo1.png";
import useScroll from "@/lib/hooks/use-scroll";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const scrolled = useScroll(50);
	const pathname = usePathname();

	return (
		<>
			{pathname !== "/profilee" ? (
				<>
					<div
						className={`fixed top-0 w-full flex flex-row items-center p-2 px-16 justify-between ${
							scrolled
								? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
								: "bg-white/0"
						} z-30 transition-all`}
					>
						<Image src={Logo} width={50} height={50} alt="logo" />
					</div>
				</>
			) : (
				<></>
			)}
		</>
	);
}
