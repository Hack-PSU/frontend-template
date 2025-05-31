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
  return (
    <>
      {/* Major */}
      <div className="card" id="major-section"> {/* Changed ID to avoid conflict */}
        <div className="card-header">
          What is your (intended) major?
        </div>
        <div className="my-2">
          <Autocomplete
            data="major" // This prop tells the component what list to fetch/display
            value={major}
            onSelectionChange={onMajorChange} // Passes (name, value)
            name="major" // Ensure name is passed for handler
          />
        </div>
        {majorError && <label className="data-error">{majorError}</label>}
        {!major && !majorError && <label className="data-error">Required</label>}
      </div>

      {/* University */}
      <div className="card" id="university-section"> {/* Changed ID */}
        <div className="card-header">What school do you attend?</div>
        <div className="my-2">
          <Autocomplete
            data="university"
            value={university}
            onSelectionChange={onUniversityChange}
            name="university" // Ensure name is passed for handler
          />
        </div>
        {universityError && <label className="data-error">{universityError}</label>}
        {!university && !universityError && <label className="data-error">Required</label>}
      </div>

      {/* Academic Year */}
      <div className="card" id="academicYear-section"> {/* Changed ID */}
        <div className="card-header">What is your academic year?</div>
        <div className="my-2">
          {academicYearOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="academicYear"
                value={option.value}
                id={`academicYear-${option.value}`}
                checked={academicYear === option.value}
                onChange={onAcademicYearChange}
              />
              <label htmlFor={`academicYear-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
        </div>
        {academicYearError && <label className="data-error">{academicYearError}</label>}
        {!academicYear && !academicYearError && <label className="data-error">Required</label>}
      </div>

      {/* Educational Institution Type */}
      <div className="card" id="educationalInstitutionType-section"> {/* Changed ID */}
        <div className="card-header">
          What type of educational institution are you enrolled in?
        </div>
        <div className="my-2">
          {institutionTypeOptions.map((option) => (
            <React.Fragment key={option.value}>
              <input
                type="radio"
                name="educationalInstitutionType"
                value={option.value}
                id={`institution-${option.value}`}
                checked={educationalInstitutionType === option.value}
                onChange={onEducationalInstitutionTypeChange}
              />
              <label htmlFor={`institution-${option.value}`}>{option.label}</label>
              <br />
            </React.Fragment>
          ))}
        </div>
        {educationalInstitutionTypeError && <label className="data-error">{educationalInstitutionTypeError}</label>}
        {!educationalInstitutionType && !educationalInstitutionTypeError && <label className="data-error">Required</label>}
      </div>
    </>
  );
};

export default EducationForm;
