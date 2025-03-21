import { FaEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
	const social_size = 40;

	return (
		<section className="flex flex-col items-center w-full gap-4 my-20">
			<div className="flex flex-row gap-2">
				<a
					href="https://www.instagram.com/hack_psu/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaInstagram size={social_size} />
				</a>
				<a
					href="https://www.linkedin.com/company/hackpsuofficial/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaLinkedin size={social_size} />
				</a>
				<a
					href="mailto:team@hackpsu.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaEnvelope size={social_size} />
				</a>
			</div>
			{/* privacy policy*/}
			<a href="/privacy" className="font-bold">
				<p className="font-bold">Privacy Policy</p>
			</a>
			<p className="font-bold md:mb-32 text-blue-100">Made with ❤️ in Happy Valley.</p>
		</section>
	);
};

export default Footer;
