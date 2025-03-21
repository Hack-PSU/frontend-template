"use client";

import React from "react";
import { Room } from "./types";

interface RoomTooltipProps {
  room: Room;
  position: { x: number; y: number };
}

const RoomTooltip: React.FC<RoomTooltipProps> = ({ room, position }) => {
  // Only display tooltip if description exists.
  if (!room.description) {
    return null;
  }
  return (
    <div
      className="absolute z-10 bg-[#273940] text-white p-3 rounded-md shadow-lg border border-[#ed9d13] max-w-xs pointer-events-none"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y - 20}px`,
        transform: position.x > 400 ? "translateX(-100%)" : "translateX(0)",
      }}
    >
      <h3
        className="font-bold text-[#ed9d13] mb-1"
        style={{ fontFamily: "TiltNeon, sans-serif" }}
      >
        {room.name} {room.roomNumber && `#${room.roomNumber}`}
      </h3>
      <p className="text-xs" style={{ fontFamily: "TiltNeon, sans-serif" }}>
        {room.description}
      </p>
    </div>
  );
};

export default RoomTooltip;
