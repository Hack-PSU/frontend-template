"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import {
	motion,
	AnimatePresence,
	useScroll,
	useTransform,
	useMotionValue,
} from "framer-motion";
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
	onEventClick: (event: ProcessedEvent) => void;
	isMobile?: boolean;
}

interface EventDetailsModalProps {
	event: ProcessedEvent | null;
	isOpen: boolean;
	onClose: () => void;
	originalEvent?: EventEntityResponse;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
	event,
	isOpen,
	onClose,
	originalEvent,
}) => {
	if (!event || !isOpen) return null;

	const colors = eventTypeColors[event.type];

	return (
		<AnimatePresence>
			<motion.div
				className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			>
				<motion.div
					className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border-4 ${colors.border}`}
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.8, opacity: 0 }}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div
						className={`${colors.bg} rounded-xl p-4 mb-4 border-2 ${colors.border}`}
					>
						<div className="flex justify-between items-start">
							<div>
								<h3
									className={`text-xl font-bold ${colors.text} mb-2`}
									style={{ fontFamily: "Monomaniac One, monospace" }}
								>
									{event.name}
								</h3>
								<span
									className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-white/80`}
									style={{ fontFamily: "Monomaniac One, monospace" }}
								>
									{colors.label}
								</span>
							</div>
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
							>
								×
							</button>
						</div>
					</div>

					{/* Details */}
					<div className="space-y-4">
						<div>
							<h4 className="font-semibold text-gray-700 mb-1">Time</h4>
							<p className="text-gray-600">
								{event.startTime.toLocaleTimeString("en-US", {
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}{" "}
								-{" "}
								{event.endTime.toLocaleTimeString("en-US", {
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
								})}
							</p>
							<p className="text-sm text-gray-500">
								{event.startTime.toLocaleDateString("en-US", {
									weekday: "long",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>

						<div>
							<h4 className="font-semibold text-gray-700 mb-1">Location</h4>
							<p className="text-gray-600">{event.location}</p>
						</div>

						<div>
							<h4 className="font-semibold text-gray-700 mb-1">Duration</h4>
							<p className="text-gray-600">
								{Math.round(event.duration)} minutes
							</p>
						</div>

						{originalEvent?.description && (
							<div>
								<h4 className="font-semibold text-gray-700 mb-1">
									Description
								</h4>
								<p className="text-gray-600">{originalEvent.description}</p>
							</div>
						)}

						{originalEvent?.wsPresenterNames && (
							<div>
								<h4 className="font-semibold text-gray-700 mb-1">
									Presenter(s)
								</h4>
								<p className="text-gray-600">
									{originalEvent.wsPresenterNames}
								</p>
							</div>
						)}

						{originalEvent?.wsRelevantSkills && (
							<div>
								<h4 className="font-semibold text-gray-700 mb-1">Skills</h4>
								<p className="text-gray-600">
									{originalEvent.wsRelevantSkills}
								</p>
							</div>
						)}

						{originalEvent?.wsSkillLevel && (
							<div>
								<h4 className="font-semibold text-gray-700 mb-1">
									Skill Level
								</h4>
								<p className="text-gray-600 capitalize">
									{originalEvent.wsSkillLevel}
								</p>
							</div>
						)}

						{originalEvent?.wsUrls && originalEvent.wsUrls.length > 0 && (
							<div>
								<h4 className="font-semibold text-gray-700 mb-1">Resources</h4>
								<div className="space-y-1">
									{originalEvent.wsUrls.map((url, index) => (
										<a
											key={index}
											href={url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 hover:text-blue-800 block text-sm underline"
										>
											{url}
										</a>
									))}
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

const EventItem: React.FC<EventItemProps> = ({
	event,
	totalColumns,
	useTwoHourIntervals,
	onEventClick,
	isMobile = false,
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
			className={`absolute p-3 rounded-xl border-3 ${colors.bg} ${colors.border} ${colors.text} shadow-md overflow-hidden cursor-pointer flex items-center justify-center`}
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
			whileHover={{ scale: 1.01, zIndex: 10 }}
			whileTap={{ scale: 0.99 }}
			onClick={() => onEventClick(event)}
		>
			<div
				className={`font-bold text-center leading-tight overflow-y-auto max-h-full w-full px-1 ${isMobile ? "text-xs" : "text-sm"}`}
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(0,0,0,0.3) transparent",
				}}
			>
				{event.name}
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
	onEventClick: (event: ProcessedEvent) => void;
	isMobile?: boolean;
	allEvents?: { Saturday: ProcessedEvent[]; Sunday: ProcessedEvent[] };
}

const DayColumn: React.FC<DayColumnProps> = ({
	day,
	events,
	startHour,
	endHour,
	totalColumns,
	useTwoHourIntervals,
	onEventClick,
	isMobile = false,
	allEvents,
}) => {
	const increment = useTwoHourIntervals ? 2 : 1;

	let adjustedStartHour = startHour;
	let adjustedEndHour = endHour;

	// On mobile, trim empty hours at start/end of weekend
	if (isMobile && allEvents) {
		if (day === "Saturday" && allEvents.Saturday.length > 0) {
			// Find first event on Saturday
			const firstEventHour = Math.min(
				...allEvents.Saturday.map((e) => Math.floor(e.startMinutes / 60))
			);
			adjustedStartHour = Math.max(
				startHour,
				Math.floor(firstEventHour / increment) * increment
			);
		}

		if (day === "Sunday" && allEvents.Sunday.length > 0) {
			// Find last event on Sunday
			const lastEventHour = Math.max(
				...allEvents.Sunday.map((e) => Math.ceil(e.endMinutes / 60))
			);
			adjustedEndHour = Math.min(
				endHour,
				Math.ceil(lastEventHour / increment) * increment
			);
		}
	}

	const hours = [];
	for (
		let hour = adjustedStartHour;
		hour <= adjustedEndHour;
		hour += increment
	) {
		hours.push(hour);
	}

	return (
		<div className="flex-1 min-w-0 relative">
			{/* Day Header */}
			<motion.div
				className={`sticky top-0 z-20 text-center bg-[#215172] border-b-4 border-[#1a3f5c] ${isMobile ? "p-3" : "p-4"}`}
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h3
					className={`font-bold text-white ${isMobile ? "text-base" : "text-lg md:text-xl"}`}
					style={{ fontFamily: "Monomaniac One, monospace" }}
				>
					{day}
				</h3>
				<div
					className={`text-white/70 font-medium ${isMobile ? "text-xs" : "text-sm"}`}
				>
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
							{/* Hour label */}
							<div
								className={`absolute right-2 top-1 font-medium text-[#215172] bg-white/80 px-1 rounded ${isMobile ? "text-[10px]" : "text-xs"}`}
							>
								{hour === 0
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
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "20px" }}
									></div>
									<div
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "40px" }}
									></div>
									<div
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "60px" }}
									></div>
								</>
							) : (
								// 15-minute subdivisions for 1-hour intervals
								<>
									<div className="absolute top-5 left-0 right-0 border-b border-[#E0F2FE] border-dashed"></div>
									<div className="absolute top-10 left-0 right-0 border-b border-[#E0F2FE] border-dashed"></div>
									<div className="absolute top-15 left-0 right-0 border-b border-[#E0F2FE] border-dashed"></div>
								</>
							)}
						</motion.div>
					);
				})}

				{/* Events Container */}
				<div className="absolute inset-0 px-4">
					{events.map((event) => {
						// Adjust event positioning based on trimmed hours
						const adjustedEvent = isMobile
							? {
									...event,
									startMinutes: event.startMinutes - adjustedStartHour * 60,
								}
							: event;

						return (
							<EventItem
								key={event.id}
								event={adjustedEvent}
								totalColumns={totalColumns}
								useTwoHourIntervals={useTwoHourIntervals}
								onEventClick={onEventClick}
								isMobile={isMobile}
							/>
						);
					})}
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

	// Ref for tracking scroll position of schedule section
	const scheduleRef = useRef<HTMLDivElement>(null);

	// State to track if component is mounted (client-side

	const tempScroll = useScroll({
		offset: ["1500px", "2500px"],
	});

	// pick the real scrollYProgress only after mount
	const scrollYProgress = tempScroll.scrollYProgress;
	const surfboardX = useTransform(scrollYProgress, [0, 1], ["0vw", "70vw"]);

	// Mobile detection
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1024); // lg breakpoint
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Determine if we should use 2-hour intervals (default to 1-hour if flag not found)
	const useTwoHourIntervals = twoHourFlag?.isEnabled ?? false;

	// State for category filtering - all categories selected by default
	const [selectedCategories, setSelectedCategories] = useState<Set<EventType>>(
		new Set(
			Object.values(EventType).filter((type) => type !== EventType.checkIn)
		) // Exclude check-in from default selection
	);

	// State for event details modal
	const [selectedEvent, setSelectedEvent] = useState<ProcessedEvent | null>(
		null
	);
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Handle event click
	const handleEventClick = (event: ProcessedEvent) => {
		setSelectedEvent(event);
		setIsModalOpen(true);
	};

	// Get original event data for modal
	const getOriginalEvent = (
		processedEvent: ProcessedEvent
	): EventEntityResponse | undefined => {
		if (!events) return undefined;
		// Handle split events (those with "-part1" or "-part2" suffix)
		const baseId = processedEvent.id.replace(/-part[12]$/, "");
		return events.find((e) => e.id === baseId || e.id === processedEvent.id);
	};

	// Handle modal close
	const handleModalClose = () => {
		setIsModalOpen(false);
		setSelectedEvent(null);
	};

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
			<div
				ref={scheduleRef}
				className="w-full flex justify-center items-center py-20"
			>
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
			<div
				ref={scheduleRef}
				className="w-full flex justify-center items-center py-20"
			>
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
			ref={scheduleRef}
			className="relative flex flex-col items-center justify-center w-full px-[4vw]"
			style={{ minHeight: "60vw", backgroundColor: "#85CEFF" }}
			id="schedule"
		>
			{/* Animated Surfboard - Scroll-linked */}
			<motion.div
				className="absolute z-50
				md:top-[-300px]
				top-[0px]
				"
				style={{
					left: surfboardX,
					width: "clamp(120px, 15vw, 250px)",
					height: "clamp(80px, 15vw, 250px)",
				}}
				initial={{ opacity: 1, rotate: -15 }}
				animate={{ opacity: 1, y: [-20, 20, -20] }}
				transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
			>
				<Image
					src="/f25/surfboard.png"
					alt="Surfboard"
					className="object-contain"
					fill
				/>
			</motion.div>

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
				className="w-full max-w-7xl bg-white/90 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3 }}
			>
				<div className="flex flex-col lg:flex-row min-h-96 gap-4 lg:gap-0">
					<DayColumn
						day="Saturday"
						events={processedEvents.Saturday.events}
						startHour={timeRange.start}
						endHour={timeRange.end}
						totalColumns={processedEvents.Saturday.totalColumns}
						useTwoHourIntervals={useTwoHourIntervals}
						onEventClick={handleEventClick}
						isMobile={isMobile}
						allEvents={{
							Saturday: processedEvents.Saturday.events,
							Sunday: processedEvents.Sunday.events,
						}}
					/>
					<div className="w-1 bg-[#FFB6D9] hidden lg:block"></div>
					<DayColumn
						day="Sunday"
						events={processedEvents.Sunday.events}
						startHour={timeRange.start}
						endHour={timeRange.end}
						totalColumns={processedEvents.Sunday.totalColumns}
						useTwoHourIntervals={useTwoHourIntervals}
						onEventClick={handleEventClick}
						isMobile={isMobile}
						allEvents={{
							Saturday: processedEvents.Saturday.events,
							Sunday: processedEvents.Sunday.events,
						}}
					/>
				</div>
			</motion.div>

			{/* Event Details Modal */}
			<EventDetailsModal
				event={selectedEvent}
				isOpen={isModalOpen}
				onClose={handleModalClose}
				originalEvent={
					selectedEvent ? getOriginalEvent(selectedEvent) : undefined
				}
			/>
		</section>
	);
};

export default Schedule;
