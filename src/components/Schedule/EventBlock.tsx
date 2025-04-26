"use client";

import React, { useState } from "react";
import { EventType, EventEntityResponse } from "@/lib/api/event/entity";

interface EventBlockProps {
	ev: EventEntityResponse;
	style: React.CSSProperties;
	filter: EventType | null;
}

export default function EventBlock({ ev, style, filter }: EventBlockProps) {
	const start = new Date(ev.startTime);
	const end = new Date(ev.endTime);

	const [show, setShow] = useState(false);
	const [pos, setPos] = useState({ x: 0, y: 0 });

	return (
		<div
			className="relative"
			onMouseEnter={() => setShow(true)}
			onMouseLeave={() => setShow(false)}
			onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
		>
			<div
				className="absolute rounded-lg p-2 text-white text-sm overflow-hidden transition-opacity"
				style={{
					...style,
					opacity: filter && ev.type !== filter ? 0.3 : 1,
				}}
			>
				<div className="font-bold truncate">{ev.name}</div>
				<div className="text-xs">
					{start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}{" "}
					– {end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
				</div>
				{ev.location?.name && <div className="text-xs">{ev.location.name}</div>}
			</div>

			{show && (
				<div
					className="fixed w-64 bg-white text-black p-3 rounded shadow-lg z-50"
					style={{ top: pos.y + 12, left: pos.x + 12 }}
				>
					<div className="font-bold mb-1">{ev.name}</div>
					{ev.description && <p className="text-xs mb-2">{ev.description}</p>}
					<p className="text-xs mb-1">
						<span className="font-semibold">Time:</span>{" "}
						{start.toLocaleTimeString([], {
							hour: "numeric",
							minute: "2-digit",
						})}{" "}
						–{" "}
						{end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
					</p>
					{ev.location?.name && (
						<p className="text-xs mb-1">
							<span className="font-semibold">Location:</span>{" "}
							{ev.location.name}
						</p>
					)}
					{ev.type === EventType.workshop && ev.wsPresenterNames && (
						<p className="text-xs mb-1">
							<span className="font-semibold">Presenter(s):</span>{" "}
							{ev.wsPresenterNames}
						</p>
					)}
					{ev.wsRelevantSkills && (
						<p className="text-xs mb-1">
							<span className="font-semibold">Skills:</span>{" "}
							{ev.wsRelevantSkills}
							{ev.wsSkillLevel && <> ({ev.wsSkillLevel})</>}
						</p>
					)}
					{ev.wsUrls?.length > 0 && (
						<div className="text-xs">
							<span className="font-semibold">Links:</span>{" "}
							{ev.wsUrls.map((url, i) => (
								<a
									key={i}
									href={url}
									target="_blank"
									rel="noopener"
									className="underline ml-1"
								>
									{new URL(url).hostname}
								</a>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
