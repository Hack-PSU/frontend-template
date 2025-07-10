import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	DollarSign,
	Bus,
	Plane,
	Car,
	Fuel,
	Receipt,
	Clock,
	AlertTriangle,
	CheckCircle,
	XCircle,
} from "lucide-react";

const TravelReimbursementPolicy = () => {
	const eligibleMethods = [
		{
			icon: <Bus className="w-5 h-5 text-blue-600" />,
			method: "Bus",
			description: "Public transportation buses",
		},
		{
			icon: <Plane className="w-5 h-5 text-sky-600" />,
			method: "Plane",
			description: "Commercial airline flights",
		},
		{
			icon: <Car className="w-5 h-5 text-green-600" />,
			method: "Ride-Sharing",
			description: "Uber, Lyft, and similar services",
		},
		{
			icon: <Car className="w-5 h-5 text-yellow-600" />,
			method: "Taxi",
			description: "Traditional taxi services",
		},
		{
			icon: <Car className="w-5 h-5 text-purple-600" />,
			method: "Rental Vehicle",
			description: "Car rental services",
		},
		{
			icon: <Fuel className="w-5 h-5 text-orange-600" />,
			method: "Personal Vehicle",
			description: "Gas expenses for your own car",
		},
	];

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
						HackPSU Travel Reimbursement Policy
					</h1>
				</div>

				{/* Overview */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<DollarSign className="w-5 h-5 text-green-600" />
							Reimbursement Overview
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="bg-green-50 border border-green-200 rounded-lg p-6">
							<div className="text-center">
								<div className="text-3xl font-bold text-green-800 mb-2">
									$110
								</div>
								<p className="text-green-700 font-medium">
									Maximum reimbursement per participant
								</p>
								<p className="text-green-600 text-sm mt-2">
									We&apos;re committed to making HackPSU accessible to
									participants from all locations
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Eligible Travel Methods */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<CheckCircle className="w-5 h-5 text-green-600" />
							Eligible Travel Methods
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700 leading-relaxed mb-6">
							The following methods of travel are eligible for reimbursement:
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{eligibleMethods.map((item, index) => (
								<div
									key={index}
									className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
								>
									<div className="flex-shrink-0">{item.icon}</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											{item.method}
										</h3>
										<p className="text-gray-600 text-sm">{item.description}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Receipt Requirements */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<Receipt className="w-5 h-5 text-blue-600" />
							Receipt Requirements
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
							<h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
								<Receipt className="w-4 h-4" />
								Required Documentation
							</h3>
							<ul className="list-disc list-inside text-blue-700 text-sm space-y-1 ml-4">
								<li>Original receipts must be provided at the event</li>
								<li>Digital receipts are accepted for arrival trip only</li>
								<li>Verification of initial departure point required</li>
								<li>Only the person named on the receipt can be reimbursed</li>
							</ul>
						</div>

						<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
							<h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
								<AlertTriangle className="w-4 h-4" />
								Important Notes
							</h3>
							<ul className="list-disc list-inside text-amber-700 text-sm space-y-1 ml-4">
								<li>Receipts cannot be split among a group</li>
								<li>Each participant must have their own receipt</li>
								<li>Keep all receipts safe until reimbursement is processed</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Processing Information */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<Clock className="w-5 h-5 text-purple-600" />
							Processing & Timeline
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
								<h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
									<Clock className="w-4 h-4" />
									Processing Time
								</h3>
								<p className="text-purple-700 text-sm">
									Reimbursements may take up to <strong>2 months</strong> to
									process after the event.
								</p>
							</div>

							<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
								<h3 className="font-semibold text-gray-800 mb-2">
									How to Submit
								</h3>
								<p className="text-gray-700 text-sm">
									Upload your receipts to the reimbursement page by going to the
									bottom of your profile page and clicking the{" "}
									<strong>Submit Reimbursement</strong> button.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Restrictions */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<XCircle className="w-5 h-5 text-red-600" />
							What&apos;s Not Covered
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="bg-red-50 border border-red-200 rounded-lg p-4">
							<h3 className="font-semibold text-red-800 mb-3">
								HackPSU does NOT reimburse:
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h4 className="font-medium text-red-700 mb-2">
										Travel Restrictions:
									</h4>
									<ul className="list-disc list-inside text-red-600 text-sm space-y-1 ml-4">
										<li>Travel from the State College area</li>
										<li>Local transportation within State College</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium text-red-700 mb-2">
										Accommodation Restrictions:
									</h4>
									<ul className="list-disc list-inside text-red-600 text-sm space-y-1 ml-4">
										<li>Lodging expenses</li>
										<li>Hotel accommodations</li>
										<li>Other accommodation costs</li>
									</ul>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Quick Reference */}
				<Card>
					<CardHeader>
						<CardTitle className="text-xl text-gray-900">
							Quick Reference Checklist
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h3 className="font-semibold text-gray-900 mb-3 text-green-700">
									✅ Before You Travel:
								</h3>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										Choose an eligible travel method
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										Keep all receipts in your name
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
										Document your departure point
									</li>
								</ul>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-3 text-blue-700">
									📋 At the Event:
								</h3>
								<ul className="space-y-2 text-sm text-gray-700">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										Bring original receipts to registration
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										Submit during check-in process
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
										Wait up to 2 months for processing
									</li>
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>

				<Separator className="my-8" />

				{/* Footer */}
				<div className="text-center text-sm text-gray-500">
					<p>
						Questions about travel reimbursement? Reach out to us at{" "}
						<a
							href="mailto:team@hackpsu.org"
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							team@hackpsu.org
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default TravelReimbursementPolicy;
