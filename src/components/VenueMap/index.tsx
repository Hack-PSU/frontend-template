"use client";

import React, { useState } from "react";
import FloorMap from "./FloorMap";
import FloorSwitcher from "./FloorSwitcher";
import { Floor } from "./types";

const VenueMap: React.FC = () => {
	// Define room colors for consistency.
	const roomColors = {
		hacking: "#5eb77e",
		public: "#f0d252",
		workshop: "#5e9cc0",
		offlimits: "#d84a69",
	};

	// Define floors and rooms.
	// The description property is optional—rooms without tooltip info simply won't show a tooltip.
	const floors: Floor[] = [
		{
			id: "level-one",
			name: "Level One",
			rooms: [
				{
					id: "Building-outline",
					name: "Building Outline",
					path: "M246.384 154.848 235.968 204.672 232.384 204.016 215.776 283.808 210.88 312.144 223.264 315.728 330.08 337.872 326.176 358.384 341.152 364.576 340.176 371.744C347.3072 376.0528 354.4368 380.3632 361.568 384.672 372.0432 391.5568 382.5168 398.4432 392.992 405.328 400.3472 411.1728 407.7008 417.0192 415.056 422.864 422.2288 428.8112 429.4032 434.7568 436.576 440.704 443.1792 446.7408 449.7808 452.7792 456.384 458.816 460.816 463.5312 465.248 468.2448 469.68 472.96 477.2272 481.8288 484.7728 490.6992 492.32 499.568 498.0752 507.2112 503.8288 514.8528 509.584 522.496L512.656 526.432 519.456 526.624 560.736 589.696 573.296 588.56 574.16 602.544H568.736L595.872 812.544 601.312 811.904 603.216 833.328 655.36 825.344 656.32 833.968 757.728 821.504 727.344 587.344 909.856 563.504 911.504 579.44 938.48 576.576 937.248 558.192 1010.816 549.6 996.112 438.432 986.704 440.064 979.344 396.336 989.152 397.552C989.8347 388.016 990.5173 378.48 991.2 368.944 994.88 359.2693 998.56 349.5947 1002.24 339.92 1005.2373 335.2907 1008.2347 330.6613 1011.232 326.032L1012.352 290.8 978.88 294.528 971.744 233.12 888.56 243.424 908.16 404.784 804.512 405.12 804.336 397.824 778.208 397.312 777.696 404.784 669.712 403.68 707.024 230.304 645.552 215.472 653.232 179.568 566.896 159.904 560.064 192.96 511.12 183.344 505.744 208.16Z",
					type: "public",
					color: "#eaeaea",
					position: [200, 200],
				},
        {
          id: "room-124",
          name: "Room 124",
          roomNumber: "124",
          description: "Hacking space",
          path: "M229.458 316.152 242.171 248.82 333.517 268.596 320.804 336.87Z",
          type: "hacking",
          color: roomColors.hacking,
          position: [280, 300],
        },
			],
		},
		{
			id: "level-two",
			name: "Level Two",
			rooms: [
				{
					id: "room-201",
					name: "Hacking Space",
					roomNumber: "201",
					description: "Hacking space on level two.",
					path: "M300,300 L450,300 L450,450 L300,450 Z",
					type: "hacking",
					color: roomColors.hacking,
					position: [375, 375],
				},
				{
					id: "room-202",
					name: "Workshop Room",
					roomNumber: "202",
					description: "Workshop room on level two.",
					path: "M500,300 L650,300 L650,450 L500,450 Z",
					type: "workshop",
					color: roomColors.workshop,
					position: [575, 375],
				},
			],
		},
	];

	const [currentFloor, setCurrentFloor] = useState<Floor>(floors[0]);

	return (
		<section className="py-16 px-4 md:px-8">
			<h2 className="section-title text-center mb-6">Venue Map</h2>
			<div className="max-w-4xl mx-auto mb-6">
				<p
					className="text-center"
					style={{ fontFamily: "TiltNeon, sans-serif" }}
				>
					Explore the venue layout. Click on different areas to learn more about
					the spaces where you&apos;ll be hacking, learning, and networking!
				</p>
			</div>
			<FloorSwitcher
				floors={floors}
				currentFloor={currentFloor}
				onSwitch={setCurrentFloor}
			/>
			{/* You can now adjust the path stroke width via the pathStrokeWidth prop */}
			<FloorMap floor={currentFloor} pathStrokeWidth={4} />
		</section>
	);
};

export default VenueMap;
