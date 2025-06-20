"use client";

import React, {
	useState,
	ChangeEvent,
	FormEvent,
	useEffect,
	useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import BigButton from "@/components/common/BigButton";
import TelephoneFormatter from "@/components/common/TelephoneFormatter";
import Alert from "@/components/common/Alert";
import Autocomplete from "@/components/common/Autocomplete";

// React Query hooks for hackathon, user and registration operations:
import { useActiveHackathonForStatic } from "@/lib/api/hackathon";
import { useUpdateUser, useCreateUser, useReplaceUser } from "@/lib/api/user";
import { useCreateRegistration } from "@/lib/api/registration";

import "./register.css";
import { track } from "@vercel/analytics";

// Local interface for our registration form state.
interface RegistrationData {
	id: string;
	firstName: string;
	lastName: string;
	gender: "male" | "female" | "non-binary" | "no-disclose" | "";
	phoneNumber: string;
	race: string;
	veteran: string;
	age: number;
	shirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "";
	country: string;
	driving: boolean;
	firstHackathon: boolean;
	hasDietaryRestrictionsOrAllegies: boolean;
	dietaryRestrictions: string | null;
	allergies: string | null;
	major: string;
	university: string;
	academicYear:
		| "freshman"
		| "sophomore"
		| "junior"
		| "senior"
		| "graduate"
		| "other"
		| "";
	educationalInstitutionType: string;
	resume: File | null;
	mlhCoc: boolean;
	mlhDcp: boolean;
	shareEmailMlh: boolean;
	time: number;
	codingExperience: "none" | "beginner" | "intermediate" | "advanced" | "";
	referral: string;
	project: string;
	expectations: string;
	linkedinUrl?: string;
}

const Registration: React.FC = () => {
	// Local form state.
	const [registrationData, setRegistrationData] = useState<RegistrationData>({
		id: "",
		firstName: "",
		lastName: "",
		gender: "",
		phoneNumber: "",
		race: "",
		veteran: "",
		age: 0,
		shirtSize: "",
		country: "",
		driving: false,
		firstHackathon: false,
		hasDietaryRestrictionsOrAllegies: false,
		dietaryRestrictions: null,
		allergies: null,
		major: "",
		university: "",
		academicYear: "",
		educationalInstitutionType: "",
		resume: null,
		mlhCoc: false,
		mlhDcp: false,
		shareEmailMlh: false,
		time: 0,
		codingExperience: "",
		referral: "",
		project: "",
		expectations: "",
		linkedinUrl: "",
	});
	const [componentMounted, setComponentMounted] = useState(false);
	const [selectedSidebarField, setSelectedSidebarField] = useState("");

	// Alert state.
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");
	const [alertSeverity, setAlertSeverity] = useState<
		"error" | "warning" | "info" | "success" | ""
	>("");

	// Firebase authentication.
	const { user, isAuthenticated } = useFirebase();
	const router = useRouter();

	// Get the active hackathon via React Query.
	const {
		data: hackathon,
		isLoading: hackathonLoading,
		error: hackathonError,
	} = useActiveHackathonForStatic();

	// Sidebar fields mapping.
	const sidebarFields: Map<string, string> = new Map<string, string>([
		["General", "name"],
		["Shirt Size", "shirtSize"],
		["Dietary Restrictions", "dietaryAllergies"],
		["Education", "educationalInstitutionType"],
		["MLH Code of Conduct", "mlhCoc"],
		["MLH Data Sharing", "mlhDcp"],
		["Additional Questions", "codingExperience"],
	]);

	// Scroll handler.
	const handleScroll = (scrollTo: string) => {
		const element = document.getElementById(scrollTo);
		if (!element) return;
		const offset = 100;
		const elementRect = element.getBoundingClientRect().top;
		const absoluteElementTop = elementRect + window.scrollY;
		const scrollToPosition = absoluteElementTop - offset;
		window.scrollTo({ top: scrollToPosition, behavior: "smooth" });
	};

	// Sidebar selection handler.
	const handleSidebarSelect = (field: string) => {
		if (field === selectedSidebarField) {
			setSelectedSidebarField("");
		} else {
			setSelectedSidebarField(field);
			handleScroll(sidebarFields.get(field) ?? "");
		}
	};

	// Set component mounted to avoid hydration issues.
	useEffect(() => {
		setComponentMounted(true);
	}, []);

	// If the user data has loaded, set the registration user ID.
	useEffect(() => {
		if (isAuthenticated) {
			setRegistrationData((prevData) => ({
				...prevData,
				id: user?.uid ?? "",
			}));
		} else {
			//alert("You must be signed in to register for HackPSU. Redirecting...");
			router.push("/signin");
		}
	}, [isAuthenticated, user, router]);

	// Helper function for alerts.
	const alertFn = (
		message: string,
		severity: "error" | "warning" | "info" | "success" | "" = "error"
	) => {
		setAlertMessage(message);
		setAlertSeverity(severity);
		setShowAlert(true);
	};

	// Standard change handlers.
	const handleChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = event.target;
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		setShowAlert(false);
	};

	const handleNumericSelectionChange = (
		event: ChangeEvent<HTMLSelectElement>
	) => {
		const { name, value } = event.target;
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: Number(value),
		}));
		setShowAlert(false);
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name } = event.target;
		const checkboxes = document.querySelectorAll<HTMLInputElement>(
			`input[name="${name}"]:checked`
		);
		const values = Array.from(checkboxes).map((checkbox) => checkbox.value);
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: values.join(", "),
		}));
		setShowAlert(false);
	};

	const handlePhoneInput = (name: string, phone: string) => {
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: phone,
		}));
		setShowAlert(false);
	};

	const handleToggle = (name: string, isChecked: boolean) => {
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: isChecked,
		}));
		setShowAlert(false);
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, files } = event.target;
		if (files) {
			setRegistrationData((prevData) => ({
				...prevData,
				[name]: files[0],
			}));
		}
		setShowAlert(false);
	};

	const handleAutocompleteChange = (name: string, value: string) => {
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		setShowAlert(false);
	};

	// Allow the user to download the resume file.
	const downloadResume = () => {
		const resume = registrationData.resume;
		if (resume) {
			const url = URL.createObjectURL(resume);
			const a = document.createElement("a");
			a.href = url;
			a.download = resume.name;
			document.body.appendChild(a);
			a.click();
			URL.revokeObjectURL(url);
		}
	};

	// Set up React Query mutations.
	const createRegistrationMutation = useCreateRegistration();
	const updateUserMutation = useReplaceUser();
	// (Optionally, you might also include useCreateUser if needed.)

	// Form submission handler.
	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Validate required fields.
		const requiredFields: { [key: string]: any } = {
			id: null,
			firstName: null,
			lastName: null,
			gender: null,
			phoneNumber: null,
			veteran: null,
			age: null,
			shirtSize: null,
			country: null,
			driving: null,
			firstHackathon: null,
			major: null,
			university: null,
			academicYear: null,
			educationalInstitutionType: null,
			mlhCoc: true,
			mlhDcp: true,
			referral: null,
		};

		const validationData: any = registrationData;
		for (let [key, value] of Object.entries(requiredFields)) {
			if (key === "id") {
				if (!validationData.id) {
					console.error("User not logged in; no user id found.");
					alertFn("You must be logged in to register for HackPSU.");
					return;
				} else {
					continue;
				}
			}
			const element = document.getElementById(key);
			if (!element) {
				console.error(`Element with ID ${key} not found.`);
				continue;
			}
			if (validationData[key] === undefined || validationData[key] === "") {
				// For name fields, scroll to the container.
				if (key === "firstName" || key === "lastName") {
					key = "name";
				}
				handleScroll(key);
				alertFn("Please fill out all required fields.");
				return;
			} else if (value !== null && validationData[key] !== value) {
				handleScroll(key);
				return;
			}
			if (validationData.age < 18) {
				alertFn("You must be 18 years or older to participate.");
				handleScroll("age");
				return;
			}
		}

		// Build the user object for the database.
		const newUser = {
			firstName: registrationData.firstName,
			lastName: registrationData.lastName,
			gender: registrationData.gender,
			shirtSize: registrationData.shirtSize,
			dietaryRestriction: registrationData.dietaryRestrictions ?? "",
			allergies: registrationData.allergies ?? "",
			university: registrationData.university,
			email: user?.email ?? "",
			major: registrationData.major,
			phone: registrationData.phoneNumber,
			country: registrationData.country,
			race: registrationData.race ?? "",
			linkedinUrl: registrationData.linkedinUrl ?? "",
		};

		// Update the user in the database.
		try {
			await updateUserMutation.mutateAsync({
				id: registrationData.id,
				data: newUser,
			});
		} catch (err) {
			console.error("Error updating user:", err);
			// Optionally, try creating the user if update fails.
		}

		// Build the registration object (include the hackathon ID if available).
		const registration = {
			travelReimbursement: false,
			driving: registrationData.driving,
			firstHackathon: registrationData.firstHackathon,
			academicYear: registrationData.academicYear,
			educationalInstitutionType: registrationData.educationalInstitutionType,
			codingExperience: registrationData.codingExperience,
			age: registrationData.age,
			mlhCoc: registrationData.mlhCoc,
			mlhDcp: registrationData.mlhDcp,
			referral: registrationData.referral,
			project: registrationData.project,
			expectations: registrationData.expectations,
			shareEmailMlh: registrationData.shareEmailMlh,
			veteran: registrationData.veteran,
			time: Date.now(),
		};

		// Create the registration entry.
		try {
			await createRegistrationMutation.mutateAsync({
				userId: registrationData.id,
				data: registration,
			});
			track("registration", {
				user: registrationData.id,
			});
			alertFn("You are now registered for the hackathon!", "success");
			setTimeout(() => {
				router.push("/profile");
			}, 3000);
		} catch (err: any) {
			console.error("Error creating registration:", err);
			alertFn("You are already registered for the Hackathon!", "warning");
		}
	};

	if (!componentMounted || hackathonLoading) {
		return <div>Loading...</div>;
	}
	if (hackathonError) {
		return <div>Error loading hackathon data.</div>;
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="mt-10 mx-auto w-4/5 md:w-[480px]">
					<div className="m-2 text-center cornerstone-font">
						<h1 className="text-4xl font-bold mb-2">Registration</h1>
						<div>
							for our{" "}
							<span className="inline font-bold text-lime-400">
								{hackathon?.name ?? ""}
							</span>{" "}
							Hackathon!
						</div>
					</div>

					<form className="form" onSubmit={handleSubmit}>
						{/** Name */}
						<div className="card" id="name">
							<div>
								<div className="card-header">What is your name?</div>
								<label htmlFor="firstName" className="label">
									First Name
								</label>
								<div className="my-2">
									<input
										id="firstName"
										name="firstName"
										onChange={handleChange}
									/>
								</div>
								<label htmlFor="lastName" className="label">
									Last Name
								</label>
								<div className="my-2">
									<input
										id="lastName"
										name="lastName"
										onChange={handleChange}
									/>
								</div>
								{(!registrationData.firstName ||
									!registrationData.lastName) && (
									<label className="data-error">Required</label>
								)}
							</div>
						</div>
						{/** Gender */}
						<div className="card" id="gender">
							<div className="card-header">
								Which gender do you identify with?
							</div>
							<div className="my-2">
								<input
									type="radio"
									name="gender"
									value="male"
									id="male"
									onChange={handleChange}
								/>
								<label htmlFor="male">Male</label>
								<br />
								<input
									type="radio"
									name="gender"
									value="female"
									id="female"
									onChange={handleChange}
								/>
								<label htmlFor="female">Female</label>
								<br />
								<input
									type="radio"
									name="gender"
									value="non-binary"
									id="non-binary"
									onChange={handleChange}
								/>
								<label htmlFor="non-binary">Non-Binary</label>
								<br />
								<input
									type="radio"
									name="gender"
									value="no-disclose"
									id="no-disclose"
									onChange={handleChange}
								/>
								<label htmlFor="no-disclose">Prefer not to disclose</label>
								<br />
								{!registrationData.gender && (
									<label className="data-error">Required</label>
								)}
							</div>
						</div>
						{/** Phone Number */}
						<div className="card" id="phoneNumber">
							<div className="card-header">What is your phone number?</div>
							<div className="info">
								This information is required by MLH. We won’t spam your phone.
							</div>
							<div className="my-2">
								<TelephoneFormatter
									name="phoneNumber"
									onChange={handlePhoneInput}
								/>
							</div>
							{!registrationData.phoneNumber && (
								<label className="data-error">Required</label>
							)}
						</div>
						{/** Race/Ethnicity */}
						<div className="card" id="raceEthnicity">
							<div className="card-header">What is your race/ethnicity?</div>
							<div className="my-2">
								<input
									type="checkbox"
									id="native"
									name="race"
									value="native"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="native">Native American or Alaska Native</label>
								<br />
								<input
									type="checkbox"
									id="asian"
									name="race"
									value="asian"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="asian">Asian</label>
								<br />
								<input
									type="checkbox"
									id="african"
									name="race"
									value="african"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="african">Black or African American</label>
								<br />
								<input
									type="checkbox"
									id="latinx"
									name="race"
									value="latinx"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="latinx">Hispanic or Latinx</label>
								<br />
								<input
									type="checkbox"
									id="pacific"
									name="race"
									value="pacific"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="pacific">
									Native Hawaiian or Other Pacific Islander
								</label>
								<br />
								<input
									type="checkbox"
									id="caucasian"
									name="race"
									value="caucasian"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="caucasian">Caucasian</label>
								<br />
								<input
									type="checkbox"
									id="noDisclose"
									name="race"
									value="noDisclose"
									onChange={handleCheckboxChange}
								/>
								<label htmlFor="noDisclose">Prefer not to disclose</label>
							</div>
						</div>
						{/** Veteran */}
						<div className="card" id="veteran">
							<div className="card-header">Are you a veteran?</div>
							<div className="my-2">
								<input
									type="radio"
									name="veteran"
									value="yes"
									id="yes"
									onChange={handleChange}
								/>
								<label htmlFor="yes">Yes</label>
								<br />
								<input
									type="radio"
									name="veteran"
									value="no"
									id="no"
									onChange={handleChange}
								/>
								<label htmlFor="no">No</label>
								<br />
								<input
									type="radio"
									name="veteran"
									value="no-disclose"
									id="no-disclose-veteran"
									onChange={handleChange}
								/>
								<label htmlFor="no-disclose-veteran">
									Prefer not to disclose
								</label>
								<br />
								{!registrationData.veteran && (
									<label className="data-error">Required</label>
								)}
							</div>
						</div>
						{/** Age */}
						<div className="card" id="age">
							<div className="card-header">
								What will your age be on{" "}
								{hackathon?.startTime
									? new Date(hackathon.startTime).toISOString().split("T")[0]
									: "the event date"}
								?
								<p className="info">
									You must be 18 years or older to participate.
								</p>
							</div>
							<select
								name="age"
								onChange={handleNumericSelectionChange}
								value={registrationData.age}
							>
								<option value={0}>Select age</option>
								{Array.from({ length: 89 }, (_, i) => (
									<option key={i + 12} value={i + 12}>
										{i + 12}
									</option>
								))}
							</select>
							<br />
							{!registrationData.age && (
								<label className="data-error">Required</label>
							)}
						</div>
						{!!registrationData.age && (
							<>
								{/** Shirt Size */}
								<div className="card" id="shirtSize">
									<div className="card-header">What is your shirt size?</div>
									<div className="my-2">
										{["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
											<React.Fragment key={size}>
												<input
													type="radio"
													name="shirtSize"
													value={size}
													id={size}
													onChange={handleChange}
												/>
												<label htmlFor={size}>
													{size === "XS"
														? "X-Small"
														: size === "XXL"
															? "XX-Large"
															: size}
												</label>
												<br />
											</React.Fragment>
										))}
										{!registrationData.shirtSize && (
											<label className="data-error">Required</label>
										)}
									</div>
								</div>
								{/** Country */}
								<div className="card" id="country">
									<div className="card-header">
										What is your country of residence?
									</div>
									<div className="my-2">
										<Autocomplete
											data="country"
											onSelectionChange={handleAutocompleteChange}
										/>
									</div>
									{!registrationData.country && (
										<label className="data-error">Required</label>
									)}
								</div>
								{/** Driving */}
								<div className="card" id="driving">
									<div className="card-header">
										Will you be driving to the event?
									</div>
									<ToggleSwitch
										name="driving"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
								</div>
								{/** First Hackathon */}
								<div className="card" id="firstHackathon">
									<div className="card-header">
										Is this your first hackathon?
									</div>
									<ToggleSwitch
										name="firstHackathon"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
								</div>
								{/** Dietary Restrictions and Allergies */}
								<div className="card" id="dietaryAllergies">
									<div className="card-header">
										Do you have any dietary restrictions or allergies?
									</div>
									<ToggleSwitch
										name="hasDietaryRestrictionsOrAllegies"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
									{registrationData.hasDietaryRestrictionsOrAllegies && (
										<>
											<label htmlFor="dietaryRestrictions" className="label">
												Dietary Restrictions
											</label>
											<div className="my-2">
												<input
													id="dietaryRestrictions"
													name="dietaryRestrictions"
													onChange={handleChange}
												/>
											</div>
											<label htmlFor="allergies" className="label">
												Allergies
											</label>
											<div className="my-2">
												<input
													id="allergies"
													name="allergies"
													onChange={handleChange}
												/>
											</div>
										</>
									)}
								</div>
								{/** Major */}
								<div className="card" id="major">
									<div className="card-header">
										What is your (intended) major?
									</div>
									<div className="my-2">
										<Autocomplete
											data="major"
											onSelectionChange={handleAutocompleteChange}
										/>
									</div>
									{!registrationData.major && (
										<label className="data-error">Required</label>
									)}
								</div>
								{/** University */}
								<div className="card" id="university">
									<div className="card-header">What school do you attend?</div>
									<div className="my-2">
										<Autocomplete
											data="university"
											onSelectionChange={handleAutocompleteChange}
										/>
									</div>
									{!registrationData.university && (
										<label className="data-error">Required</label>
									)}
								</div>
								{/** Academic Year */}
								<div className="card" id="academicYear">
									<div className="card-header">What is your academic year?</div>
									<div className="my-2">
										{[
											"freshman",
											"sophomore",
											"junior",
											"senior",
											"graduate",
											"other",
										].map((year) => (
											<React.Fragment key={year}>
												<input
													type="radio"
													name="academicYear"
													value={year}
													id={year}
													onChange={handleChange}
												/>
												<label htmlFor={year}>
													{year.charAt(0).toUpperCase() + year.slice(1)}
												</label>
												<br />
											</React.Fragment>
										))}
										{!registrationData.academicYear && (
											<label className="data-error">Required</label>
										)}
									</div>
								</div>
								{/** Educational Institution Type */}
								<div className="card" id="educationalInstitutionType">
									<div className="card-header">
										What type of educational institution are you enrolled in?
									</div>
									<div className="my-2">
										{[
											{
												value: "less-than-secondary",
												label: "Less than Secondary / High School",
											},
											{
												value: "secondary",
												label: "Secondary / High School",
											},
											{
												value: "two-year-university",
												label:
													"Undergraduate University (2 year - community college or similar)",
											},
											{
												value: "three-plus-year-university",
												label: "Undergraduate University (3+ year)",
											},
											{
												value: "graduate-university",
												label:
													"Graduate University (Masters, Professional, Doctoral, etc.)",
											},
											{
												value: "post-doctorate",
												label: "Post Doctorate",
											},
											{
												value: "code-school-or-bootcamp",
												label: "Code School / Bootcamp",
											},
											{
												value: "vocational-trade-apprenticeship",
												label:
													"Other Vocational / Trade Program or Apprenticeship",
											},
											{
												value: "other",
												label: "Other",
											},
											{
												value: "not-a-student",
												label: "I'm not currently a student",
											},
											{
												value: "prefer-no-answer",
												label: "Prefer not to answer",
											},
										].map((option) => (
											<React.Fragment key={option.value}>
												<input
													type="radio"
													name="educationalInstitutionType"
													value={option.value}
													id={option.value}
													onChange={handleChange}
												/>
												<label htmlFor={option.value}>{option.label}</label>
												<br />
											</React.Fragment>
										))}
										{!registrationData.educationalInstitutionType && (
											<label className="data-error">Required</label>
										)}
									</div>
								</div>
								{/** Resume */}
								<div className="card" id="resume">
									<div className="card-header">Submit a PDF of your resume</div>
									<div className="info">
										If a resume is submitted, it will be shared with employers
										sponsoring HackPSU.
									</div>
									<div className="flex justify-center w-full my-2">
										<div className="file-upload-container">
											<input
												type="file"
												id="resume-input"
												name="resume"
												className="input-file"
												onChange={handleFileChange}
												accept="application/pdf"
											/>
											<label
												htmlFor="resume-input"
												className="file-upload-button"
											>
												Upload Resume
											</label>
										</div>
									</div>
									{registrationData.resume && (
										<a className="resume-download" onClick={downloadResume}>
											{(registrationData.resume as File).name}
										</a>
									)}
								</div>
								{/**Linkedin URLs */}
								<div className="card" id="linkedinUrl">
									<div className="card-header">
										What is your LinkedIn profile URL?
									</div>
									<div className="my-2">
										<input
											id="linkedinUrl"
											name="linkedinUrl"
											placeholder="https://www.linkedin.com/in/yourprofile"
											className="rounded-lg shadow-md"
											onChange={handleChange}
										/>
									</div>
								</div>
								{/** MLH Code of Conduct */}
								<div className="card" id="mlhCoc">
									<div className="card-header">
										Do you agree to the MLH Code of Conduct?
									</div>
									<span>
										<p className="inline">I have read and agree to the&nbsp;</p>
										<a
											href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
											target="_blank"
											rel="noopener noreferrer"
										>
											MLH Code of Conduct
										</a>
										<p className="info">
											To participate at HackPSU, you must agree to this policy.
										</p>
									</span>
									<ToggleSwitch
										name="mlhCoc"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
									{!registrationData.mlhCoc && (
										<label className="data-error">Required</label>
									)}
								</div>
								{/** MLH Data Sharing */}
								<div className="card" id="mlhDcp">
									<div className="card-header">
										Do you agree to the MLH Data Sharing?
									</div>
									<span>
										By agreeing, you authorize MLH to share your registration
										information with event sponsors and MLH as outlined in the{" "}
										<a
											href="https://mlh.io/privacy"
											target="_blank"
											rel="noopener noreferrer"
										>
											MLH Privacy Policy
										</a>
										.
										<p className="info">
											To participate at HackPSU, you must agree to this policy.
										</p>
									</span>
									<ToggleSwitch
										name="mlhDcp"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
									{!registrationData.mlhDcp && (
										<label className="data-error">Required</label>
									)}
								</div>
								{/** Share Email with MLH */}
								<div className="card" id="shareEmailMlh">
									<div className="card-header">
										Do you want to opt into further communications from MLH?
									</div>
									<span>
										<p className="inline">
											I authorize MLH to send me occasional emails about
											relevant events and opportunities.
										</p>
										<br />
										<br />
										<p className="info">This is entirely optional.</p>
									</span>
									<ToggleSwitch
										name="shareEmailMlh"
										on="Yes"
										off="No"
										onChange={handleToggle}
									/>
								</div>
								{registrationData.mlhCoc && registrationData.mlhDcp && (
									<>
										{/** Coding Experience */}
										<div className="card" id="codingExperience">
											<div className="card-header">
												What is your level of coding experience?
											</div>
											<div className="my-2">
												<input
													type="radio"
													name="codingExperience"
													value="none"
													id="none"
													onChange={handleChange}
												/>
												<label htmlFor="none">None</label>
												<br />
												<input
													type="radio"
													name="codingExperience"
													value="beginner"
													id="beginner"
													onChange={handleChange}
												/>
												<label htmlFor="beginner">Beginner (0-2 years)</label>
												<br />
												<input
													type="radio"
													name="codingExperience"
													value="intermediate"
													id="intermediate"
													onChange={handleChange}
												/>
												<label htmlFor="intermediate">
													Intermediate (2-4 years)
												</label>
												<br />
												<input
													type="radio"
													name="codingExperience"
													value="advanced"
													id="advanced"
													onChange={handleChange}
												/>
												<label htmlFor="advanced">
													Advanced (&gt; 4 years)
												</label>
												<br />
											</div>
										</div>
										{/** Referral */}
										<div className="card" id="referral">
											<div className="card-header">
												Where did you hear about HackPSU?
											</div>
											<div className="my-2">
												<Autocomplete
													data="referral"
													onSelectionChange={handleAutocompleteChange}
													searchTermMin={1}
												/>
											</div>
											{!registrationData.referral && (
												<label className="data-error">Required</label>
											)}
										</div>
										{/** Project */}
										<div className="card" id="project">
											<div className="card-header">
												What is a project you’re proud of?
											</div>
											<div className="my-2">
												<textarea
													id="project"
													name="project"
													onChange={handleChange}
												/>
											</div>
										</div>
										{/** Expectations */}
										<div className="card" id="expectations">
											<div className="card-header">
												What would you like to get out of HackPSU?
											</div>
											<div className="my-2">
												<textarea
													id="expectations"
													name="expectations"
													onChange={handleChange}
												/>
											</div>
										</div>
										{/** Submit */}
										<div id="submit" className="flex items-center">
											<BigButton className="bg-blue-300 border rounded-full p-4 flex justify-center">
												<p className="text-white">Register</p>
											</BigButton>
										</div>
									</>
								)}
							</>
						)}
					</form>
				</div>
			</div>

			{/** Sidebar (shown on large screens) */}
			{typeof window !== "undefined" && window.innerWidth >= 1024 && (
				<div className="p-2 m-auto fixed top-0 left-0 h-full w-[300px] flex justify-center items-center hidden lg:flex">
					{registrationData.age ? (
						<div className="bg-white opacity-80 p-4 w-[225px] border rounded-lg flex flex-col absolute right-0">
							{Array.from(sidebarFields.keys()).map((field) =>
								field === "Additional Questions" &&
								(!registrationData.mlhCoc ||
									!registrationData.mlhDcp) ? null : (
									<a
										key={field}
										className={
											selectedSidebarField === field
												? "sidebar-selected"
												: "sidebar"
										}
										onClick={() => handleSidebarSelect(field)}
									>
										{field}
									</a>
								)
							)}
							<br />
							<p>
								Any issues? - Email us at <br />{" "}
								<a href="mailto:technology@hackpsu.org">
									technology@hackpsu.org
								</a>
							</p>
						</div>
					) : null}
				</div>
			)}

			{/** Alert */}
			{showAlert && (
				<Alert
					message={alertMessage}
					onClose={() => setShowAlert(false)}
					severity={alertSeverity}
				/>
			)}
		</>
	);
};

export default Registration;
