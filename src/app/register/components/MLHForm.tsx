import React from 'react';
import ToggleSwitch from '@/components/common/ToggleSwitch'; // Assuming this path is correct

interface MLHFormProps {
  mlhCoc: boolean;
  onMlhCocChange: (name: string, isChecked: boolean) => void;
  mlhCocError?: string;

  mlhDcp: boolean;
  onMlhDcpChange: (name: string, isChecked: boolean) => void;
  mlhDcpError?: string;

  shareEmailMlh: boolean;
  onShareEmailMlhChange: (name: string, isChecked: boolean) => void;
  // No error prop for shareEmailMlh as it's optional
}

const MLHForm: React.FC<MLHFormProps> = ({
  mlhCoc, onMlhCocChange, mlhCocError,
  mlhDcp, onMlhDcpChange, mlhDcpError,
  shareEmailMlh, onShareEmailMlhChange,
}) => {
  // Helper for styling error messages
  const errorLabelClass = "text-[var(--destructive)] text-sm font-medium mt-1 block"; // Added mt-1 and block
  // Helper for info text
  const infoTextClass = "text-xs text-slate-500 mt-1"; // Mapped from .info

  return (
    <>
      {/* MLH Code of Conduct */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="mlhCoc-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          Do you agree to the MLH Code of Conduct?
        </div>
        <div className="text-center mb-3"> {/* Centered text and toggle */}
          <span className="text-sm text-gray-700"> {/* Standard label class styling */}
            I have read and agree to the&nbsp;
            <a
              href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MLH Code of Conduct
            </a>
          </span>
          <p className={infoTextClass}>
            To participate at HackPSU, you must agree to this policy.
          </p>
        </div>
        <div className="flex justify-center mb-2">
          <ToggleSwitch
            name="mlhCoc"
            on="Yes"
            off="No"
            checked={mlhCoc}
            onChange={onMlhCocChange}
          />
        </div>
        {mlhCocError && <label className={errorLabelClass}>{mlhCocError}</label>}
        {!mlhCoc && !mlhCocError && <label className={errorLabelClass}>Required (must be Yes)</label>}
      </div>

      {/* MLH Data Sharing */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="mlhDcp-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          Do you agree to the MLH Data Sharing?
        </div>
        <div className="text-center mb-3"> {/* Centered text and toggle */}
          <span className="text-sm text-gray-700">
            By agreeing, you authorize MLH to share your registration
            information with event sponsors and MLH as outlined in the&nbsp;
            <a
              href="https://mlh.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              MLH Privacy Policy
            </a>.
          </span>
          <p className={infoTextClass}>
            To participate at HackPSU, you must agree to this policy.
          </p>
        </div>
        <div className="flex justify-center mb-2">
          <ToggleSwitch
            name="mlhDcp"
            on="Yes"
            off="No"
            checked={mlhDcp}
            onChange={onMlhDcpChange}
          />
        </div>
        {mlhDcpError && <label className={errorLabelClass}>{mlhDcpError}</label>}
        {!mlhDcp && !mlhDcpError && <label className={errorLabelClass}>Required (must be Yes)</label>}
      </div>

      {/* Share Email with MLH */}
      <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="shareEmailMlh-section">
        <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">
          Do you want to opt into further communications from MLH?
        </div>
        <div className="text-center mb-3"> {/* Centered text and toggle */}
          <span className="text-sm text-gray-700">
            I authorize MLH to send me occasional emails about
            relevant events and opportunities.
          </span>
          <p className={`${infoTextClass} mt-2`}>This is entirely optional.</p>
        </div>
        <div className="flex justify-center">
          <ToggleSwitch
            name="shareEmailMlh"
            on="Yes"
            off="No"
            checked={shareEmailMlh}
            onChange={onShareEmailMlhChange}
          />
        </div>
        {/* No error display for this optional field */}
      </div>
    </>
  );
};

export default MLHForm;
