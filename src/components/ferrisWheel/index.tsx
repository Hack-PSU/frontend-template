"use client";

import React from "react";
import { motion, useMotionValue } from "framer-motion";
import Image from "next/image";

const SpinningWheel = () => {
	const numCabins = 8;

	// Create a motion value for rotation
	const rotate = useMotionValue(0);

	return (
		<>
			<div className="flex justify-center items-center mt-[50px]">
				<motion.div
					style={{ rotate }}
					initial={{ rotate: 0 }}
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
					className="relative rounded-full h-[300px] w-[300px] bg-gradient-to-l bg-black from-white to-black"
				>
					<div>
						<Image src="/wheel.svg" alt="wheel" width={300} height={300} />
					</div>
					<div>
						{/* Place divs along the wheel */}
						{Array.from({ length: numCabins }).map((_, i) => (
							<div
								key={i}
								className="absolute w-5 h-5 bg-red-500 rounded-full"
								style={{
									top: "50%",
									left: "50%",
									transform: `translate(-50%, -50%) rotate(${i * (360 / numCabins)}deg) translate(150px)`,
								}}
							>
								{/* Small rectangular div to indicate cabin orientation */}
								<div
									className="relative w-2 h-2"
									style={{
										top: "50%",
										left: "50%",
										transform: `translate(-50%, -50%) rotate(-${i * (360 / numCabins)}deg)`,
									}}
								>
									<motion.div
										initial={{ rotate: 0 }}
										animate={{ rotate: -360 }}
										transition={{
											repeat: Infinity,
											duration: 20,
											ease: "linear",
										}}
										className="w-2 h-2 bg-green-500 border-b-2 border-cyan-200"
									/>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</>
	);
};

export default SpinningWheel;
