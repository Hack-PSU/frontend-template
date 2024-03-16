import React from "react";
import { motion } from "framer-motion";
import "./alert.css";

interface AlertProps {
	message: string;
	onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onClose }) => {
	const handleClose = () => {
		if (onClose) {
			onClose();
		}
	};

	return (
		<motion.div
			className="alert"
			animate={{
				x: [0, -5, 5, -5, 5, 0],
				transition: {
					duration: 0.5,
				},
			}}
		>
			<span className="closebtn" onClick={handleClose}>
				&times;
			</span>
			<p className="alert-text">{message}</p>
		</motion.div>
	);
};

export default Alert;
