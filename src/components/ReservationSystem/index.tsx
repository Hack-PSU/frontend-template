"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar, Accessibility, Monitor, Projector, PenTool, Loader2 } from "lucide-react";
import { useReservations, useLocations, useCreateReservation, useCancelReservation } from "@/lib/api/reservation/hook";
import { useAllTeams } from "@/lib/api/team/hook";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { toast } from "sonner";

interface Room {
  id: number;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  hasAccessibility: boolean;
  hasProjector: boolean;
  hasMonitor: boolean;
  hasWhiteboard: boolean;
}

const ReservationSystem: React.FC = () => {
  const { user } = useFirebase();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get user's team first to determine hackathon ID
  const { data: teams } = useAllTeams();
  
  const userTeam = useMemo(() => {
    if (!teams || !user) return null;
    return teams.find((team) =>
      [team.member1, team.member2, team.member3, team.member4, team.member5].includes(user.uid)
    );
  }, [teams, user]);

  // Fetch data using hackathon ID from user's team
  const { data: reservations, isLoading: reservationsLoading, error: reservationsError } = useReservations(userTeam?.hackathonId || "");
  const { data: locations, isLoading: locationsLoading, error: locationsError } = useLocations();
  const { mutateAsync: createReservation, isPending: isCreating } = useCreateReservation();
  const { mutateAsync: cancelReservation, isPending: isCanceling } = useCancelReservation(userTeam?.hackathonId || "");

  const [selectedSlot, setSelectedSlot] = useState<{
    roomId: number;
    time: string;
  } | null>(null);

  // Log errors for debugging
  React.useEffect(() => {
    console.log("=== Reservation System Debug ===");
    console.log("User:", user?.uid);
    console.log("Teams:", teams);
    console.log("User Team:", userTeam);
    console.log("User Team Hackathon ID:", userTeam?.hackathonId);
    console.log("Reservations:", reservations);
    console.log("Locations:", locations);
    console.log("Reservations Loading:", reservationsLoading);
    console.log("Locations Loading:", locationsLoading);
    console.log("Reservations Error:", reservationsError);
    console.log("Locations Error:", locationsError);
    console.log("================================");
    
    if (reservationsError) console.error("Reservations error:", reservationsError);
    if (locationsError) console.error("Locations error:", locationsError);
  }, [user, teams, userTeam, reservations, locations, reservationsLoading, locationsLoading, reservationsError, locationsError]);

  // Generate time slots from 12:00pm to 11:00pm
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 12; hour <= 23; hour++) {
      const displayHour = hour > 12 ? hour - 12 : hour;
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

  // Convert time string to Unix timestamp
  const timeToTimestamp = (timeStr: string, date: Date): number => {
    const [time, period] = timeStr.split(/(am|pm)/);
    let hour = parseInt(time);
    if (period === "pm" && hour !== 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;
    
    const newDate = new Date(date);
    newDate.setHours(hour, 0, 0, 0);
    return Math.floor(newDate.getTime() / 1000);
  };

  // Convert timestamp to time string
  const timestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    const hour = date.getHours();
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const period = hour >= 12 ? "pm" : "am";
    return `${displayHour}:00${period}`;
  };

  // Transform locations into rooms
  const rooms: Room[] = useMemo(() => {
    if (!locations) return [];
    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      building: loc.name.split(" ")[0],
      floor: loc.name.match(/\d+/)?.[0]?.charAt(0) || "1",
      capacity: loc.capacity,
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    }));
  }, [locations]);

  // Build availability map
  const availability = useMemo(() => {
    const availabilityMap: { [key: string]: { available: boolean; reservationId?: string } } = {};
    
    if (!reservations || !rooms) return availabilityMap;

    // Initialize all slots as available
    rooms.forEach(room => {
      timeSlots.forEach(time => {
        availabilityMap[`${room.id}-${time}`] = { available: true };
      });
    });

    // Mark reserved slots
    reservations.forEach(reservation => {
      const startTime = timestampToTime(reservation.startTime);
      const key = `${reservation.locationId}-${startTime}`;
      
      // Check if this is the user's team reservation
      const isUserTeamReservation = reservation.teamId === userTeam?.id;
      
      availabilityMap[key] = {
        available: false,
        reservationId: isUserTeamReservation ? reservation.id : undefined,
      };
    });

    return availabilityMap;
  }, [reservations, rooms, timeSlots, userTeam]);

  const handleSlotClick = async (roomId: number, time: string, slotInfo: { available: boolean; reservationId?: string }) => {
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
    if (!selectedSlot || !userTeam) return;

    try {
      const startTime = timeToTimestamp(selectedSlot.time, selectedDate);
      const endTime = startTime + 3600; // 1 hour reservation

      await createReservation({
        locationId: selectedSlot.roomId,
        teamId: userTeam.id,
        startTime,
        endTime,
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
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    setSelectedDate(newDate);
    setSelectedSlot(null);
  };

  // Show message if user has no team
  if (!userTeam && teams && !reservationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-gray-800">No Team Found</div>
          <div className="text-gray-600">You must be part of a team to make room reservations.</div>
          <div className="text-sm text-gray-500">Teams available: {teams.length}</div>
          <button 
            onClick={() => window.location.href = "/team"}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create or Join a Team
          </button>
        </div>
      </div>
    );
  }

  if (!teams || reservationsLoading || locationsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg">Loading reservations...</span>
          <div className="text-sm text-gray-500">
            {!teams && <div>Loading teams...</div>}
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
          <div className="text-red-600 text-xl font-bold">Error Loading Data</div>
          <div className="text-gray-600 text-sm">
            {reservationsError && <div>Reservations Error: {String(reservationsError)}</div>}
            {locationsError && <div>Locations Error: {String(locationsError)}</div>}
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
          <div className="text-gray-600">There are no rooms available for reservation at this time.</div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-6 text-gray-800" style={{ fontFamily: "TiltNeon, sans-serif" }}>
            Room Reservations
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xl font-semibold text-gray-700">{currentDate}</span>
            <button 
              onClick={() => handleDateChange("prev")}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => handleDateChange("next")}
              className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200 w-72 p-4 font-bold text-gray-700 border-r-2 border-gray-200 text-lg">
                Space
              </div>

              {rooms.map((room, index) => (
                <div
                  key={room.id}
                  className={`w-72 p-4 border-r-2 border-gray-200 border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-semibold">
                      Info
                    </span>
                    <span className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer transition-colors">
                      {room.name}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-2">
                    {room.hasAccessibility && (
                      <span title="Accessible">
                        <Accessibility size={20} className="text-gray-600" />
                      </span>
                    )}
                    {room.hasProjector && (
                      <span title="Projector">
                        <Projector size={20} className="text-gray-600" />
                      </span>
                    )}
                    {room.hasMonitor && (
                      <span title="Monitor">
                        <Monitor size={20} className="text-gray-600" />
                      </span>
                    )}
                    {room.hasWhiteboard && (
                      <span title="Whiteboard">
                        <PenTool size={20} className="text-gray-600" />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto flex-1">
              <div className="min-w-max">
                <div className="flex bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                  {timeSlots.map((time) => (
                    <div
                      key={time}
                      className="w-24 p-4 text-center font-semibold border-r border-gray-200 text-gray-700"
                    >
                      {time}
                    </div>
                  ))}
                </div>

                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`flex border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {timeSlots.map((time) => {
                      const slotInfo = availability[`${room.id}-${time}`] || { available: true };
                      const isSelected =
                        selectedSlot?.roomId === room.id &&
                        selectedSlot?.time === time;
                      const isUserReservation = Boolean(slotInfo.reservationId);

                      return (
                        <div
                          key={`${room.id}-${time}`}
                          className={`w-24 h-20 border-r border-gray-200 transition-all ${
                            isUserReservation
                              ? "bg-purple-400 hover:bg-purple-500 hover:shadow-lg hover:scale-105 cursor-pointer"
                              : slotInfo.available
                              ? isSelected
                                ? "bg-blue-500 hover:bg-blue-600 shadow-inner cursor-pointer"
                                : "bg-green-400 hover:bg-green-500 hover:shadow-lg hover:scale-105 cursor-pointer"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          onClick={() => handleSlotClick(room.id, time, slotInfo)}
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
                  </div>
                ))}
              </div>
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
            <span className="font-semibold text-gray-700">Your Reservation (Click to Cancel)</span>
          </div>
        </div>

        {selectedSlot && (
          <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl shadow-xl">
            <h3 className="font-bold text-2xl mb-4 text-gray-800" style={{ fontFamily: "TiltNeon, sans-serif" }}>
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
                <span className="font-semibold text-gray-700">Time:</span>{" "}
                <span className="text-blue-600 font-bold">{selectedSlot.time}</span>
              </p>
              <p className="text-lg">
                <span className="font-semibold text-gray-700">Team:</span>{" "}
                <span className="text-blue-600 font-bold">{userTeam?.name || "No Team"}</span>
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
      </div>
    </section>
  );
};

export default ReservationSystem;