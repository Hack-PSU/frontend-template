"use client";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";

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

	async function fetchUserId() {
		// IMPLEMENT THIS
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
										type="firstName"
										required
										className="input"
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
										type="lastName"
										required
										className="input"
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>
						<div className="card" id="gender">
							<div className="card-header">
								Which gender do you identify with?
							</div>
						</div>
						<div className="card" id="phoneNumber">
							<div className="card-header">What is your phone number?</div>
						</div>
						<div className="card" id="raceEthnicity">
							<div className="card-header">What is your race/ethnicity?</div>
						</div>
						<div className="card" id="veteran">
							<div className="card-header">Are you a veteran?</div>
						</div>
						<div className="card" id="eighteenBeforeEvent">
							<div className="card-header">
								Will you be 18 years old before ***EVENT DATE***?
							</div>
						</div>
						<div className="card" id="shirtSize">
							<div className="card-header">What is your shirt size?</div>
						</div>
						<div className="card" id="country">
							<div className="card-header">What country are you from?</div>
						</div>
						<div className="card" id="driving">
							<div className="card-header">
								Will you be driving to the event?
							</div>
						</div>
						<div className="card" id="firstHackathon">
							<div className="card-header">Is this your first hackathon?</div>
						</div>
						<div className="card" id="dietaryAllergies">
							<div className="card-header">
								Do you have any dietary restrictions or allergies?
							</div>
							{/** conditional formatting if checked YES */}
						</div>
						<div className="card" id="major">
							<div className="card-header">What is your (intended) major?</div>
						</div>
						<div className="card" id="university">
							<div className="card-header">What school do you attend?</div>
						</div>
						<div className="card" id="academicYear">
							<div className="card-header">What is your academic year?</div>
						</div>
						<div className="card" id="educationalInstitutionType">
							<div className="card-header">
								What type of educational institution are you enrolled in?
							</div>
						</div>
						<div className="card" id="resume">
							<div className="card-header">Submit your resume</div>
						</div>
						<div className="card" id="mlhCoc">
							<div className="card-header">
								Do you agree to the MLH Code of Conduct?
							</div>
						</div>
						<div className="card" id="mlhDcp">
							<div className="card-header">
								Do you agree to the MLH Data Sharing
							</div>
						</div>
						<div className="card" id="shareEmailMlh">
							<div className="card-header">
								Do you want to opt into further communications from MLH?
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Registration;
