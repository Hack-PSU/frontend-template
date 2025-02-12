import Image from "next/image";
import React from "react";
import Divider from "../common/Divider";
import "./sponsors.css";
import { useAllSponsors } from "@/lib/api/sponsor/hook";

export default function Sponsors() {
	// Use the React Query hook to fetch sponsors.
	const { data: sponsors, isLoading, error } = useAllSponsors();

	if (isLoading) {
		return <div>Loading sponsors...</div>;
	}

	if (error || !sponsors) {
		return <div>Error loading sponsors.</div>;
	}

	// Sort sponsors by the 'order' property.
	const sortedSponsors = sponsors.sort((a, b) => a.order - b.order);

	return (
		<section id="sponsors" className="flex flex-col items-center w-full mt-20">
			<div className="w-11/12 md:w-4/12 flex flex-col items-center">
				<h1 className="section-header-text">Sponsors</h1>
				<Divider />
			</div>
			<div className="bg-transparent mt-8">
				<div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 items-center">
					{sortedSponsors.map((sponsor) => (
						<div key={sponsor.id} className="sponsor-container">
							<a
								href={sponsor.link}
								target="_blank"
								rel="noopener noreferrer"
								className="cursor-pointer"
							>
								<div className="sponsor-card">
									<Image
										className="max-h-[94px] object-contain"
										src={sponsor.darkLogo || ""}
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
