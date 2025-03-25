import EmailIcon from "@mui/icons-material/Email";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

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
					<InstagramIcon style={{ fontSize: social_size }} />
				</a>
				<a
					href="https://www.linkedin.com/company/hackpsuofficial/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<LinkedInIcon style={{ fontSize: social_size }} />
				</a>
				<a
					href="mailto:team@hackpsu.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					<EmailIcon style={{ fontSize: social_size }} />
				</a>
			</div>
			{/* privacy policy */}
			<a href="/privacy" className="font-bold">
				<p className="font-bold">Privacy Policy</p>
			</a>
			<p className="font-bold md:mb-32 text-blue-100">
				Made with ❤️ in Happy Valley.
			</p>
		</section>
	);
};

export default Footer;
