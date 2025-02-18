import React from "react";

const TravelReimbursementPolicy = () => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
    }}>
      <div className="max-w-full mx-auto text-justify text-sm pl-4 pr-4 h-[100vh] flex flex-col pt-8">
        <div className="font-verdana text-[42px] md:text-[42px] text-3xl text-center mb-8 cornerstone-font" style={{ // Changed font size of the title to 42px and 3xl for mobile to avoid clunking
          WebkitTextStroke: '1px white' // Added text stroke for the title to stand out better
        }}> 
          HackPSU Travel Reimbursement Policy
        </div>
        <div style={{ 
          border: '4px solid #e86818', // Border reflects the consistent design element of the borders on the homepage
          padding: '40px',
          borderRadius: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background just like the boxes on the homepage
          color: 'white',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          fontSize: '1.2rem',
          lineHeight: '1.6',
          marginBottom: '20px' // Ensures the bottom border doesn't touch the bottom of the screen
        }}>
          <p className="my-2 md:my-2 mb-6" /* Added mb-6 to all texts blocks besides last one to ensure proper spacing on mobile version */>
            HackPSU offers single travelers up to $70 in reimbursements, groups of
            2 or 3 hackers with up to $90, and groups of 4+ hackers up to $110.
          </p>
          <p className="my-2 md:my-2 mb-6">
            Participants arriving by bus or plane can be reimbursed up to $110. A
            taxi or ride-sharing service (e.g., Lyft or Uber) can also be
            reimbursed, but will count toward the participant&apos;s $110.
          </p>
          <p className="my-2 md:my-2 mb-6">
            Original receipts must be provided at the event in order to receive
            any reimbursement. Digital receipts are accepted for bus/plane tickets
            and for gas on the participant&apos;s return trip only.
          </p>
          <p className="my-2 md:my-2">
            Reimbursements may take up to 2 months. HackPSU does not reimburse
            travel from the State College area or lodging/other accommodations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelReimbursementPolicy;