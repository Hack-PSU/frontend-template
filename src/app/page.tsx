"use client";
import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import Schedule from "@/components/Schedule";
import FAQRules from "@/components/FAQRules";
import MobileApp from "@/components/MobileApp";
import PrizesChallenges from "@/components/PrizesChallenges";
import Sponsors from "@/components/Sponsors";
import Footer from "@/components/Footer";

export default function Home() {
	// Redirect to the old website on mobile because this one isn't ready for it yet.
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 1024
  );
  
  useEffect(() => {
    if (isMobile) {
      window.location.replace("https://hackpsu.org");
    }
  }, [isMobile])
  
  return (
		<>
      <a id="mlh-trust-badge" className="mlh-badge" href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2024-season&utm_content=white" target="_blank">
        <img src="https://s3.amazonaws.com/logged-assets/trust-badge/2024/mlh-trust-badge-2024-white.svg" alt="Major League Hacking 2024 Hackathon Season" className="w-full" />
      </a>
      <main className="flex min-h-screen flex-col items-center w-full gap-6">
        <Hero />
        <Schedule />
        <FAQRules />
        <MobileApp />
        <PrizesChallenges />
        <Sponsors />
        <Footer />
      </main>
    </>
	);
}
