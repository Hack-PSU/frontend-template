import InfoSections from "@/components/Info";
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
		</>
	);
}
