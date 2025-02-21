import React, { useMemo } from "react";
import { Tab } from "@headlessui/react";
import "./schedule.css";
import { useAllEvents } from "@/lib/api/event/hook";
import { EventEntityResponse } from "@/lib/api/event/entity";

const Divider = () => <hr className="my-4 border-white border-[1px]" />;

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
	<li className="flex justify-between">
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
			// Assuming event.location has a 'name' property.
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
	Object.keys(schedule).forEach((category: string) => {
		schedule[category].sort(
			(a, b) => a.sortKey.getTime() - b.sortKey.getTime()
		);
	});

	return schedule;
};

const Schedule: React.FC = () => {
	// Use React Query to fetch events.
	const { data: events, isLoading, error } = useAllEvents();

	// Convert events to schedule structure when events data changes.
	const schedule = useMemo(() => {
		return events ? convertEventsToSchedule(events) : {};
	}, [events]);

	if (isLoading) {
		return <div>Loading events...</div>;
	}

	if (error || !events) {
		return <div>Error loading events.</div>;
	}

	return (
		<div className="w-full max-w-5xl px-8 py-20 sm:px-0" id="schedule">
			<div className="text-center">
				<h1 className="section-header-text">Schedule</h1>
				<Divider />
			</div>
			<Tab.Group as="div">
				<Tab.List as="div" className="tab-list flex space-x-2 rounded-xl p-2">
					{Object.keys(schedule)
						.filter((category) => category !== "CheckIn")
						.map((category) => (
							<Tab
								as="div"
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

				<Tab.Panels as="div" className="mt-4 tab-panel">
					{Object.entries(schedule)
						.filter(([category]) => category !== "CheckIn")
						.map(([category, items], idx) => (
							<Tab.Panel key={idx} as="div" className="rounded-xl p-4">
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

export default Schedule;
