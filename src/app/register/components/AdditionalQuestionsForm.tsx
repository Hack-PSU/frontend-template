import React, { ChangeEvent } from 'react';
import Autocomplete from '@/components/common/Autocomplete'; // Assuming this path is correct

const codingExperienceOptions = [
  { value: "none", label: "None" },
  { value: "beginner", label: "Beginner (0-2 years)" },
  { value: "intermediate", label: "Intermediate (2-4 years)" },
  { value: "advanced", label: "Advanced (> 4 years)" },
];

interface AdditionalQuestionsFormProps {
  codingExperience: string;
  onCodingExperienceChange: (event: ChangeEvent<HTMLInputElement>) => void;
  codingExperienceError?: string;

  referral: string;
  onReferralChange: (name: string, value: string) => void;
  referralError?: string;

  project: string;
  onProjectChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;

  expectations: string;
  onExpectationsChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const AdditionalQuestionsForm: React.FC<AdditionalQuestionsFormProps> = ({
  codingExperience, onCodingExperienceChange, codingExperienceError,
  referral, onReferralChange, referralError,
  project, onProjectChange,
  expectations, onExpectationsChange,
}) => {
  // Helper for styling error messages
  const errorLabelClass = "text-[var(--destructive)] text-sm font-medium";
  // Helper for standard labels
  const standardLabelClass = "text-sm font-medium text-gray-700";

  return (
    <>
      {/* Coding Experience */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="codingExperience-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          What is your level of coding experience?
        </div>
        <div className="my-2">
          {codingExperienceOptions.map((option) => (
            <div key={option.value} className="flex items-center my-1">
              <input
                type="radio"
                name="codingExperience"
                value={option.value}
                id={`codingExperience-${option.value}`}
                checked={codingExperience === option.value}
                onChange={onCodingExperienceChange}
              />
              <label htmlFor={`codingExperience-${option.value}`} className={`${standardLabelClass} ml-2`}>{option.label}</label>
            </div>
          ))}
        </div>
        {codingExperienceError && <label className={errorLabelClass}>{codingExperienceError}</label>}
        {!codingExperience && !codingExperienceError && <label className={errorLabelClass}>Required</label>}
      </div>

      {/* Referral */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="referral-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          Where did you hear about HackPSU?
        </div>
        <div className="my-2">
          <Autocomplete
            data="referral"
            onSelectionChange={onReferralChange}
            searchTermMin={1}
            name="referral"
          />
        </div>
        {referralError && <label className={errorLabelClass}>{referralError}</label>}
        {!referral && !referralError && <label className={errorLabelClass}>Required</label>}
      </div>

      {/* Project */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="project-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          What is a project you’re proud of?
        </div>
        <div className="my-2">
          <textarea
            id="project"
            name="project"
            value={project}
            onChange={onProjectChange}
            // Using base textarea styles from register.css
            rows={3} // Added default rows
          />
        </div>
        {/* No error display for this optional field based on original form */}
      </div>

      {/* Expectations */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="expectations-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          What would you like to get out of HackPSU?
        </div>
        <div className="my-2">
          <textarea
            id="expectations"
            name="expectations"
            value={expectations}
            onChange={onExpectationsChange}
            // Using base textarea styles from register.css
            rows={3} // Added default rows
          />
        </div>
        {/* No error display for this optional field based on original form */}
      </div>
    </>
  );
};

export default AdditionalQuestionsForm;
