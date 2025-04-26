"use client";

import React, { useRef, useEffect } from "react";

type WaveProps = {
	/** overall container width in pixels; defaults to 100% of parent */
	width?: number;
	/** overall container height in pixels; defaults to 100% of parent */
	height?: number;
	/** vertical position of the wave baseline */
	waveHeight?: number;
	/** amplitude of the wave */
	waveDelta?: number;
	/** speed multiplier */
	speed?: number;
	/** number of control points */
	wavePoints?: number;
	/** SVG fill color */
	fill?: string;
	/** SVG border fill color; if set, a second wave is drawn behind */
	borderColor?: string;
	/** vertical offset (in px) for the border wave */
	borderOffset?: number;
	/** additional CSS on the outer wrapper */
	style?: React.CSSProperties;
	/** additional className on the <div> */
	className?: string;
};

const Wave: React.FC<WaveProps> = ({
	width,
	height,
	waveHeight = 400,
	waveDelta = 30,
	speed = 0.3,
	wavePoints = 3,
	fill = "#00FDFB",
	borderColor,
	borderOffset = 5,
	style,
	className,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const pathRef = useRef<SVGPathElement>(null);
	const borderRef = useRef<SVGPathElement>(null);

	useEffect(() => {
		let frameId: number;
		let lastTime: number | null = null;
		let totalTime = 0;

		const container = containerRef.current;
		const pathEl = pathRef.current;
		const borderEl = borderRef.current;
		if (!container || !pathEl) return;

		const waveWidth = width ?? container.offsetWidth;
		const fullHeight = height ?? container.offsetHeight;

		function calculateWavePoints(factor: number) {
			const pts: { x: number; y: number }[] = [];
			for (let i = 0; i <= wavePoints; i++) {
				const x = (i / wavePoints) * waveWidth;
				const sinSeed = (factor + (i + (i % wavePoints))) * speed * 100;
				const sinHeight = Math.sin(sinSeed / 100) * waveDelta;
				const yPos = Math.sin(sinSeed / 100) * sinHeight + waveHeight;
				pts.push({ x, y: yPos });
			}
			return pts;
		}

		function buildPath(points: { x: number; y: number }[]) {
			let d = `M ${points[0].x} ${points[0].y}`;
			const cp0 = {
				x: (points[1].x - points[0].x) / 2,
				y: points[0].y + (points[1].y - points[0].y) * 2,
			};
			d += ` C ${cp0.x} ${cp0.y} ${cp0.x} ${cp0.y} ${points[1].x} ${points[1].y}`;
			let prevCp = cp0;
			for (let i = 1; i < points.length - 1; i++) {
				const cp1 = {
					x: points[i].x * 2 - prevCp.x,
					y: points[i].y * 2 - prevCp.y,
				};
				d += ` C ${cp1.x} ${cp1.y} ${cp1.x} ${cp1.y} ${points[i + 1].x} ${points[i + 1].y}`;
				prevCp = cp1;
			}
			d += ` L ${waveWidth} ${fullHeight} L 0 ${fullHeight} Z`;
			return d;
		}

		function tick() {
			const now = Date.now();
			if (lastTime !== null) {
				const dt = (now - lastTime) / 1000;
				totalTime += dt;
				const factor = totalTime * Math.PI;
				const pts = calculateWavePoints(factor);
				const d = buildPath(pts);
				if (pathEl) {
					pathEl.setAttribute("d", d);
				}
				if (borderColor && borderEl) {
					borderEl.setAttribute("d", d);
				}
			}
			lastTime = now;
			frameId = window.requestAnimationFrame(tick);
		}

		tick();
		return () => void window.cancelAnimationFrame(frameId);
	}, [width, height, waveHeight, waveDelta, speed, wavePoints, borderColor]);

	return (
		<div
			ref={containerRef}
			className={className}
			style={{
				position: "relative",
				overflow: "hidden",
				width: width ?? "100%",
				height: height ?? "100%",
				...style,
			}}
		>
			<svg width="100%" height="100%">
				{borderColor && (
					<path
						ref={borderRef}
						fill={borderColor}
						transform={`translate(0, ${borderOffset})`}
					/>
				)}
				<path ref={pathRef} fill={fill} />
			</svg>
		</div>
	);
};

export default Wave;
