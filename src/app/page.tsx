import Challenges from "@/components/Challenges";
import FAQs from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ImageGallery from "@/components/ImageGallery";
import InfoSections from "@/components/Info";
import Schedule from "@/components/Schedule";
import Sponsors from "@/components/Sponsors";
import Wave from "@/components/Wave";

export default function Home() {
	return (
		<>
			<Hero />
			<Wave
				height={250}
				waveHeight={100}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#D8FFFC"
				borderColor="#ffffff"
				borderOffset={-15}
			/>
			<InfoSections />
			<Challenges />
			<Wave
				height={500}
				waveHeight={350}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#86CFFC"
				borderColor="#ffffff"
				borderOffset={-15}
				className="bg-[#D8FFFC] mt-[-400px] z-[-1]"
			/>
			<Schedule />
			<FAQs />
			<Wave
				height={300}
				waveHeight={100}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#3689CB"
				borderColor="#ffffff"
				borderOffset={-15}
				className="bg-[#86CFFC]"
			/>
			<Sponsors />
			<ImageGallery
				images={[
					"/event/event_1.jpg",
					"/event/event_2.jpg",
					"/event/event_3.jpg",
					"/event/event_4.jpg",
					"/event/event_5.jpg",
					"/event/event_6.jpg",
					"/event/event_7.jpg",
					"/event/event_8.jpg",
					"/event/event_9.jpg",
					"/event/event_10.jpg",
					"/event/event_11.jpg",
					"/event/event_12.jpg",
				]}
			/>
			<Wave
				height={250}
				waveHeight={100}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#215172"
				borderColor="#ffffff"
				borderOffset={-15}
				className="bg-[#3689CB]"
			/>
			<Footer />
		</>
	);
}
