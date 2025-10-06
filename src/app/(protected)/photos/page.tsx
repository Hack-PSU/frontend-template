"use client";

import React from "react";
import PhotoGallery from "@/components/PhotoGallery";
import { Button } from "@/components/ui/button";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PhotosPage() {
	const { isAuthenticated, isLoading } = useFirebase();
	const router = useRouter();

	// Placeholder images - reuse event images bundled in public/
	const images = [
		"/event/event_1.jpg",
		"/event/event_2.jpg",
		"/event/event_3.jpg",
		"/event/event_4.jpg",
		"/event/event_5.jpg",
		"/event/event_6.jpg",
		"/event/event_7.jpg",
		"/event/event_8.jpg",
		"/event/event_9.jpg",
		"/event/event_10.jpg",
		"/event/event_11.jpg",
		"/event/event_12.jpg",
	];

	const handleUpload = () => {
		// For now navigate to profile as a simple action; later replace with upload UI/modal
		router.push("/profile");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
			</div>
		);
	}

	if (!isAuthenticated) {
		// The (protected) layout wraps this page with AuthGuard and should redirect,
		// but add a soft-fallback here
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#FFEBB8]">
				<div className="max-w-xl text-center p-6">
					<h2 className="text-2xl font-bold mb-2">Sign in to view photos</h2>
					<p className="text-gray-700 mb-4">
						You must be signed in to access the photo gallery.
					</p>
					<Button
						onClick={() =>
							(window.location.href =
								"https://auth.hackpsu.org/login?returnTo=" +
								window.location.href)
						}
					>
						Sign in
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#215172] text-white py-12">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1
							className="text-3xl md:text-4xl font-bold"
							style={{ fontFamily: "Monomaniac One, monospace" }}
						>
							Photos
						</h1>
						<p className="text-gray-200">
							A collection of moments from past events.
						</p>
					</div>

					<div className="flex items-center space-x-4">
						<Button
							onClick={handleUpload}
							className="bg-[#FFEBB8] text-[#215172] border-0"
						>
							Upload Photo
						</Button>
						<Image src="/logo.svg" alt="HackPSU" width={48} height={48} />
					</div>
				</div>

				<PhotoGallery images={images} />
			</div>
		</div>
	);
}
