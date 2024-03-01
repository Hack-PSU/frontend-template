"use client";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { getActiveHackathon } from "@/lib/common";
import { writeToDatabase } from "@/lib/database";
import { User } from "@/interfaces";
import BigButton from "@/components/common/BigButton";

/*
 * Registration is used to add a user to table of hackathon participants.
 * This is done by first creating the user,
 * then adding the user to the table of participants.
 */

import "./register.css";

const Registration: React.FC = () => {
	// TODO: update some generic strings to better reflect data (e.g. "male"/"female"/"other" for gender rather than string)
	interface RegistrationData extends FormData {
		id: string;
		firstName: string;
		lastName: string;
		gender: "male" | "female" | "non-binary" | "no-disclose" | "";
		phoneNumber: string;
		race: string;
		veteran: string;
		eighteenBeforeEvent: boolean;
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
		resume: any;
		mlhCoc: boolean;
		mlhDcp: boolean;
		shareEmailMlh: boolean;
		time: number;
		codingExperience: "none" | "beginner" | "intermediate" | "advanced" | "";
		referral: string;
		project: string;
		expectations: string;
	}

	const [registrationData, setRegistrationData] = useState<RegistrationData>({
		id: "",
		firstName: "",
		lastName: "",
		gender: "",
		phoneNumber: "",
		race: "",
		veteran: "",
		eighteenBeforeEvent: false,
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
	} as RegistrationData);
	const [componentMounted, setComponentMounted] = useState(false); // Handles hydration error

	const [hackathon, setHackathon] = useState<any>(null);

	let { user, isAuthenticated } = useFirebase();
	const router = useRouter();

	async function fetchHackathon() {
		const hackathon = await getActiveHackathon();
		setHackathon(hackathon);
	}

	useEffect(() => {
		fetchHackathon();
		setComponentMounted(true);
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			setRegistrationData((prevData) => ({
				...prevData,
				id: user?.uid ?? "",
			}));
		} else if (componentMounted) {
			void router.push("/");
		}
	}, [isAuthenticated]);

	const handleChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		console.log(registrationData);
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name } = event.target;

		const checkboxes = document.querySelectorAll<HTMLInputElement>(
			`input[name="${name}"]:checked`
		);
		const values = Array.from(checkboxes).map((checkbox) => checkbox.value);
		const valueString = values.join(", ");
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: valueString,
		}));
	};

	const handleToggle = (name: string, isChecked: boolean) => {
		console.log(name, isChecked);
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: isChecked,
		}));
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, files } = event.target;
		if (files) {
			const file = files[0];
			setRegistrationData((prevData) => ({
				...prevData,
				[name]: file,
			}));
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Validate required fields
		// Null indicates it is just necessary; a value indicates that it must be exactly that value
		const requiredFields = {
			id: null,
			firstName: null,
			lastName: null,
			gender: null,
			phoneNumber: null,
			veteran: null,
			eighteenBeforeEvent: true,
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

		// Check if all required fields are filled
		const validationData: any = registrationData as any;
		for (const [key, value] of Object.entries(requiredFields)) {
			const element = document.getElementById(key);

			if (!element) {
				// Necessary to avoid TypeScript error
				console.error(`Element with ID ${key} not found.`);
				continue;
			}

			if (validationData[key] === undefined || validationData[key] === "") {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
				return;
			} else if (value !== null && validationData[key] !== value) {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
				return;
			}
		}

		// Build user object
		const newUser: User = {
			id: registrationData.id,
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
		};

		const registrationUser = new FormData();
		Object.entries(newUser).forEach(([key, value]) => {
			registrationUser.append(key, value);
		});

		// Handle resume
		if (registrationData.resume) {
			registrationUser.append(
				"resume",
				registrationData.resume,
				registrationData.resume.name
			);
		}

		console.log("Sending FormData: ", registrationUser);

		// Write user to database
		const res: any = await writeToDatabase("users", registrationUser);

		if (res?.id) {
			// Success if post returns user that was created
			// Now, build the registration object
			const registration = {
				userId: res.id,
				travelReimbursement: false,
				driving: registrationData.driving,
				firstHackathon: registrationData.firstHackathon,
				academicYear: registrationData.academicYear,
				educationalInstitutionType: registrationData.educationalInstitutionType,
				codingExperience: registrationData.codingExperience,
				eighteenBeforeEvent: registrationData.eighteenBeforeEvent,
				mlhCoc: registrationData.mlhCoc,
				mlhDcp: registrationData.mlhDcp,
				referral: registrationData.referral,
				project: registrationData.project,
				expectations: registrationData.expectations,
				shareEmailMlh: registrationData.shareEmailMlh,
				veteran: registrationData.veteran,
				time: Date.now(),
			};

			const regRes: any = await writeToDatabase("registrations", registration);
			console.log("Registration response: ", regRes);
		}

		// Do something on success ??
	};

	if (!componentMounted) {
		return null;
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="m-2 text-center cornerstone-font">
						<h1 className="text-4xl font-bold mb-2">Registration</h1>
						<div>
							for our{" "}
							<div className="inline font-bold text-lime-400">
								{hackathon?.name ?? ""}
							</div>{" "}
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
										required
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
										required
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
									required
									value="male"
									id="male"
									onChange={handleChange}
								/>
								<label htmlFor="male">Male</label>
								<br />
								<input
									type="radio"
									name="gender"
									required
									value="female"
									id="female"
									onChange={handleChange}
								/>
								<label htmlFor="female">Female</label>
								<br />
								<input
									type="radio"
									name="gender"
									required
									value="non-binary"
									id="non-binary"
									onChange={handleChange}
								/>
								<label htmlFor="non-binary">Non-Binary</label>
								<br />
								<input
									type="radio"
									name="gender"
									required
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
								This information is required by MLH. Rest assured we won't be
								spamming your phone.
							</div>
							<div className="my-2">
								<input
									id="phoneNumber"
									name="phoneNumber"
									required
									onChange={handleChange}
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
									required
									value="yes"
									id="yes"
									onChange={handleChange}
								/>
								<label htmlFor="yes">Yes</label>
								<br />
								<input
									type="radio"
									name="veteran"
									required
									value="no"
									id="no"
									onChange={handleChange}
								/>
								<label htmlFor="no">No</label>
								<br />
								<input
									type="radio"
									name="veteran"
									required
									value="no-disclose"
									id="no-disclose-veteran"
									onChange={handleChange}
								/>
								<label htmlFor="no">Prefer not to disclose</label>
								<br />
								{!registrationData.veteran && (
									<label className="data-error">Required</label>
								)}
							</div>
						</div>
						{/** Eighteen Before Event */}
						<div className="card" id="eighteenBeforeEvent">
							<div className="card-header">
								Will you be 18 years old before{" "}
								{hackathon?.startTime
									? new Date(hackathon?.startTime).toISOString().split("T")[0]
									: "the event date"}
								?
							</div>
							<ToggleSwitch
								name="eighteenBeforeEvent"
								on="Yes"
								off="No"
								onChange={handleToggle}
							/>
							{!registrationData.eighteenBeforeEvent && (
								<label className="data-error">Required</label>
							)}
						</div>
						{registrationData.eighteenBeforeEvent && (
							<>
								{/** Shirt Size */}
								<div className="card" id="shirtSize">
									<div className="card-header">What is your shirt size?</div>
									<div className="my-2">
										<input
											type="radio"
											name="shirtSize"
											required
											value="XS"
											id="XS"
											onChange={handleChange}
										/>
										<label htmlFor="XS">X-Small</label>
										<br />
										<input
											type="radio"
											name="shirtSize"
											required
											value="S"
											id="S"
											onChange={handleChange}
										/>
										<label htmlFor="S">Small</label>
										<br />
										<input
											type="radio"
											name="shirtSize"
											required
											value="M"
											id="M"
											onChange={handleChange}
										/>
										<label htmlFor="M">Medium</label>
										<br />
										<input
											type="radio"
											name="shirtSize"
											required
											value="L"
											id="L"
											onChange={handleChange}
										/>
										<label htmlFor="L">Large</label>
										<br />
										<input
											type="radio"
											name="shirtSize"
											required
											value="XL"
											id="XL"
											onChange={handleChange}
										/>
										<label htmlFor="XL">X-Large</label>
										<br />
										<input
											type="radio"
											name="shirtSize"
											required
											value="XXL"
											id="XXL"
											onChange={handleChange}
										/>
										<label htmlFor="XXL">XX-Large</label>
										<br />
										{!registrationData.shirtSize && (
											<label className="data-error">Required</label>
										)}
									</div>
								</div>
								{/** Country */}
								<div className="card" id="country">
									<div className="card-header">What country are you from?</div>
									<div className="my-2">
										<input
											id="country"
											name="country"
											required
											onChange={handleChange}
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
										<input
											id="major"
											name="major"
											required
											onChange={handleChange}
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
										<input
											id="university"
											name="university"
											required
											onChange={handleChange}
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
										<input
											type="radio"
											name="academicYear"
											required
											value="freshman"
											id="freshman"
											onChange={handleChange}
										/>
										<label htmlFor="freshman">Freshman</label>
										<br />
										<input
											type="radio"
											name="academicYear"
											required
											value="sophomore"
											id="sophomore"
											onChange={handleChange}
										/>
										<label htmlFor="sophomore">Sophomore</label>
										<br />
										<input
											type="radio"
											name="academicYear"
											required
											value="junior"
											id="junior"
											onChange={handleChange}
										/>
										<label htmlFor="junior">Junior</label>
										<br />
										<input
											type="radio"
											name="academicYear"
											required
											value="senior"
											id="senior"
											onChange={handleChange}
										/>
										<label htmlFor="senior">Senior</label>
										<br />
										<input
											type="radio"
											name="academicYear"
											required
											value="graduate"
											id="graduate"
											onChange={handleChange}
										/>
										<label htmlFor="graduate">Graduate</label>
										<br />
										<input
											type="radio"
											name="academicYear"
											required
											value="other"
											id="other"
											onChange={handleChange}
										/>
										<label htmlFor="other">Other</label>
										<br />
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
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="less-than-secondary"
											id="less-than-secondary"
											onChange={handleChange}
										/>
										<label htmlFor="less-than-secondary">
											Less than Secondary / High School
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="secondary"
											id="secondary"
											onChange={handleChange}
										/>
										<label htmlFor="secondary">Secondary / High School</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="two-year-university"
											id="two-year-university"
											onChange={handleChange}
										/>
										<label htmlFor="two-year-university">
											Undergraduate University (2 year - community college or
											similar)
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="three-plus-year-university"
											id="three-plus-year-university"
											onChange={handleChange}
										/>
										<label htmlFor="three-plus-year-university">
											Undergraduate University (3+ year)
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="graduate-university"
											id="graduate-university"
											onChange={handleChange}
										/>
										<label htmlFor="graduate-university">
											Graduate University (Masters, Professional, Doctoral,
											etc.)
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="code-school-or-bootcamp"
											id="code-school-or-bootcamp"
											onChange={handleChange}
										/>
										<label htmlFor="code-school-or-bootcamp">
											Code School / Bootcamp
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="vocational-trade-apprenticeship"
											id="vocational-trade-apprenticeship"
											onChange={handleChange}
										/>
										<label htmlFor="vocational-trade-apprenticeship">
											Other Vocational / Trade Program or Apprenticeship
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="other"
											id="other"
											onChange={handleChange}
										/>
										<label htmlFor="other">Other</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="not-a-student"
											id="not-a-student"
											onChange={handleChange}
										/>
										<label htmlFor="not-a-student">
											I'm not currently a student
										</label>
										<br />
										<input
											type="radio"
											name="educationalInstitutionType"
											required
											value="prefer-no-answer"
											id="prefer-no-answer"
											onChange={handleChange}
										/>
										<label htmlFor="prefer-no-answer">
											Prefer not to answer
										</label>
										<br />

										{!registrationData.educationalInstitutionType && (
											<label className="data-error">Required</label>
										)}
									</div>
								</div>
								{/** Resume */}
								<div className="card" id="resume">
									<div className="card-header">Submit your resume</div>
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
										<div className="info">
											{
												(registrationData.resume as unknown as { name: string })
													?.name
											}
										</div>
									)}
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
										Do you agree to the MLH Data Sharing
									</div>
									<span>
										By agreeing to this notice, you affirm that: "I authorize
										you to share my registration information with Major League
										Hacking for event administration, ranking, MLH
										administration in-line with the&nbsp;
										<a href="https://mlh.io/privacy" target="_blank">
											MLH Privacy Policy
										</a>
										. I further agree to the terms of both the&nbsp;
										<a
											href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
											target="_blank"
										>
											MLH Contest Terms and Conditions
										</a>
										&nbsp;and the&nbsp;
										<a href="https://mlh.io/privacy" target="_blank">
											MLH Privacy Policy
										</a>
										."
										<br />
										<br />
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
											By agreeing to this, you affirm that: "I authorize MLH to
											send me an email where I can further opt into the MLH
											Hacker, Events, or Organizer Newsletters and other
											communications from MLH."
										</p>
										<br />
										<br />
										<p className="info">
											This is entirely optional and may be opted into of your
											choosing.
										</p>
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
												<input
													id="referral"
													name="referral"
													onChange={handleChange}
													required
												/>
											</div>
											{!registrationData.referral && (
												<label className="data-error">Required</label>
											)}
										</div>

										{/** Project */}
										<div className="card" id="project">
											<div className="card-header">
												What is a project you're proud of?
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
		</>
	);
};

export default Registration;
