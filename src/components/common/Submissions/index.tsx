import React from "react";

const Submissions: React.FC = () => {
    return (
        <div className="w-11/12 md:w-5/12 p-3 bg-[rgba(0,0,0,0.75)] border-[green] border-4 rounded-lg text-center mt-20">
            <p className="text-lg text-left text-white">
                <span style={{ color: "red", fontWeight: "bold", fontSize: "larger" }}>
                    SUBMISSIONS:
                </span>{" "}
                To submit, please visit our Devpost page at{" "}
                <a
                    href="http://devpost.hackpsu.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    devpost.hackpsu.org
                </a>
                . Make sure to submit your project (even if not completed) on Devpost by 12
                PM Sunday! You can edit it until 1:45 PM Sunday. This is a hard deadline -
                the submission portal closes at 12 PM and any projects not submitted will
                not be considered for prizes.
            </p>
        </div>
    );
};

export default Submissions;