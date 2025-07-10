"use client";

import type * as React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import countries from "@/components/common/Autocomplete/assets/countries.json";
import universities from "@/components/common/Autocomplete/assets/schools.json";
import majors from "@/components/common/Autocomplete/assets/majors.json";
import referrals from "@/components/common/Autocomplete/assets/referrals.json";
import type { UserEntity } from "@/lib/api/user/entity";
import type {
	RegistrationEntity,
	RegistrationCreateEntity,
} from "@/lib/api/registration/entity";
import { useReplaceUser, useUserInfoMe } from "@/lib/api/user/hook";
import { useCreateRegistration } from "@/lib/api/registration/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon";
import { track } from "@vercel/analytics";

type FormData = Omit<UserEntity, "id" | "email" | "resume"> &
	Omit<
		RegistrationEntity,
		| "id"
		| "userId"
		| "hackathonId"
		| "time"
		| "shareAddressSponsors"
		| "travelReimbursement"
		| "shareAddressMlh"
	> & {
		resume: File | null;
		hasDietaryRestrictions: boolean;
	};

interface Section {
	id: string;
	title: string;
	isVisible: (formData: FormData) => boolean;
	isComplete: (formData: FormData) => boolean;
}

export default function RegistrationPage() {
	const router = useRouter();
	const { user } = useFirebase();
	const { data: userInfo, isLoading: isUserInfoLoading } = useUserInfoMe();
	const replaceUserMutation = useReplaceUser();
	const createRegistrationMutation = useCreateRegistration();
	const { data: hackathon } = useActiveHackathonForStatic();

	// Refs for sections
	const personalInfoRef = useRef<HTMLDivElement>(null);
	const logisticsRef = useRef<HTMLDivElement>(null);
	const dietaryRef = useRef<HTMLDivElement>(null);
	const educationRef = useRef<HTMLDivElement>(null);
	const mlhRef = useRef<HTMLDivElement>(null);
	const additionalRef = useRef<HTMLDivElement>(null);

	const [activeSection, setActiveSection] = useState("personal-info");

	const trackPageView = () => {
		if (user) {
			track("registration_page_view", {
				userId: user.uid,
			});
		}
	};

	useEffect(() => {
		trackPageView();
	}, [hackathon, user]);

	const [formData, setFormData] = useState<FormData>({
		firstName: "",
		lastName: "",
		gender: "",
		shirtSize: "",
		dietaryRestriction: "",
		allergies: "",
		university: "",
		major: "",
		phone: "",
		country: "",
		race: "",
		age: 0,
		educationalInstitutionType: "",
		academicYear: "",
		codingExperience: "",
		expectations: "",
		driving: false,
		firstHackathon: false,
		mlhCoc: false,
		mlhDcp: false,
		project: "",
		referral: "",
		shareEmailMlh: false,
		veteran: "",
		resume: null,
		hasDietaryRestrictions: false,
	});

	const [races, setRaces] = useState<string[]>([]);

	// Define sections
	const sections: Section[] = [
		{
			id: "personal-info",
			title: "Personal Information",
			isVisible: () => true,
			isComplete: (data) =>
				!!(
					data.firstName &&
					data.lastName &&
					data.gender &&
					data.phone &&
					data.race &&
					data.veteran &&
					data.age > 0
				),
		},
		{
			id: "logistics",
			title: "Logistics & Preferences",
			isVisible: (data) => data.age >= 18,
			isComplete: (data) => !!(data.shirtSize && data.country),
		},
		{
			id: "dietary",
			title: "Dietary Needs",
			isVisible: (data) => data.age >= 18,
			isComplete: (data) =>
				!data.hasDietaryRestrictions ||
				(data.hasDietaryRestrictions &&
					!!(data.dietaryRestriction || data.allergies)),
		},
		{
			id: "education",
			title: "Education & Professional",
			isVisible: (data) => data.age >= 18,
			isComplete: (data) =>
				!!(
					data.university &&
					data.major &&
					data.academicYear &&
					data.educationalInstitutionType
				),
		},
		{
			id: "mlh",
			title: "MLH Agreements",
			isVisible: (data) => data.age >= 18,
			isComplete: (data) => !!(data.mlhCoc && data.mlhDcp),
		},
		{
			id: "additional",
			title: "Additional Questions",
			isVisible: (data) => data.age >= 18 && data.mlhCoc && data.mlhDcp,
			isComplete: (data) => !!data.codingExperience,
		},
	];

	const visibleSections = sections.filter((section) =>
		section.isVisible(formData)
	);
	const completedSections = visibleSections.filter((section) =>
		section.isComplete(formData)
	);
	const progressPercentage = visibleSections.length
		? (completedSections.length / visibleSections.length) * 100
		: 0;

	const scrollToSection = (sectionId: string) => {
		const refs = {
			"personal-info": personalInfoRef,
			logistics: logisticsRef,
			dietary: dietaryRef,
			education: educationRef,
			mlh: mlhRef,
			additional: additionalRef,
		};

		const ref = refs[sectionId as keyof typeof refs];
		if (ref?.current) {
			ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(sectionId);
		}
	};

	// Intersection Observer to track active section
	useEffect(() => {
		const observers: IntersectionObserver[] = [];
		const refs = [
			{ ref: personalInfoRef, id: "personal-info" },
			{ ref: logisticsRef, id: "logistics" },
			{ ref: dietaryRef, id: "dietary" },
			{ ref: educationRef, id: "education" },
			{ ref: mlhRef, id: "mlh" },
			{ ref: additionalRef, id: "additional" },
		];

		refs.forEach(({ ref, id }) => {
			if (ref.current) {
				const observer = new IntersectionObserver(
					([entry]) => {
						if (entry.isIntersecting) {
							setActiveSection(id);
						}
					},
					{ threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
				);
				observer.observe(ref.current);
				observers.push(observer);
			}
		});

		return () => {
			observers.forEach((observer) => observer.disconnect());
		};
	}, [formData.age, formData.mlhCoc, formData.mlhDcp]);

	useEffect(() => {
		if (userInfo) {
			setFormData((prev) => ({
				...prev,
				firstName: userInfo.firstName || "",
				lastName: userInfo.lastName || "",
				gender: userInfo.gender || "",
				shirtSize: userInfo.shirtSize || "",
				dietaryRestriction: userInfo.dietaryRestriction || "",
				allergies: userInfo.allergies || "",
				university: userInfo.university || "",
				major: userInfo.major || "",
				phone: userInfo.phone || "",
				country: userInfo.country || "",
				race: "",
				hasDietaryRestrictions: !!(
					userInfo.dietaryRestriction || userInfo.allergies
				),
				...(userInfo.registration && {
					...userInfo.registration,
					age: userInfo.registration.age || 0,
				}),
			}));
			if (userInfo.race) {
				setRaces(userInfo.race.split(", "));
			}
		}
	}, [userInfo]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string | number) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSwitchChange = (name: string, checked: boolean) => {
		setFormData((prev) => ({ ...prev, [name]: checked }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFormData((prev) => ({
				...prev,
				resume: e.target.files?.[0] || null,
			}));
		}
	};

	const handleRaceChange = (checked: boolean, race: string) => {
		setRaces((prev) => {
			const newRaces = checked
				? [...prev, race]
				: prev.filter((r) => r !== race);
			setFormData((prevData) => ({ ...prevData, race: newRaces.join(", ") }));
			return newRaces;
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!user) {
			toast.error("You must be logged in to register.");
			return;
		}
		if (formData.age < 18) {
			toast.error("You must be 18 years or older to participate.");
			return;
		}
		if (!formData.mlhCoc || !formData.mlhDcp) {
			toast.error(
				"You must agree to the MLH Code of Conduct and Data Sharing Policy."
			);
			return;
		}

		const userData: Omit<UserEntity, "id" | "resume"> & {
			resume?: File | null | undefined;
		} = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: user?.email || "",
			gender: formData.gender,
			shirtSize: formData.shirtSize,
			dietaryRestriction: formData.dietaryRestriction,
			allergies: formData.allergies,
			university: formData.university,
			major: formData.major,
			phone: formData.phone,
			country: formData.country,
			race: formData.race,
		};

		if (formData.resume) {
			userData.resume = formData.resume;
		}

		const registrationData: RegistrationCreateEntity & { time: number } = {
			age: formData.age,
			educationalInstitutionType: formData.educationalInstitutionType,
			academicYear: formData.academicYear,
			codingExperience: formData.codingExperience,
			expectations: formData.expectations,
			driving: formData.driving,
			firstHackathon: formData.firstHackathon,
			mlhCoc: formData.mlhCoc,
			mlhDcp: formData.mlhDcp,
			project: formData.project,
			referral: formData.referral,
			shareEmailMlh: formData.shareEmailMlh,
			veteran: formData.veteran,
			time: Date.now(),
		};

		toast.promise(
			async () => {
				await replaceUserMutation.mutateAsync({
					id: user?.uid,
					data: userData,
				});
				await createRegistrationMutation.mutateAsync({
					userId: user?.uid,
					data: registrationData,
				});
			},
			{
				loading: "Submitting your registration...",
				success: () => {
					setTimeout(() => router.push("/profile"), 2000);
					return "Registration successful! Redirecting to your profile...";
				},
				error: (err: any) =>
					err?.message || "An error occurred during registration.",
			}
		);
	};

	if (isUserInfoLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p>Loading user data...</p>
			</div>
		);
	}

	const ageOptions = Array.from({ length: 89 }, (_, i) => (
		<SelectItem key={i + 12} value={String(i + 12)}>
			{i + 12}
		</SelectItem>
	));

	return (
		<>
			<Toaster richColors />
			<div className="text-foreground min-h-screen">
				<div className="flex">
					{/* Sidebar - Hidden on mobile, floating and vertically centered */}
					<div className="hidden xl:block fixed left-4 top-1/2 -translate-y-1/2 w-80 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-6 z-40 max-h-[80vh] overflow-y-auto">
						<div className="space-y-6">
							<div>
								<h2 className="text-lg font-semibold mb-2">
									Registration Progress
								</h2>
								<div className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>Progress</span>
										<span>{Math.round(progressPercentage)}%</span>
									</div>
									<Progress value={progressPercentage} className="h-2" />
									<p className="text-xs text-muted-foreground">
										{completedSections.length} of {visibleSections.length}{" "}
										sections completed
									</p>
								</div>
							</div>

							<div>
								<h3 className="text-sm font-medium mb-3">Sections</h3>
								<nav className="space-y-1">
									{visibleSections.map((section) => {
										const isComplete = section.isComplete(formData);
										const isActive = activeSection === section.id;

										return (
											<button
												key={section.id}
												onClick={() => scrollToSection(section.id)}
												className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-md transition-colors ${
													isActive
														? "bg-primary text-primary-foreground"
														: "hover:bg-muted"
												}`}
											>
												{isComplete ? (
													<CheckCircle className="h-4 w-4 text-green-500" />
												) : (
													<Circle className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="truncate">{section.title}</span>
											</button>
										);
									})}
								</nav>
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1 lg:ml-8 p-4 sm:p-6 lg:p-8">
						<div className="max-w-3xl mx-auto">
							<header className="text-center mb-8">
								<h1 className="text-4xl font-bold tracking-tight text-primary">
									Register for our {hackathon?.name} hackathon
								</h1>
								<p className="text-muted-foreground mt-2">
									Feel free to reach out to us at{" "}
									<a
										href="mailto:technology@hackpsu.org"
										className="text-primary underline"
									>
										<span className="">technology@hackpsu.org</span>
									</a>{" "}
									if you have any questions or concerns.
								</p>
							</header>

							<form onSubmit={handleSubmit} className="space-y-8">
								{/* Personal Information */}
								<div ref={personalInfoRef}>
									<Card>
										<CardHeader>
											<CardTitle>Personal Information</CardTitle>
											<CardDescription>
												Let&apos;s get to know you. This information is required
												for registration.
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="grid sm:grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label htmlFor="firstName">First Name</Label>
													<Input
														id="firstName"
														name="firstName"
														value={formData.firstName}
														onChange={handleChange}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="lastName">Last Name</Label>
													<Input
														id="lastName"
														name="lastName"
														value={formData.lastName}
														onChange={handleChange}
														required
													/>
												</div>
											</div>

											<div className="space-y-2">
												<Label>Gender</Label>
												<RadioGroup
													name="gender"
													value={formData.gender}
													onValueChange={(value) =>
														handleSelectChange("gender", value)
													}
													className="flex flex-wrap gap-4 pt-2"
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="male" id="male" />
														<Label htmlFor="male">Male</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="female" id="female" />
														<Label htmlFor="female">Female</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="non-binary"
															id="non-binary"
														/>
														<Label htmlFor="non-binary">Non-binary</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="no-disclose"
															id="no-disclose-gender"
														/>
														<Label htmlFor="no-disclose-gender">
															Prefer not to say
														</Label>
													</div>
												</RadioGroup>
											</div>

											<div className="space-y-2">
												<Label htmlFor="phone">Phone Number</Label>
												<Input
													id="phone"
													name="phone"
													type="tel"
													placeholder="(123) 456-7890"
													value={formData.phone}
													onChange={handleChange}
													required
												/>
											</div>

											<div className="space-y-2">
												<Label>Race/Ethnicity (Select all that apply)</Label>
												<div className="space-y-2 pt-2">
													{[
														"Native American or Alaska Native",
														"Asian",
														"Black or African American",
														"Hispanic or Latinx",
														"Native Hawaiian or Other Pacific Islander",
														"Caucasian",
													].map((race) => (
														<div
															key={race}
															className="flex items-center space-x-2"
														>
															<Checkbox
																id={race}
																checked={races.includes(race)}
																onCheckedChange={(checked) =>
																	handleRaceChange(!!checked, race)
																}
															/>
															<Label htmlFor={race} className="font-normal">
																{race}
															</Label>
														</div>
													))}
												</div>
											</div>

											<div className="space-y-2">
												<Label>Are you a veteran?</Label>
												<RadioGroup
													name="veteran"
													value={formData.veteran}
													onValueChange={(value) =>
														handleSelectChange("veteran", value)
													}
													className="flex flex-wrap gap-4 pt-2"
													required
												>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="yes" id="vet-yes" />
														<Label htmlFor="vet-yes">Yes</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem value="no" id="vet-no" />
														<Label htmlFor="vet-no">No</Label>
													</div>
													<div className="flex items-center space-x-2">
														<RadioGroupItem
															value="no-disclose"
															id="vet-no-disclose"
														/>
														<Label htmlFor="vet-no-disclose">
															Prefer not to say
														</Label>
													</div>
												</RadioGroup>
											</div>

											<div className="space-y-2">
												<Label htmlFor="age">
													Age (at the time of the event)
												</Label>
												<Select
													name="age"
													value={String(formData.age)}
													onValueChange={(value) =>
														handleSelectChange("age", Number(value))
													}
													required
												>
													<SelectTrigger>
														<SelectValue placeholder="Select your age" />
													</SelectTrigger>
													<SelectContent>{ageOptions}</SelectContent>
												</Select>
												<p className="text-sm text-muted-foreground">
													You must be 18 or older to participate.
												</p>
											</div>
										</CardContent>
									</Card>
								</div>

								{formData.age >= 18 && (
									<>
										{/* Logistics & Preferences */}
										<div ref={logisticsRef}>
											<Card>
												<CardHeader>
													<CardTitle>Logistics & Preferences</CardTitle>
												</CardHeader>
												<CardContent className="space-y-6">
													<div className="space-y-2">
														<Label htmlFor="shirtSize">
															T-Shirt Size (Unisex)
														</Label>
														<Select
															name="shirtSize"
															value={formData.shirtSize}
															onValueChange={(value) =>
																handleSelectChange("shirtSize", value)
															}
															required
														>
															<SelectTrigger>
																<SelectValue placeholder="Select a size" />
															</SelectTrigger>
															<SelectContent>
																{["XS", "S", "M", "L", "XL", "XXL"].map(
																	(size) => (
																		<SelectItem key={size} value={size}>
																			{size}
																		</SelectItem>
																	)
																)}
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label htmlFor="country">
															Country of Residence
														</Label>
														<Autocomplete
															data={Object.keys(countries)}
															value={formData.country}
															placeholder="Select your country"
															onSelectionChange={(value) =>
																handleSelectChange("country", value)
															}
														/>
													</div>

													<div className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<Label>Will you be driving to the event?</Label>
														</div>
														<Switch
															name="driving"
															checked={formData.driving}
															onCheckedChange={(checked) =>
																handleSwitchChange("driving", checked)
															}
														/>
													</div>

													<div className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<Label>Is this your first hackathon?</Label>
														</div>
														<Switch
															name="firstHackathon"
															checked={formData.firstHackathon}
															onCheckedChange={(checked) =>
																handleSwitchChange("firstHackathon", checked)
															}
														/>
													</div>
												</CardContent>
											</Card>
										</div>

										{/* Dietary Needs */}
										<div ref={dietaryRef}>
											<Card>
												<CardHeader>
													<CardTitle>Dietary Needs</CardTitle>
												</CardHeader>
												<CardContent className="space-y-6">
													<div className="flex items-center justify-between rounded-lg border p-4">
														<div className="space-y-0.5">
															<Label>
																Do you have any dietary restrictions or
																allergies?
															</Label>
														</div>
														<Switch
															name="hasDietaryRestrictions"
															checked={formData.hasDietaryRestrictions}
															onCheckedChange={(checked) =>
																handleSwitchChange(
																	"hasDietaryRestrictions",
																	checked
																)
															}
														/>
													</div>

													{formData.hasDietaryRestrictions && (
														<div className="space-y-4">
															<div className="space-y-2">
																<Label htmlFor="dietaryRestriction">
																	Dietary Restrictions
																</Label>
																<Textarea
																	id="dietaryRestriction"
																	name="dietaryRestriction"
																	placeholder="e.g., Vegetarian, Gluten-Free"
																	value={formData.dietaryRestriction}
																	onChange={handleChange}
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="allergies">Allergies</Label>
																<Textarea
																	id="allergies"
																	name="allergies"
																	placeholder="e.g., Peanuts, Shellfish"
																	value={formData.allergies}
																	onChange={handleChange}
																/>
															</div>
														</div>
													)}
												</CardContent>
											</Card>
										</div>

										{/* Education & Professional */}
										<div ref={educationRef}>
											<Card>
												<CardHeader>
													<CardTitle>Education & Professional</CardTitle>
												</CardHeader>
												<CardContent className="space-y-6">
													<div className="space-y-2">
														<Label htmlFor="university">
															School/University
														</Label>
														<Autocomplete
															data={Object.keys(universities)}
															value={formData.university}
															placeholder="Select your school"
															onSelectionChange={(value) =>
																handleSelectChange("university", value)
															}
														/>
													</div>

													<div className="space-y-2">
														<Label htmlFor="major">Major</Label>
														<Autocomplete
															data={Object.keys(majors)}
															value={formData.major}
															placeholder="Select your major"
															onSelectionChange={(value) =>
																handleSelectChange("major", value)
															}
														/>
													</div>

													<div className="space-y-2">
														<Label>Academic Year</Label>
														<RadioGroup
															name="academicYear"
															value={formData.academicYear}
															onValueChange={(value) =>
																handleSelectChange("academicYear", value)
															}
															className="flex flex-wrap gap-4 pt-2"
															required
														>
															{[
																"freshman",
																"sophomore",
																"junior",
																"senior",
																"graduate",
																"other",
															].map((year) => (
																<div
																	key={year}
																	className="flex items-center space-x-2"
																>
																	<RadioGroupItem value={year} id={year} />
																	<Label htmlFor={year} className="capitalize">
																		{year}
																	</Label>
																</div>
															))}
														</RadioGroup>
													</div>

													<div className="space-y-2">
														<Label>Educational Institution Type</Label>
														<Select
															name="educationalInstitutionType"
															value={formData.educationalInstitutionType}
															onValueChange={(value) =>
																handleSelectChange(
																	"educationalInstitutionType",
																	value
																)
															}
															required
														>
															<SelectTrigger>
																<SelectValue placeholder="Select institution type" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="less-than-secondary">
																	Less than Secondary / High School
																</SelectItem>
																<SelectItem value="secondary">
																	Secondary / High School
																</SelectItem>
																<SelectItem value="two-year-university">
																	Undergraduate University (2 year)
																</SelectItem>
																<SelectItem value="three-plus-year-university">
																	Undergraduate University (3+ year)
																</SelectItem>
																<SelectItem value="graduate-university">
																	Graduate University
																</SelectItem>
																<SelectItem value="code-school-or-bootcamp">
																	Code School / Bootcamp
																</SelectItem>
																<SelectItem value="other">Other</SelectItem>
															</SelectContent>
														</Select>
													</div>

													<div className="space-y-2">
														<Label htmlFor="resume">Resume (PDF only)</Label>
														<Input
															id="resume"
															name="resume"
															type="file"
															accept="application/pdf"
															onChange={handleFileChange}
														/>
														<p className="text-sm text-muted-foreground">
															Your resume will be shared with our sponsors.
														</p>
													</div>
												</CardContent>
											</Card>
										</div>

										{/* MLH Agreements */}
										<div ref={mlhRef}>
											<Card>
												<CardHeader>
													<CardTitle>MLH Agreements</CardTitle>
													<CardDescription>
														These are required to participate in the event.
													</CardDescription>
												</CardHeader>
												<CardContent className="space-y-6">
													<div className="flex items-start justify-between rounded-lg border p-4">
														<div className="space-y-1.5 pr-4">
															<Label>MLH Code of Conduct</Label>
															<p className="text-sm text-muted-foreground">
																I have read and agree to the{" "}
																<a
																	href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
																	target="_blank"
																	rel="noopener noreferrer"
																	className="underline"
																>
																	MLH Code of Conduct
																</a>
																.
															</p>
														</div>
														<Switch
															name="mlhCoc"
															checked={formData.mlhCoc}
															onCheckedChange={(checked) =>
																handleSwitchChange("mlhCoc", checked)
															}
														/>
													</div>

													<div className="flex items-start justify-between rounded-lg border p-4">
														<div className="space-y-1.5 pr-4">
															<Label>MLH Data Sharing</Label>
															<p className="text-sm text-muted-foreground">
																I authorize MLH to share my registration
																information with event sponsors as per the{" "}
																<a
																	href="https://mlh.io/privacy"
																	target="_blank"
																	rel="noopener noreferrer"
																	className="underline"
																>
																	MLH Privacy Policy
																</a>
																.
															</p>
														</div>
														<Switch
															name="mlhDcp"
															checked={formData.mlhDcp}
															onCheckedChange={(checked) =>
																handleSwitchChange("mlhDcp", checked)
															}
														/>
													</div>

													<div className="flex items-start justify-between rounded-lg border p-4">
														<div className="space-y-1.5 pr-4">
															<Label>MLH Communications (Optional)</Label>
															<p className="text-sm text-muted-foreground">
																I authorize MLH to send me occasional emails
																about relevant events and opportunities.
															</p>
														</div>
														<Switch
															name="shareEmailMlh"
															checked={formData.shareEmailMlh}
															onCheckedChange={(checked) =>
																handleSwitchChange("shareEmailMlh", checked)
															}
														/>
													</div>
												</CardContent>
											</Card>
										</div>

										{/* Additional Questions */}
										{formData.mlhCoc && formData.mlhDcp && (
											<div ref={additionalRef}>
												<Card>
													<CardHeader>
														<CardTitle>Additional Questions</CardTitle>
													</CardHeader>
													<CardContent className="space-y-6">
														<div className="space-y-2">
															<Label>Level of coding experience?</Label>
															<RadioGroup
																name="codingExperience"
																value={formData.codingExperience}
																onValueChange={(value) =>
																	handleSelectChange("codingExperience", value)
																}
																className="flex flex-wrap gap-4 pt-2"
																required
															>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem value="none" id="exp-none" />
																	<Label htmlFor="exp-none">None</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem
																		value="beginner"
																		id="exp-beginner"
																	/>
																	<Label htmlFor="exp-beginner">
																		Beginner (0-2 years)
																	</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem
																		value="intermediate"
																		id="exp-intermediate"
																	/>
																	<Label htmlFor="exp-intermediate">
																		Intermediate (2-4 years)
																	</Label>
																</div>
																<div className="flex items-center space-x-2">
																	<RadioGroupItem
																		value="advanced"
																		id="exp-advanced"
																	/>
																	<Label htmlFor="exp-advanced">
																		Advanced (4+ years)
																	</Label>
																</div>
															</RadioGroup>
														</div>

														<div className="space-y-2">
															<Label htmlFor="referral">
																How did you hear about us?
															</Label>
															<Autocomplete
																data={Object.keys(referrals)}
																value={formData.referral}
																placeholder="Select a source"
																onSelectionChange={(value) =>
																	handleSelectChange("referral", value)
																}
															/>
														</div>

														<div className="space-y-2">
															<Label htmlFor="project">
																What is a project you&apos;re proud of?
															</Label>
															<Textarea
																id="project"
																name="project"
																placeholder="Describe a project and your role in it..."
																value={formData.project}
																onChange={handleChange}
															/>
														</div>

														<div className="space-y-2">
															<Label htmlFor="expectations">
																What do you want to get out of this hackathon?
															</Label>
															<Textarea
																id="expectations"
																name="expectations"
																placeholder="e.g., Learn a new skill, meet new people, build something cool..."
																value={formData.expectations}
																onChange={handleChange}
															/>
														</div>
													</CardContent>
												</Card>
											</div>
										)}
									</>
								)}

								<CardFooter>
									<Button
										type="submit"
										className="w-full"
										size="lg"
										disabled={formData.age < 18}
									>
										Register
									</Button>
								</CardFooter>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
