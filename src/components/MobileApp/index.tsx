import Image from "next/image";

import Divider from "../common/Divider";

const MobileApp = () => {
	return (
		<section className="flex flex-col items-center w-full gap-4 mt-20">
			<div className="w-11/12 md:w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl cornerstone-font">Mobile App</h1>
				<Divider />
			</div>
			<div className="frame w-4/5 text-white flex flex-col items-center justify-center p-8">
				<p className="font-bold">
					Get our app on Google Play and the App Store!
				</p>
				<div className="flex flex-row gap-4">
					<div className="flex justify-center items-center">
						<a
							href="https://apps.apple.com/app/hackpsu-mobile/id1615222779"
							target="_blank"
							rel="noopener noreferrer"
						>
							{/* TODO: Set up Next.js SVG handling for iOS store icon. */}
							<img
								src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1604620800&h=413f442f188f45f269ac02e9fafd7e0f"
								alt="Download on the App Store"
								height="100"
								width="180"
							/>
						</a>
					</div>
					<div className="flex justify-center items-center">
						<a
							href="https://play.google.com/store/apps/details?id=org.hackpsu.prod"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Image
								src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
								height="100"
								width="200"
								alt="Get it on Google Play"
							/>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MobileApp;
