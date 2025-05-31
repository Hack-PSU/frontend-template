import React, { ChangeEvent } from 'react';
import ToggleSwitch from '@/components/common/ToggleSwitch'; // Assuming this path is correct

interface DietaryFormProps {
  hasDietaryRestrictionsOrAllegies: boolean;
  onHasDietaryRestrictionsOrAllegiesChange: (name: string, isChecked: boolean) => void;

  dietaryRestrictions: string | null;
  onDietaryRestrictionsChange: (event: ChangeEvent<HTMLInputElement>) => void;

  allergies: string | null;
  onAllergiesChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const DietaryForm: React.FC<DietaryFormProps> = ({
  hasDietaryRestrictionsOrAllegies,
  onHasDietaryRestrictionsOrAllegiesChange,
  dietaryRestrictions,
  onDietaryRestrictionsChange,
  allergies,
  onAllergiesChange,
}) => {
  // Helper for standard labels - consistent with PersonalInfoForm
  const standardLabelClass = "text-sm font-medium text-gray-700";

  return (
    <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="dietaryAllergies">
      <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
        Do you have any dietary restrictions or allergies?
      </div>
      <div className="flex justify-center mb-4"> {/* Centering the toggle switch */}
        <ToggleSwitch
          name="hasDietaryRestrictionsOrAllegies"
          on="Yes"
          off="No"
          checked={hasDietaryRestrictionsOrAllegies}
          onChange={(name, isChecked) => onHasDietaryRestrictionsOrAllegiesChange(name, isChecked)}
        />
      </div>
      {hasDietaryRestrictionsOrAllegies && (
        <>
          <label htmlFor="dietaryRestrictions" className={`${standardLabelClass} mt-4 block`}>
            Dietary Restrictions
          </label>
          <div className="my-2">
            <input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={dietaryRestrictions || ''}
              onChange={onDietaryRestrictionsChange}
              // Using base input styles from register.css
            />
          </div>
          <label htmlFor="allergies" className={`${standardLabelClass} mt-4 block`}>
            Allergies
          </label>
          <div className="my-2">
            <input
              id="allergies"
              name="allergies"
              value={allergies || ''}
              onChange={onAllergiesChange}
              // Using base input styles from register.css
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DietaryForm;
