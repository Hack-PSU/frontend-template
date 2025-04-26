"use client";

import React, { useState, useMemo } from "react";
import { useAllEvents } from "@/lib/api/event/hook";
import { EventType, EventEntityResponse } from "@/lib/api/event/entity";
import clsx from "clsx";
import EventBlock from "./EventBlock";

const HOUR_HEIGHT = 60;
const LABEL_WIDTH = 48;
const DAYS: ("Saturday" | "Sunday")[] = ["Saturday", "Sunday"];

const HEX_COLORS: Record<EventType, string> = {
	[EventType.workshop]: "#00CFFB",
	[EventType.activity]: "#A075FF",
	[EventType.food]: "#8BC34A",
	[EventType.checkIn]: "#FFB300",
};

function toWeekday(ts: number) {
	return new Date(ts).toLocaleDateString("en-US", { weekday: "long" });
}

function splitAcrossMidnight(ev: EventEntityResponse): EventEntityResponse[] {
	const parts: EventEntityResponse[] = [];
	const start = new Date(ev.startTime);
	const dayStart = new Date(start);
	dayStart.setHours(0, 0, 0, 0);
	const midnight = dayStart.getTime() + 24 * 3600_000;

	if (ev.endTime <= midnight) parts.push(ev);
	else {
		parts.push({ ...ev, id: ev.id + "-1", endTime: midnight });
		parts.push({ ...ev, id: ev.id + "-2", startTime: midnight });
	}
	return parts;
}

function computeLayout(evs: EventEntityResponse[]) {
	if (!evs.length) return [];
	const firstDay = new Date(evs[0].startTime);
	firstDay.setHours(0, 0, 0, 0);
	const dayStartTs = firstDay.getTime();

	const counts = new Array(1440).fill(0);
	evs.forEach((ev) => {
		const startMin = Math.max(
			0,
			Math.floor((ev.startTime - dayStartTs) / 60000)
		);
		const endMin = Math.min(1440, Math.ceil((ev.endTime - dayStartTs) / 60000));
		for (let m = startMin; m < endMin; m++) counts[m]++;
	});
	const totalCols = Math.max(...counts);

	const sorted = [...evs].sort((a, b) => a.startTime - b.startTime);
	const columnsEnd = new Array(totalCols).fill(0);
	return sorted.map((ev) => {
		const idx = columnsEnd.findIndex((end) => end <= ev.startTime);
		const column = idx !== -1 ? idx : 0;
		columnsEnd[column] = ev.endTime;
		return { ev, column, totalCols };
	});
}

function HexButton({
	type,
	selected,
	onClick,
}: {
	type: EventType;
	selected: boolean;
	onClick: () => void;
}) {
	const color = HEX_COLORS[type];
	return (
		<button
			onClick={onClick}
			className={clsx(
				"relative w-24 h-24 flex items-center justify-center transition-transform",
				selected
					? "opacity-100 scale-110 animate-pulse"
					: "opacity-80 hover:opacity-100"
			)}
		>
			<svg viewBox="0 0 120 100" className="absolute inset-0 w-full h-full">
				<path
					d="M38,2 L82,2 A12,12 0 0,1 94,10 L112,44 A12,12 0 0,1 112,56 L94,90 A12,12 0 0,1 82,98 L38,98 A12,12 0 0,1 26,90 L8,56 A12,12 0 0,1 8,44 L26,10 A12,12 0 0,1 38,2"
					fill={color}
					fillOpacity={0.2}
					stroke={color}
					strokeWidth={7}
				/>
			</svg>
			<span className="relative z-10 font-bold text-white">{type}</span>
		</button>
	);
}

export default function ScheduleClient({
	hackathonId,
	ignoreList = ["45"],
}: {
	hackathonId?: string;
	ignoreList?: string[];
}) {
	const { data: raw = [], isLoading } = useAllEvents(hackathonId);
	const [filter, setFilter] = useState<EventType | null>(null);

	const eventsByDay = useMemo(() => {
		const buckets: Record<"Saturday" | "Sunday", EventEntityResponse[]> = {
			Saturday: [],
			Sunday: [],
		};

		raw
			.filter((ev) => !ignoreList.includes(ev.id))
			.sort((a, b) => a.type.localeCompare(b.type))
			.flatMap(splitAcrossMidnight)
			.forEach((ev) => {
				const day = toWeekday(ev.startTime);
				if (day === "Saturday" || day === "Sunday") buckets[day].push(ev);
			});

		return buckets;
	}, [raw, ignoreList]);

	if (isLoading) return <div>Loading…</div>;

	return (
		<div className="py-4 px-8 space-y-6 bg-[#86CFFC]">
			<div className="flex justify-end gap-4">
				{Object.values(EventType).map((type) => (
					<HexButton
						key={type}
						type={type}
						selected={filter === type}
						onClick={() => setFilter((f) => (f === type ? null : type))}
					/>
				))}
			</div>

			<div className="flex">
				<div style={{ width: LABEL_WIDTH }} />
				{DAYS.map((day) => (
					<div key={day} className="flex-1 text-center py-2 font-semibold">
						{day}
					</div>
				))}
			</div>

			<div className="flex gap-4 px-4">
				<div className="flex flex-col" style={{ width: LABEL_WIDTH }}>
					{Array.from({ length: 13 }).map((_, i) => {
						const hour = i * 2;
						const label =
							hour === 0
								? "12 AM"
								: hour < 12
									? `${hour} AM`
									: hour === 12
										? "12 PM"
										: `${hour - 12} PM`;
						return (
							<div
								key={hour}
								className="flex items-start"
								style={{ height: HOUR_HEIGHT * 2 }}
							>
								<span className="text-xs text-gray-600">{label}</span>
							</div>
						);
					})}
				</div>

				{DAYS.map((day) => {
					const layout = computeLayout(eventsByDay[day]);
					return (
						<div key={day} className="relative flex-1 border-l border-gray-300">
							<div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none">
								{Array.from({ length: 25 }).map((_, h) => (
									<div
										key={h}
										className="absolute left-0 right-0 border-t border-gray-100"
										style={{ top: `${(h / 24) * 100}%` }}
									/>
								))}
							</div>

							{layout.map(({ ev, column, totalCols }) => {
								const start = new Date(ev.startTime);
								const end = new Date(ev.endTime);
								const dayStart = new Date(start);
								dayStart.setHours(0, 0, 0, 0);

								const topPx =
									((start.getTime() - dayStart.getTime()) / 3600_000) *
									HOUR_HEIGHT;
								const heightPx =
									((end.getTime() - start.getTime()) / 3600_000) * HOUR_HEIGHT;
								const widthPct = 100 / totalCols;
								const leftPct = column * widthPct;

								const style: React.CSSProperties = {
									top: `${topPx}px`,
									height: `${Math.max(heightPx, HOUR_HEIGHT)}px`,
									width: `calc(${widthPct}% - 8px)`,
									left: `calc(${leftPct}% + 4px)`,
									backgroundColor: HEX_COLORS[ev.type],
									opacity: filter && ev.type !== filter ? 0.3 : 1,
								};

								return (
									<EventBlock
										key={ev.id}
										ev={ev}
										style={style}
										filter={filter}
									/>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
}
