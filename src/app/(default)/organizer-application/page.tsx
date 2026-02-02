"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { Fireworks } from "@fireworks-js/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Mail, Home, Lock } from "lucide-react";
import {
	YearStanding,
	OrganizerTeam,
	type OrganizerApplicationCreateEntity,
} from "@/lib/api/organizer-application/entity";
import { useSubmitOrganizerApplication } from "@/lib/api/organizer-application/hook";
import { useFlagState } from "@/lib/api/flag/hook";

interface FormData {
	name: string;
	email: string;
	yearStanding: YearStanding | "";
	major: string;
	firstChoiceTeam: OrganizerTeam | "";
	secondChoiceTeam: OrganizerTeam | "";
	whyHackpsu: string;
	newIdea: string;
	whatExcitesYou: string;
	resume: File | null;
}

export default function OrganizerApplicationPage() {
	const router = useRouter();
	const submitApplicationMutation = useSubmitOrganizerApplication();
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Feature flag check
	const { data: organizerApplicationsFlag, isLoading: flagLoading } =
		useFlagState("OrganizerApplications");

	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		yearStanding: "",
		major: "",
		firstChoiceTeam: "",
		secondChoiceTeam: "",
		whyHackpsu: "",
		newIdea: "",
		whatExcitesYou: "",
		resume: null,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			// Validate file type
			const validTypes = [
				"application/pdf",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			];
			if (!validTypes.includes(file.type)) {
				toast.error("Please upload a PDF, DOC, or DOCX file");
				e.target.value = "";
				return;
			}

			// Validate file size (10MB)
			const maxSize = 10 * 1024 * 1024;
			if (file.size > maxSize) {
				toast.error("File size must be less than 10MB");
				e.target.value = "";
				return;
			}

			setFormData((prev) => ({ ...prev, resume: file }));
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validation
		if (
			!formData.name ||
			!formData.email ||
			!formData.yearStanding ||
			!formData.major ||
			!formData.firstChoiceTeam ||
			!formData.secondChoiceTeam ||
			!formData.whyHackpsu ||
			!formData.newIdea ||
			!formData.whatExcitesYou ||
			!formData.resume
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (formData.firstChoiceTeam === formData.secondChoiceTeam) {
			toast.error("First and second choice teams must be different");
			return;
		}

		const applicationData: OrganizerApplicationCreateEntity = {
			name: formData.name,
			email: formData.email,
			yearStanding: formData.yearStanding as YearStanding,
			major: formData.major,
			firstChoiceTeam: formData.firstChoiceTeam as OrganizerTeam,
			secondChoiceTeam: formData.secondChoiceTeam as OrganizerTeam,
			whyHackpsu: formData.whyHackpsu,
			newIdea: formData.newIdea,
			whatExcitesYou: formData.whatExcitesYou,
			resume: formData.resume,
		};

		toast.promise(submitApplicationMutation.mutateAsync(applicationData), {
			loading: "Submitting your application...",
			success: () => {
				setIsSubmitted(true);
				window.scrollTo({ top: 0, behavior: "smooth" });
				return "Application submitted successfully!";
			},
			error: (err: any) =>
				err?.message || "An error occurred while submitting your application.",
		});
	};

	const yearStandingOptions = Object.values(YearStanding);
	const teamOptions = Object.values(OrganizerTeam);

	// Show loading state while flag is being fetched
	if (flagLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-transparent p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-8 text-center">
						<div className="flex justify-center mb-4">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
						</div>
						<CardTitle className="text-lg text-muted-foreground">
							Loading...
						</CardTitle>
					</CardContent>
				</Card>
			</div>
		);
	}

	const isApplicationEnabled = organizerApplicationsFlag?.isEnabled ?? false;
	console.log("Organizer Applications Flag:", organizerApplicationsFlag);

	// Show closed message if flag is disabled
	if (!isApplicationEnabled) {
		return (
			<>
				<Toaster richColors />
				<div className="text-foreground min-h-screen bg-transparent">
					<div className="flex-1 p-4 sm:p-6 lg:p-8">
						<div className="max-w-3xl mx-auto">
							<header className="text-center mb-8 mt-8">
								<h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
									HackPSU Organizer Team Application
								</h1>

								{/* Status Banner */}
								<div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-6 mb-8">
									<div className="flex items-start gap-3 mb-3">
										<Lock className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-1 flex-shrink-0" />
										<div className="text-left flex-1">
											<h2 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-2">
												Applications Currently Closed
											</h2>
											<p className="text-amber-800 dark:text-amber-200">
												We&apos;re not currently accepting new organizer
												applications. Organizer applications will reopen after
												the hackathon concludes. Thank you for your interest in
												joining the HackPSU team!
											</p>
										</div>
									</div>
								</div>

								{/* About Section */}
								<Card className="text-left mb-8 bg-card">
									<CardHeader>
										<CardTitle className="text-xl">About HackPSU</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<p>
											HackPSU is the largest 24-hour student-run hackathon and
											technology event at Penn State. We&apos;re all about
											celebrating innovation, creativity, and the thrill of
											learning. Imagine being part of a team that brings
											mind-blowing ideas to life and creates an unforgettable
											experience for everyone involved. That&apos;s what HackPSU
											is all about!
										</p>

										<div>
											<h3 className="font-semibold text-lg mb-2">
												What Does the Organizing Team Do?
											</h3>
											<p>
												As an organizer, you&apos;ll work alongside a passionate
												team to plan and execute one of the most exciting tech
												events at Penn State. From securing sponsors and
												coordinating logistics to designing promotional
												materials and creating engaging activities, there&apos;s
												a role for everyone!
											</p>
										</div>

										<div>
											<h3 className="font-semibold text-lg mb-2">
												Experience Level
											</h3>
											<p>
												You do NOT need a tech background to join the HackPSU
												organizing team. We&apos;re all about embracing diverse
												perspectives and talents. Whether you&apos;re a coding
												expert or have never written a line of code, as long as
												you are curious and have a can-do attitude, we would
												like to hear from you.
											</p>
											<p className="mt-2">
												We have teams like Entertainment, Logistics,
												Communications, Design, and Marketing that are open to
												everyone from all majors and backgrounds!
											</p>
										</div>

										<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-4">
											<h3 className="font-semibold mb-2">Team Descriptions</h3>
											<p className="text-sm mb-2">
												Find a detailed list of team descriptions{" "}
												<a
													href="https://docs.google.com/document/d/1UtW5J2arWv8K-8g7jfLHHaRqHavm8nR0qpJRiRYSzwQ/edit?tab=t.0"
													target="_blank"
													rel="noopener noreferrer"
													className="text-primary underline"
												>
													here
												</a>
												.
											</p>
										</div>

										<div className="pt-4 text-center border-t">
											<p className="text-sm text-muted-foreground mb-4">
												Have questions or want to be notified when applications
												open?
											</p>
											<p className="text-sm mb-4">
												Reach out at{" "}
												<a
													href="mailto:team@hackpsu.org"
													className="text-primary underline"
												>
													team@hackpsu.org
												</a>
											</p>
											<Button onClick={() => router.push("/")}>
												<Home className="mr-2 h-4 w-4" />
												Back to Home
											</Button>
										</div>
									</CardContent>
								</Card>
							</header>
						</div>
					</div>
				</div>
			</>
		);
	}

	// Success View
	if (isSubmitted) {
		return (
			<div className="relative min-h-screen bg-transparent flex items-center justify-center p-4">
				{/* Confetti Effect */}
				<Fireworks
					options={{
						rocketsPoint: {
							min: 0,
							max: 100,
						},
						hue: {
							min: 0,
							max: 360,
						},
					}}
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: 0,
						pointerEvents: "none",
					}}
				/>

				{/* Success Content */}
				<div className="relative z-10 w-full max-w-2xl">
					<Card className="bg-card shadow-2xl border-2">
						<CardHeader className="text-center pb-4">
							<div className="flex justify-center mb-4">
								<div className="rounded-full bg-emerald-100 dark:bg-emerald-900/20 p-4">
									<CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
								</div>
							</div>
							<CardTitle className="text-4xl font-bold mb-2">
								Application Submitted!
							</CardTitle>
						</CardHeader>

						<CardContent className="space-y-6 text-center">
							<div className="space-y-4">
								<p className="text-xl font-semibold text-primary">
									Thank you for applying to join the HackPSU organizing team!
								</p>

								<div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
									<div className="flex items-start gap-3">
										<Mail className="h-6 w-6 text-slate-600 dark:text-slate-400 mt-1 flex-shrink-0" />
										<div className="text-left">
											<p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
												What happens next?
											</p>
											<ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
												<li>
													We&apos;ve received your application and our team will
													review it carefully
												</li>
												<li>You&apos;ll hear back from us via email</li>
												<li>
													If selected for an interview, we&apos;ll reach out
													with more details
												</li>
												<li>
													Keep an eye on your inbox (and spam folder, just in
													case!)
												</li>
											</ul>
										</div>
									</div>
								</div>

								<div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
									<p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
										We&apos;re excited to learn more about you!
									</p>
									<p className="text-sm text-slate-700 dark:text-slate-300">
										Being part of HackPSU means joining a community of
										passionate individuals who love creating amazing
										experiences. Whether you&apos;re accepted to your first
										choice team or second choice team, you&apos;ll make a real
										impact!
									</p>
								</div>

								<div className="pt-4">
									<p className="text-sm text-muted-foreground">
										Have questions? Reach out to us at{" "}
										<a
											href="mailto:team@hackpsu.org"
											className="text-primary underline font-semibold"
										>
											team@hackpsu.org
										</a>
									</p>
								</div>
							</div>
						</CardContent>

						<CardFooter className="flex justify-center pt-6">
							<Button onClick={() => router.push("/")} size="lg">
								<Home className="mr-2 h-5 w-5" />
								Back to Home
							</Button>
						</CardFooter>
					</Card>
				</div>
			</div>
		);
	}

	// Form View
	return (
		<>
			<Toaster richColors />
			<div
				className="text-foreground min-h-screen"
				style={{ backgroundColor: "#4d1170" }}
			>
				<div className="flex-1 p-4 sm:p-6 lg:p-8">
					<div className="max-w-3xl mx-auto">
						<header className="text-center mb-8 mt-8">
							<h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
								HackPSU Organizer Team Application
							</h1>

							<Card className="text-left mb-8 bg-card">
								<CardHeader>
									<CardTitle className="text-xl">About HackPSU</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<p>
										HackPSU is the largest 24-hour student-run hackathon and
										technology event at Penn State. We&apos;re all about
										celebrating innovation, creativity, and the thrill of
										learning. Imagine being part of a team that brings
										mind-blowing ideas to life and creates an unforgettable
										experience for everyone involved. That&apos;s what HackPSU
										is all about!
									</p>

									<div>
										<h3 className="font-semibold text-lg mb-2">
											Experience Level
										</h3>
										<p>
											Here&apos;s the exciting news: you do NOT need a tech
											background to join the HackPSU organizing team. We&apos;re
											all about embracing diverse perspectives and talents.
											Whether you&apos;re a coding expert or have never written
											a line of code, as long as you are curious and have a
											can-do attitude, we would like to hear from you.
										</p>
										<p className="mt-2">
											We have teams like Entertainment, Logistics,
											Communications, Design, and Marketing that are open to
											everyone from all majors and backgrounds!
										</p>
									</div>

									<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-md p-4">
										<p className="text-sm">
											<strong>Important:</strong> The application for the tech
											team is extremely competitive with limited openings, so
											ensure you choose a desired second choice team. Make sure
											to carefully select your second choice. If rejected from
											the first choice, you will be considered for your second
											choice team.
										</p>
									</div>

									<div className="bg-blue-500/10 border border-blue-500/20 rounded-md p-4">
										<p className="text-sm">
											<strong>Note:</strong> Applications are considered on a
											rolling basis and may take up to 3 weeks into the next
											semester to process. Team roles will close once the
											positions are filled.
										</p>
									</div>

									<p className="text-sm">
										Still got questions? Reach out at{" "}
										<a
											href="mailto:team@hackpsu.org"
											className="text-primary underline"
										>
											team@hackpsu.org
										</a>
									</p>

									<p className="text-sm">
										Find a detailed list of team descriptions{" "}
										<a
											href="https://docs.google.com/document/d/1UtW5J2arWv8K-8g7jfLHHaRqHavm8nR0qpJRiRYSzwQ/edit?tab=t.0"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary underline"
										>
											here
										</a>
										.
									</p>
								</CardContent>
							</Card>
						</header>

						<form onSubmit={handleSubmit} className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle>Personal Information</CardTitle>
									<CardDescription>Tell us about yourself</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="name">
											Name <span className="text-red-500">*</span>
										</Label>
										<Input
											id="name"
											name="name"
											placeholder="First and last name"
											value={formData.name}
											onChange={handleChange}
											required
										/>
										<p className="text-xs text-muted-foreground">
											First and last name
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="email">
											Email <span className="text-red-500">*</span>
										</Label>
										<Input
											id="email"
											name="email"
											type="email"
											placeholder="your.email@example.com"
											value={formData.email}
											onChange={handleChange}
											required
										/>
										<p className="text-xs text-muted-foreground">
											Please provide an email that you check regularly! We will
											be using this email to contact you for interviews.
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="yearStanding">
											Year Standing <span className="text-red-500">*</span>
										</Label>
										<Select
											name="yearStanding"
											value={formData.yearStanding}
											onValueChange={(value) =>
												handleSelectChange("yearStanding", value)
											}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select your year standing" />
											</SelectTrigger>
											<SelectContent>
												{yearStandingOptions.map((year) => (
													<SelectItem key={year} value={year}>
														{year}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="major">
											Major or Intended Major{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Input
											id="major"
											name="major"
											placeholder="e.g., Computer Science, Business, Psychology"
											value={formData.major}
											onChange={handleChange}
											required
										/>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Team Preferences</CardTitle>
									<CardDescription>
										Select your first and second choice teams
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="firstChoiceTeam">
											What team is your first choice?{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Select
											name="firstChoiceTeam"
											value={formData.firstChoiceTeam}
											onValueChange={(value) =>
												handleSelectChange("firstChoiceTeam", value)
											}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select your first choice team" />
											</SelectTrigger>
											<SelectContent>
												{teamOptions.map((team) => (
													<SelectItem key={team} value={team}>
														{team}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									<div className="space-y-2">
										<Label htmlFor="secondChoiceTeam">
											What team is your second choice?{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Select
											name="secondChoiceTeam"
											value={formData.secondChoiceTeam}
											onValueChange={(value) =>
												handleSelectChange("secondChoiceTeam", value)
											}
											required
										>
											<SelectTrigger>
												<SelectValue placeholder="Select your second choice team" />
											</SelectTrigger>
											<SelectContent>
												{teamOptions.map((team) => (
													<SelectItem key={team} value={team}>
														{team}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Resume</CardTitle>
									<CardDescription>
										Upload your resume (PDF, DOC, or DOCX, max 10MB)
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Label htmlFor="resume">
											Submit your resume <span className="text-red-500">*</span>
										</Label>
										<Input
											id="resume"
											name="resume"
											type="file"
											accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
											onChange={handleFileChange}
											required
										/>
										{formData.resume && (
											<p className="text-sm text-green-600">
												Selected: {formData.resume.name}
											</p>
										)}
									</div>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>Application Questions</CardTitle>
									<CardDescription>
										Help us get to know you better
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="whyHackpsu">
											Why do you want to be a member of the HackPSU team?{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Textarea
											id="whyHackpsu"
											name="whyHackpsu"
											placeholder="Share your motivation for joining HackPSU..."
											value={formData.whyHackpsu}
											onChange={handleChange}
											rows={4}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="newIdea">
											What is one new idea you have for HackPSU (either in
											general or specific to a team)?{" "}
											<span className="text-red-500">*</span>
										</Label>
										<Textarea
											id="newIdea"
											name="newIdea"
											placeholder="Tell us your innovative idea..."
											value={formData.newIdea}
											onChange={handleChange}
											rows={4}
											required
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="whatExcitesYou">
											Tell us about what excites you! (Does NOT have to be
											HackPSU or tech related){" "}
											<span className="text-red-500">*</span>
										</Label>
										<Textarea
											id="whatExcitesYou"
											name="whatExcitesYou"
											placeholder="What are you passionate about?"
											value={formData.whatExcitesYou}
											onChange={handleChange}
											rows={4}
											required
										/>
									</div>
								</CardContent>
							</Card>

							<CardFooter className="flex flex-col space-y-4">
								<Button
									type="submit"
									className="w-full"
									size="lg"
									disabled={submitApplicationMutation.isPending}
								>
									{submitApplicationMutation.isPending
										? "Submitting..."
										: "Submit Application"}
								</Button>
								<p className="text-xs text-center text-muted-foreground">
									By submitting this form, you agree to be contacted via the
									email provided above.
								</p>
							</CardFooter>
						</form>
					</div>
				</div>
			</div>
		</>
	);
}
