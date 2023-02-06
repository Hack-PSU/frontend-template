import Divider from "../Divider";

const MobileApp = () => {
	return (
		<section className="flex flex-col items-center w-full gap-4">
			<div className="w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl">Mobile App</h1>
				<Divider />
			</div>
			<p className="font-bold">Get our app on Google Play and the App Store!</p>
			<div className="flex flex-row gap-4">
				<p>Google Play Button</p>
				<p>App Store Button</p>
			</div>
		</section>
	);
};

export default MobileApp;
