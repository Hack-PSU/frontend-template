"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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

	// Fetch data using hackathon ID from user's team
	const {
		data: reservations,
		isLoading: reservationsLoading,
		error: reservationsError,
	} = useReservations(userTeam?.hackathonId || "");
	const {
		data: locations,
		isLoading: locationsLoading,
		error: locationsError,
	} = useLocations();
	const { mutateAsync: createReservation, isPending: isCreating } =
		useCreateReservation();
	const { mutateAsync: cancelReservation, isPending: isCanceling } =
		useCancelReservation(userTeam?.hackathonId || "");

	const [selectedSlot, setSelectedSlot] = useState<{
		roomId: number;
		time: string;
	} | null>(null);

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
		console.log("Hackathon ID:", userTeam?.hackathonId);
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

	// Build availability map (normalize incoming reservation times)
	const availability = useMemo(() => {
		const availabilityMap: {
			[key: string]: { available: boolean; reservationId?: string };
		} = {};

		if (!reservations || !rooms) return availabilityMap;

		// Initialize all slots as available
		rooms.forEach((room) => {
			timeSlots.forEach((time) => {
				availabilityMap[`${room.id}-${time}`] = { available: true };
			});
		});

		// Mark reserved slots
		reservations.forEach((reservation) => {
			const startLabel = timestampToTime(reservation.startTime);
			const key = `${reservation.locationId}-${startLabel}`;

			const isUserTeamReservation = reservation.teamId === userTeam?.id;

			availabilityMap[key] = {
				available: false,
				reservationId: isUserTeamReservation ? reservation.id : undefined,
			};
		});

		return availabilityMap;
	}, [reservations, rooms, timeSlots, userTeam]);

	const handleSlotClick = async (
		roomId: number,
		time: string,
		slotInfo: { available: boolean; reservationId?: string }
	) => {
		if (!userTeam) {
			toast.error("You must be part of a team to make reservations");
			return;
		}

		// If clicking an existing reservation by this team, cancel it
		if (slotInfo.reservationId) {
			try {
				await cancelReservation(slotInfo.reservationId);
				toast.success("Reservation canceled");
				setSelectedSlot(null);
			} catch (error) {
				console.error("Cancel error:", error);
				toast.error("Failed to cancel reservation");
			}
			return;
		}

		// If slot is not available, do nothing
		if (!slotInfo.available) {
			toast.error("This time slot is not available");
			return;
		}

		setSelectedSlot({ roomId, time });
	};

	const handleConfirmReservation = async () => {
		if (!selectedSlot || !userTeam || !hackathon) return;

		try {
			// ms throughout
			const startTimeMs = timeToTimestamp(selectedSlot.time, selectedDate);
			const endTimeMs = startTimeMs + 60 * 60 * 1000; // 1 hour

			const hackathonStartMs =
				hackathon.startTime > 9999999999
					? hackathon.startTime
					: hackathon.startTime * 1000;
			const hackathonEndMs =
				hackathon.endTime > 9999999999
					? hackathon.endTime
					: hackathon.endTime * 1000;

			// Validate within bounds (ms)
			if (startTimeMs < hackathonStartMs || endTimeMs > hackathonEndMs) {
				toast.error("Reservation time must be within the hackathon period");
				return;
			}

			await createReservation({
				locationId: selectedSlot.roomId,
				teamId: userTeam.id,
				startTime: startTimeMs, // ms
				endTime: endTimeMs, // ms
				hackathonId: userTeam.hackathonId,
			});

			toast.success("Reservation created successfully!");
			setSelectedSlot(null);
		} catch (error: any) {
			console.error("Create reservation error:", error);
			toast.error(error?.message || "Failed to create reservation");
		}
	};

	const handleDateChange = (direction: "prev" | "next") => {
		if (!dateRange.dates || dateRange.dates.length === 0) return;

		const currentIndex = dateRange.dates.findIndex(
			(d) => d.toDateString() === selectedDate.toDateString()
		);

		if (direction === "next" && currentIndex < dateRange.dates.length - 1) {
			setSelectedDate(dateRange.dates[currentIndex + 1]);
			setSelectedSlot(null);
		} else if (direction === "prev" && currentIndex > 0) {
			setSelectedDate(dateRange.dates[currentIndex - 1]);
			setSelectedSlot(null);
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
				<div className="mb-8">
					<h1
						className="text-5xl font-bold mb-6 text-gray-800"
						style={{ fontFamily: "TiltNeon, sans-serif" }}
					>
						Room Reservations
					</h1>
					<div className="flex flex-wrap items-center gap-3 mb-6">
						<span className="text-xl font-semibold text-gray-700">
							{currentDate}
						</span>
						<button
							onClick={() => handleDateChange("prev")}
							disabled={!canNavigate.prev}
							className={`px-4 py-2 bg-white border-2 border-gray-300 rounded-lg transition-all shadow-sm ${
								canNavigate.prev
									? "hover:bg-gray-50"
									: "opacity-50 cursor-not-allowed"
							}`}
						>
							<ChevronLeft size={18} />
						</button>
						<button
							onClick={() => handleDateChange("next")}
							disabled={!canNavigate.next}
							className={`px-4 py-2 bg-white border-2 border-gray-300 rounded-lg transition-all shadow-sm ${
								canNavigate.next
									? "hover:bg-gray-50"
									: "opacity-50 cursor-not-allowed"
							}`}
						>
							<ChevronRight size={18} />
						</button>
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
						<div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-2 00">
							{/* Unified Grid Container */}
							<div className="overflow-x-auto">
								<div
									className="grid"
									style={{
										gridTemplateColumns: `192px repeat(${timeSlots.length}, 1fr)`,
										gridTemplateRows: `56px repeat(${rooms.length}, 56px)`,
									}}
								>
									{/* Header Row */}
									<div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-r-2 border-gray-200 flex items-center px-3 font-bold text-gray-700">
										Space
									</div>
									{timeSlots.map((time) => (
										<div
											key={time}
											className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-r border-gray-200 flex items-center justify-center font-semibold text-gray-700 text-sm"
										>
											{time}
										</div>
									))}

									{/* Data Rows */}
									{rooms.map((room, rowIndex) => (
										<React.Fragment key={room.id}>
											{/* Room Name Cell */}
											<div
												className={`border-r-2 border-b border-gray-200 flex items-center px-3 ${
													rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
												}`}
											>
												<span className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors text-sm">
													{room.name}
												</span>
											</div>

											{/* Time Slot Cells */}
											{timeSlots.map((time) => {
												const slotInfo = availability[`${room.id}-${time}`] || {
													available: true,
												};
												const isSelected =
													selectedSlot?.roomId === room.id &&
													selectedSlot?.time === time;
												const isUserReservation = Boolean(
													slotInfo.reservationId
												);

												return (
													<div
														key={`${room.id}-${time}`}
														className={`border-r border-b border-gray-200 transition-all ${
															isUserReservation
																? "bg-purple-400 hover:bg-purple-500 hover:shadow-lg hover:scale-105 cursor-pointer"
																: slotInfo.available
																	? isSelected
																		? "bg-blue-500 hover:bg-blue-600 shadow-inner cursor-pointer"
																		: "bg-green-400 hover:bg-green-500 hover:shadow-lg hover:scale-105 cursor-pointer"
																	: "bg-gray-300 cursor-not-allowed"
														}`}
														onClick={() =>
															handleSlotClick(room.id, time, slotInfo)
														}
														title={
															isUserReservation
																? `Your reservation at ${room.name} - Click to cancel`
																: slotInfo.available
																	? `Reserve ${room.name} at ${time}`
																	: "Not available"
														}
													/>
												);
											})}
										</React.Fragment>
									))}
								</div>
							</div>
						</div>

						<div className="mt-6 flex flex-wrap gap-6 text-base bg-white p-4 rounded-xl shadow-md border-2 border-gray-200">
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-green-400 border-2 border-gray-300 rounded shadow-sm"></div>
								<span className="font-semibold text-gray-700">Available</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-gray-300 border-2 border-gray-300 rounded shadow-sm"></div>
								<span className="font-semibold text-gray-700">Unavailable</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-blue-500 border-2 border-gray-300 rounded shadow-sm"></div>
								<span className="font-semibold text-gray-700">Selected</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-8 h-8 bg-purple-400 border-2 border-gray-300 rounded shadow-sm"></div>
								<span className="font-semibold text-gray-700">
									Your Reservation (Click to Cancel)
								</span>
							</div>
						</div>

						{selectedSlot && (
							<div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-xl">
								<h3
									className="font-bold text-2xl mb-4 text-gray-800"
									style={{ fontFamily: "TiltNeon, sans-serif" }}
								>
									Selected Reservation
								</h3>
								<div className="space-y-2 mb-4">
									<p className="text-lg">
										<span className="font-semibold text-gray-700">Room:</span>{" "}
										<span className="text-blue-600 font-bold">
											{rooms.find((r) => r.id === selectedSlot.roomId)?.name}
										</span>
									</p>
									<p className="text-lg">
										<span className="font-semibold text-gray-700">
											Date & Time:
										</span>{" "}
										<span className="text-blue-600 font-bold">
											{selectedDate.toLocaleDateString()} at {selectedSlot.time}
										</span>
									</p>
									<p className="text-lg">
										<span className="font-semibold text-gray-700">
											Duration:
										</span>{" "}
										<span className="text-blue-600 font-bold">1 hour</span>
									</p>
									<p className="text-lg">
										<span className="font-semibold text-gray-700">Team:</span>{" "}
										<span className="text-blue-600 font-bold">
											{userTeam?.name || "No Team"}
										</span>
									</p>
								</div>
								<button
									onClick={handleConfirmReservation}
									disabled={isCreating}
									className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									{isCreating ? (
										<>
											<Loader2 className="h-5 w-5 animate-spin" />
											Creating...
										</>
									) : (
										"Confirm Reservation"
									)}
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default ReservationSystem;
