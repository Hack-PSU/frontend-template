"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Accessibility, Monitor, Projector, PenTool } from "lucide-react";

interface Room {
  id: string;
  name: string;
  building: string;
  floor: string;
  hasAccessibility: boolean;
  hasProjector: boolean;
  hasMonitor: boolean;
  hasWhiteboard: boolean;
}

const ReservationSystem: React.FC = () => {
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
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Sample room data
  const rooms: Room[] = [
    {
      id: "ecore-125",
      name: "ECORE 125",
      building: "ECORE",
      floor: "1",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-142",
      name: "ECORE 142",
      building: "ECORE",
      floor: "1",
      hasAccessibility: true,
      hasProjector: false,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-178",
      name: "ECORE 178",
      building: "ECORE",
      floor: "1",
      hasAccessibility: false,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-195",
      name: "ECORE 195",
      building: "ECORE",
      floor: "1",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: false,
      hasWhiteboard: true,
    },
    {
      id: "ecore-215",
      name: "ECORE 215",
      building: "ECORE",
      floor: "2",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-233",
      name: "ECORE 233",
      building: "ECORE",
      floor: "2",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: false,
    },
    {
      id: "ecore-256",
      name: "ECORE 256",
      building: "ECORE",
      floor: "2",
      hasAccessibility: false,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-267",
      name: "ECORE 267",
      building: "ECORE",
      floor: "2",
      hasAccessibility: false,
      hasProjector: false,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-289",
      name: "ECORE 289",
      building: "ECORE",
      floor: "2",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: true,
      hasWhiteboard: true,
    },
    {
      id: "ecore-294",
      name: "ECORE 294",
      building: "ECORE",
      floor: "2",
      hasAccessibility: true,
      hasProjector: true,
      hasMonitor: false,
      hasWhiteboard: false,
    },
  ];

  // Generate random availability for demo - memoized so it doesn't change on re-render
  const [availability] = useState(() => {
    const availabilityMap: { [key: string]: boolean } = {};
    rooms.forEach(room => {
      timeSlots.forEach(time => {
        availabilityMap[`${room.id}-${time}`] = Math.random() > 0.6;
      });
    });
    return availabilityMap;
  });

  const [selectedSlot, setSelectedSlot] = useState<{
    roomId: string;
    time: string;
  } | null>(null);

  const handleSlotClick = (roomId: string, time: string, available: boolean) => {
    if (!available) return; // Do nothing if slot is not available
    
    setSelectedSlot({ roomId, time });
  };

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-6 text-gray-800" style={{ fontFamily: "TiltNeon, sans-serif" }}>
            Room Reservations
          </h1>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xl font-semibold text-gray-700">{currentDate}</span>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm font-medium flex items-center gap-2">
              <Calendar size={18} />
              Go To Date
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Reservation Grid */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200">
          <div className="flex">
            {/* Fixed Room Column */}
            <div className="flex-shrink-0">
              {/* Room Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200 w-72 p-4 font-bold text-gray-700 border-r-2 border-gray-200 text-lg">
                Space
              </div>

              {/* Room Names */}
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
                      <Accessibility size={20} className="text-gray-600" title="Accessible" />
                    )}
                    {room.hasProjector && (
                      <Projector size={20} className="text-gray-600" title="Projector" />
                    )}
                    {room.hasMonitor && (
                      <Monitor size={20} className="text-gray-600" title="Monitor" />
                    )}
                    {room.hasWhiteboard && (
                      <PenTool size={20} className="text-gray-600" title="Whiteboard" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Scrollable Time Slots */}
            <div className="overflow-x-auto flex-1">
              <div className="min-w-max">
                {/* Time Header Row */}
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

                {/* Time Slot Rows */}
                {rooms.map((room, index) => (
                  <div
                    key={room.id}
                    className={`flex border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    {timeSlots.map((time) => {
                      const available = availability[`${room.id}-${time}`];
                      const isSelected =
                        selectedSlot?.roomId === room.id &&
                        selectedSlot?.time === time;

                      return (
                        <div
                          key={`${room.id}-${time}`}
                          className={`w-24 h-20 border-r border-gray-200 transition-all ${
                            available
                              ? isSelected
                                ? "bg-blue-500 hover:bg-blue-600 shadow-inner cursor-pointer"
                                : "bg-green-400 hover:bg-green-500 hover:shadow-lg hover:scale-105 cursor-pointer"
                              : "bg-gray-300 cursor-not-allowed"
                          }`}
                          onClick={() => handleSlotClick(room.id, time, available)}
                          title={
                            available
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

        {/* Legend */}
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
        </div>

        {/* Selection Info */}
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
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg">
              Confirm Reservation
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservationSystem;