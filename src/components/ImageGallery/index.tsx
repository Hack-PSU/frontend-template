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

const Carousel: React.FC<CarouselProps> = ({ images }) => (
	<div className="w-full overflow-hidden bg-[#3689CB]">
		<Swiper
			modules={[Pagination, Autoplay]}
			slidesPerView={3}
			spaceBetween={6}
			centeredSlides
			loop
			slideToClickedSlide
			pagination={{ clickable: true }}
			autoplay={{
				delay: 2000,
				disableOnInteraction: false,
				pauseOnMouseEnter: true,
			}}
			className="my-16"
		>
			{images.map((src, idx) => (
				<SwiperSlide key={idx}>
					<Image
						src={src}
						alt={`Slide ${idx + 1}`}
						width={500}
						height={300}
						className="w-full h-auto object-cover rounded-lg shadow-lg"
						loading="lazy"
					/>
				</SwiperSlide>
			))}
		</Swiper>

		{/*
      Scale slides so only active is full size; side & off-screen remain scaled
    */}
		<style jsx global>{`
			.swiper-slide {
				transform: scale(0.8);
				transition: transform 0.3s ease-out;
			}
			.swiper-slide-active {
				transform: scale(1) !important;
			}
		`}</style>
	</div>
);

export default Carousel;
