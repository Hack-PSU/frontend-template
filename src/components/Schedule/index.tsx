import React, { useMemo } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { useAllEvents } from "@/lib/api/event/hook";
import { EventEntityResponse } from "@/lib/api/event/entity";

const DayIndicator: React.FC<{ day: string }> = ({ day }) => (
	<div className="my-4">
		<h2 className="text-2xl font-bold bg-[#EFA00B] text-[#A20021] inline-block px-4 py-1 rounded-md border border-[#A20021]">
			{day}
		</h2>
	</div>
);

const EventItem: React.FC<{ name: string; time: string }> = ({
	name,
	time,
}) => (
	<li className="flex justify-between items-center py-2 border-b border-gray-300">
		<span className="text-lg font-medium">{name}</span>
		<span className="text-lg font-medium">{time}</span>
	</li>
);

interface ScheduleEventDetails {
	name: string;
	time: string;
	day: string;
	sortKey: Date;
}

interface ScheduleByCategory {
	[category: string]: ScheduleEventDetails[];
}

/**
 * Converts an array of events into an object keyed by event type (category)
 * with each value being an array of event details sorted by start time.
 */
const convertEventsToSchedule = (
	events: EventEntityResponse[]
): ScheduleByCategory => {
	const schedule = events.reduce(
		(acc: ScheduleByCategory, event: EventEntityResponse) => {
			const startTime = new Date(event.startTime);
			const day = startTime.toLocaleDateString("en-US", {
				weekday: "long",
				month: "long",
				day: "numeric",
			});

			const formattedStartTime = startTime.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			});
			const endTime = new Date(event.endTime);
			const formattedEndTime = endTime.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
			});

			// Capitalize the first letter of the event type.
			const eventType =
				event.type.charAt(0).toUpperCase() + event.type.slice(1);
			const eventName = event.name;
			const eventLocation = event.location.name;
			const timeRange = `${formattedStartTime} - ${formattedEndTime}`;

			const eventDetails: ScheduleEventDetails = {
				name: `${eventName} @ ${eventLocation}`,
				time: timeRange,
				day,
				sortKey: startTime,
			};

			if (!acc[eventType]) {
				acc[eventType] = [eventDetails];
			} else {
				acc[eventType].push(eventDetails);
			}
			return acc;
		},
		{}
	);

	// Sort each category’s events by start time.
	Object.keys(schedule).forEach((category) => {
		schedule[category].sort(
			(a, b) => a.sortKey.getTime() - b.sortKey.getTime()
		);
	});

	return schedule;
};

const Schedule: React.FC = () => {
	const { data: events, isLoading, error } = useAllEvents();

	const schedule = useMemo(
		() => (events ? convertEventsToSchedule(events) : {}),
		[events]
	);

	if (isLoading) {
		return (
			<div className="w-full flex justify-center items-center py-20">
				<p className="text-xl text-white">Loading events...</p>
			</div>
		);
	}

	if (error || !events) {
		return (
			<div className="w-full flex justify-center items-center py-20">
				<p className="text-xl text-red-500">Error loading events.</p>
			</div>
		);
	}

	// Filter out "CheckIn" and sort categories with "Food" first.
	const categories = Object.keys(schedule)
		.filter((category) => category !== "CheckIn")
		.sort((a, b) => {
			if (a === "Food") return -1;
			if (b === "Food") return 1;
			return a.localeCompare(b);
		});

	return (
		<div
			className="w-full max-w-5xl mx-auto px-4 pt-12 mt-16 rounded-2xl"
			id="schedule"
		>
			<div className="text-center mb-8">
				<h1 className="text-4xl md:text-5xl font-['Rye'] text-[#A20021]">
					Schedule
				</h1>
			</div>
			<Tab.Group>
				<Tab.List className="flex justify-center items-center mx-auto space-x-1 md:space-x-2 w-full max-w-md pb-2 border-b border-gray-300">
					{categories.map((category) => (
						<Tab
							key={category}
							className={({ selected }) =>
								clsx(
									"whitespace-nowrap px-4 py-2 md:px-8 md:py-4 rounded-t-lg font-semibold text-base md:text-xl transition-colors duration-300",
									selected
										? "bg-[#A20021] text-white border-b-4 border-[#EFA00B]"
										: "bg-white/80 text-[#A20021] border border-[#A20021]"
								)
							}
						>
							{category === "Food" ? "General" : category}
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels className="mt-4">
					{categories.map((category, idx) => (
						<Tab.Panel
							key={idx}
							className="bg-white/25 backdrop-blur-sm p-6 rounded-xl shadow-md border-2 border-[#EFA00B]"
						>
							{schedule[category].map((item, itemIdx, arr) => (
								<React.Fragment key={itemIdx}>
									{(itemIdx === 0 || item.day !== arr[itemIdx - 1].day) && (
										<DayIndicator day={item.day} />
									)}
									<EventItem name={item.name} time={item.time} />
								</React.Fragment>
							))}
						</Tab.Panel>
					))}
				</Tab.Panels>
			</Tab.Group>
		</div>
	);
};

export default Schedule;
