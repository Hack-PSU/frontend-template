import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import FAQRules from "@/components/FAQRules";
import MobileApp from "@/components/MobileApp";
import PrizesChallenges from "@/components/PrizesChallenges";
import Workshops from "@/components/Workshops";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center w-full gap-6">
			<Hero />
			<Schedule />
			<FAQRules />
			<MobileApp />
			<PrizesChallenges />
			<Workshops />
			<Sponsors />
			<Footer />
		</main>
	);
}
