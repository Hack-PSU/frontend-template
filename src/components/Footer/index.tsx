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
				<a
					href="https://facebook.com/HackPSU"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaFacebook size={social_size} />
				</a>
				<a
					href="https://twitter.com/hackpsu"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaTwitter size={social_size} />
				</a>
				<a
					href="https://www.instagram.com/hack_psu/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaInstagram size={social_size} />
				</a>
				<a
					href="https://www.snapchat.com/add/hackpsu"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaSnapchat size={social_size} />
				</a>
				<a
					href="mailto:team@hackpsu.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaEnvelope size={social_size} />
				</a>
			</div>
			<p className="font-bold md:mb-32">Made with ❤️ in Happy Valley.</p>
		</section>
	);
};

export default Footer;
