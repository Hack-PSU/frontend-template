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
  const infoTextClass = "text-xs text-slate-500 text-center"; // Centered info text
  const resumeDownloadClass = "text-xs text-slate-500 hover:underline cursor-pointer text-center block mt-2"; // Centered and styled download link

  return (
    <div className="card p-4 sm:px-12 my-8 shadow-md rounded-md sm:rounded-lg" id="resume-section">
      <div className="text-2xl text-center p-4 text-[#001f3f] font-bold">Submit a PDF of your resume</div>
      <p className={`${infoTextClass} mb-4`}> {/* Added margin bottom to info text */}
        If a resume is submitted, it will be shared with employers
        sponsoring HackPSU.
      </p>
      <div className="flex justify-center w-full my-2">
        {/* file-upload-container, input-file, file-upload-button are kept from register.css for custom file input styling */}
        <div className="file-upload-container">
          <input
            type="file"
            id="resume-input"
            name="resume"
            className="input-file"
            onChange={onFileChange}
            accept="application/pdf"
          />
          <label
            htmlFor="resume-input"
            className="file-upload-button"
          >
            Upload Resume
          </label>
        </div>
      </div>
      {resumeFile && (
        <div className="text-center mt-2"> {/* Centering the download link */}
          <a className={resumeDownloadClass} onClick={onDownloadResume}>
            {(resumeFile as File).name}
          </a>
        </div>
      )}
    </div>
  );
};

export default ResumeForm;
