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
  return (
    <>
      {/* Coding Experience */}
      <div className="card" id="codingExperience-section"> {/* Changed ID */}
        <div className="card-header">
          What is your level of coding experience?
        </div>
        <div className="my-2">
          {codingExperienceOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="codingExperience"
                value={option.value}
                id={`codingExperience-${option.value}`}
                checked={codingExperience === option.value}
                onChange={onCodingExperienceChange}
              />
              <label htmlFor={`codingExperience-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
        </div>
        {codingExperienceError && <label className="data-error">{codingExperienceError}</label>}
        {!codingExperience && !codingExperienceError && <label className="data-error">Required</label>}
      </div>

      {/* Referral */}
      <div className="card" id="referral-section"> {/* Changed ID */}
        <div className="card-header">
          Where did you hear about HackPSU?
        </div>
        <div className="my-2">
          <Autocomplete
            data="referral"
            value={referral}
            onSelectionChange={onReferralChange}
            searchTermMin={1}
            name="referral" // Ensure name is passed for handler
          />
        </div>
        {referralError && <label className="data-error">{referralError}</label>}
        {!referral && !referralError && <label className="data-error">Required</label>}
      </div>

      {/* Project */}
      <div className="card" id="project-section"> {/* Changed ID */}
        <div className="card-header">
          What is a project you’re proud of?
        </div>
        <div className="my-2">
          <textarea
            id="project" // Keep id for potential label linking if any
            name="project"
            value={project}
            onChange={onProjectChange}
            className="w-full p-2 border rounded" // Basic textarea styling
          />
        </div>
        {/* No error display for this optional field based on original form */}
      </div>

      {/* Expectations */}
      <div className="card" id="expectations-section"> {/* Changed ID */}
        <div className="card-header">
          What would you like to get out of HackPSU?
        </div>
        <div className="my-2">
          <textarea
            id="expectations" // Keep id
            name="expectations"
            value={expectations}
            onChange={onExpectationsChange}
            className="w-full p-2 border rounded" // Basic textarea styling
          />
        </div>
        {/* No error display for this optional field based on original form */}
      </div>
    </>
  );
};

export default AdditionalQuestionsForm;
