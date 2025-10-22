"use client";

import React, { useState } from "react";
import PhotoUpload from "@/components/PhotoUpload";
import { usePhotos } from "@/lib/api/photo";
import { Toaster } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera, X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PhotosPage() {
	const { data: photos, isLoading, refetch } = usePhotos();
	const { user } = useFirebase();
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	const [viewingTab, setViewingTab] = useState<"my-photos" | "community">("my-photos");

	// Separate my photos into public and private
	const myPublicPhotos = photos?.filter((photo) => {
		const userId = photo.name.split("_")[0];
		const fileType = photo.name.split("_")[1];
		return userId === user?.uid && fileType === "public";
	}) || [];

	const myPrivatePhotos = photos?.filter((photo) => {
		const userId = photo.name.split("_")[0];
		const fileType = photo.name.split("_")[1];
		return userId === user?.uid && fileType === "private";
	}) || [];

	const myPhotos = [...myPublicPhotos, ...myPrivatePhotos];

	const communityPhotos = photos?.filter((photo) => {
		const userId = photo.name.split("_")[0];
		const fileType = photo.name.split("_")[1];
		return userId !== user?.uid && fileType === "public";
	}) || [];

	const getPhotoArray = () => {
		return viewingTab === "my-photos" ? myPhotos : communityPhotos;
	};

	const currentPhotos = getPhotoArray();
	const selectedPhoto = selectedImageIndex !== null ? currentPhotos[selectedImageIndex] : null;

	const openLightbox = (index: number) => {
		setSelectedImageIndex(index);
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

	const isPhotoPrivate = (photo: { name: string; url: string; createdAt: string }) => {
		const fileType = photo.name.split("_")[1];
		return fileType === "private";
	};

	return (
		<>
			<Toaster richColors />
			<div className="min-h-screen py-8 md:py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="mb-10">
						<h1
							className="text-4xl md:text-5xl font-bold mb-3"
							style={{ fontFamily: "TiltNeon, sans-serif" }}
						>
							Photo Gallery
						</h1>
						<p className="text-lg text-muted-foreground max-w-3xl">
							Capture and share your HackPSU moments. Upload photos as public to share with the community, or keep them private just for you.
						</p>
					</div>

					{/* Upload Section */}
					<div className="mb-12">
						<PhotoUpload onUploaded={() => refetch()} />
					</div>

					{/* Gallery Tabs */}
					<Tabs value={viewingTab} onValueChange={(v: string) => setViewingTab(v as "my-photos" | "community")} className="w-full">
						<TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
							<TabsTrigger value="my-photos" className="text-base">
								My Photos
								{myPhotos.length > 0 && (
									<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-semibold">
										{myPhotos.length}
									</span>
								)}
							</TabsTrigger>
							<TabsTrigger value="community" className="text-base">
								Community
								{communityPhotos.length > 0 && (
									<span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary font-semibold">
										{communityPhotos.length}
									</span>
								)}
							</TabsTrigger>
						</TabsList>

						{/* My Photos Tab */}
						<TabsContent value="my-photos" className="mt-0">
							{isLoading ? (
								<div className="flex items-center justify-center py-20">
									<div className="text-center">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
										<p className="text-muted-foreground">Loading your photos...</p>
									</div>
								</div>
							) : myPhotos.length > 0 ? (
								<div>
									<div className="mb-4 flex items-center justify-between">
										<p className="text-sm text-muted-foreground">
											{myPublicPhotos.length} public • {myPrivatePhotos.length} private
										</p>
									</div>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{myPhotos.map((photo, idx) => (
											<button
												key={idx}
												onClick={() => openLightbox(idx)}
												className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:ring-2 hover:ring-primary/50 transition-all"
											>
												<img
													src={photo.url}
													alt={`Your photo ${idx + 1}`}
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
												{isPhotoPrivate(photo) && (
													<div className="absolute top-2 right-2 p-1.5 bg-purple-500/90 rounded-full">
														<Lock className="h-3 w-3 text-white" />
													</div>
												)}
											</button>
										))}
									</div>
								</div>
							) : (
								<Card className="bg-white/60 backdrop-blur-sm border-dashed border-2">
									<CardContent className="py-16 text-center">
										<div className="max-w-md mx-auto">
											<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
												<Camera className="h-8 w-8 text-blue-600" />
											</div>
											<h3 className="text-xl font-semibold mb-2">
												No Photos Yet
											</h3>
											<p className="text-muted-foreground">
												Upload your first photo above to start your gallery. You can choose to make it public or keep it private.
											</p>
										</div>
									</CardContent>
								</Card>
							)}
						</TabsContent>

						{/* Community Tab */}
						<TabsContent value="community" className="mt-0">
							{isLoading ? (
								<div className="flex items-center justify-center py-20">
									<div className="text-center">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
										<p className="text-muted-foreground">Loading community photos...</p>
									</div>
								</div>
							) : communityPhotos.length > 0 ? (
								<div>
									<div className="mb-4">
										<p className="text-sm text-muted-foreground">
											{communityPhotos.length} {communityPhotos.length === 1 ? "photo" : "photos"} from the HackPSU community
										</p>
									</div>
									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
										{communityPhotos.map((photo, idx) => (
											<button
												key={idx}
												onClick={() => openLightbox(idx)}
												className="group relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:ring-2 hover:ring-primary/50 transition-all"
											>
												<img
													src={photo.url}
													alt={`Community photo ${idx + 1}`}
													className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
											</button>
										))}
									</div>
								</div>
							) : (
								<Card className="bg-white/60 backdrop-blur-sm border-dashed border-2">
									<CardContent className="py-16 text-center">
										<div className="max-w-md mx-auto">
											<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
												<Camera className="h-8 w-8 text-muted-foreground" />
											</div>
											<h3 className="text-xl font-semibold mb-2">
												No Community Photos Yet
											</h3>
											<p className="text-muted-foreground">
												Be the first to share a public photo with the HackPSU community! Upload a photo above and select "Public" to get started.
											</p>
										</div>
									</CardContent>
								</Card>
							)}
						</TabsContent>
					</Tabs>
				</div>
			</div>

			{/* Lightbox Modal */}
			<Dialog open={selectedImageIndex !== null} onOpenChange={closeLightbox}>
				<DialogContent
					className="max-w-[100vw] w-full h-[100vh] p-0 bg-black/95 border-none"
					onKeyDown={handleKeyDown}
				>
					<div className="relative w-full h-full flex items-center justify-center overflow-hidden">
						{/* Close Button */}
						<button
							onClick={closeLightbox}
							className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
							aria-label="Close"
						>
							<X className="h-6 w-6" />
						</button>

						{/* Previous Button */}
						{selectedImageIndex !== null && selectedImageIndex > 0 && (
							<button
								onClick={goToPrevious}
								className="absolute left-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
								aria-label="Previous photo"
							>
								<ChevronLeft className="h-8 w-8" />
							</button>
						)}

						{/* Next Button */}
						{selectedImageIndex !== null && selectedImageIndex < currentPhotos.length - 1 && (
							<button
								onClick={goToNext}
								className="absolute right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors backdrop-blur-sm"
								aria-label="Next photo"
							>
								<ChevronRight className="h-8 w-8" />
							</button>
						)}

						{/* Image Container */}
						{selectedPhoto && (
							<div className="w-full h-full flex items-center justify-center p-4 sm:p-16">
								<img
									src={selectedPhoto.url}
									alt={selectedPhoto.name}
									className="max-w-full max-h-full object-contain"
								/>
								{/* Image Counter & Privacy Badge */}
								<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
									<div className="px-4 py-2 rounded-full bg-black/70 text-white text-sm backdrop-blur-sm">
										{selectedImageIndex !== null && `${selectedImageIndex + 1} / ${currentPhotos.length}`}
									</div>
									{isPhotoPrivate(selectedPhoto) && (
										<div className="px-3 py-2 rounded-full bg-purple-500/90 text-white text-sm backdrop-blur-sm flex items-center gap-1.5">
											<Lock className="h-3.5 w-3.5" />
											<span>Private</span>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
