import React from "react";

const TravelReimbursementPolicy = () => {
	return (
		<div className="max-w-full mx-auto text-justify text-sm bg-white pl-4 pr-4 h-[100vh]">
			<div className="font-verdana text-3xl text-center mb-4">
				HackPSU Travel Reimbursement Policy
			</div>
			<div>
				<p className="my-2">
					HackPSU offers travel reimbursements up to $110 total per participant.
				</p>
				<p className="my-2">
					Those using the following methods of travel are eligible:
				</p>
				<ul className="list-disc ml-6 my-2">
					<li>Bus</li>
					<li>Plane</li>
					<li>Ride-Sharing Service (Uber / Lyft / etc.)</li>
					<li>Taxi</li>
					<li>Rental Vehicle</li>
					<li>Personal Vehicle (Gas)</li>
				</ul>
				<p className="my-2">
					Original receipts must be provided at the event in order to receive
					any reimbursement. Digital receipts are accepted for the participant’s
					arrival trip only. Only the person with their name on the receipt will
					be able to be reimbursed—receipts cannot be split among a group. For
					all modes of travel, we require verification of your initial departure
					point.
				</p>
				<p className="my-2">
					Reimbursements may take up to 2 months. HackPSU does not reimburse
					travel from the State College area or lodging/other accommodations.
				</p>
			</div>
		</div>
	);
};

export default TravelReimbursementPolicy;
