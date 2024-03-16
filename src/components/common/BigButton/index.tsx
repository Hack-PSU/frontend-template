import React from "react";
import { motion } from "framer-motion";

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
				<img src={background.src} className={`w-full ${className || ""}`} />
			) : (
				<></>
			)}
			{children}
		</motion.button>
	);
};

export default BigButton;
