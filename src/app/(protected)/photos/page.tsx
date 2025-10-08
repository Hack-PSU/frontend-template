"use client";

import React from "react";
import PhotoGallery from "@/components/PhotoGallery";
import PhotoUpload from "@/components/PhotoUpload";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePhotos } from "@/lib/api/photo/hook";

export default function PhotosPage() {
  const { isAuthenticated, isLoading } = useFirebase();
  const { data, isLoading: isPhotosLoading, refetch } = usePhotos();

  if (isLoading) {
	return (
	  <div className="min-h-screen flex items-center justify-center">
		<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
	  </div>
	);
  }

  if (!isAuthenticated) {
	return (
	  <div className="min-h-screen flex items-center justify-center bg-[#FFEBB8]">
		<div className="max-w-xl text-center p-6">
		  <h2 className="text-2xl font-bold mb-2">Sign in to view photos</h2>
		  <p className="text-gray-700 mb-4">You must be signed in to access the photo gallery.</p>
		  <Button onClick={() => (window.location.href = "https://auth.hackpsu.org/login?returnTo=" + window.location.href)}>
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
			<h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "Monomaniac One, monospace" }}>
			  Photos
			</h1>
			<p className="text-gray-200">A collection of moments from past events.</p>
		  </div>

		  <div className="flex items-center space-x-4">
			<Image src="/logo.svg" alt="HackPSU" width={48} height={48} />
		  </div>
		</div>

		<div className="mb-8">
		  <PhotoUpload onUploaded={() => refetch()} />
		</div>

		{isPhotosLoading ? (
		  <div className="py-12 text-center">Loading photos...</div>
		) : (
		  <PhotoGallery images={(data || []).map((p: any) => p.url || p.photoUrl || p.name)} />
		)}
	  </div>
	</div>
  );
}
