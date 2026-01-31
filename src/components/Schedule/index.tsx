"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import { createEvents, EventAttributes } from "ics";
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
import { useAllHackathons } from "@/lib/api/hackathon/hook";

// Event type color mapping with jellyfish assets
const eventTypeColors = {
	[EventType.activity]: {
		bg: "bg-[#f5b90c]",
		border: "border-[#f5b90c]",
		text: "text-[#DC2626]",
		label: "Activity",
		jellyfishAsset: "/sp26/activities2.png",
	},
	[EventType.food]: {
		bg: "bg-[#2b98a1]",
		border: "border-[#2b98a1]",
		text: "text-[#16A34A]",
		label: "General",
		jellyfishAsset: "/sp26/general2.png",
	},
	[EventType.workshop]: {
		bg: "bg-[#88d960]",
		border: "border-[#88d960]",
		text: "text-[#D97706]",
		label: "Workshop",
		jellyfishAsset: "/sp26/workshops2.png",
	},
	[EventType.checkIn]: {
		bg: "bg-[#e295fd]",
		border: "border-[#e295fd]",
		text: "text-[#4338CA]",
		label: "Check-in",
		jellyfishAsset: "/sp26/checkin2.png",
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
									className="text-xl font-bold text-white mb-2"
									style={{ fontFamily: "Orbitron, monospace" }}
								>
									{event.name}
								</h3>
								<span
									className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white bg-black/20"
									style={{ fontFamily: "Orbitron, monospace" }}
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

	// Add state for current time and update it every minute
	const [isHappening, setIsHappening] = useState(false);

	useEffect(() => {
		const checkIfHappening = () => {
			const now = new Date();
			setIsHappening(now >= event.startTime && now <= event.endTime);
		};

		// Check initially
		checkIfHappening();

		// Update every minute
		const interval = setInterval(checkIfHappening, 60000);

		return () => clearInterval(interval);
	}, [event.startTime, event.endTime]);

	// Adjust positioning and sizing based on interval type
	// 1-hour intervals: 80px per hour = 80/60 = 1.33px per minute
	// 2-hour intervals: 120px per 2 hours = 120/120 = 1px per minute
	const pixelsPerMinute = useTwoHourIntervals ? 120 / 120 : 80 / 60; // pixels per minute
	const topPosition = event.startMinutes * pixelsPerMinute;
	const height = Math.max(event.duration * pixelsPerMinute, isMobile ? 40 : 60); // minimum height for readability

	return (
		<motion.div
			className={`absolute p-3 rounded-xl border-3 ${colors.bg} ${colors.border} text-white shadow-md overflow-hidden cursor-pointer`}
			style={{
				top: `${topPosition}px`,
				left: leftOffset,
				width: `calc(${columnWidth} - 8px)`, // More margin between columns
				height: `${height}px`,
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
			{isHappening && (
				<div
					className="absolute w-2 h-2 rounded-full bg-red-500 animate-pulse"
					style={{
						top: "8px",
						left: "8px",
						zIndex: 2,
					}}
				/>
			)}
			<div
				className={`text-center leading-tight overflow-y-auto max-h-full w-full px-2 text-white ${isMobile ? "text-xs" : "text-sm"}`}
				style={{
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(0,0,0,0.3) transparent",
				}}
			>
				<div className="font-bold mb-1 text-white">{event.name}</div>
				<div
					className={`text-xs opacity-80 font-medium text-white ${isMobile ? "hidden" : ""}`}
				>
					{event.startTime.toLocaleTimeString("en-US", {
						hour: "numeric",
						minute: "2-digit",
						hour12: true,
					})}
				</div>
				<div
					className={`text-xs opacity-70 text-white ${isMobile ? "hidden" : ""}`}
				>
					{event.location}
				</div>
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
	isScrollable?: boolean;
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
	isScrollable = false,
}) => {
	const increment = useTwoHourIntervals ? 2 : 1;

	let adjustedStartHour = startHour;
	let adjustedEndHour = endHour;

	// On mobile, trim empty hours at start/end of weekend
	// Trim empty hours at the top/bottom based on this day's events
	if (events.length > 0) {
		const firstEventHour = Math.min(
			...events.map((e) => Math.floor(e.startMinutes / 60))
		);
		const lastEventHour = Math.max(
			...events.map((e) => Math.ceil(e.endMinutes / 60))
		);

		// Round to the current grid increment (1-hr or 2-hr)
		adjustedStartHour = Math.max(
			startHour,
			Math.floor(firstEventHour / increment) * increment
		);
		adjustedEndHour = Math.min(
			endHour,
			Math.ceil(lastEventHour / increment) * increment
		);
	}

	const hours = [];
	for (
		let hour = adjustedStartHour;
		hour <= adjustedEndHour;
		hour += increment
	) {
		hours.push(hour);
	}

	const timeAreaRef = useRef<HTMLDivElement>(null);
	const eventsAreaRef = useRef<HTMLDivElement>(null);

	// Synchronize scrolling between time sidebar and events area
	const handleTimeScroll = () => {
		if (timeAreaRef.current && eventsAreaRef.current) {
			eventsAreaRef.current.scrollTop = timeAreaRef.current.scrollTop;
		}
	};

	const handleEventsScroll = () => {
		if (timeAreaRef.current && eventsAreaRef.current) {
			timeAreaRef.current.scrollTop = eventsAreaRef.current.scrollTop;
		}
	};

	return (
		<div
			className={`${isScrollable ? "h-full" : "flex-1 min-w-0"} relative flex`}
		>
			{/* Time Sidebar */}
			<div
				ref={timeAreaRef}
				className={`${isMobile ? "w-16" : "w-20"} flex-shrink-0 bg-[#1a3f5c] ${isScrollable ? "overflow-y-auto" : ""}`}
				onScroll={handleTimeScroll}
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				<style jsx>{`
					div::-webkit-scrollbar {
						display: none;
					}
				`}</style>
				{hours.map((hour, index) => {
					const gridHeight = useTwoHourIntervals ? 120 : 80; // 2-hour gets more space

					return (
						<motion.div
							key={hour}
							className="relative border-b border-[#215172] flex items-start justify-center pt-2"
							style={{ height: `${gridHeight}px` }}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.3, delay: index * 0.05 }}
						>
							<div
								className={`font-medium text-white text-center ${isMobile ? "text-[10px]" : "text-xs"}`}
								style={{ fontFamily: "Orbitron, monospace" }}
							>
								{hour === 0
									? "12 AM"
									: hour < 12
										? `${hour} AM`
										: hour === 12
											? "12 PM"
											: `${hour - 12} PM`}
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Events Area */}
			<div
				ref={eventsAreaRef}
				className={`flex-1 relative bg-[#F0F9FF] ${isScrollable ? "overflow-y-auto" : ""}`}
				onScroll={handleEventsScroll}
			>
				{/* Grid lines */}
				{hours.map((hour, index) => {
					const gridHeight = useTwoHourIntervals ? 120 : 80; // 2-hour gets more space

					return (
						<div
							key={hour}
							className="relative border-b border-[#BFDBFE]"
							style={{ height: `${gridHeight}px` }}
						>
							{/* Subdivisions based on interval type */}
							{useTwoHourIntervals ? (
								// 30-minute subdivisions for 2-hour intervals
								<>
									<div
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "30px" }}
									></div>
									<div
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "60px" }}
									></div>
									<div
										className="absolute left-0 right-0 border-b border-[#E0F2FE] border-dashed"
										style={{ top: "90px" }}
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
						</div>
					);
				})}

				{/* Events Container */}
				<div className="absolute inset-0 px-4">
					{events.map((event) => {
						// Adjust event positioning based on trimmed hours
						const offsetMinutes = adjustedStartHour * 60;
						const adjustedEvent = {
							...event,
							startMinutes: event.startMinutes - offsetMinutes,
						};

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

// PreHackathonList: Renders a scrollable list of pre-hackathon events
interface PreHackathonEvent {
	id: string;
	name: string;
	type: EventType;
	location: string;
	startTime: Date;
	endTime: Date;
	duration: number;
}

const PreHackathonList: React.FC<{
	events: PreHackathonEvent[];
	onEventClick: (event: PreHackathonEvent) => void;
	isMobile: boolean;
}> = ({ events, onEventClick, isMobile }) => {
	return (
		<div
			className={`bg-white/90 border-4 border-[#215172] rounded-3xl shadow-xl p-4 flex flex-col gap-4
				${isMobile ? "w-full mb-4 rounded-3xl" : "w-64 mr-6 min-w-[220px] max-h-[600px] overflow-y-auto"}
			`}
			style={{
				fontFamily: "Orbitron, monospace",
			}}
		>
			<div className="text-center bg-[#215172] rounded-xl p-3 -m-4 mb-2">
				<h2 className="text-lg font-bold text-white">Pre-Hackathon Events</h2>
				<div className="h-1 w-16 bg-white/80 rounded-full mt-1 mx-auto"></div>
			</div>
			{events.length === 0 ? (
				<p className="text-gray-500 text-sm text-center py-4">
					No pre-hackathon events at this time.
				</p>
			) : (
				<ul className="flex flex-col gap-3">
					{events
						.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
						.map((event) => {
							const colors = eventTypeColors[event.type];
							return (
								<li
									key={event.id}
									className={`cursor-pointer rounded-xl border-3 ${colors.border} ${colors.bg} px-3 py-3 shadow-md transition-all duration-300 hover:scale-105 relative`}
									onClick={() => onEventClick(event)}
								>
									{(() => {
										const now = new Date();
										const isHappening =
											now >= event.startTime && now <= event.endTime;
										return (
											isHappening && (
												<div
													className="absolute w-2 h-2 rounded-full bg-red-500 animate-pulse"
													style={{
														top: "8px",
														right: "8px",
														zIndex: 2,
													}}
												/>
											)
										);
									})()}
									<div className="font-bold text-white mb-1">{event.name}</div>
									<div className="text-xs text-white/90 font-medium mb-1">
										{event.startTime.toLocaleDateString("en-US", {
											weekday: "short",
											month: "short",
											day: "numeric",
										})}
									</div>
									<div className="text-xs text-white/80">
										{event.startTime.toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										})}
										{" - "}
										{event.endTime.toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										})}
									</div>
									<div className="text-xs text-white/80 mt-1">
										{event.location}
									</div>
								</li>
							);
						})}
				</ul>
			)}
		</div>
	);
};

const Schedule: React.FC = () => {
	// Feature flag checks
	const { data: twoHourFlag } = useFlagState("TwoHourIncrement");
	const { data: sampleScheduleFlag } = useFlagState("SampleSchedule");

	// Fetch all hackathons to find the previous one when sample schedule flag is enabled
	const { data: allHackathons, isLoading: isLoadingHackathons } =
		useAllHackathons();

	// Find the previous hackathon (most recent inactive hackathon)
	const previousHackathonId = useMemo(() => {
		if (!sampleScheduleFlag?.isEnabled || !allHackathons) return undefined;

		// Filter out active hackathons and sort by endTime descending
		const inactiveHackathons = allHackathons
			.filter((h) => !h.active)
			.sort((a, b) => b.endTime - a.endTime);

		// Return the most recent inactive hackathon ID
		return inactiveHackathons.length > 0 ? inactiveHackathons[0].id : undefined;
	}, [sampleScheduleFlag?.isEnabled, allHackathons]);

	// Fetch previous hackathon events when the flag is enabled, otherwise current
	const {
		data: fetchedEvents,
		isLoading: isLoadingEvents,
		error,
	} = useAllEvents(
		sampleScheduleFlag?.isEnabled ? previousHackathonId : undefined
	);

	// Use fetched events directly; default to empty array while loading
	const events = fetchedEvents ?? [];

	// Combine loading states: loading if either hackathons or events are loading
	const isLoading = isLoadingHackathons || isLoadingEvents;

	// Ref for tracking scroll position of schedule section
	const scheduleRef = useRef<HTMLDivElement>(null);

	// State to track if component is mounted (client-side

	const tempScroll = useScroll({
		offset: ["2200px", "2900px"],
	});

	// pick the real scrollYProgress only after mount
	const scrollYProgress = tempScroll.scrollYProgress;

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

	// State for active day tab
	const [activeDay, setActiveDay] = useState<"Saturday" | "Sunday">("Saturday");

	// State for toggling pre-hackathon events visibility
	const [showPreEvents, setShowPreEvents] = useState(true);

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

	// Download .ics handler
	const handleDownloadIcs = async () => {
		// Combine all currently displayed events (respects filters)
		const saturdayEvents = processedEvents.Saturday.events;
		const sundayEvents = processedEvents.Sunday.events;
		const allEvents: ProcessedEvent[] = [...saturdayEvents, ...sundayEvents];

		// Map to ICS Event Format
		const icsEvents: EventAttributes[] = allEvents.map((event) => ({
			title: event.name,
			description: undefined,
			location: event.location,
			start: [
				event.startTime.getFullYear(),
				event.startTime.getMonth() + 1,
				event.startTime.getDate(),
				event.startTime.getHours(),
				event.startTime.getMinutes(),
			],
			end: [
				event.endTime.getFullYear(),
				event.endTime.getMonth() + 1,
				event.endTime.getDate(),
				event.endTime.getHours(),
				event.endTime.getMinutes(),
			],
		}));

		// Use ics package to create the ICS text
		createEvents(icsEvents, (error, value) => {
			if (error || !value) {
				alert("There was a problem exporting the .ics file.");
				return;
			}
			// Download as file
			const blob = new Blob([value], { type: "text/calendar" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `schedule.ics`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		});
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
				PreHackathon: [],
			};

		// Filter events by selected categories
		const filteredEvents = events.filter((event) =>
			selectedCategories.has(event.type)
		);

		const eventsByDay: {
			Saturday: Omit<ProcessedEvent, "column">[];
			Sunday: Omit<ProcessedEvent, "column">[];
			PreHackathon: PreHackathonEvent[];
		} = {
			Saturday: [],
			Sunday: [],
			PreHackathon: [],
		};

		// Helper to determine if a date is on the weekend
		const isWeekend = (date: Date) => {
			const d = date.getDay();
			return d === 6 || d === 0;
		};

		// Saturday = 6, Sunday = 0
		filteredEvents.forEach((event) => {
			const startTime = new Date(event.startTime);
			const endTime = new Date(event.endTime);
			const startDayOfWeek = startTime.getDay();
			const endDayOfWeek = endTime.getDay();

			// Adds event to PreHackathon if begins before hackathon weekend
			const isPreHackathon =
				startDayOfWeek !== 6 &&
				startDayOfWeek !== 0 &&
				endDayOfWeek !== 6 &&
				endDayOfWeek !== 0;

			// Checks if event ends, or starts and ends, before Saturday
			if (isPreHackathon) {
				const duration =
					(endTime.getTime() - startTime.getTime()) / (1000 * 60); // minutes
				eventsByDay.PreHackathon.push({
					id: event.id,
					name: event.name,
					type: event.type,
					location: event.location.name,
					startTime,
					endTime,
					duration,
				});
				return;
			}

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
			PreHackathon: eventsByDay.PreHackathon,
		};
	}, [events, selectedCategories]);

	// Check if there are any upcoming pre-hackathon events
	const hasUpcomingPreEvents = useMemo(() => {
		if (processedEvents.PreHackathon.length === 0) return false;
		const now = new Date();
		return processedEvents.PreHackathon.some((event) => event.endTime > now);
	}, [processedEvents.PreHackathon]);

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
					style={{ fontFamily: "Orbitron, monospace" }}
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
					style={{ fontFamily: "Orbitron, monospace" }}
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
			style={{
				minHeight: "60vw",
				borderTop: "2px solid #ff88e9ff",
				borderBottom: "2px solid #ff88e9ff",
				boxShadow:
					"0 -6px 10px #ff88e9cc, 0 6px 10px #ff88e9cc, inset 0 -6px 6px rgba(255, 136, 233, 0.05), inset 0 6px 6px rgba(255, 136, 233, 0.05)",
			}}
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
					className="text-4xl md:text-5xl font-bold text-[#2f234bff] mt-8 mx-auto"
					style={{
						fontFamily: "Orbitron, monospace",
						backgroundColor: "#ffffff",
						borderRadius: "12px",
						padding: "0.5rem 1rem",
						width: "fit-content",
					}}
				>
					Schedule
				</h1>
				<div className="w-16 h-1 bg-[#000080] rounded-full mx-auto mb-6"></div>

				{/* Legend - Conditional rendering based on screen size */}
				{isMobile ? (
					/* Mobile: Traditional Buttons */
					<div className="flex flex-wrap justify-center gap-3 mb-6">
						{Object.entries(eventTypeColors).map(([type, colors], index) => {
							const eventType = type as EventType;
							const isSelected = selectedCategories.has(eventType);

							return (
								<motion.button
									key={type}
									onClick={() => toggleCategory(eventType)}
									className={`px-4 py-2 rounded-lg font-medium text-sm border-2 transition-all duration-300 ${
										isSelected
											? `${colors.bg} ${colors.border} text-white`
											: "bg-white/80 border-gray-300 text-gray-700 hover:bg-gray-100"
									}`}
									style={{ fontFamily: "Orbitron, monospace" }}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.4, delay: index * 0.1 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{colors.label}
								</motion.button>
							);
						})}
					</div>
				) : (
					/* Desktop: Jellyfish Buttons */
					<div className="flex flex-wrap justify-center gap-6">
						{Object.entries(eventTypeColors).map(([type, colors], index) => {
							const eventType = type as EventType;
							const isSelected = selectedCategories.has(eventType);

							return (
								<motion.button
									key={type}
									onClick={() => toggleCategory(eventType)}
									className="relative flex flex-col items-center cursor-pointer group"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.4 }}
									whileHover={{ scale: 1 }}
									whileTap={{ scale: 1 }}
								>
									{/* Jellyfish Image */}
									<div className="relative w-60 h-60 mb-2">
										<Image
											src={colors.jellyfishAsset}
											alt={`${colors.label} Jellyfish`}
											fill
											className={`object-contain transition-all duration-300 ${
												isSelected ? "" : "grayscale"
											} group-hover:scale-110`}
										/>
									</div>

									{/* Text Overlay - Positioned upward */}
									<div
										className="absolute inset-0 flex items-center justify-center pointer-events-none"
										style={{ transform: "translateY(-70px) translateX(-5px)" }}
									>
										<span
											className={`font-bold text-center rounded-lg backdrop-blur-sm transition-all duration-300 ${
												isSelected
													? `text-white ${colors.bg} border-2 ${colors.border}`
													: "text-gray-600 bg-white/70"
											}`}
											style={{
												fontFamily: "Orbitron, monospace",
												fontSize: "clamp(12px, 2vw, 16px)",
											}}
										>
											{colors.label}
										</span>
									</div>
								</motion.button>
							);
						})}
					</div>
				)}

				{/* Show selected count */}
				<div className="text-center mb-4">
					<span
						className="text-sm text-[#ffa1fd] font-medium"
						style={{ fontFamily: "Orbitron, monospace" }}
					>
						{selectedCategories.size === Object.keys(EventType).length
							? "Showing all categories"
							: `Showing ${selectedCategories.size} of ${Object.keys(EventType).length} categories`}
					</span>
				</div>

				{/* Toggle for Pre-Hackathon Events */}
				{hasUpcomingPreEvents && (
					<div className="flex justify-center mb-4">
						<motion.button
							onClick={() => setShowPreEvents(!showPreEvents)}
							className={`px-6 py-3 rounded-xl font-bold text-sm border-3 transition-all duration-300 ${
								showPreEvents
									? "bg-[#215172] border-[#215172] text-white"
									: "bg-white/80 border-[#215172] text-[#215172] hover:bg-white"
							}`}
							style={{ fontFamily: "Orbitron, monospace" }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{showPreEvents ? "Hide" : "Show"} Pre-Hackathon Events
						</motion.button>
					</div>
				)}
			</motion.div>

			{/* Calendar Grid */}
			<div
				className={`w-full ${showPreEvents && hasUpcomingPreEvents ? "max-w-5xl" : "max-w-4xl"} flex ${
					isMobile ? "flex-col" : "flex-row"
				} items-stretch gap-0`}
			>
				{/* PreHackathonList: Displayed left of calendar on desktop, above on mobile */}
				{showPreEvents && hasUpcomingPreEvents && (
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 0.4 }}
					>
						<PreHackathonList
							events={processedEvents.PreHackathon}
							onEventClick={(event) => {
								// Open modal with minimal event info
								setSelectedEvent({
									id: event.id,
									name: event.name,
									type: event.type,
									location: event.location,
									startTime: event.startTime,
									endTime: event.endTime,
									day: "Saturday", // Not used for modal
									duration: event.duration,
									startMinutes:
										event.startTime.getHours() * 60 +
										event.startTime.getMinutes(),
									endMinutes:
										event.endTime.getHours() * 60 + event.endTime.getMinutes(),
									column: 0,
								});
								setIsModalOpen(true);
							}}
							isMobile={isMobile}
						/>
					</motion.div>
				)}
				<motion.div
					className="flex-1 bg-white/90 rounded-3xl shadow-xl overflow-hidden backdrop-blur-sm"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.3 }}
					layout
				>
					{/* Day Tabs */}
					<div className="sticky top-0 z-20 bg-[#215172] border-b-4 border-[#1a3f5c]">
						<div className="flex">
							{(["Saturday", "Sunday"] as const).map((day) => (
								<motion.button
									key={day}
									onClick={() => setActiveDay(day)}
									className={`flex-1 py-4 px-6 font-bold transition-all duration-300 ${
										activeDay === day
											? "bg-[#215172] text-white"
											: "bg-[#1a3f5c] text-white/70 hover:text-white hover:bg-[#215172]/80"
									}`}
									style={{ fontFamily: "Orbitron, monospace" }}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									<div
										className={`${isMobile ? "text-base" : "text-lg md:text-xl"}`}
									>
										{day}
									</div>
									<div
										className={`text-white/70 font-medium ${isMobile ? "text-xs" : "text-sm"} mt-1`}
									>
										{day === "Saturday"
											? `${processedEvents.Saturday.events.length} event${processedEvents.Saturday.events.length !== 1 ? "s" : ""}`
											: `${processedEvents.Sunday.events.length} event${processedEvents.Sunday.events.length !== 1 ? "s" : ""}`}
									</div>
								</motion.button>
							))}
						</div>
					</div>

					<div className="h-[600px] flex flex-col">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeDay}
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -50 }}
								transition={{ duration: 0.3 }}
								className="h-full"
							>
								<DayColumn
									day={activeDay}
									events={
										activeDay === "Saturday"
											? processedEvents.Saturday.events
											: processedEvents.Sunday.events
									}
									startHour={timeRange.start}
									endHour={timeRange.end}
									totalColumns={
										activeDay === "Saturday"
											? processedEvents.Saturday.totalColumns
											: processedEvents.Sunday.totalColumns
									}
									useTwoHourIntervals={useTwoHourIntervals}
									onEventClick={handleEventClick}
									isMobile={isMobile}
									allEvents={{
										Saturday: processedEvents.Saturday.events,
										Sunday: processedEvents.Sunday.events,
									}}
									isScrollable={true}
								/>
							</motion.div>
						</AnimatePresence>
					</div>
				</motion.div>
			</div>

			{/* Download .ics Button */}
			<div className="w-full max-w-5xl flex justify-center mt-8 mb-8">
				<button
					className="flex items-center gap-2 px-5 py-3 bg-[#215172] text-white font-semibold rounded-xl shadow-md hover:bg-[#1a3f5c] transition-colors "
					style={{ fontFamily: "Orbitron, monospace" }}
					onClick={handleDownloadIcs}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
						className="w-5 h-5"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M10 4v8m0 0L6.5 8.5M10 12l3.5-3.5M19 15a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"
						/>
					</svg>
					Download schedule
				</button>
			</div>

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
