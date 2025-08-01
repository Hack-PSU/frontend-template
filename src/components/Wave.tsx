"use client";

import React, { useRef, useEffect, useMemo } from "react";

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
    /** whether the wave should be flipped vertically */
    inverted?: boolean;
    /** opacity of the wave */
    opacity?: number;
};

const Wave: React.FC<WaveProps> = ({
    width,
    height,
    waveHeight = 400,
    waveDelta = 30,
    speed = 0.3,
    wavePoints = 6, // Increased for smoother waves
    fill = "#00FDFB",
    borderColor,
    borderOffset = 5,
    style,
    className,
    inverted = false,
    opacity = 1,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const borderRef = useRef<SVGPathElement>(null);
    // Memoize expensive calculations
    const waveConfig = useMemo(() => ({
        speed: speed * 0.5, // Smoother animation
        points: Math.max(3, wavePoints),
        delta: Math.max(10, waveDelta),
    }), [speed, wavePoints, waveDelta]);

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

        function calculateWavePoints(factor: number, offset: number = 0) {
            const pts: { x: number; y: number }[] = [];
            for (let i = 0; i <= waveConfig.points; i++) {
                const x = (i / waveConfig.points) * waveWidth;
                const sinSeed = (factor + (i + (i % waveConfig.points))) * waveConfig.speed * 100;
                const sinHeight = Math.sin(sinSeed / 100) * waveConfig.delta;
                let yPos = Math.sin(sinSeed / 100) * sinHeight + waveHeight + offset;
                
                // Invert if needed
                if (inverted) {
                    yPos = fullHeight - yPos;
                }
                
                pts.push({ x, y: yPos });
            }
            return pts;
        }

        function buildPath(points: { x: number; y: number }[]) {
            if (points.length < 2) return "";
            
            let d = `M ${points[0].x} ${points[0].y}`;
            
            // Use smoother cubic bezier curves
            for (let i = 0; i < points.length - 1; i++) {
                const cp1x = points[i].x + (points[i + 1].x - points[i].x) / 3;
                const cp1y = points[i].y;
                const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) / 3;
                const cp2y = points[i + 1].y;
                
                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
            }
            
            // Close the path properly based on inversion
            if (inverted) {
                d += ` L ${waveWidth} 0 L 0 0 Z`;
            } else {
                d += ` L ${waveWidth} ${fullHeight} L 0 ${fullHeight} Z`;
            }
            
            return d;
        }

        function tick() {
            const now = performance.now(); // More accurate timing
            if (lastTime !== null) {
                const dt = (now - lastTime) / 1000;
                totalTime += dt;
                const factor = totalTime * Math.PI;
                const pts = calculateWavePoints(factor);
                const d = buildPath(pts);
                
                if (pathEl && d) {
                    pathEl.setAttribute("d", d);
                }
                if (borderColor && borderEl) {
                    const borderPts = calculateWavePoints(factor, inverted ? -borderOffset : borderOffset);
                    const borderD = buildPath(borderPts);
                    if (borderD) {
                        borderEl.setAttribute("d", borderD);
                    }
                }
            }
            lastTime = now;
            frameId = window.requestAnimationFrame(tick);
        }

        // Start animation
        tick();
        
        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [width, height, waveHeight, waveConfig, borderColor, borderOffset, inverted]);

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
            <svg 
                width="100%" 
                height="100%" 
                style={{ 
                    display: "block",
                    opacity: opacity 
                }}
                preserveAspectRatio="none"
                viewBox={`0 0 ${width ?? 800} ${height ?? 200}`}
            >
                {borderColor && (
                    <path
                        ref={borderRef}
                        fill={borderColor}
                        style={{ opacity: opacity * 0.8 }}
                    />
                )}
                <path 
                    ref={pathRef} 
                    fill={fill}
                    style={{ opacity: opacity }}
                />
            </svg>
        </div>
    );
};

export default Wave;