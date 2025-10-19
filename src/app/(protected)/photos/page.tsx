"use client";

import React, { useMemo } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import PhotoUpload from "@/components/PhotoUpload";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePhotos } from "@/lib/api/photo/hook";
import { useUserInfoMe } from "@/lib/api/user/hook";
import { useAllTeams } from "@/lib/api/team";

export default function PhotosPage() {
	const { isAuthenticated, isLoading } = useFirebase();
	const { data: userData, isLoading: isUserLoading } = useUserInfoMe();
	const { data: teams } = useAllTeams();

	// Find user's team
	const userTeam = teams?.find((team) =>
		[
			team.member1,
			team.member2,
			team.member3,
			team.member4,
			team.member5,
		].includes(userData?.id)
	);

	const { data, isLoading: isPhotosLoading, refetch } = usePhotos();

	// Filter photos to only show photos from the user's team
	const teamPhotos = useMemo(() => {
		if (!data || !Array.isArray(data) || !userTeam) return [];

		// Get list of all team member IDs
		const teamMemberIds = [
			userTeam.member1,
			userTeam.member2,
			userTeam.member3,
			userTeam.member4,
			userTeam.member5,
		].filter(Boolean);

		// Filter photos that were uploaded by team members
		// Photo names are in format: {userId}_{fileType}_{uuid}.{extension}
		return data.filter((photo: any) => {
			const photoName = photo.name || "";
			const parts = photoName.split("_");

			// Extract userId (first part) and fileType (second part)
			const userId = parts[0];
			const fileType = parts[1];

			// Check if this photo is a "team" photo AND uploaded by a team member
			return fileType === "team" && teamMemberIds.includes(userId);
		});
	}, [data, userTeam]);

	if (isLoading || isUserLoading) {
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

	if (!userTeam) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#FFEBB8]">
				<div className="max-w-xl text-center p-6">
					<h2 className="text-2xl font-bold mb-2">Join a Team First</h2>
					<p className="text-gray-700 mb-4">
						You need to be part of a team to view and upload team photos.
					</p>
					<Button onClick={() => (window.location.href = "/team")}>
						Go to Teams
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#ffebb8] text-[#215172] py-12">
			<div className="max-w-6xl mx-auto px-4">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1
							className="text-3xl md:text-4xl font-bold"
							style={{ fontFamily: "Monomaniac One, monospace" }}
						>
							Team Photos
						</h1>
						<p className="text-[#215172]-200">
							Photos from your team: {userTeam.name}
						</p>
					</div>
				</div>

				<div className="mb-8">
					<PhotoUpload onUploaded={() => refetch()} />
				</div>

				{isPhotosLoading ? (
					<div className="py-12 text-center">Loading photos...</div>
				) : (
					<PhotoGallery
						images={teamPhotos.map((p: any) => p.url || p.photoUrl || p.name)}
						variant="photos"
					/>
				)}
			</div>
		</div>
	);
}
