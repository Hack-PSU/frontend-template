import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type BigButtonProps = {
	children?: React.ReactNode;
	background?: any;
	onClick?: () => void;
	className?: string;
};

const BigButton = ({
	children,
	background,
	onClick,
	className,
}: BigButtonProps) => {
	return (
		<motion.button
			className={`w-full hover:cursor-pointer ${className || ""}`}
			onClick={onClick}
			whileHover={{
				scale: 1.1,
				transition: { duration: 0.1 },
			}}
			whileTap={{ scale: 0.9 }}
		>
			{background ? (
				<Image
					src={background.src}
					alt="big-button"
					width={background.width}
					height={background.height}
				/>
			) : (
				<></>
			)}
			{children}
		</motion.button>
	);
};

export default BigButton;
