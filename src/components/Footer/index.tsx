import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaSnapchat } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
	const social_size = 30;

	return (
		<section className="flex flex-col items-center w-full gap-4">
			<div className="flex flex-row gap-2">
				<FaFacebook size={social_size} />
				<FaTwitter size={social_size} />
				<FaInstagram size={social_size} />
				<FaSnapchat size={social_size} />
				<FaEnvelope size={social_size} />
			</div>
			<p className="font-bold md:mb-32">Made with ❤️ in Happy Valley.</p>
		</section>
	);
};

export default Footer;
