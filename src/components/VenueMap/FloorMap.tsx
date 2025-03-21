"use client";

import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { Floor, Room } from "./types";
import RoomTooltip from "./RoomToolTip";

interface FloorMapProps {
  floor: Floor;
  // Allow setting the stroke width for room paths (default is 3px).
  pathStrokeWidth?: number;
}

const FloorMap: React.FC<FloorMapProps> = ({ floor, pathStrokeWidth = 3 }) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 800,
  });
  const [scale, setScale] = useState<number>(1);

  // Ensure responsiveness on mobile
  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current) {
        const containerWidth = mapContainerRef.current.clientWidth;
        const originalWidth = 1000; // Original SVG width
        //const newScale = containerWidth / originalWidth;
        //setScale(newScale);
        setMapDimensions({
          width: containerWidth,
          height: containerWidth * 0.8, // Maintain aspect ratio
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const handleRoomHover = (event: MouseEvent<SVGPathElement>, room: Room) => {
    // Only show tooltip if tooltip information exists.
    if (!room.description) return;

    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setSelectedRoom(room);
    setIsTooltipVisible(true);
  };

  const handleRoomLeave = () => {
    setIsTooltipVisible(false);
  };

  return (
    <div
      className="relative border-4 border-[#a01127] rounded-lg overflow-hidden"
      ref={mapContainerRef}
      style={{ backgroundColor: "#f8f8f8", minHeight: "300px", padding: "20px" }}
    >
      <h3
        className="text-center font-black text-2xl mb-6"
        style={{ fontFamily: "Rye, cursive" }}
      >
        {floor.name.toUpperCase()}
      </h3>
      <svg
        width={mapDimensions.width}
        height={mapDimensions.height}
        viewBox="0 0 1000 1000"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          maxWidth: "100%",
        }}
      >
        {floor.rooms.map((room) => (
          <g key={room.id}>
            <path
              d={room.path}
              fill={room.color}
              stroke="#000"
              strokeWidth={pathStrokeWidth}
              onMouseMove={(e) => handleRoomHover(e, room)}
              onMouseLeave={handleRoomLeave}
              style={{ cursor: "pointer" }}
              className="transition-all duration-200 hover:opacity-80"
            />
            {room.roomNumber && (
              <text
                x={room.position[0]}
                y={room.position[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#000"
                fontWeight="bold"
                fontSize="22"
                fontFamily="monospace"
              >
                {room.roomNumber}
              </text>
            )}
          </g>
        ))}
      </svg>
      {isTooltipVisible && selectedRoom && selectedRoom.description && (
        <RoomTooltip room={selectedRoom} position={tooltipPosition} />
      )}
    </div>
  );
};

export default FloorMap;
