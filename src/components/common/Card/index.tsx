import ReactCardFlip from "react-card-flip";
import React, { useState } from "react";
import "./index.css";

interface Props {
	question: string;
	answer: string;
	link?: {
		target: string;
		text?: string | undefined;
	};
}

export default function Card({ question, answer, link }: Props) {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleClick = () => {
		setIsFlipped(!isFlipped);
	};

	return (
		<ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
			{/* Front Side */}
			<div onClick={handleClick} className="card-front w-full h-110 relative">
				<img
					src="/FAQ_Back.png"
					alt="Front"
					className="w-full h-full object-cover rounded-md"
				/>
				<div className="absolute inset-0 flex flex-col justify-center items-center px-20">
					<p className="text-center text-lg font-tiltneon text-black">
						{question}
					</p>
				</div>
			</div>

			{/* Back Side */}
			<div onClick={handleClick} className="card-back w-full h-110 relative">
				<img
					src="/FAQ_Front.png"
					alt="Back"
					className="w-full h-full object-cover rounded-md"
				/>
				<div className="absolute inset-0 flex flex-col justify-center items-center px-20">
					<p className="text-left text-[13px] text-black font-tiltneon ">
						{answer}
					</p>
					{link && (
						<a
							href={link.target}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-500 text-xs underline mt-2 font-tiltneon"
						>
							{link.text || "Learn more"}
						</a>
					)}
				</div>
			</div>
		</ReactCardFlip>
	);
}
