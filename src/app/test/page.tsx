"use client";
import React, { useState, useEffect } from "react";

interface this

const Test: React.FC = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	const options = [
		{ value: "a", label: "One" },
		{ value: "b", label: "Two" },
		{ value: "c", label: "Three" },
	];

	return (
		<div>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					
				</div>
			</div>
		</div>
	);
};

export default Test;