"use client";

import React from "react";
import { useAllSponsors } from "@/lib/api/sponsor/hook";
import { SponsorEntity } from "@/lib/api/sponsor/entity";

type Level = "gold" | "silver" | "bronze";
const LEVELS: Level[] = ["gold", "silver", "bronze"];

const MAX_COLS: Record<Level, number> = {
	gold: 3,
	silver: 4,
	bronze: 6,
};

const LOGO_SIZES: Record<Level, string> = {
	gold: "h-24",
	silver: "h-20",
	bronze: "h-16",
};

export default function Sponsors({ hackathonId }: { hackathonId?: string }) {
	const { data: sponsors = [], isLoading } = useAllSponsors(hackathonId);
	if (isLoading) {
		return (
			<div className="py-12 text-center text-white">Loading sponsors…</div>
		);
	}

	// group & sort
	const grouped: Record<Level | "others", SponsorEntity[]> = {
		gold: [],
		silver: [],
		bronze: [],
		others: [],
	};
	sponsors.forEach((s) => {
		const lvl = (s.level || "").toLowerCase() as Level;
		if (LEVELS.includes(lvl)) grouped[lvl].push(s);
		else grouped.others.push(s);
	});
	(Object.keys(grouped) as Array<Level | "others">).forEach((lvl) => {
		grouped[lvl].sort((a, b) => a.order - b.order);
	});

	return (
		<section className="py-12 bg-[#3689CB] px-6">
			<div className="max-w-6xl mx-auto space-y-12">
				{LEVELS.map(
					(level) =>
						grouped[level].length > 0 && (
							<LogoGrid key={level} level={level} items={grouped[level]} />
						)
				)}

				{grouped.others.length > 0 && (
					<LogoGrid level="others" items={grouped.others} />
				)}
			</div>
		</section>
	);
}

function LogoGrid({
	level,
	items,
}: {
	level: Level | "others";
	items: SponsorEntity[];
}) {
	const isTier = level !== "others";
	const maxCols = isTier ? MAX_COLS[level as Level] : 6;
	const sizeClass = isTier ? LOGO_SIZES[level as Level] : "h-16";

	// break items into rows of maxCols
	const rows: SponsorEntity[][] = [];
	for (let i = 0; i < items.length; i += maxCols) {
		rows.push(items.slice(i, i + maxCols));
	}

	return (
		<div className="space-y-8">
			{rows.map((row, idx) => (
				<div
					key={idx}
					className="grid gap-8 justify-items-center"
					style={{
						gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
					}}
				>
					{row.map((s) => (
						<a
							key={s.id}
							href={s.link}
							target="_blank"
							rel="noopener noreferrer"
							className="bg-white rounded-lg p-4 shadow hover:shadow-lg transition"
						>
							<img
								src={s.darkLogo || s.lightLogo}
								alt={s.name}
								className={`${sizeClass} object-contain mx-auto`}
							/>
						</a>
					))}
				</div>
			))}
		</div>
	);
}
