import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Sponsor } from "../../interfaces/Sponsor";
import Divider from "../common/Divider";
import "./sponsors.css";

export default function Sponsors() {
	const [sponsors, setSponsors] = useState<Sponsor[]>([]);

	useEffect(() => {
		async function fetchSponsors() {
			const apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL_V3}/sponsors`;
			try {
				const response = await fetch(apiEndpoint);
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				const data = await response.json();
				setSponsors(data.sort((a: Sponsor, b: Sponsor) => a.order - b.order)); // Sort sponsors once when setting state
			} catch (error) {
				console.error("Error fetching sponsors:", error);
			}
		}

		fetchSponsors();
	}, []);

	return (
		<section id="sponsors" className="flex flex-col items-center w-full mt-20">
			<div className="w-11/12 md:w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl cornerstone-font">Sponsors</h1>
				<Divider />
			</div>
			<div className="bg-transparent mt-8">
				<div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 items-center">
					{sponsors.map((sponsor, index) => (
						<div key={index} className="sponsor-container">
							{" "}
							<a
								href={sponsor.link}
								target="_blank"
								rel="noopener noreferrer"
								className="cursor-pointer"
							>
								<div className="sponsor-card">
									<Image
										className="max-h-[94px] object-contain"
										src={sponsor.darkLogo}
										alt={sponsor.name}
										width={458}
										height={48}
									/>
								</div>
							</a>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
