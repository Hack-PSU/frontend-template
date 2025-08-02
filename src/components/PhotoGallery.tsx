"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

interface CarouselProps {
	/** Array of image URLs (e.g. ['/images/carousel/1.jpg', '/images/carousel/2.jpg', ...]) */
	images: string[];
}

const PhotoGallery: React.FC<CarouselProps> = ({ images }) => (
	<div className="w-full overflow-hidden bg-[#215172] py-8 md:py-16">
		{/* Header */}
		<div className="text-center mb-8">
			<h1
				className="text-4xl md:text-5xl font-bold text-[#FFEBB8] mb-3"
				style={{ fontFamily: "Monomaniac One, monospace" }}
			>
				Gallery
			</h1>
			<div className="w-16 h-1 bg-[#FFEBB8] rounded-full mx-auto"></div>
		</div>
		<Swiper
			modules={[Pagination, Autoplay]}
			slidesPerView={1}
			spaceBetween={20}
			centeredSlides
			loop
			slideToClickedSlide
			pagination={{ clickable: true }}
			autoplay={{
				delay: 3000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}}
			breakpoints={{
				640: {
					slidesPerView: 2,
					spaceBetween: 15,
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1280: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			}}
			className="px-4 md:px-8"
		>
			{images.map((src, idx) => (
				<SwiperSlide key={idx} className="pb-12">
					<div className="relative aspect-[4/3] w-full max-w-md mx-auto">
						<Image
							src={src}
							alt={`Event photo ${idx + 1}`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover rounded-xl shadow-lg"
							loading="lazy"
						/>
					</div>
				</SwiperSlide>
			))}
		</Swiper>

		{/*
      Responsive scaling: more subtle on mobile, more dramatic on desktop
    */}
		<style jsx global>{`
			.swiper-slide {
				transform: scale(0.9);
				transition: transform 0.4s ease-out;
				opacity: 0.7;
			}
			.swiper-slide-active {
				transform: scale(1) !important;
				opacity: 1 !important;
			}
			/* More dramatic scaling on larger screens */
			@media (min-width: 1024px) {
				.swiper-slide {
					transform: scale(0.8);
				}
			}
			/* Pagination styling */
			.swiper-pagination {
				bottom: 10px !important;
			}
			.swiper-pagination-bullet {
				background: rgba(255, 255, 255, 0.7) !important;
				width: 12px !important;
				height: 12px !important;
			}
			.swiper-pagination-bullet-active {
				background: #ffffff !important;
				width: 14px !important;
				height: 14px !important;
			}
		`}</style>
	</div>
);

export default PhotoGallery;
