import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const PrivacyPolicy = () => {
	const sections = [
		{ id: "collection", title: "Information Collection" },
		{ id: "usage", title: "Information Usage" },
		{ id: "protection", title: "Information Protection" },
		{ id: "cookies", title: "Cookie Usage" },
		{ id: "disclosure", title: "3rd Party Disclosure" },
		{ id: "links", title: "3rd Party Links" },
		{ id: "google", title: "Google Services" },
		{ id: "california", title: "California Privacy Rights" },
		{ id: "coppa", title: "Children's Privacy" },
		{ id: "contact", title: "Contact Information" },
	];

	return (
		<div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
						hackpsu.org Privacy Policy
					</h1>
					<Badge variant="secondary" className="text-sm">
						Last Updated: February 27, 2018
					</Badge>
				</div>

				{/* Table of Contents */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="text-xl">Table of Contents</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
							{sections.map((section) => (
								<a
									key={section.id}
									href={`#${section.id}`}
									className="text-blue-600 hover:text-blue-800 hover:underline text-sm py-1 transition-colors"
								>
									{section.title}
								</a>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Main Content */}
				<div className="space-y-8">
					{/* Information Collection */}
					<Card id="collection">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Information Collection
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									What personal information do we collect from visitors?
								</h3>
								<p className="text-gray-700 leading-relaxed">
									When registering on our site, you may be asked to enter your
									name, email address, phone number, or other details to help
									improve your experience.
								</p>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									When do we collect information?
								</h3>
								<p className="text-gray-700 leading-relaxed">
									We collect information when you register on our site, fill out
									a form, or enter information on our website.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Information Usage */}
					<Card id="usage">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								How We Use Your Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed mb-4">
								We may use the information we collect from you in the following
								ways:
							</p>
							<ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
								<li>
									To personalize your experience and deliver content that
									interests you
								</li>
								<li>To improve our website to better serve you</li>
								<li>
									To administer contests, promotions, surveys, or other site
									features
								</li>
								<li>
									To follow up after correspondence (live chat, email, or phone
									inquiries)
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Information Protection */}
					<Card id="protection">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Information Protection
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<p className="text-gray-700">
										• We use regular malware scanning
									</p>
									<p className="text-gray-700">
										• We don&apos;t store credit card information
									</p>
									<p className="text-gray-700">
										• SSL encryption for sensitive data
									</p>
								</div>
								<div className="space-y-3">
									<p className="text-gray-700">
										• Secured networks with limited access
									</p>
									<p className="text-gray-700">
										• Gateway processing for transactions
									</p>
									<p className="text-gray-700">
										• Multiple security measures implemented
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Cookies */}
					<Card id="cookies">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Cookie Usage
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-gray-700 leading-relaxed">
								Yes, we use cookies. Cookies are small files transferred to your
								computer&apos;s hard drive through your web browser that enable
								our systems to recognize your browser and remember certain
								information.
							</p>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									We use cookies to:
								</h3>
								<ul className="list-disc list-inside text-gray-700 ml-4">
									<li>
										Understand and save user preferences for future visits
									</li>
									<li>
										Compile aggregate data about site traffic and interactions
									</li>
								</ul>
							</div>
							<div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
								<p className="text-amber-800 text-sm">
									<strong>Note:</strong> If you disable cookies, some features
									may not function properly.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Third-party Disclosure */}
					<Card id="disclosure">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Third-party Disclosure
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed">
								We do not sell, trade, or transfer your Personally Identifiable
								Information to outside parties unless we provide advance notice.
								This excludes trusted partners who assist in operating our
								website, conducting business, or serving users, provided they
								agree to keep information confidential.
							</p>
						</CardContent>
					</Card>

					{/* Third-party Links */}
					<Card id="links">
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Third-party Links
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed">
								We do not include or offer third-party products or services on
								our website.
							</p>
						</CardContent>
					</Card>

					{/* Google Services */}
					<Card id="google">
						<CardHeader>
							<CardTitle className="text-xl text-blue-600">
								Google Services
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-gray-700 leading-relaxed">
								We use Google AdSense Advertising on our website. Google uses
								cookies to serve ads based on previous visits to our site and
								other sites on the Internet.
							</p>
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									We have implemented:
								</h3>
								<ul className="list-disc list-inside text-gray-700 ml-4">
									<li>Demographics and Interests Reporting</li>
								</ul>
							</div>
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<p className="text-blue-800 text-sm">
									<strong>Opting out:</strong> You can set preferences using the
									Google Ad Settings page or opt out via the Network Advertising
									Initiative Opt Out page.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* California Privacy Rights */}
					<Card id="california">
						<CardHeader>
							<CardTitle className="text-xl text-blue-600">
								California Online Privacy Protection Act
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-gray-700 leading-relaxed">
								CalOPPA requires commercial websites to post a privacy policy.
								We comply with CalOPPA and agree to the following:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<h3 className="font-semibold text-gray-900 mb-2">
										Our Commitments:
									</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li>Users can visit our site anonymously</li>
										<li>Privacy policy link is easily accessible</li>
										<li>We honor Do Not Track signals</li>
									</ul>
								</div>
								<div>
									<h3 className="font-semibold text-gray-900 mb-2">
										Your Rights:
									</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li>Change personal information by emailing us</li>
										<li>Notification of policy changes</li>
										<li>No third-party behavioral tracking</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* COPPA */}
					<Card id="coppa">
						<CardHeader>
							<CardTitle className="text-xl text-blue-600">
								Children&apos;s Online Privacy Protection Act (COPPA)
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed">
								We do not specifically market to children under 13 years old. We
								do not allow third-parties, including ad networks or plug-ins,
								to collect personally identifiable information from children
								under 13.
							</p>
						</CardContent>
					</Card>

					{/* Data Breach Response */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								Fair Information Practices & Data Breach Response
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed mb-4">
								Should a data breach occur, we will take the following
								responsive actions:
							</p>
							<div className="bg-red-50 border border-red-200 rounded-lg p-4">
								<ul className="list-disc list-inside text-red-800 space-y-1 ml-4">
									<li>Notify you via email within 7 business days</li>
									<li>
										Notify users via in-site notification within 7 business days
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					{/* CAN SPAM Act */}
					<Card>
						<CardHeader>
							<CardTitle className="text-xl text-gray-900">
								CAN SPAM Act Compliance
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									We collect your email address to:
								</h3>
								<ul className="list-disc list-inside text-gray-700 ml-4">
									<li>Send information and respond to inquiries or requests</li>
								</ul>
							</div>
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<p className="text-green-800 text-sm">
									<strong>Unsubscribe:</strong> Email us at
									technology@hackpsu.org to be removed from all correspondence.
								</p>
							</div>
						</CardContent>
					</Card>

					{/* Contact Information */}
					<Card id="contact">
						<CardHeader>
							<CardTitle className="text-xl text-blue-600">
								Contact Us
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-gray-700 leading-relaxed mb-4">
								If you have any questions regarding this privacy policy, please
								contact us:
							</p>
							<div className="bg-gray-50 rounded-lg p-4 space-y-2">
								<p className="font-semibold text-gray-900">hackpsu.org</p>
								<p className="text-gray-700">Old Main</p>
								<p className="text-gray-700">
									State College, Pennsylvania 16803
								</p>
								<p className="text-gray-700">United States</p>
								<a
									href="mailto:technology@hackpsu.org"
									className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
								>
									technology@hackpsu.org
								</a>
							</div>
						</CardContent>
					</Card>
				</div>

				<Separator className="my-8" />

				{/* Footer */}
				<div className="text-center text-sm text-gray-500">
					<p>This privacy policy was last updated on February 27, 2018</p>
				</div>
			</div>
		</div>
	);
};

export default PrivacyPolicy;
