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
  return (
    <div className="card" id="dietaryAllergies">
      <div className="card-header">
        Do you have any dietary restrictions or allergies?
      </div>
      <ToggleSwitch
        name="hasDietaryRestrictionsOrAllegies"
        on="Yes"
        off="No"
        checked={hasDietaryRestrictionsOrAllegies} // Pass the checked state
        onChange={(name, isChecked) => onHasDietaryRestrictionsOrAllegiesChange(name, isChecked)}
      />
      {hasDietaryRestrictionsOrAllegies && (
        <>
          <label htmlFor="dietaryRestrictions" className="label mt-4 block"> {/* Added margin for spacing */}
            Dietary Restrictions
          </label>
          <div className="my-2">
            <input
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={dietaryRestrictions || ''} // Handle null value
              onChange={onDietaryRestrictionsChange}
              className="w-full p-2 border rounded" // Basic input styling
            />
          </div>
          <label htmlFor="allergies" className="label mt-4 block"> {/* Added margin for spacing */}
            Allergies
          </label>
          <div className="my-2">
            <input
              id="allergies"
              name="allergies"
              value={allergies || ''} // Handle null value
              onChange={onAllergiesChange}
              className="w-full p-2 border rounded" // Basic input styling
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DietaryForm;
