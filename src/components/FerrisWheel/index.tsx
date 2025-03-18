"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import wheel from "../../../public/wheel.svg";
import base from "../../../public/base.svg";
import Image from "next/image";

// Wheel SVG with visible spokes.
function WheelSVG() {
  return (
	<Image src="/wheel.svg" alt="Ferris Wheel" width={500} height={500}  />
  );
}

// Base SVG for the Ferris Wheel.
function BaseSVG() {
  return (
	<Image src="/base.svg" alt="Ferris Wheel Base" width={300} height={300} />
  );
}

const FerrisWheel = () => {
  const [wheelRotation, setWheelRotation] = useState(0);

  // Handle scroll wheel events to update the rotation.
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setWheelRotation((prev) => prev + e.deltaY);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden", // Hide the scrollbar.
        position: "relative",
      }}
      onWheel={handleWheel}
	  className="mt-[-200px]"
    >
      {/* Rotating wheel */}
      <motion.div
        style={{
          rotate: wheelRotation,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <WheelSVG />
      </motion.div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <BaseSVG />
      </div>
    </div>
  );
};

export default FerrisWheel;
