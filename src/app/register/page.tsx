"use client";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import ToggleSwitch from "@/components/common/ToggleSwitch";

/*
 * Registration is used to add a user to table of hackathon participants.
 * This is done by first creating the user,
 * then adding the user to the table of participants.
 */

import "./register.css";

const Registration: React.FC = () => {
	// TODO: update some generic strings to better reflect data (e.g. "male"/"female"/"other" for gender rather than string)
	interface RegistrationData {
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
		educationalInstutionType: string;
		resume: string;
		mlhCoc: boolean;
		mlhDcp: boolean;
		shareEmailMlh: boolean;
		time: number;
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
		educationalInstutionType: "",
		resume: "",
		mlhCoc: false,
		mlhDcp: false,
		shareEmailMlh: false,
		time: 0,
	});
	const [componentMounted, setComponentMounted] = useState(false); // Handles hydration error

	// TODO: Implement hackathon fetch for date and semester

	async function fetchUserId() {
		// IMPLEMENT THIS
		console.log("hi");

		const id = "TEST_ID";
		setRegistrationData((prevData) => ({
			...prevData,
			id: id,
		}));
		return;
	}

	useEffect(() => {
		fetchUserId();
		setComponentMounted(true);
	}, []);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// console.log(name, value);
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

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// IMPLEMENT THIS
		console.log(registrationData);
	};

	if (!componentMounted) {
		return null;
	}

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="m-2 text-center">
						<h1 className="text-4xl font-bold">Registration</h1>
						<div>... for our Spring 2024 Hackathon!</div>
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
								Will you be 18 years old before ***EVENT DATE***?
							</div>
							<ToggleSwitch
								name="eighteenBeforeEvent"
								on="Yes"
								off="No"
								onChange={handleToggle}
							/>
						</div>

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
							<div className="card-header">Is this your first hackathon?</div>
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
							<div className="card-header">What is your (intended) major?</div>
							<div className="my-2">
								<input
									id="major"
									name="major"
									required
									onChange={handleChange}
								/>
							</div>
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
									name="educationalInstutionType"
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
									name="educationalInstutionType"
									required
									value="secondary"
									id="secondary"
									onChange={handleChange}
								/>
								<label htmlFor="secondary">Secondary / High School</label>
								<br />
								<input
									type="radio"
									name="educationalInstutionType"
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
									name="educationalInstutionType"
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
									name="educationalInstutionType"
									required
									value="graduate-university"
									id="graduate-university"
									onChange={handleChange}
								/>
								<label htmlFor="graduate-university">
									Graduate University (Masters, Professional, Doctoral, etc.)
								</label>
								<br />
								<input
									type="radio"
									name="educationalInstutionType"
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
									name="educationalInstutionType"
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
									name="educationalInstutionType"
									required
									value="other"
									id="other"
									onChange={handleChange}
								/>
								<label htmlFor="other">Other</label>
								<br />
								<input
									type="radio"
									name="educationalInstutionType"
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
									name="educationalInstutionType"
									required
									value="prefer-no-answer"
									id="prefer-no-answer"
									onChange={handleChange}
								/>
								<label htmlFor="prefer-no-answer">Prefer not to answer</label>
								<br />

								{!registrationData.educationalInstutionType && (
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
							<div className="my-2">
								<input
									type="file"
									id="resume"
									name="resume"
									required
									onChange={handleChange}
									accept="file/pdf"
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
								By agreeing to this notice, you affirm that: "I authorize you to
								share my registration information with Major League Hacking for
								event administration, ranking, MLH administration in-line with
								the&nbsp;
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
									By agreeing to this, you affirm that: "I authorize MLH to send
									me an email where I can further opt into the MLH Hacker,
									Events, or Organizer Newsletters and other communications from
									MLH."
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

						{/** Submit */}
					</form>
				</div>
			</div>
		</>
	);
};

export default Registration;
