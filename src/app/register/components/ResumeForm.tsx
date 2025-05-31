import React, { ChangeEvent } from 'react';

interface ResumeFormProps {
  resumeFile: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadResume: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({
  resumeFile,
  onFileChange,
  onDownloadResume,
}) => {
  return (
    <div className="card" id="resume-section"> {/* Changed ID to avoid conflict with input name */}
      <div className="card-header">Submit a PDF of your resume</div>
      <div className="info">
        If a resume is submitted, it will be shared with employers
        sponsoring HackPSU.
      </div>
      <div className="flex justify-center w-full my-2">
        <div className="file-upload-container">
          <input
            type="file"
            id="resume-input" // Keep original ID for label association
            name="resume" // Keep original name
            className="input-file"
            onChange={onFileChange}
            accept="application/pdf"
          />
          <label
            htmlFor="resume-input"
            className="file-upload-button" // Style as defined in original CSS
          >
            Upload Resume
          </label>
        </div>
      </div>
      {resumeFile && (
        <a className="resume-download" onClick={onDownloadResume}> {/* Style as defined in original CSS */}
          {(resumeFile as File).name}
        </a>
      )}
    </div>
  );
};

export default ResumeForm;
