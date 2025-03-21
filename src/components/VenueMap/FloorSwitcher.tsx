"use client";

import React from "react";
import { Floor } from "./types";

interface FloorSwitcherProps {
	floors: Floor[];
	currentFloor: Floor;
	onSwitch: (floor: Floor) => void;
}

const FloorSwitcher: React.FC<FloorSwitcherProps> = ({
	floors,
	currentFloor,
	onSwitch,
}) => (
	<div className="flex justify-center gap-4 mb-4">
		{floors.map((floor) => (
			<button
				key={floor.id}
				onClick={() => onSwitch(floor)}
				className={`px-4 py-2 rounded ${
					currentFloor.id === floor.id
						? "bg-[#a01127] text-white"
						: "bg-gray-200 text-black"
				}`}
			>
				{floor.name}
			</button>
		))}
	</div>
);

export default FloorSwitcher;
