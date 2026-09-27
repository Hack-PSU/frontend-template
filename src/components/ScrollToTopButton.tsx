"use client"

import { useEffect, useState } from "react";
export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                padding: "0rem",
                width: "3rem",
                height: "3rem",
                aspectRatio: "1 / 1",
                lineHeight: 1,
                flexShrink: 0,
                backgroundColor: "rgba(17, 18, 45, 0.5)",
                backdropFilter: "blur(8px)",
                color: "#EFE6D4",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 50,
            }}
        >
            ↑
        </button>
    );
}