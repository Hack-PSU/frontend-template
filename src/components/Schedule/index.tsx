import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAllEvents } from "@/lib/api/event/hook";
import { EventEntityResponse, EventType } from "@/lib/api/event/entity";
import { useFlagState } from "@/lib/api/flag/hook";

// Event type color mapping with pastel/cartoon theme
const eventTypeColors = {
	[EventType.activity]: {
		bg: "bg-[#FFE4E6]",
		border: "border-[#F87171]",
		text: "text-[#DC2626]",
		label: "Activity",
	},
	[EventType.food]: {
		bg: "bg-[#DCFCE7]",
		border: "border-[#4ADE80]",
		text: "text-[#16A34A]",
		label: "Food",
	},
	[EventType.workshop]: {
		bg: "bg-[#FEF3C7]",
		border: "border-[#FBBF24]",
		text: "text-[#D97706]",
		label: "Workshop",
	},
	[EventType.checkIn]: {
		bg: "bg-[#E0E7FF]",
		border: "border-[#818CF8]",
		text: "text-[#4338CA]",
		label: "Check-in",
	},
};

interface ProcessedEvent {
	id: string;
	name: string;
	type: EventType;
	location: string;
	startTime: Date;
	endTime: Date;
	day: "Saturday" | "Sunday";
	duration: number; // in minutes
	startMinutes: number; // minutes from midnight
	endMinutes: number; // end time in minutes from midnight
	column: number; // which column this event should be in
}

interface EventItemProps {
	event: ProcessedEvent;
	totalColumns: number;
	useTwoHourIntervals: boolean;
}

const EventItem: React.FC<EventItemProps> = ({
	event,
	totalColumns,
	useTwoHourIntervals,
}) => {
	const colors = eventTypeColors[event.type];
	const columnWidth = `${100 / totalColumns}%`;
	const leftOffset = `${(event.column * 100) / totalColumns}%`;

	// Adjust positioning and sizing based on interval type
	// For 2-hour intervals, use half the height to make it more compact
	const pixelsPerMinute = useTwoHourIntervals ? 80 / 120 : 80 / 60; // pixels per minute
	const topPosition = event.startMinutes * pixelsPerMinute;
	const height = Math.max(event.duration * pixelsPerMinute, 40); // minimum 40px height for 2-hour, 50px for 1-hour

	return (
		<motion.div
			className={`absolute p-3 rounded-xl border-3 ${colors.bg} ${colors.border} ${colors.text} shadow-md overflow-hidden`}
			style={{
				top: `${topPosition}px`,
				left: leftOffset,
				width: `calc(${columnWidth} - 8px)`, // More margin between columns
				height: `${height}px`,
				fontFamily: "Monomaniac One, monospace",
				marginLeft: "4px",
				marginRight: "4px",
			}}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3, delay: event.column * 0.1 }}
			whileHover={{ scale: 1.05, zIndex: 10 }}
		>
			<div className="text-sm font-bold truncate">{event.name}</div>
			<div className="text-xs opacity-75 truncate">{event.location}</div>
			<div className="text-xs opacity-60 mt-1">
				{event.startTime.toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				})}
			</div>
		</motion.div>
	);
};

interface DayColumnProps {
	day: "Saturday" | "Sunday";
	events: ProcessedEvent[];
	startHour: number;
	endHour: number;
	totalColumns: number;
	useTwoHourIntervals: boolean;
}

const DayColumn: React.FC<DayColumnProps> = ({
	day,
	events,
	startHour,
	endHour,
	totalColumns,
	useTwoHourIntervals,
}) => {
	const hours = [];
	const increment = useTwoHourIntervals ? 2 : 1;

	for (let hour = startHour; hour <= endHour; hour += increment) {
		hours.push(hour);
	}

	return (
		<div className="flex-1 min-w-0 relative">
			{/* Day Header */}
			<motion.div
				className="sticky top-0 z-20 p-4 text-center bg-[#A8E6CF] border-b-4 border-[#88D8A3]"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h3
					className="text-lg md:text-xl font-bold text-[#2D5016]"
					style={{ fontFamily: "Monomaniac One, monospace" }}
				>
					{day}
				</h3>
				<div className="text-sm text-[#2D5016]/70 font-medium">
					{events.length} event{events.length !== 1 ? "s" : ""}
				</div>
			</motion.div>

			{/* Time Grid */}
			<div className="relative bg-[#F0F9FF]">
				{/* Hour labels and grid lines */}
				{hours.map((hour, index) => {
					const gridHeight = useTwoHourIntervals ? 80 : 80; // Same height for both intervals to make 2-hour more compact

					return (
						<motion.div
							key={hour}
							className="relative border-b border-[#BFDBFE]"
							style={{ height: `${gridHeight}px` }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
						>
							<div
								className="absolute left-3 top-2 text-sm font-bold text-[#1E40AF] bg-[#DBEAFE] px-2 py-1 rounded-lg"
								style={{ fontFamily: "Monomaniac One, monospace" }}
							>
								{useTwoHourIntervals
									? // Show time range for 2-hour intervals
										`${hour === 0 ? "12" : hour > 12 ? hour - 12 : hour}${hour < 12 ? " AM" : " PM"} - ${
											hour + 2 === 0
												? "12"
												: hour + 2 > 12
													? hour + 2 - 12
													: hour + 2
										}${hour + 2 < 12 ? " AM" : " PM"}`
									: // Show single hour for 1-hour intervals
										hour === 0
										? "12 AM"
										: hour < 12
											? `${hour} AM`
											: hour === 12
												? "12 PM"
												: `${hour - 12} PM`}
							</div>
							{/* Subdivisions based on interval type */}
							{useTwoHourIntervals ? (
								// 30-minute subdivisions for 2-hour intervals (compact)
								<>
									<div
										className="absolute left-16 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "20px" }}
									></div>
									<div
										className="absolute left-16 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "40px" }}
									></div>
									<div
										className="absolute left-16 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "60px" }}
									></div>
								</>
							) : (
								// 15-minute subdivisions for 1-hour intervals
								<>
									<div className="absolute top-5 left-16 right-0 border-b border-[#E0F2FE] border-dashed"></div>
									<div className="absolute top-10 left-16 right-0 border-b border-[#E0F2FE] border-dashed"></div>
									<div className="absolute top-15 left-16 right-0 border-b border-[#E0F2FE] border-dashed"></div>
								</>
							)}
						</motion.div>
					);
				})}

				{/* Events Container */}
				<div className="absolute inset-0 pl-20 pr-4">
					{events.map((event) => (
						<EventItem
							key={event.id}
							event={event}
							totalColumns={totalColumns}
							useTwoHourIntervals={useTwoHourIntervals}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

// Function to assign columns to events to prevent overlapping
const assignColumns = (
	events: Omit<ProcessedEvent, "column">[]
): { events: ProcessedEvent[]; totalColumns: number } => {
	if (events.length === 0) return { events: [], totalColumns: 1 };

	// Sort events by start time, then by duration (longer events first for better packing)
	const sortedEvents = [...events].sort((a, b) => {
		if (a.startMinutes !== b.startMinutes) {
			return a.startMinutes - b.startMinutes;
		}
		return b.duration - a.duration;
	});

	// Track which columns are occupied at what times
	const columns: { endTime: number }[] = [];
	const eventsWithColumns: ProcessedEvent[] = [];
	const MAX_COLUMNS = 4; // Limit to 4 columns for readability

	sortedEvents.forEach((event) => {
		// Find the first available column
		let columnIndex = 0;
		while (columnIndex < columns.length && columnIndex < MAX_COLUMNS) {
			// Add 15-minute buffer to prevent tight overlaps
			if (columns[columnIndex].endTime <= event.startMinutes + 15) {
				break;
			}
			columnIndex++;
		}

		// If no available column and we haven't reached max, create a new one
		if (columnIndex === columns.length && columnIndex < MAX_COLUMNS) {
			columns.push({ endTime: event.endMinutes });
		} else if (columnIndex < columns.length) {
			columns[columnIndex].endTime = event.endMinutes;
		} else {
			// If we've reached max columns, put in the first available column (may overlap)
			columnIndex = 0;
			columns[0].endTime = Math.max(columns[0].endTime, event.endMinutes);
		}

		eventsWithColumns.push({
			...event,
			column: columnIndex,
		});
	});

	return {
		events: eventsWithColumns,
		totalColumns: Math.min(columns.length, MAX_COLUMNS),
	};
};

const Schedule: React.FC = () => {
	const { data: events, isLoading, error } = useAllEvents();
	const { data: twoHourFlag } = useFlagState("TwoHourIncrement");

	// Determine if we should use 2-hour intervals (default to 1-hour if flag not found)
	const useTwoHourIntervals = twoHourFlag?.isEnabled ?? false;

	// State for category filtering - all categories selected by default
	const [selectedCategories, setSelectedCategories] = useState<Set<EventType>>(
		new Set(Object.values(EventType).filter((type) => type !== EventType.checkIn)) // Exclude check-in from default selection
	);

	// Toggle category selection
	const toggleCategory = (category: EventType) => {
		setSelectedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(category)) {
				newSet.delete(category);
			} else {
				newSet.add(category);
			}
			return newSet;
		});
	};

	const processedEvents = useMemo(() => {
		if (!events)
			return {
				Saturday: { events: [], totalColumns: 1 },
				Sunday: { events: [], totalColumns: 1 },
			};

		// Filter events by selected categories
		const filteredEvents = events.filter((event) =>
			selectedCategories.has(event.type)
		);

		const eventsByDay: {
			Saturday: Omit<ProcessedEvent, "column">[];
			Sunday: Omit<ProcessedEvent, "column">[];
		} = {
			Saturday: [],
			Sunday: [],
		};

		filteredEvents.forEach((event) => {
			const startTime = new Date(event.startTime);
			const endTime = new Date(event.endTime);
			const startDayOfWeek = startTime.getDay(); // 0 = Sunday, 6 = Saturday
			const endDayOfWeek = endTime.getDay();

			// Only process Saturday (6) and Sunday (0) events
			if (
				startDayOfWeek !== 0 &&
				startDayOfWeek !== 6 &&
				endDayOfWeek !== 0 &&
				endDayOfWeek !== 6
			)
				return;

			// Check if event crosses midnight (spans multiple days)
			const crossesMidnight = startTime.getDate() !== endTime.getDate();

			if (crossesMidnight) {
				// Split event into two parts

				// First part: from start time to end of day (23:59:59)
				if (startDayOfWeek === 6 || startDayOfWeek === 0) {
					const endOfDay = new Date(startTime);
					endOfDay.setHours(23, 59, 59, 999);

					const startDay = startDayOfWeek === 6 ? "Saturday" : "Sunday";
					const firstPartDuration =
						(endOfDay.getTime() - startTime.getTime()) / (1000 * 60);
					const startMinutes =
						startTime.getHours() * 60 + startTime.getMinutes();
					const endMinutes = 23 * 60 + 59; // End of day

					const firstPart: Omit<ProcessedEvent, "column"> = {
						id: `${event.id}-part1`,
						name: `${event.name} (Part 1)`,
						type: event.type,
						location: event.location.name,
						startTime,
						endTime: endOfDay,
						day: startDay,
						duration: firstPartDuration,
						startMinutes,
						endMinutes,
					};

					eventsByDay[startDay].push(firstPart);
				}

				// Second part: from start of next day (00:00) to end time
				if (endDayOfWeek === 6 || endDayOfWeek === 0) {
					const startOfDay = new Date(endTime);
					startOfDay.setHours(0, 0, 0, 0);

					const endDay = endDayOfWeek === 6 ? "Saturday" : "Sunday";
					const secondPartDuration =
						(endTime.getTime() - startOfDay.getTime()) / (1000 * 60);
					const startMinutes = 0; // Start of day
					const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

					const secondPart: Omit<ProcessedEvent, "column"> = {
						id: `${event.id}-part2`,
						name: `${event.name} (Part 2)`,
						type: event.type,
						location: event.location.name,
						startTime: startOfDay,
						endTime,
						day: endDay,
						duration: secondPartDuration,
						startMinutes,
						endMinutes,
					};

					eventsByDay[endDay].push(secondPart);
				}
			} else {
				// Event doesn't cross midnight, process normally
				const day = startDayOfWeek === 6 ? "Saturday" : "Sunday";
				const duration =
					(endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
				const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
				const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

				const processedEvent: Omit<ProcessedEvent, "column"> = {
					id: event.id,
					name: event.name,
					type: event.type,
					location: event.location.name,
					startTime,
					endTime,
					day,
					duration,
					startMinutes,
					endMinutes,
				};

				eventsByDay[day].push(processedEvent);
			}
		});

		// Assign columns to prevent overlapping
		const saturdayResult = assignColumns(eventsByDay.Saturday);
		const sundayResult = assignColumns(eventsByDay.Sunday);

		return {
			Saturday: saturdayResult,
			Sunday: sundayResult,
		};
	}, [events, selectedCategories]);

	// Calculate time range to show
	const timeRange = useMemo(() => {
		if (!events || events.length === 0) return { start: 8, end: 22 }; // default 8 AM to 10 PM

		let earliestHour = 23;
		let latestHour = 0;

		events.forEach((event) => {
			const startHour = new Date(event.startTime).getHours();
			const endHour = new Date(event.endTime).getHours();

			earliestHour = Math.min(earliestHour, startHour);
			latestHour = Math.max(latestHour, endHour);
		});

		// Add 1 hour padding on each side
		return {
			start: Math.max(0, earliestHour - 1),
			end: Math.min(23, latestHour + 1),
		};
	}, [events]);

	if (isLoading) {
		return (
			<div className="w-full flex justify-center items-center py-20">
				<motion.p
					className="text-xl text-[#048A81]"
					style={{ fontFamily: "Monomaniac One, monospace" }}
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					Loading schedule...
				</motion.p>
			</div>
		);
	}

	if (error || !events) {
		return (
			<div className="w-full flex justify-center items-center py-20">
				<p
					className="text-xl text-[#A20021]"
					style={{ fontFamily: "Monomaniac One, monospace" }}
				>
					Error loading schedule.
				</p>
			</div>
		);
	}

	return (
		<section
			className="relative flex flex-col items-center justify-center w-full px-[4vw] py-[8vw]"
			style={{ minHeight: "60vw", backgroundColor: "#FFE4F4" }}
			id="schedule"
		>
			{/* Header */}
			<motion.div
				className="text-center mb-8 z-10 relative"
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h1
					className="text-4xl md:text-5xl font-bold text-[#A20021] mb-6"
					style={{ fontFamily: "Rye, serif" }}
				>
					Schedule
				</h1>

				{/* Legend - Clickable Category Filters */}
				<div className="flex flex-wrap justify-center gap-4 mb-6">
					{Object.entries(eventTypeColors).map(([type, colors], index) => {
						const eventType = type as EventType;
						const isSelected = selectedCategories.has(eventType);

						return (
							<motion.button
								key={type}
								onClick={() => toggleCategory(eventType)}
								className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-all duration-200 cursor-pointer hover:scale-105 ${
									isSelected
										? `${colors.bg} ${colors.border}`
										: "bg-gray-200 border-gray-400 opacity-50"
								}`}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<div
									className={`w-3 h-3 rounded-full transition-colors ${
										isSelected
											? colors.border.replace("border-", "bg-")
											: "bg-gray-400"
									}`}
								></div>
								<span
									className={`text-sm font-bold transition-colors ${
										isSelected ? colors.text : "text-gray-500"
									}`}
									style={{ fontFamily: "Monomaniac One, monospace" }}
								>
									{colors.label}
								</span>
								{/* Visual indicator for selected state */}
								{isSelected && (
									<motion.div
										className="w-2 h-2 bg-current rounded-full"
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										exit={{ scale: 0 }}
									/>
								)}
							</motion.button>
						);
					})}
				</div>

				{/* Show selected count */}
				<div className="text-center mb-4">
					<span
						className="text-sm text-[#A20021]/70 font-medium"
						style={{ fontFamily: "Monomaniac One, monospace" }}
					>
						{selectedCategories.size === Object.keys(EventType).length
							? "Showing all categories"
							: `Showing ${selectedCategories.size} of ${Object.keys(EventType).length} categories`}
					</span>
				</div>
			</motion.div>

			{/* Calendar Grid */}
			<motion.div
				className="w-full max-w-7xl bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#FFB6D9]"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<div className="flex flex-col lg:flex-row min-h-96">
					<DayColumn
						day="Saturday"
						events={processedEvents.Saturday.events}
						startHour={timeRange.start}
						endHour={timeRange.end}
						totalColumns={processedEvents.Saturday.totalColumns}
						useTwoHourIntervals={useTwoHourIntervals}
					/>
					<div className="w-1 bg-[#FFB6D9] hidden lg:block"></div>
					<DayColumn
						day="Sunday"
						events={processedEvents.Sunday.events}
						startHour={timeRange.start}
						endHour={timeRange.end}
						totalColumns={processedEvents.Sunday.totalColumns}
						useTwoHourIntervals={useTwoHourIntervals}
					/>
				</div>
			</motion.div>
		</section>
	);
};

export default Schedule;
