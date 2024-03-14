import React, { useState, useEffect } from "react";
import { Tab } from "@headlessui/react";
import "./schedule.css";
import { EventModel } from "@/interfaces";

const Divider = () => <hr className="my-4 border-black border-[1px]" />;

interface DayIndicatorProps {
	day: string;
}

const DayIndicator: React.FC<DayIndicatorProps> = ({ day }) => (
	<div className="text-center py-4">
		<h2 className="text-xl font-bold">{day}</h2>
	</div>
);

interface EventItemProps {
	name: string;
	time: string;
}

const EventItem: React.FC<EventItemProps> = ({ name, time }) => (
	<li className="flex justify-between ">
		<span className="text-xl">{name}</span>
		<span className="text-xl">{time}</span>
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

const Schedule: React.FC = () => {
	const [schedule, setSchedule] = useState<ScheduleByCategory>({});

	useEffect(() => {
		const fetchEvents = async (): Promise<EventModel[]> => {
			const apiEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL_V3}/events`;
			try {
				const response = await fetch(apiEndpoint);
				if (!response.ok) {
					throw new Error(`Network response was not ok: ${response.status}`);
				}
				return await response.json();
			} catch (error) {
				console.error("Error fetching events:", error);
				return [];
			}
		};

		const loadEvents = async () => {
			const events = await fetchEvents();
			setSchedule(convertEventsToSchedule(events));
		};

		loadEvents();
	}, []);

	return (
		<div className="w-full max-w-5xl px-8 py-20 sm:px-0" id="schedule">
			<div className="text-center">
				<h1 className="font-bold text-6xl">Schedule</h1>
				<Divider />
			</div>
			<Tab.Group>
				<Tab.List className="tab-list flex space-x-2 rounded-xl p-2">
					{Object.keys(schedule).map((category) => (
						<Tab
							key={category}
							className={({ selected }) =>
								`tab w-full rounded-lg py-4 text-lg font-medium leading-6 focus:outline-none ${
									selected ? "bg-[#ffffff]" : "hover:bg-white/[0.12]"
								}`
							}
						>
							{category}
						</Tab>
					))}
				</Tab.List>
				<Tab.Panels className="mt-4 tab-panel">
					{Object.entries(schedule).map(([category, items], idx) => (
						<Tab.Panel key={idx} className="rounded-xl p-4">
							{items.map((item, itemIdx, arr) => (
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

const convertEventsToSchedule = (events: EventModel[]): ScheduleByCategory => {
	const schedule = events.reduce(
		(acc: ScheduleByCategory, event: EventModel) => {
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

	Object.keys(schedule).forEach((category: string) => {
		schedule[category].sort(
			(a: ScheduleEventDetails, b: ScheduleEventDetails) =>
				a.sortKey.getTime() - b.sortKey.getTime()
		);
	});

	return schedule;
};

export default Schedule;
