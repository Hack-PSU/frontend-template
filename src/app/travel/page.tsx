import React from "react";

const TravelReimbursementPolicy = () => {
	return (
		<div className="max-w-full mx-auto text-justify text-sm bg-white pl-4 pr-4 h-[100vh]">
			<div className="font-verdana text-3xl text-center mb-4">
				HackPSU Travel Reimbursement Policy
			</div>
			<div>
				<p className="my-2">
					HackPSU offers single travelers up to $70 in reimbursements, groups of
					2 or 3 hackers with up to $90, and groups of 4+ hackers up to $110.
				</p>
				<p className="my-2">
					Participants arriving by bus or plane can be reimbursed up to $110. A
					taxi or ride-sharing service (e.g., Lyft or Uber) can also be
					reimbursed, but will count toward the participant&apos;s $110.
				</p>
				<p className="my-2">
					Original receipts must be provided at the event in order to receive
					any reimbursement. Digital receipts are accepted for bus/plane tickets
					and for gas on the participant&apos;s return trip only.
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
