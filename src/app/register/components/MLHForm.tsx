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
  return (
    <>
      {/* MLH Code of Conduct */}
      <div className="card" id="mlhCoc-section"> {/* Changed ID */}
        <div className="card-header">
          Do you agree to the MLH Code of Conduct?
        </div>
        <span>
          <p className="inline">I have read and agree to the&nbsp;</p>
          <a
            href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline" // Basic link styling
          >
            MLH Code of Conduct
          </a>
          <p className="info">
            To participate at HackPSU, you must agree to this policy.
          </p>
        </span>
        <ToggleSwitch
          name="mlhCoc"
          on="Yes"
          off="No"
          checked={mlhCoc}
          onChange={onMlhCocChange}
        />
        {mlhCocError && <label className="data-error">{mlhCocError}</label>}
        {!mlhCoc && !mlhCocError && <label className="data-error">Required (must be Yes)</label>}
      </div>

      {/* MLH Data Sharing */}
      <div className="card" id="mlhDcp-section"> {/* Changed ID */}
        <div className="card-header">
          Do you agree to the MLH Data Sharing?
        </div>
        <span>
          By agreeing, you authorize MLH to share your registration
          information with event sponsors and MLH as outlined in the{" "}
          <a
            href="https://mlh.io/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline" // Basic link styling
          >
            MLH Privacy Policy
          </a>
          .
          <p className="info">
            To participate at HackPSU, you must agree to this policy.
          </p>
        </span>
        <ToggleSwitch
          name="mlhDcp"
          on="Yes"
          off="No"
          checked={mlhDcp}
          onChange={onMlhDcpChange}
        />
        {mlhDcpError && <label className="data-error">{mlhDcpError}</label>}
        {!mlhDcp && !mlhDcpError && <label className="data-error">Required (must be Yes)</label>}
      </div>

      {/* Share Email with MLH */}
      <div className="card" id="shareEmailMlh-section"> {/* Changed ID */}
        <div className="card-header">
          Do you want to opt into further communications from MLH?
        </div>
        <span>
          <p className="inline">
            I authorize MLH to send me occasional emails about
            relevant events and opportunities.
          </p>
          <br />
          <br />
          <p className="info">This is entirely optional.</p>
        </span>
        <ToggleSwitch
          name="shareEmailMlh"
          on="Yes"
          off="No"
          checked={shareEmailMlh}
          onChange={onShareEmailMlhChange}
        />
        {/* No error display for this optional field */}
      </div>
    </>
  );
};

export default MLHForm;
