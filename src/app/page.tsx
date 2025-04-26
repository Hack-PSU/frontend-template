import ImageGallery from "@/components/ImageGallery";
import InfoSections from "@/components/Info";
import Schedule from "@/components/Schedule";
import Wave from "@/components/Wave";

export default function Home() {
	return (
		<>
			<Wave
				height={400}
				waveHeight={200}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#D8FFFC"
				borderColor="#ffffff"
				borderOffset={-15}
			/>
			<InfoSections />
			<Wave
				height={400}
				waveHeight={200}
				waveDelta={75}
				speed={0.15}
				wavePoints={6}
				fill="#86CFFC"
				borderColor="#ffffff"
				borderOffset={-15}
				className="bg-[#D8FFFC]"
			/>
			<Schedule />
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
		</>
	);
}
