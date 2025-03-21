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
		<section
			id="sponsors"
			className="flex flex-col items-center w-full mt-20 font-['rye'] text-[#A20021] text-[4rem]"
		>
			<div className="w-11/12 md:w-4/12 flex flex-col items-center">
				<p>Sponsors</p>
				<Divider />
			</div>
			<div className="bg-transparent mt-8">
				<div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-10 items-center">
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
										className="object-contain"
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
