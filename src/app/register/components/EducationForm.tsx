import React, { ChangeEvent } from 'react';
import Autocomplete from '@/components/common/Autocomplete'; // Assuming this path is correct

// Define options as they are in the original page.tsx
const academicYearOptions = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "graduate", label: "Graduate" },
  { value: "other", label: "Other" },
];

const institutionTypeOptions = [
  { value: "less-than-secondary", label: "Less than Secondary / High School" },
  { value: "secondary", label: "Secondary / High School" },
  { value: "two-year-university", label: "Undergraduate University (2 year - community college or similar)" },
  { value: "three-plus-year-university", label: "Undergraduate University (3+ year)" },
  { value: "graduate-university", label: "Graduate University (Masters, Professional, Doctoral, etc.)" },
  { value: "code-school-or-bootcamp", label: "Code School / Bootcamp" },
  { value: "vocational-trade-apprenticeship", label: "Other Vocational / Trade Program or Apprenticeship" },
  { value: "other", label: "Other" },
  { value: "not-a-student", label: "I'm not currently a student" },
  { value: "prefer-no-answer", label: "Prefer not to answer" },
];

interface EducationFormProps {
  major: string;
  onMajorChange: (name: string, value: string) => void;
  majorError?: string;

  university: string;
  onUniversityChange: (name: string, value: string) => void;
  universityError?: string;

  academicYear: string;
  onAcademicYearChange: (event: ChangeEvent<HTMLInputElement>) => void;
  academicYearError?: string;

  educationalInstitutionType: string;
  onEducationalInstitutionTypeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  educationalInstitutionTypeError?: string;
}

const EducationForm: React.FC<EducationFormProps> = ({
  major, onMajorChange, majorError,
  university, onUniversityChange, universityError,
  academicYear, onAcademicYearChange, academicYearError,
  educationalInstitutionType, onEducationalInstitutionTypeChange, educationalInstitutionTypeError,
}) => {
  // Helper for styling error messages
  const errorLabelClass = "text-[var(--destructive)] text-sm font-medium";
  // Helper for standard labels
  const standardLabelClass = "text-sm font-medium text-gray-700";

  return (
    <>
      {/* Major */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="major-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          What is your (intended) major?
        </div>
        <div className="my-2">
          <Autocomplete
            data="major"
            onSelectionChange={onMajorChange}
            name="major"
            // value prop was confirmed to be an issue for referral, assuming same for others
          />
        </div>
        {majorError && <label className={errorLabelClass}>{majorError}</label>}
        {!major && !majorError && <label className={errorLabelClass}>Required</label>}
      </div>

      {/* University */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="university-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">What school do you attend?</div>
        <div className="my-2">
          <Autocomplete
            data="university"
            onSelectionChange={onUniversityChange}
            name="university"
             // value prop was confirmed to be an issue for referral, assuming same for others
          />
        </div>
        {universityError && <label className={errorLabelClass}>{universityError}</label>}
        {!university && !universityError && <label className={errorLabelClass}>Required</label>}
      </div>

      {/* Academic Year */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="academicYear-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">What is your academic year?</div>
        <div className="my-2">
          {academicYearOptions.map((option) => (
            <div key={option.value} className="flex items-center my-1">
              <input
                type="radio"
                name="academicYear"
                value={option.value}
                id={`academicYear-${option.value}`}
                checked={academicYear === option.value}
                onChange={onAcademicYearChange}
              />
              <label htmlFor={`academicYear-${option.value}`} className={`${standardLabelClass} ml-2`}>{option.label}</label>
            </div>
          ))}
        </div>
        {academicYearError && <label className={errorLabelClass}>{academicYearError}</label>}
        {!academicYear && !academicYearError && <label className={errorLabelClass}>Required</label>}
      </div>

      {/* Educational Institution Type */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="educationalInstitutionType-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          What type of educational institution are you enrolled in?
        </div>
        <div className="my-2">
          {institutionTypeOptions.map((option) => (
             <div key={option.value} className="flex items-center my-1">
              <input
                type="radio"
                name="educationalInstitutionType"
                value={option.value}
                id={`institution-${option.value}`}
                checked={educationalInstitutionType === option.value}
                onChange={onEducationalInstitutionTypeChange}
              />
              <label htmlFor={`institution-${option.value}`} className={`${standardLabelClass} ml-2`}>{option.label}</label>
            </div>
          ))}
        </div>
        {educationalInstitutionTypeError && <label className={errorLabelClass}>{educationalInstitutionTypeError}</label>}
        {!educationalInstitutionType && !educationalInstitutionTypeError && <label className={errorLabelClass}>Required</label>}
      </div>
    </>
  );
};

export default EducationForm;
