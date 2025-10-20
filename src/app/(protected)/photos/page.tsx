"use client";

import React, { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import { usePhotos } from "@/lib/api/photo";
import { PHOTO_MILESTONES } from "@/lib/api/photo";
import { Toaster } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, Image as ImageIcon, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "@/components/ui/button";

export default function PhotosPage() {
	const { data: photos, isLoading, refetch } = usePhotos();
	const { user } = useFirebase();
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [viewingMyPhotos, setViewingMyPhotos] = useState(false);

	// Separate my photos (all of them) from community photos (only public)
	const myPhotos = photos?.filter((photo) => {
		const userId = photo.name.split("_")[0];
		return userId === user?.uid;
	}) || [];

	const communityPhotos = photos?.filter((photo) => {
		const userId = photo.name.split("_")[0];
		const fileType = photo.name.split("_")[1];
		return userId !== user?.uid && fileType === "public";
	}) || [];

	const currentPhotos = viewingMyPhotos ? myPhotos : communityPhotos;
	const selectedPhoto = selectedImageIndex !== null ? currentPhotos[selectedImageIndex] : null;

	const openLightbox = (index: number, isMyPhotos: boolean) => {
		setSelectedImageIndex(index);
		setViewingMyPhotos(isMyPhotos);
	};

	const closeLightbox = () => {
		setSelectedImageIndex(null);
	};

	const goToPrevious = () => {
		if (selectedImageIndex !== null && selectedImageIndex > 0) {
			setSelectedImageIndex(selectedImageIndex - 1);
		}
	};

	const goToNext = () => {
		if (selectedImageIndex !== null && selectedImageIndex < currentPhotos.length - 1) {
			setSelectedImageIndex(selectedImageIndex + 1);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "ArrowLeft") goToPrevious();
		if (e.key === "ArrowRight") goToNext();
		if (e.key === "Escape") closeLightbox();
	};

	return (
		<>
			<Toaster richColors />
			<div className="min-h-screen bg-transparent py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="mb-12">
						<div className="max-w-3xl">
							<h1 className="text-4xl md:text-5xl font-bold mb-4">
								Photo Gallery
							</h1>
							<p className="text-lg text-muted-foreground">
								Share your HackPSU experience with the community. Upload photos, browse what others have captured, and relive the highlights of the event.
							</p>
						</div>
					</div>

					{/* Upload Section */}
					<div className="mb-16">
						<div className="mb-6">
							<h2 className="text-2xl font-semibold mb-2">
								Share a Photo
							</h2>
							<p className="text-muted-foreground">
								Upload a photo to the public gallery and let everyone see your HackPSU moment.
							</p>
						</div>
						<PhotoUpload onUploaded={() => refetch()} />
					</div>

					{/* My Photos Section */}
					{myPhotos.length > 0 && (
						<div className="mb-16">
							<div className="mb-4">
								<h2 className="text-xl font-semibold">Your Photos</h2>
								<p className="text-sm text-muted-foreground">
									{myPhotos.length} {myPhotos.length === 1 ? "photo" : "photos"} uploaded
								</p>
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{myPhotos.map((photo, idx) => (
									<button
										key={idx}
										onClick={() => openLightbox(idx, true)}
										className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									>
										<img
											src={photo.url}
											alt={`Your photo ${idx + 1}`}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
									</button>
								))}
							</div>
						</div>
					)}

					{/* Community Gallery Section */}
					<div className="mb-8">
						<div className="mb-6">
							<h2 className="text-2xl font-semibold mb-2">
								Community Highlights
							</h2>
							<p className="text-muted-foreground">
								{isLoading
									? "Loading gallery..."
									: communityPhotos.length > 0
									? `${communityPhotos.length} ${communityPhotos.length === 1 ? "photo" : "photos"} from the HackPSU community`
									: "Waiting for the first community photo"}
							</p>
						</div>

						{isLoading ? (
							<div className="flex items-center justify-center py-20">
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
									<p className="text-muted-foreground">Loading gallery...</p>
								</div>
							</div>
						) : communityPhotos.length > 0 ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
								{communityPhotos.map((photo, idx) => (
									<button
										key={idx}
										onClick={() => openLightbox(idx, false)}
										className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
									>
										<img
											src={photo.url}
											alt={`Community photo ${idx + 1}`}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
										/>
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
									</button>
								))}
							</div>
						) : (
							<Card className="bg-muted/10 border-dashed">
								<CardContent className="py-16 text-center">
									<div className="max-w-md mx-auto">
										<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
											<Camera className="h-8 w-8 text-muted-foreground" />
										</div>
										<h3 className="text-xl font-semibold mb-2">
											{myPhotos.length > 0 ? "You're the First!" : "Gallery Opening Soon"}
										</h3>
										<p className="text-muted-foreground">
											{myPhotos.length > 0
												? "Your photo is the first in the gallery. Others will join soon!"
												: "Upload a photo above to start the gallery and inspire others to share their moments."}
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>

			{/* Lightbox Modal */}
			<Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
				<DialogContent
					className="max-w-[100vw] w-[95vw] sm:w-[90vw] h-[85vh] sm:h-[90vh] p-0 bg-black/95 border-none overflow-hidden"
					onKeyDown={handleKeyDown}
				>
					<div className="relative w-full h-full flex items-center justify-center">
						{/* Close Button */}
						<button
							onClick={closeLightbox}
							className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
							aria-label="Close"
						>
							<X className="h-5 w-5 sm:h-6 sm:w-6" />
						</button>

						{/* Previous Button */}
						{selectedImageIndex !== null && selectedImageIndex > 0 && (
							<button
								onClick={goToPrevious}
								className="absolute left-2 sm:left-4 z-50 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
								aria-label="Previous photo"
							>
								<ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
							</button>
						)}

						{/* Next Button */}
						{selectedImageIndex !== null && selectedImageIndex < currentPhotos.length - 1 && (
							<button
								onClick={goToNext}
								className="absolute right-2 sm:right-4 z-50 p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
								aria-label="Next photo"
							>
								<ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
							</button>
						)}

						{/* Image Container */}
						{selectedPhoto && (
							<div className="relative w-full h-full flex items-center justify-center px-12 sm:px-16 py-12 sm:py-16">
								<img
									src={selectedPhoto.url}
									alt={selectedPhoto.name}
									className="max-w-full max-h-full w-auto h-auto object-contain"
									style={{
										maxWidth: 'calc(100vw - 4rem)',
										maxHeight: 'calc(85vh - 6rem)',
									}}
								/>
								{/* Image Counter */}
								<div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/50 text-white text-xs sm:text-sm">
									{selectedImageIndex !== null && `${selectedImageIndex + 1} / ${currentPhotos.length}`}
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
