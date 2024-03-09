import React from "react";
import { Tab } from "@headlessui/react";
import "./schedule.css";

const mockData = {
	Overview: [
		{ name: "Check-In", time: "11AM" },
		{ name: "Opening Ceremonies", time: "12PM - 1PM" },
	],
	Workshops: [
		{ name: "Intro to React", time: "1PM - 2PM" },
		{ name: "Advanced CSS", time: "3PM - 4PM" },
	],
	Entertainment: [
		{ name: "Stand-up Comedy", time: "7:30PM" },
		{ name: "Trivia Night", time: "10:00PM" },
	],
};

function Divider() {
	return <hr className="my-4 border-black border-[1px]" />;
}

function Schedule() {
	return (
		<div className="w-full max-w-5xl px-8 py-20 sm:px-0" id="schedule">
			{" "}
			{/* Increased padding and max-width */}
			<div className="text-center">
				<h1 className="font-bold text-6xl cornerstone-font">Schedule</h1>{" "}
				{/* Increased font size */}
				<Divider />
			</div>
			<Tab.Group>
				<Tab.List className="tab-list flex space-x-2 rounded-xl p-2">
					{" "}
					{/* Increased padding */}
					{Object.keys(mockData).map((category) => (
						<Tab
							key={category}
							className={({ selected }) =>
								`tab w-full rounded-lg py-4 text-lg font-medium leading-6 focus:outline-none ${
									selected ? "bg-white " : " hover:bg-white/[0.12]"
								}`
							}
						>
							{category}
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels className="mt-4 tab-panel">
					{" "}
					{/* Increased margin */}
					{Object.entries(mockData).map(([category, items], idx) => (
						<Tab.Panel key={idx} className="rounded-xl p-4">
							{" "}
							{/* Increased padding */}
							<ul>
								{items.map((item, idx) => (
									<li
										key={idx}
										className="flex justify-between p-3 hover:bg-blue-50"
									>
										{" "}
										{/* Increased padding */}
										<span className="font-semibold text-lg">
											{item.name}
										</span>{" "}
										{/* Increased font size */}
										<span className="text-md">{item.time}</span>{" "}
										{/* Increased font size */}
									</li>
								))}
							</ul>
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
}

export default Schedule;
