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
import PersonalInfoForm from "./components/PersonalInfoForm";
import DietaryForm from "./components/DietaryForm";
import EducationForm from "./components/EducationForm";
import MLHForm from "./components/MLHForm";
import AdditionalQuestionsForm from "./components/AdditionalQuestionsForm";
import ResumeForm from "./components/ResumeForm"; // Import the new ResumeForm

// React Query hooks for hackathon, user and registration operations:
import { useActiveHackathonForStatic } from "@/lib/api/hackathon";
import { useUpdateUser, useCreateUser, useReplaceUser } from "@/lib/api/user";
import { useCreateRegistration } from "@/lib/api/registration";

import "./register.css";
import { track } from "@vercel/analytics";

// Local interface for our registration form state.
// Base type for RegistrationData remains the same.
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
}

// Define types for form errors
interface FormErrors {
	firstName?: string;
	lastName?: string;
	gender?: string;
	phoneNumber?: string;
	race?: string;
	veteran?: string;
	age?: string;
	shirtSize?: string;
	country?: string;
	// Add other fields as needed
	major?: string;
	university?: string;
	academicYear?: string;
	educationalInstitutionType?: string;
	mlhCoc?: string;
	mlhDcp?: string;
	codingExperience?: string;
	referral?: string;
	// No need for error props for driving, firstHackathon if not explicitly showing field-level error messages for them.
}

interface ValidationResult {
	errors: FormErrors;
	isValid: boolean;
	firstErrorField?: string;
}


const Registration: React.FC = () => {
	// Local form state.
	const [registrationData, setRegistrationData] = useState<RegistrationData>({
		id: "",
		firstName: "",
		lastName: "",
		gender: "",
		phoneNumber: "",
		race: "", // Will be a comma-separated string for multiple selections
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
	});
	const [componentMounted, setComponentMounted] = useState(false);
	const [selectedSidebarField, setSelectedSidebarField] = useState<string>(""); // Explicitly type
	const [formErrors, setFormErrors] = useState<FormErrors>({});


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

	// Sidebar fields mapping - updated to new section IDs
	const sidebarFields: Map<string, string> = new Map<string, string>([
		["General", "name"], // PersonalInfoForm: name section
		["Shirt Size", "shirtSize-section"], // PersonalInfoForm: shirt size section
		["Dietary Restrictions", "dietaryAllergies"], // DietaryForm
		["Education", "major-section"], // EducationForm: first field in this group
		["MLH Code of Conduct", "mlhCoc-section"], // MLHForm
		["MLH Data Sharing", "mlhDcp-section"], // MLHForm
		["Additional Questions", "codingExperience-section"], // AdditionalQuestionsForm
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

	// Specific handler for age, as it's numeric in state
	const handleAgeChange = (value: string) => {
		setRegistrationData((prevData) => ({
			...prevData,
			age: Number(value),
		}));
		setFormErrors((prevErrors) => ({ ...prevErrors, age: undefined }));
		setShowAlert(false);
	}

	const handleNumericSelectionChange = ( // Kept for other potential numeric selects if any
		event: ChangeEvent<HTMLSelectElement>
	) => {
		const { name, value } = event.target;
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: Number(value),
		}));
		setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
		setShowAlert(false);
	};

	const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value, checked } = event.target; // `name` here is "race"
		setRegistrationData((prevData) => {
			const currentSelection = prevData.race ? prevData.race.split(',') : [];
			let newSelection;
			if (checked) {
				newSelection = [...currentSelection, value];
			} else {
				newSelection = currentSelection.filter(item => item !== value);
			}
			return {
				...prevData,
				[name]: newSelection.join(','),
			};
		});
		setFormErrors((prevErrors) => ({ ...prevErrors, race: undefined }));
		setShowAlert(false);
	};


	const handlePhoneInput = (name: string, phone: string) => {
		setRegistrationData((prevData) => ({
			...prevData,
			[name]: phone,
		}));
		setFormErrors((prevErrors) => ({ ...prevErrors, phoneNumber: undefined }));
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
			[name]: value, // This is for the Autocomplete's `onSelectionChange`
		}));
		setFormErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
		setShowAlert(false);
	};

	// Wrapper for simple value changes for PersonalInfoForm text inputs
	const handlePersonalInfoChange = (field: keyof RegistrationData, value: string) => {
		setRegistrationData(prevData => ({ ...prevData, [field]: value }));
		setFormErrors(prevErrors => ({ ...prevErrors, [field]: undefined }));
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
		setFormErrors({}); // Clear previous errors
		let accumulatedErrors: FormErrors = {};
		let firstErrorField: string | undefined = undefined;
		let overallIsValid = true;

		// User ID check (fundamental requirement)
		if (!registrationData.id) {
			console.error("User not logged in; no user id found.");
			alertFn("You must be logged in to register for HackPSU. Redirecting to signin page...");
			setTimeout(() => router.push("/signin"), 3000); // Redirect after a delay
			return;
		}

		// Validate Personal Info
		const personalInfoValidation = _validatePersonalInfo(registrationData);
		if (!personalInfoValidation.isValid) {
			overallIsValid = false;
			accumulatedErrors = { ...accumulatedErrors, ...personalInfoValidation.errors };
			if (!firstErrorField) firstErrorField = personalInfoValidation.firstErrorField;
		}

		// Validate Education Info (assuming it's always required if personal info is valid)
		const educationInfoValidation = _validateEducationInfo(registrationData);
		if (!educationInfoValidation.isValid) {
			overallIsValid = false;
			accumulatedErrors = { ...accumulatedErrors, ...educationInfoValidation.errors };
			if (!firstErrorField) firstErrorField = educationInfoValidation.firstErrorField;
		}

		// Validate MLH Agreements
		const mlhAgreementsValidation = _validateMlhAgreements(registrationData);
		if (!mlhAgreementsValidation.isValid) {
			overallIsValid = false;
			accumulatedErrors = { ...accumulatedErrors, ...mlhAgreementsValidation.errors };
			if (!firstErrorField) firstErrorField = mlhAgreementsValidation.firstErrorField;
		}

		// Validate Additional Questions (only if MLH agreements are met)
		if (registrationData.mlhCoc && registrationData.mlhDcp) {
			const additionalQuestionsValidation = _validateAdditionalQuestions(registrationData);
			if (!additionalQuestionsValidation.isValid) {
				overallIsValid = false;
				accumulatedErrors = { ...accumulatedErrors, ...additionalQuestionsValidation.errors };
				if (!firstErrorField) firstErrorField = additionalQuestionsValidation.firstErrorField;
			}
		}

		// Validate other standalone fields (e.g., driving, firstHackathon - these are booleans, validation means checking if they are set if they were mandatory, currently they are not)
		// For this refactor, we'll assume 'driving' and 'firstHackathon' don't have specific validation error messages beyond being part of the form.
		// If they were mandatory, their validation would be here.

		if (!overallIsValid) {
			setFormErrors(accumulatedErrors);
			if (firstErrorField) {
				handleScroll(firstErrorField);
			}
			// Determine a general error message
			let mainAlertMessage = "Please fill out all required fields correctly.";
			if (accumulatedErrors.firstName || accumulatedErrors.lastName || accumulatedErrors.age) {
				mainAlertMessage = "Please ensure all personal information is complete and correct.";
			} else if (accumulatedErrors.major || accumulatedErrors.university) {
				mainAlertMessage = "Please ensure all education information is complete.";
			} else if (accumulatedErrors.mlhCoc || accumulatedErrors.mlhDcp) {
				mainAlertMessage = "Please agree to the MLH policies to continue.";
			} else if (accumulatedErrors.codingExperience || accumulatedErrors.referral) {
				mainAlertMessage = "Please complete the additional questions section.";
			}
			alertFn(mainAlertMessage);
			return;
		}

		// If all validations pass, proceed with submission
		try {
			// Build the user object for the database.
			const newUser = {
				firstName: registrationData.firstName,
				lastName: registrationData.lastName,
				gender: registrationData.gender,
				shirtSize: registrationData.shirtSize,
				dietaryRestriction: registrationData.dietaryRestrictions ?? "",
				allergies: registrationData.allergies ?? "",
				university: registrationData.university,
				email: user?.email ?? "", // Assuming user object is available and has email
				major: registrationData.major,
				phone: registrationData.phoneNumber,
				country: registrationData.country,
				race: registrationData.race ?? "",
				// veteran status is missing in this user object, but present in registration object. Check if needed here.
			};

			await updateUserMutation.mutateAsync({
				id: registrationData.id,
				data: newUser,
			});

			// Build the registration object
			const registrationPayload = {
				travelReimbursement: false, // Defaulted, consider if it should be part of form
				driving: registrationData.driving,
				firstHackathon: registrationData.firstHackathon,
				academicYear: registrationData.academicYear,
				educationalInstitutionType: registrationData.educationalInstitutionType,
				codingExperience: registrationData.codingExperience,
				age: registrationData.age, // Already validated
				mlhCoc: registrationData.mlhCoc, // Already validated
				mlhDcp: registrationData.mlhDcp, // Already validated
				referral: registrationData.referral,
				project: registrationData.project,
				expectations: registrationData.expectations,
				shareEmailMlh: registrationData.shareEmailMlh,
				veteran: registrationData.veteran,
				time: Date.now(),
				// hackathonId: hackathon?.id, // Associate with the active hackathon
			};

			await createRegistrationMutation.mutateAsync({
				userId: registrationData.id,
				// hackathonId: hackathon?.id, // Pass hackathonId if your mutation requires it
				data: registrationPayload,
			});

			track("registration", { user: registrationData.id });
			alertFn("You are now registered for the hackathon!", "success");
			setTimeout(() => router.push("/profile"), 3000);

		} catch (err: any) {
			console.error("Error during submission process:", err);
			// More specific error handling based on which mutation failed might be useful
			if (err.message.includes("already registered")) { // Example check
				alertFn("You are already registered for this Hackathon!", "warning");
			} else {
				alertFn("An error occurred during registration. Please try again.", "error");
			}
		}
	};

	// --- Validation Helper Functions ---
	const _validatePersonalInfo = (data: RegistrationData): ValidationResult => {
		const errors: FormErrors = {};
		let isValid = true;
		let firstErrorField: string | undefined = undefined;

		const fieldsToIdMap: { [key: string]: string } = {
			firstName: "name", lastName: "name", gender: "gender-section",
			phoneNumber: "phoneNumber-section", veteran: "veteran-section",
			shirtSize: "shirtSize-section", country: "country-section",
			race: "raceEthnicity-section", age: "age-section",
		};

		const requiredFields: (keyof RegistrationData)[] = ['firstName', 'lastName', 'gender', 'phoneNumber', 'veteran', 'age', 'shirtSize', 'country', 'race'];
		for (const field of requiredFields) {
			if (field === 'age') {
				if (!data.age || data.age === 0) {
					errors.age = "Age is required.";
					isValid = false;
					if (!firstErrorField) firstErrorField = fieldsToIdMap[field];
				} else if (data.age < 18) {
					errors.age = "You must be 18 years or older to participate.";
					isValid = false;
					if (!firstErrorField) firstErrorField = fieldsToIdMap[field];
				}
			} else if (field === 'race') {
				if (!data.race || data.race.length === 0) {
					errors.race = "Race/Ethnicity is required.";
					isValid = false;
					if (!firstErrorField) firstErrorField = fieldsToIdMap[field];
				}
			} else if (!data[field]) {
				errors[field as keyof FormErrors] = "This field is required.";
				isValid = false;
				if (!firstErrorField) firstErrorField = fieldsToIdMap[field];
			}
		}
		return { errors, isValid, firstErrorField };
	};

	const _validateEducationInfo = (data: RegistrationData): ValidationResult => {
		const errors: FormErrors = {};
		let isValid = true;
		let firstErrorField: string | undefined = undefined;
		const fields: (keyof FormErrors)[] = ['major', 'university', 'academicYear', 'educationalInstitutionType'];
		for (const field of fields) {
			if (!data[field as keyof RegistrationData]) {
				errors[field] = "This field is required.";
				isValid = false;
				if (!firstErrorField) firstErrorField = `${field}-section`;
			}
		}
		return { errors, isValid, firstErrorField };
	};

	const _validateMlhAgreements = (data: RegistrationData): ValidationResult => {
		const errors: FormErrors = {};
		let isValid = true;
		let firstErrorField: string | undefined = undefined;
		if (!data.mlhCoc) {
			errors.mlhCoc = "You must agree to the MLH Code of Conduct to participate.";
			isValid = false;
			if(!firstErrorField) firstErrorField = "mlhCoc-section";
		}
		if (!data.mlhDcp) {
			errors.mlhDcp = "You must agree to the MLH Data Sharing Policy to participate.";
			isValid = false;
			if(!firstErrorField) firstErrorField = "mlhDcp-section";
		}
		return { errors, isValid, firstErrorField };
	};

	const _validateAdditionalQuestions = (data: RegistrationData): ValidationResult => {
		const errors: FormErrors = {};
		let isValid = true;
		let firstErrorField: string | undefined = undefined;
		if (!data.codingExperience) {
			errors.codingExperience = "Please select your coding experience level.";
			isValid = false;
			if(!firstErrorField) firstErrorField = "codingExperience-section";
		}
		if (!data.referral) {
			errors.referral = "Please let us know where you heard about HackPSU.";
			isValid = false;
			if(!firstErrorField) firstErrorField = "referral-section";
		}
		return { errors, isValid, firstErrorField };
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
						{/* Personal Info Form Component */}
						<PersonalInfoForm
							firstName={registrationData.firstName}
							onFirstNameChange={(value) => handlePersonalInfoChange('firstName', value)}
							firstNameError={formErrors.firstName}

							lastName={registrationData.lastName}
							onLastNameChange={(value) => handlePersonalInfoChange('lastName', value)}
							lastNameError={formErrors.lastName}

							gender={registrationData.gender}
							onGenderChange={(value) => handlePersonalInfoChange('gender', value)}
							genderError={formErrors.gender}

							phoneNumber={registrationData.phoneNumber}
							onPhoneNumberChange={handlePhoneInput} //name, value
							phoneNumberError={formErrors.phoneNumber}

							race={registrationData.race} // comma-separated string
							onRaceChange={handleCheckboxChange} // event
							raceError={formErrors.race}

							veteran={registrationData.veteran}
							onVeteranChange={(value) => handlePersonalInfoChange('veteran', value)}
							veteranError={formErrors.veteran}

							age={registrationData.age}
							onAgeChange={handleAgeChange} // value (string from select)
							ageError={formErrors.age}

							shirtSize={registrationData.shirtSize}
							onShirtSizeChange={(value) => handlePersonalInfoChange('shirtSize', value)}
							shirtSizeError={formErrors.shirtSize}

							country={registrationData.country}
							onCountryChange={handleAutocompleteChange} // name, value
							countryError={formErrors.country}
						/>

						{/* Fields that were conditional on age are now always present if PersonalInfoForm is shown */}
						{/* Or, we can keep the original age condition for the remaining sections */}
						{!!registrationData.age && (
							<>
								{/* Driving, First Hackathon, Dietary, etc. remain here */}
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
								<DietaryForm
									hasDietaryRestrictionsOrAllegies={registrationData.hasDietaryRestrictionsOrAllegies}
									onHasDietaryRestrictionsOrAllegiesChange={handleToggle}
									dietaryRestrictions={registrationData.dietaryRestrictions}
									onDietaryRestrictionsChange={handleChange}
									allergies={registrationData.allergies}
									onAllergiesChange={handleChange}
								/>
								{/* Education Form Component */}
								<EducationForm
									major={registrationData.major}
									onMajorChange={handleAutocompleteChange}
									majorError={formErrors.major}
									university={registrationData.university}
									onUniversityChange={handleAutocompleteChange}
									universityError={formErrors.university}
									academicYear={registrationData.academicYear}
									onAcademicYearChange={handleChange}
									academicYearError={formErrors.academicYear}
									educationalInstitutionType={registrationData.educationalInstitutionType}
									onEducationalInstitutionTypeChange={handleChange}
									educationalInstitutionTypeError={formErrors.educationalInstitutionType}
								/>
								{/* Resume Form Component */}
								<ResumeForm
									resumeFile={registrationData.resume}
									onFileChange={handleFileChange}
									onDownloadResume={downloadResume}
								/>
								{/* MLH Form Component */}
								<MLHForm
									mlhCoc={registrationData.mlhCoc}
									onMlhCocChange={handleToggle}
									mlhCocError={formErrors.mlhCoc}
									mlhDcp={registrationData.mlhDcp}
									onMlhDcpChange={handleToggle}
									mlhDcpError={formErrors.mlhDcp}
									shareEmailMlh={registrationData.shareEmailMlh}
									onShareEmailMlhChange={handleToggle}
								/>
								{registrationData.mlhCoc && registrationData.mlhDcp && (
									<>
										<AdditionalQuestionsForm
											codingExperience={registrationData.codingExperience}
											onCodingExperienceChange={handleChange}
											codingExperienceError={formErrors.codingExperience}
											referral={registrationData.referral}
											onReferralChange={handleAutocompleteChange}
											referralError={formErrors.referral}
											project={registrationData.project}
											onProjectChange={(e) => handleChange(e as any)} // Cast event for textarea
											expectations={registrationData.expectations}
											onExpectationsChange={(e) => handleChange(e as any)} // Cast event for textarea
										/>
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
