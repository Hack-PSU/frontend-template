import React from 'react';
// Corrected import for Autocomplete and TelephoneFormatter
import Autocomplete from '@/components/common/Autocomplete';
import TelephoneFormatter from '@/components/common/TelephoneFormatter';

// Define the options directly in the component for now, as in the original page.
// These could be passed as props if they need to be dynamic.
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-Binary" },
  { value: "no-disclose", label: "Prefer not to disclose" },
];

const raceOptions = [
  { value: "native", label: "Native American or Alaska Native" },
  { value: "asian", label: "Asian" },
  { value: "african", label: "Black or African American" },
  { value: "latinx", label: "Hispanic or Latinx" },
  { value: "pacific", label: "Native Hawaiian or Other Pacific Islander" },
  { value: "caucasian", label: "Caucasian" },
  { value: "noDisclose", label: "Prefer not to disclose" },
];

const veteranOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "no-disclose-veteran", label: "Prefer not to disclose" },
];

const shirtSizeOptions = [
  { value: "XS", label: "X-Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "X-Large" },
  { value: "XXL", label: "XX-Large" },
];

interface PersonalInfoFormProps {
  firstName: string;
  onFirstNameChange: (value: string) => void;
  firstNameError?: string;

  lastName: string;
  onLastNameChange: (value: string) => void;
  lastNameError?: string;

  gender: string;
  onGenderChange: (value: string) => void;
  genderError?: string;

  phoneNumber: string;
  onPhoneNumberChange: (name: string, value: string) => void; // Adapted for TelephoneFormatter
  phoneNumberError?: string;

  race: string; // This will store a comma-separated string if multiple are selected
  onRaceChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Adapted for checkboxes
  raceError?: string;

  veteran: string;
  onVeteranChange: (value: string) => void;
  veteranError?: string;

  age: number; // Changed to number to match original state
  onAgeChange: (value: string) => void; // Value from select is string
  ageError?: string;

  shirtSize: string;
  onShirtSizeChange: (value: string) => void;
  shirtSizeError?: string;

  country: string;
  onCountryChange: (name: string, value: string) => void; // Adapted for common Autocomplete
  countryError?: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  firstName, onFirstNameChange, firstNameError,
  lastName, onLastNameChange, lastNameError,
  gender, onGenderChange, genderError,
  phoneNumber, onPhoneNumberChange, phoneNumberError,
  race, onRaceChange, raceError, // race is a string of comma-separated values
  veteran, onVeteranChange, veteranError,
  age, onAgeChange, ageError,
  shirtSize, onShirtSizeChange, shirtSizeError,
  country, onCountryChange, countryError,
}) => {

  // Helper to check if a race option is selected
  const isRaceSelected = (value: string) => race.split(',').includes(value);

  return (
    <>
      {/* Name */}
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
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              className={firstNameError ? "input-error" : ""} // Basic error styling
            />
          </div>
          {firstNameError && <label className="data-error">{firstNameError}</label>}
          <label htmlFor="lastName" className="label">
            Last Name
          </label>
          <div className="my-2">
            <input
              id="lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              className={lastNameError ? "input-error" : ""}
            />
          </div>
          {lastNameError && <label className="data-error">{lastNameError}</label>}
          {(!firstName || !lastName) && (!firstNameError && !lastNameError) && (
            <label className="data-error">Required</label>
          )}
        </div>
      </div>

      {/* Gender */}
      <div className="card" id="gender-section"> {/* Changed id to avoid conflict with input name */}
        <div className="card-header">
          Which gender do you identify with?
        </div>
        <div className="my-2">
          {genderOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="gender"
                value={option.value}
                id={`gender-${option.value}`} // Ensure unique id for label linking
                checked={gender === option.value}
                onChange={(e) => onGenderChange(e.target.value)}
              />
              <label htmlFor={`gender-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
          {genderError && <label className="data-error">{genderError}</label>}
          {!gender && !genderError && <label className="data-error">Required</label>}
        </div>
      </div>

      {/* Phone Number */}
      <div className="card" id="phoneNumber-section"> {/* Changed id */}
        <div className="card-header">What is your phone number?</div>
        <div className="info">
          This information is required by MLH. We won’t spam your phone.
        </div>
        <div className="my-2">
          <TelephoneFormatter
            name="phoneNumber"
            value={phoneNumber} // Pass value to TelephoneFormatter
            onChange={onPhoneNumberChange}
          />
        </div>
        {phoneNumberError && <label className="data-error">{phoneNumberError}</label>}
        {!phoneNumber && !phoneNumberError && <label className="data-error">Required</label>}
      </div>

      {/* Race/Ethnicity */}
      <div className="card" id="raceEthnicity-section"> {/* Changed id */}
        <div className="card-header">What is your race/ethnicity?</div>
        <div className="my-2">
          {raceOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="checkbox"
                id={`race-${option.value}`}
                name="race" // Name is same for all checkboxes in a group
                value={option.value}
                checked={isRaceSelected(option.value)}
                onChange={onRaceChange} // This handler needs to manage multiple selections
              />
              <label htmlFor={`race-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
          {raceError && <label className="data-error">{raceError}</label>}
        </div>
      </div>

      {/* Veteran */}
      <div className="card" id="veteran-section"> {/* Changed id */}
        <div className="card-header">Are you a veteran?</div>
        <div className="my-2">
          {veteranOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="veteran"
                value={option.value}
                id={`veteran-${option.value}`}
                checked={veteran === option.value}
                onChange={(e) => onVeteranChange(e.target.value)}
              />
              <label htmlFor={`veteran-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
          {veteranError && <label className="data-error">{veteranError}</label>}
          {!veteran && !veteranError && <label className="data-error">Required</label>}
        </div>
      </div>

      {/* Age */}
      <div className="card" id="age-section"> {/* Changed id */}
        <div className="card-header">
          What will your age be on the event date? {/* Simplified header for now */}
          <p className="info">
            You must be 18 years or older to participate.
          </p>
        </div>
        <select
          name="age"
          onChange={(e) => onAgeChange(e.target.value)}
          value={age === 0 ? "" : age.toString()} // Handle initial 0 value
          className={ageError ? "input-error" : ""}
        >
          <option value="">Select age</option>
          {Array.from({ length: 89 }, (_, i) => (
            <option key={i + 12} value={(i + 12).toString()}>
              {i + 12}
            </option>
          ))}
        </select>
        <br />
        {ageError && <label className="data-error">{ageError}</label>}
        {age === 0 && !ageError && <label className="data-error">Required</label>}
      </div>

      {/* Shirt Size */}
      <div className="card" id="shirtSize-section"> {/* Changed id */}
        <div className="card-header">What is your shirt size?</div>
        <div className="my-2">
          {shirtSizeOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="shirtSize"
                value={option.value}
                id={`shirt-${option.value}`}
                checked={shirtSize === option.value}
                onChange={(e) => onShirtSizeChange(e.target.value)}
              />
              <label htmlFor={`shirt-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
          {shirtSizeError && <label className="data-error">{shirtSizeError}</label>}
          {!shirtSize && !shirtSizeError && <label className="data-error">Required</label>}
        </div>
      </div>

      {/* Country */}
      <div className="card" id="country-section"> {/* Changed id */}
        <div className="card-header">
          What is your country of residence?
        </div>
        <div className="my-2">
          <Autocomplete
            data="country" // This prop tells the component what list to fetch/display
            value={country} // Pass current value
            onSelectionChange={(name, value) => onCountryChange(name, value)}
            // className={countryError ? "input-error" : ""} // Autocomplete might not have className like this
          />
        </div>
        {countryError && <label className="data-error">{countryError}</label>}
        {!country && !countryError && <label className="data-error">Required</label>}
      </div>
    </>
  );
};

export default PersonalInfoForm;
