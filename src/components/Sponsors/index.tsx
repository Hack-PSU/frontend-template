"use client";
import Image from "next/image";
import React, { useEffect } from "react";

import { Sponsor } from "../../interfaces/Sponsor";
import Divider from "../common/Divider";
import "./sponsors.css";

export default function Sponsors() {
	const [sponsors, setSponsors] = React.useState<Sponsor[]>([]);

	useEffect(() => {
		const apiEndpoint = "https://api-v3-production-oz3dekgbpa-uk.a.run.app/sponsors";
		fetch(apiEndpoint)
			.then((response) => {
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				return response.json();
			})
			.then((data) => {
				// Update the sponsors state with the fetched data
				setSponsors(data); // If we have an array of sponsors
			})
			.catch((error) => {
				console.error("Error fetching sponsors:", error);
			});
	}, []);

	// Display sponsors dynamically
	const sponsorElements = sponsors
		.sort((a, b) => (a.order - b.order))
		.map((sponsor, index) => (
      <div key={index} className="sponsor-container">
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
					<div className="sponsor-card">
						<Image
							className="max-h-16.1 object-contain"
							src={sponsor.darkLogo}
							alt={sponsor.name}
							width={458}
							height={48}
						/>
					</div>
			  </a>
      </div>
		));

	return (
		<section id="sponsors" className="flex flex-col items-center w-full mt-20">
			<div className="w-11/12 md:w-4/12 flex flex-col items-center">
				<h1 className="font-bold text-6xl cornerstone-font">Sponsors</h1>
				<Divider />
			</div>
			<div className="bg-transparent mt-8">
				<div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 items-center">
					{sponsorElements}
				</div>
			</div>
		</section>
	);
}
