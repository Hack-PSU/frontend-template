"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, Calendar, Clock, Users, MapPin, X } from "lucide-react";
import {
	useReservations,
	useLocations,
	useCreateReservation,
	useCancelReservation,
} from "@/lib/api/reservation/hook";
import { useAllTeams } from "@/lib/api/team/hook";
import { useActiveHackathonForStatic } from "@/lib/api/hackathon/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface Room {
	id: number;
	name: string;
	building: string;
	floor: string;
	capacity: number;
}

const ReservationSystem: React.FC = () => {
	const { user } = useFirebase();

	// Get user's team first to determine hackathon ID
	const { data: teams } = useAllTeams();

	const userTeam = useMemo(() => {
		if (!teams || !user) return null;
		return teams.find((team) =>
			[
				team.member1,
				team.member2,
				team.member3,
				team.member4,
				team.member5,
			].includes(user.uid)
		);
	}, [teams, user]);

	// Fetch hackathon data to get timeframe - using the active hackathon endpoint
	const { data: activeHackathon, isLoading: hackathonLoading } =
		useActiveHackathonForStatic();

	// Extract the hackathon data from the active hackathon response
	const hackathon = useMemo(() => {
		if (!activeHackathon) return null;
		return {
			id: activeHackathon.id,
			name: activeHackathon.name,
			startTime: activeHackathon.startTime,
			endTime: activeHackathon.endTime,
			active: activeHackathon.active,
		};
	}, [activeHackathon]);

	// Initialize selected date based on hackathon start time (normalize to ms)
	const initialDate = useMemo(() => {
		if (hackathon?.startTime) {
			const tsMs =
				hackathon.startTime > 9999999999
					? hackathon.startTime
					: hackathon.startTime * 1000;
			return new Date(tsMs);
		}
		return new Date();
	}, [hackathon]);

	const [selectedDate, setSelectedDate] = useState(initialDate);

	// Update selected date when hackathon data loads
	React.useEffect(() => {
		if (
			hackathon?.startTime &&
			selectedDate.getTime() !== initialDate.getTime()
		) {
			setSelectedDate(initialDate);
		}
	}, [hackathon, initialDate]);

	// Fetch data using hackathon ID from active hackathon
	const {
		data: reservations,
		isLoading: reservationsLoading,
		error: reservationsError,
	} = useReservations(hackathon?.id || "");
	const {
		data: locations,
		isLoading: locationsLoading,
		error: locationsError,
	} = useLocations();
	const { mutateAsync: createReservation, isPending: isCreating } =
		useCreateReservation();
	const { mutateAsync: cancelReservation, isPending: isCanceling } =
		useCancelReservation(hackathon?.id || "");

	const [selectedSlots, setSelectedSlots] = useState<{
		roomId: number;
		times: string[];
	} | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [cancelModalOpen, setCancelModalOpen] = useState(false);
	const [reservationToCancel, setReservationToCancel] = useState<string | null>(null);

	// Get valid date range for the hackathon (normalize to ms)
	const dateRange = useMemo(() => {
		if (!hackathon)
			return { startDate: null, endDate: null, dates: [] as Date[] };

		const startMs =
			hackathon.startTime > 9999999999
				? hackathon.startTime
				: hackathon.startTime * 1000;
		const endMs =
			hackathon.endTime > 9999999999
				? hackathon.endTime
				: hackathon.endTime * 1000;

		const startDate = new Date(startMs);
		const endDate = new Date(endMs);

		const dates: Date[] = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return { startDate, endDate, dates };
	}, [hackathon]);

	// Debug
	React.useEffect(() => {
		console.log("=== Reservation System Debug ===");
		console.log("User:", user?.uid);
		console.log("User Team:", userTeam);
		console.log("Hackathon ID:", hackathon?.id);
		console.log("Hackathon Data:", hackathon);
		if (hackathon) {
			const startMs =
				hackathon.startTime > 9999999999
					? hackathon.startTime
					: hackathon.startTime * 1000;
			const endMs =
				hackathon.endTime > 9999999999
					? hackathon.endTime
					: hackathon.endTime * 1000;
			console.log("Hackathon Start:", new Date(startMs));
			console.log("Hackathon End:", new Date(endMs));
		}
		console.log("Selected Date:", selectedDate);
		console.log("Date Range:", dateRange);
		console.log("Reservations:", reservations);
		console.log("Locations:", locations);
		console.log("================================");
	}, [
		user,
		userTeam,
		hackathon,
		selectedDate,
		dateRange,
		reservations,
		locations,
	]);

	// Generate time slots based on selected date and hackathon timeframe
	const generateTimeSlots = (): string[] => {
		if (!hackathon) return [];

		const slots: string[] = [];
		const selectedDateStart = new Date(selectedDate);
		selectedDateStart.setHours(0, 0, 0, 0);

		const startMs =
			hackathon.startTime > 9999999999
				? hackathon.startTime
				: hackathon.startTime * 1000;
		const endMs =
			hackathon.endTime > 9999999999
				? hackathon.endTime
				: hackathon.endTime * 1000;

		const hackathonStart = new Date(startMs);
		const hackathonEnd = new Date(endMs);

		let startHour = 0;
		let endHour = 24; // ← include 23:00 (11pm) by default

		// First day: start at hackathon start hour
		if (selectedDateStart.toDateString() === hackathonStart.toDateString()) {
			startHour = hackathonStart.getHours();
		}

		// Last day: end at hackathon end hour (exclusive)
		if (selectedDateStart.toDateString() === hackathonEnd.toDateString()) {
			endHour = hackathonEnd.getHours();
			if (endHour === 0) endHour = 24; // if it ends at midnight, show up to 11pm
		}

		for (let hour = startHour; hour < endHour; hour++) {
			const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
			const period = hour >= 12 ? "pm" : "am";
			slots.push(`${displayHour}:00${period}`);
		}

		return slots;
	};

	const timeSlots = generateTimeSlots();

	const currentDate = selectedDate.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	/**
	 * Helpers: milliseconds everywhere
	 */

	// Convert "h:00am/pm" + date -> timestamp in **ms**
	const timeToTimestamp = (timeStr: string, date: Date): number => {
		const [time, period] = timeStr.split(/(am|pm)/);
		let hour = parseInt(time);
		if (period === "pm" && hour !== 12) hour += 12;
		if (period === "am" && hour === 12) hour = 0;

		const d = new Date(date);
		d.setHours(hour, 0, 0, 0);
		return d.getTime(); // ms
	};

	// Convert timestamp (sec OR ms) -> "h:00am/pm"
	const timestampToTime = (ts: number): string => {
		const ms = ts > 9999999999 ? ts : ts * 1000; // normalize to ms
		const date = new Date(ms);
		const hour = date.getHours();
		const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
		const period = hour >= 12 ? "pm" : "am";
		return `${displayHour}:00${period}`;
	};

	const rooms: Room[] = useMemo(() => {
		if (!locations) return [];
		return locations
			.filter((loc) => loc.capacity !== -1)
			.map((loc) => ({
				id: loc.id,
				name: loc.name,
				building: loc.name.split(" ")[0],
				floor: loc.name.match(/\d+/)?.[0]?.charAt(0) || "1",
				capacity: loc.capacity,
			}));
	}, [locations]);

	// Build availability map with capacity tracking (normalize incoming reservation times)
	const availability = useMemo(() => {
		const availabilityMap: {
			[key: string]: {
				available: boolean;
				reservationId?: string;
				currentOccupancy: number;
				maxCapacity: number;
			};
		} = {};

		if (!reservations || !rooms) return availabilityMap;

		// Initialize all slots with capacity information
		rooms.forEach((room) => {
			timeSlots.forEach((time) => {
				availabilityMap[`${room.id}-${time}`] = {
					available: true,
					currentOccupancy: 0,
					maxCapacity: room.capacity,
				};
			});
		});

		// Count participant reservations per slot
		reservations.forEach((reservation) => {
			// Only count participant reservations toward capacity
			if (reservation.reservationType !== 'participant') return;

			const startLabel = timestampToTime(reservation.startTime);
			const key = `${reservation.locationId}-${startLabel}`;

			if (!availabilityMap[key]) return;

			const isUserTeamReservation = reservation.teamId === userTeam?.id;

			// Increment occupancy count
			availabilityMap[key].currentOccupancy += 1;

			// Store user's own reservation ID
			if (isUserTeamReservation) {
				availabilityMap[key].reservationId = reservation.id;
			}

			// Mark as unavailable if at capacity (capacity > 0 means limited, 0 means unlimited)
			const room = rooms.find(r => r.id === reservation.locationId);
			if (room && room.capacity > 0 && availabilityMap[key].currentOccupancy >= room.capacity) {
				availabilityMap[key].available = false;
			}
		});

		return availabilityMap;
	}, [reservations, rooms, timeSlots, userTeam]);

	const handleSlotClick = async (
		roomId: number,
		time: string,
		slotInfo: {
			available: boolean;
			reservationId?: string;
			currentOccupancy: number;
			maxCapacity: number;
		}
	) => {
		if (!userTeam) {
			toast.error("You must be part of a team to make reservations");
			return;
		}

		// If clicking an existing reservation by this team, open cancel modal
		if (slotInfo.reservationId) {
			setReservationToCancel(slotInfo.reservationId);
			setSelectedSlots({ roomId, times: [time] });
			setCancelModalOpen(true);
			return;
		}

		// If slot is not available (at capacity), show detailed message
		if (!slotInfo.available) {
			const capacityText = slotInfo.maxCapacity === 0 ? 'unlimited' : slotInfo.maxCapacity;
			toast.error(`This time slot is at full capacity (${slotInfo.currentOccupancy}/${capacityText})`);
			return;
		}

		// Toggle slot selection
		if (selectedSlots?.roomId === roomId) {
			const timeIndex = selectedSlots.times.indexOf(time);
			if (timeIndex > -1) {
				// Deselect this time
				const newTimes = selectedSlots.times.filter((t) => t !== time);
				if (newTimes.length === 0) {
					setSelectedSlots(null);
				} else {
					setSelectedSlots({ roomId, times: newTimes });
				}
			} else {
				// Add this time
				setSelectedSlots({ roomId, times: [...selectedSlots.times, time].sort() });
			}
		} else {
			// New room selection
			setSelectedSlots({ roomId, times: [time] });
		}
	};

	const handleConfirmReservation = async () => {
		if (!selectedSlots || !userTeam || !hackathon) return;

		try {
			const hackathonStartMs =
				hackathon.startTime > 9999999999
					? hackathon.startTime
					: hackathon.startTime * 1000;
			const hackathonEndMs =
				hackathon.endTime > 9999999999
					? hackathon.endTime
					: hackathon.endTime * 1000;

			// Sort times to create consecutive reservations
			const sortedTimes = [...selectedSlots.times].sort((a, b) => {
				const aMs = timeToTimestamp(a, selectedDate);
				const bMs = timeToTimestamp(b, selectedDate);
				return aMs - bMs;
			});

			// Create reservations for each selected slot
			const reservationPromises = sortedTimes.map(async (time) => {
				const startTimeMs = timeToTimestamp(time, selectedDate);
				const endTimeMs = startTimeMs + 60 * 60 * 1000; // 1 hour

				// Validate within bounds (ms)
				if (startTimeMs < hackathonStartMs || endTimeMs > hackathonEndMs) {
					throw new Error("Reservation time must be within the hackathon period");
				}

				return createReservation({
					locationId: selectedSlots.roomId,
					teamId: userTeam.id,
					startTime: startTimeMs, // ms
					endTime: endTimeMs, // ms
					hackathonId: hackathon.id,
				});
			});

			await Promise.all(reservationPromises);

			toast.success(
				`${sortedTimes.length} reservation${sortedTimes.length > 1 ? "s" : ""} created successfully!`
			);
			setSelectedSlots(null);
			setIsModalOpen(false);
		} catch (error: any) {
			console.error("Create reservation error:", error);
			toast.error(error?.message || "Failed to create reservation");
		}
	};

	const handleCancelReservation = async () => {
		if (!reservationToCancel) return;

		try {
			await cancelReservation(reservationToCancel);
			toast.success("Reservation canceled successfully!");
			setReservationToCancel(null);
			setSelectedSlots(null);
			setCancelModalOpen(false);
		} catch (error) {
			console.error("Cancel error:", error);
			toast.error("Failed to cancel reservation");
		}
	};

	const handleDateChange = (direction: "prev" | "next") => {
		if (!dateRange.dates || dateRange.dates.length === 0) return;

		const currentIndex = dateRange.dates.findIndex(
			(d) => d.toDateString() === selectedDate.toDateString()
		);

		if (direction === "next" && currentIndex < dateRange.dates.length - 1) {
			setSelectedDate(dateRange.dates[currentIndex + 1]);
			setSelectedSlots(null);
		} else if (direction === "prev" && currentIndex > 0) {
			setSelectedDate(dateRange.dates[currentIndex - 1]);
			setSelectedSlots(null);
		}
	};

	// Check if we can navigate to prev/next dates
	const canNavigate = useMemo(() => {
		if (!dateRange.dates || dateRange.dates.length === 0)
			return { prev: false, next: false };

		const currentIndex = dateRange.dates.findIndex(
			(d) => d.toDateString() === selectedDate.toDateString()
		);

		return {
			prev: currentIndex > 0,
			next: currentIndex < dateRange.dates.length - 1,
		};
	}, [dateRange.dates, selectedDate]);

	// Show message if user has no team
	if (!userTeam && teams && !reservationsLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center space-y-4">
					<div className="text-2xl font-bold text-gray-800">No Team Found</div>
					<div className="text-gray-600">
						You must be part of a team to make room reservations.
					</div>
					<div className="text-sm text-gray-500">
						Teams available: {teams.length}
					</div>
					<button
						onClick={() => (window.location.href = "/team")}
						className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Create or Join a Team
					</button>
				</div>
			</div>
		);
	}

	if (!teams || reservationsLoading || locationsLoading || hackathonLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600" />
					<span className="text-lg">Loading reservations...</span>
					<div className="text-sm text-gray-500">
						{!teams && <div>Loading teams...</div>}
						{hackathonLoading && <div>Loading hackathon details...</div>}
						{reservationsLoading && <div>Loading reservations...</div>}
						{locationsLoading && <div>Loading locations...</div>}
					</div>
				</div>
			</div>
		);
	}

	if (reservationsError || locationsError) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex flex-col items-center space-y-4 text-center max-w-md">
					<div className="text-red-600 text-xl font-bold">
						Error Loading Data
					</div>
					<div className="text-gray-600 text-sm">
						{reservationsError && (
							<div>Reservations Error: {String(reservationsError)}</div>
						)}
						{locationsError && (
							<div>Locations Error: {String(locationsError)}</div>
						)}
					</div>
					<button
						onClick={() => window.location.reload()}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!locations || locations.length === 0) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="text-xl font-bold mb-2">No Locations Available</div>
					<div className="text-gray-600">
						There are no rooms available for reservation at this time.
					</div>
				</div>
			</div>
		);
	}

	if (!hackathon) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<div className="text-xl font-bold mb-2">No Hackathon Data</div>
					<div className="text-gray-600">
						Unable to load hackathon timeframe information.
					</div>
				</div>
			</div>
		);
	}

	return (
		<section className="py-12 px-4 md:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<h1
						className="text-4xl font-bold mb-4 text-gray-800"
						style={{ fontFamily: "TiltNeon, sans-serif" }}
					>
						Room Reservations
					</h1>

					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200 w-fit">
							<button
								onClick={() => handleDateChange("prev")}
								disabled={!canNavigate.prev}
								className={`p-2 rounded-lg transition-all ${
									canNavigate.prev
										? "hover:bg-gray-100 text-gray-700"
										: "opacity-30 cursor-not-allowed text-gray-400"
								}`}
								title="Previous day"
							>
								<ChevronLeft size={20} />
							</button>
							<div className="flex items-center gap-2 px-3">
								<Calendar className="h-4 w-4 text-blue-600" />
								<span className="text-base font-semibold text-gray-800 min-w-[200px] text-center">
									{currentDate}
								</span>
							</div>
							<button
								onClick={() => handleDateChange("next")}
								disabled={!canNavigate.next}
								className={`p-2 rounded-lg transition-all ${
									canNavigate.next
										? "hover:bg-gray-100 text-gray-700"
										: "opacity-30 cursor-not-allowed text-gray-400"
								}`}
								title="Next day"
							>
								<ChevronRight size={20} />
							</button>
						</div>

						<div className="flex flex-wrap gap-3 text-xs bg-white p-2.5 rounded-lg shadow-sm border border-gray-200">
							<div className="flex items-center gap-1.5">
								<div className="w-4 h-4 bg-green-400 border border-gray-300 rounded"></div>
								<span className="text-gray-600">Available (Low occupancy)</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-4 h-4 bg-yellow-300 border border-gray-300 rounded"></div>
								<span className="text-gray-600">Filling up (75%+)</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-4 h-4 bg-blue-500 border border-gray-300 rounded"></div>
								<span className="text-gray-600">Selected</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-4 h-4 bg-gray-300 border border-gray-300 rounded"></div>
								<span className="text-gray-600">Full</span>
							</div>
							<div className="flex items-center gap-1.5">
								<div className="w-4 h-4 bg-purple-400 border border-gray-300 rounded"></div>
								<span className="text-gray-600">Your Reservation</span>
							</div>
						</div>
					</div>
				</div>

				{timeSlots.length === 0 ? (
					<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
						<p className="text-yellow-800">
							No reservation slots available for this date.
						</p>
					</div>
				) : (
					<>
						<div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
							{/* Unified Grid Container */}
							<div className="overflow-x-auto">
								<div
									className="grid"
									style={{
										gridTemplateColumns: `140px repeat(${timeSlots.length}, 1fr)`,
										gridTemplateRows: `40px repeat(${rooms.length}, 40px)`,
									}}
								>
									{/* Header Row */}
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-r-2 border-gray-200 flex items-center px-3 font-bold text-gray-700 text-sm">
										Space
									</div>
									{timeSlots.map((time) => (
										<div
											key={time}
											className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-r border-gray-200 flex items-center justify-center font-semibold text-gray-700 text-xs"
										>
											{time}
										</div>
									))}

									{/* Data Rows */}
									{rooms.map((room, rowIndex) => (
										<React.Fragment key={room.id}>
											{/* Room Name Cell */}
											<div
												className={`border-r-2 border-b border-gray-200 flex flex-col justify-center px-2 py-1 ${
													rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
												}`}
											>
												<span className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors text-xs leading-tight">
													{room.name}
												</span>
												<span className="text-[10px] text-gray-500 mt-0.5">
													{room.capacity === 0 ? 'Unlimited' : `Cap: ${room.capacity}`}
												</span>
											</div>

											{/* Time Slot Cells */}
											{timeSlots.map((time) => {
												const slotInfo = availability[`${room.id}-${time}`] || {
													available: true,
													currentOccupancy: 0,
													maxCapacity: room.capacity,
												};
												const isSelected =
													selectedSlots?.roomId === room.id &&
													selectedSlots?.times.includes(time);
												const isUserReservation = Boolean(
													slotInfo.reservationId
												);

												// Calculate fill percentage for visual indicator
												const fillPercentage = slotInfo.maxCapacity > 0
													? (slotInfo.currentOccupancy / slotInfo.maxCapacity) * 100
													: 0;

												// Determine background color based on occupancy
												let bgColor = "bg-green-400 hover:bg-green-500 hover:ring-2 hover:ring-green-600 hover:ring-inset";
												if (isUserReservation) {
													bgColor = "bg-purple-400 hover:bg-purple-500";
												} else if (isSelected) {
													bgColor = "bg-blue-500 hover:bg-blue-600 ring-2 ring-blue-700 ring-inset";
												} else if (!slotInfo.available) {
													bgColor = "bg-gray-300 cursor-not-allowed hover:bg-gray-300";
												} else if (slotInfo.maxCapacity > 0) {
													// Show color gradient based on occupancy
													if (fillPercentage >= 75) {
														bgColor = "bg-yellow-300 hover:bg-yellow-400 hover:ring-2 hover:ring-yellow-500 hover:ring-inset";
													} else if (fillPercentage >= 50) {
														bgColor = "bg-green-300 hover:bg-green-400 hover:ring-2 hover:ring-green-500 hover:ring-inset";
													}
												}

												// Build tooltip text
												let tooltipText = "";
												if (isUserReservation) {
													tooltipText = `Your reservation at ${room.name} - Click to cancel`;
												} else if (slotInfo.available) {
													const capacityText = slotInfo.maxCapacity === 0
														? 'Unlimited capacity'
														: `${slotInfo.currentOccupancy}/${slotInfo.maxCapacity} spots filled`;
													if (isSelected) {
														tooltipText = `Deselect ${time} (${capacityText})`;
													} else {
														tooltipText = `Select ${time} at ${room.name} (${capacityText})`;
													}
												} else {
													const capacityText = slotInfo.maxCapacity === 0 ? 'unlimited' : slotInfo.maxCapacity;
													tooltipText = `Full capacity (${slotInfo.currentOccupancy}/${capacityText})`;
												}

												return (
													<div
														key={`${room.id}-${time}`}
														className={`border-r border-b border-gray-200 transition-all cursor-pointer relative group ${bgColor}`}
														onClick={() =>
															handleSlotClick(room.id, time, slotInfo)
														}
														title={tooltipText}
													>
														{/* Show occupancy indicator for non-empty slots */}
														{!isUserReservation && !isSelected && slotInfo.currentOccupancy > 0 && slotInfo.maxCapacity > 0 && (
															<div className="absolute inset-0 flex items-center justify-center">
																<span className="text-[10px] font-bold text-gray-700 opacity-70">
																	{slotInfo.currentOccupancy}/{slotInfo.maxCapacity}
																</span>
															</div>
														)}
													</div>
												);
											})}
										</React.Fragment>
									))}
								</div>
							</div>
						</div>

						{selectedSlots && selectedSlots.times.length > 0 && (
							<div className="mt-6 flex justify-center">
								<button
									onClick={() => setIsModalOpen(true)}
									className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-lg hover:shadow-xl flex items-center gap-2 text-lg"
								>
									<Calendar className="h-5 w-5" />
									Review & Confirm ({selectedSlots.times.length} slot{selectedSlots.times.length > 1 ? 's' : ''})
								</button>
							</div>
						)}

						{/* Booking Modal */}
						<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
							<DialogContent className="sm:max-w-lg">
								<DialogHeader>
									<DialogTitle className="text-2xl font-bold text-gray-800">
										Confirm Reservation{selectedSlots && selectedSlots.times.length > 1 ? 's' : ''}
									</DialogTitle>
									<DialogDescription className="text-gray-600">
										Review your reservation details before confirming.
									</DialogDescription>
								</DialogHeader>

								<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
									<p className="text-xs text-blue-900">
										<span className="font-semibold">Note:</span> Reserving a room does not guarantee exclusive use.
										Larger rooms are shared hacking spaces. This system ensures your team has a designated spot
										and helps manage room capacity to keep everyone comfortable and productive.
									</p>
								</div>

								{selectedSlots && (
									<div className="space-y-4 py-2">
										<div className="flex items-start gap-3">
											<MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
											<div>
												<p className="text-sm font-medium text-gray-500">Room</p>
												<p className="text-lg font-semibold text-gray-800">
													{rooms.find((r) => r.id === selectedSlots.roomId)?.name}
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
											<div>
												<p className="text-sm font-medium text-gray-500">Date</p>
												<p className="text-lg font-semibold text-gray-800">
													{selectedDate.toLocaleDateString("en-US", {
														weekday: "long",
														month: "long",
														day: "numeric",
													})}
												</p>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<Clock className="h-5 w-5 text-blue-600 mt-0.5" />
											<div className="flex-1">
												<p className="text-sm font-medium text-gray-500 mb-2">
													Time Slots ({selectedSlots.times.length} hour{selectedSlots.times.length > 1 ? 's' : ''})
												</p>
												<div className="flex flex-wrap gap-2">
													{selectedSlots.times.map((time) => (
														<span
															key={time}
															className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold"
														>
															{time}
														</span>
													))}
												</div>
											</div>
										</div>

										<div className="flex items-start gap-3">
											<Users className="h-5 w-5 text-blue-600 mt-0.5" />
											<div>
												<p className="text-sm font-medium text-gray-500">Team</p>
												<p className="text-lg font-semibold text-gray-800">
													{userTeam?.name || "No Team"}
												</p>
											</div>
										</div>
									</div>
								)}

								<DialogFooter className="gap-2">
									<button
										onClick={() => setIsModalOpen(false)}
										className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
									>
										Cancel
									</button>
									<button
										onClick={handleConfirmReservation}
										disabled={isCreating}
										className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
									>
										{isCreating ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Confirming...
											</>
										) : (
											"Confirm Reservation"
										)}
									</button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						{/* Cancel Modal */}
						<Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle className="text-2xl font-bold text-gray-800">
										Cancel Reservation
									</DialogTitle>
									<DialogDescription className="text-gray-600">
										Are you sure you want to cancel this reservation?
									</DialogDescription>
								</DialogHeader>

								{selectedSlots && (
									<div className="space-y-3 py-4">
										<div className="flex items-center gap-3">
											<MapPin className="h-5 w-5 text-red-600" />
											<div>
												<p className="text-sm text-gray-500">Room</p>
												<p className="font-semibold text-gray-800">
													{rooms.find((r) => r.id === selectedSlots.roomId)?.name}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-3">
											<Clock className="h-5 w-5 text-red-600" />
											<div>
												<p className="text-sm text-gray-500">Time</p>
												<p className="font-semibold text-gray-800">
													{selectedDate.toLocaleDateString()} at {selectedSlots.times[0]}
												</p>
											</div>
										</div>
									</div>
								)}

								<DialogFooter className="gap-2">
									<button
										onClick={() => setCancelModalOpen(false)}
										className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
									>
										Keep Reservation
									</button>
									<button
										onClick={handleCancelReservation}
										disabled={isCanceling}
										className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
									>
										{isCanceling ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" />
												Canceling...
											</>
										) : (
											<>
												<X className="h-4 w-4" />
												Cancel Reservation
											</>
										)}
									</button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</>
				)}
			</div>
		</section>
	);
};

export default ReservationSystem;
