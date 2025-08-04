import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Mail, Smartphone, Globe } from "lucide-react";

const AccountDeletionPolicy = () => {
	const deletionMethods = [
		{
			icon: <Mail className="w-5 h-5 text-purple-600" />,
			title: "Email Request",
			description:
				'Send an email to "technology@hackpsu.org" with the subject line "Account Deletion Request".',
		},
	];

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<div className="bg-red-100 p-3 rounded-full">
							<Trash2 className="w-8 h-8 text-red-600" />
						</div>
					</div>
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
						HackPSU Account Deletion
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						We respect your right to control your personal data. You can delete
						your account and all associated data at any time.
					</p>
				</div>

				{/* Main Content */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<Trash2 className="w-5 h-5 text-red-600" />
							Account Deletion Options
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700 leading-relaxed mb-6">
							HackPSU offers users the ability to delete their account and all
							data associated with it. Choose any of the following methods to
							request account deletion:
						</p>

						<div className="space-y-4">
							{deletionMethods.map((method, index) => (
								<div
									key={index}
									className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
								>
									<div className="flex-shrink-0 mt-1">{method.icon}</div>
									<div className="flex-1">
										<h3 className="font-semibold text-gray-900 mb-1">
											{method.title}
										</h3>
										<p className="text-gray-700 text-sm leading-relaxed">
											{method.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Important Information */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl text-gray-900">
							Important Information
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
								<h3 className="font-semibold text-amber-800 mb-2">
									⚠️ Before You Delete
								</h3>
								<p className="text-amber-700 text-sm">
									Account deletion is permanent and cannot be undone. All your
									data, including profile information, event registrations, and
									associated records will be permanently removed from our
									systems.
								</p>
							</div>

							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h3 className="font-semibold text-blue-800 mb-2">
									📧 Email Template
								</h3>
								<p className="text-blue-700 text-sm mb-2">
									When emailing us for account deletion, please include:
								</p>
								<ul className="list-disc list-inside text-blue-700 text-sm space-y-1 ml-4">
									<li>Your full name</li>
									<li>Email address associated with your account</li>
									<li>Reason for deletion (optional)</li>
								</ul>
							</div>

							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<h3 className="font-semibold text-green-800 mb-2">
									✅ Processing Time
								</h3>
								<p className="text-green-700 text-sm">
									Account deletion requests are typically processed within 7
									business days. You will receive a confirmation email once your
									account has been successfully deleted.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Contact Information */}
				<Card>
					<CardHeader>
						<CardTitle className="text-xl text-gray-900 flex items-center gap-2">
							<Mail className="w-5 h-5 text-blue-600" />
							Need Help?
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-gray-700 leading-relaxed mb-4">
							If you have questions about account deletion or need assistance,
							please contact us:
						</p>
						<div className="bg-gray-50 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<Mail className="w-4 h-4 text-gray-600" />
								<span className="font-semibold text-gray-900">Email:</span>
							</div>
							<a
								href="mailto:technology@hackpsu.org"
								className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-lg"
							>
								technology@hackpsu.org
							</a>
							<p className="text-gray-600 text-sm mt-2">
								We typically respond within 24-48 hours during business days.
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Footer */}
				<div className="text-center mt-8 pt-6 border-t border-gray-200">
					<p className="text-sm text-gray-500">
						This policy is part of our commitment to user privacy and data
						protection.
					</p>
					<p className="text-sm text-gray-500 mt-1">
						For more information, see our{" "}
						<a
							href="/privacy"
							className="text-blue-600 hover:text-blue-800 hover:underline"
						>
							Privacy Policy
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AccountDeletionPolicy;
