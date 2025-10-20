"use client";

import React, { useRef, useState } from "react";
import { useUploadPhoto } from "@/lib/api/photo";
import { PHOTO_MILESTONES } from "@/lib/api/photo";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface FileWithPreview {
	file: File;
	preview: string;
}

export default function PhotoUpload({
	onUploaded,
}: {
	onUploaded?: () => void;
}) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [files, setFiles] = useState<FileWithPreview[]>([]);
	const [fileType, setFileType] = useState<string>("public");
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<{current: number, total: number}>({current: 0, total: 0});

	const upload = useUploadPhoto();

	const validateFile = (f: File): boolean => {
		// Validate file type
		const validImageTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/heic",
			"image/heif",
		];
		const validVideoTypes = [
			"video/mp4",
			"video/quicktime",
			"video/x-msvideo",
		];

		if (
			!validImageTypes.includes(f.type) &&
			!validVideoTypes.includes(f.type)
		) {
			toast.error(`${f.name}: Please upload an image or video file`);
			return false;
		}

		// Validate file size (100MB)
		const maxSize = 100 * 1024 * 1024;
		if (f.size > maxSize) {
			toast.error(`${f.name}: File size must be less than 100MB`);
			return false;
		}

		return true;
	};

	const onPick = (fileList: FileList | null) => {
		if (!fileList) return;

		const newFiles: FileWithPreview[] = [];
		for (let i = 0; i < fileList.length; i++) {
			const f = fileList[i];
			if (validateFile(f)) {
				newFiles.push({
					file: f,
					preview: URL.createObjectURL(f),
				});
			}
		}

		if (newFiles.length > 0) {
			setFiles(prev => [...prev, ...newFiles]);
		}
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		onPick(e.target.files);
		// Reset input so same files can be selected again
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		onPick(e.dataTransfer.files);
	};

	const removeFile = (index: number) => {
		setFiles(prev => {
			const newFiles = [...prev];
			// Revoke object URL to prevent memory leak
			URL.revokeObjectURL(newFiles[index].preview);
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const startUpload = async () => {
		if (files.length === 0 || !fileType) {
			toast.error("Please select at least one file and category");
			return;
		}

		setIsUploading(true);
		setUploadProgress({current: 0, total: files.length});

		let successCount = 0;
		let failCount = 0;

		for (let i = 0; i < files.length; i++) {
			try {
				await upload.mutateAsync({ file: files[i].file, fileType });
				successCount++;
				setUploadProgress({current: i + 1, total: files.length});
			} catch (err: any) {
				failCount++;
				toast.error(`Failed to upload ${files[i].file.name}: ${err?.message || "Unknown error"}`);
			}
		}

		// Clean up
		files.forEach(f => URL.revokeObjectURL(f.preview));
		setFiles([]);
		setFileType("public");
		setIsUploading(false);
		setUploadProgress({current: 0, total: 0});
		onUploaded?.();

		// Show summary toast
		if (successCount > 0) {
			toast.success(`${successCount} ${successCount === 1 ? "photo" : "photos"} uploaded successfully!`, {
				description: "All photos are reviewed by our team before appearing in the gallery. This typically takes a few minutes.",
				duration: 6000,
			});
		}

		if (failCount > 0) {
			toast.error(`${failCount} ${failCount === 1 ? "photo" : "photos"} failed to upload.`);
		}
	};

	const selectedMilestone = PHOTO_MILESTONES.find((m) => m.id === fileType);

	return (
		<Card className="bg-card">
			<CardContent className="pt-6">
				<div className="space-y-4">
					{/* Upload Area */}
					<div
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={() => setIsDragging(true)}
						onDragLeave={() => setIsDragging(false)}
						onDrop={handleDrop}
						className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
							isDragging
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-muted-foreground/50"
						}`}
					>
						<input
							ref={inputRef}
							type="file"
							accept="image/*,video/*"
							multiple
							hidden
							onChange={handleFile}
						/>

						{files.length > 0 ? (
							<div className="space-y-4">
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{files.map((fileWithPreview, idx) => (
										<div key={idx} className="relative aspect-square">
											{fileWithPreview.file.type.startsWith("video/") ? (
												<video
													src={fileWithPreview.preview}
													className="w-full h-full object-cover rounded-lg"
												/>
											) : (
												<img
													src={fileWithPreview.preview}
													alt={`preview ${idx + 1}`}
													className="w-full h-full object-cover rounded-lg"
												/>
											)}
											<button
												onClick={() => removeFile(idx)}
												className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									))}
								</div>
								<div className="text-center">
									<p className="text-sm text-muted-foreground mb-2">
										{files.length} {files.length === 1 ? "file" : "files"} selected
									</p>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => inputRef.current?.click()}
										disabled={isUploading}
									>
										<Upload className="h-4 w-4 mr-2" />
										Add More Files
									</Button>
								</div>
							</div>
						) : (
							<div className="text-center">
								<Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
								<h3 className="text-lg font-semibold mb-2">
									Upload Photos or Videos
								</h3>
								<p className="text-sm text-muted-foreground mb-4">
									Drag and drop your files here, or click to browse
								</p>
								<Button
									type="button"
									variant="outline"
									onClick={() => inputRef.current?.click()}
								>
									<Upload className="h-4 w-4 mr-2" />
									Choose Files
								</Button>
								<p className="text-xs text-muted-foreground mt-3">
									Supports: JPG, PNG, GIF, WebP, MP4, MOV (max 100MB each)
								</p>
							</div>
						)}
					</div>

					{/* Milestone Selection */}
					<div className="space-y-2">
						<label className="text-sm font-medium">
							What&apos;s this photo about?{" "}
							<span className="text-red-500">*</span>
						</label>
						<Select value={fileType} onValueChange={setFileType} disabled={isUploading}>
							<SelectTrigger>
								<SelectValue placeholder="Select a category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="public" className="font-semibold">
									Public Gallery
								</SelectItem>
								{PHOTO_MILESTONES.filter((m) => m.id !== "public").map(
									(milestone) => (
										<SelectItem key={milestone.id} value={milestone.id}>
											{milestone.label}
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
						{selectedMilestone && (
							<p className="text-xs text-muted-foreground">
								{selectedMilestone.description}
							</p>
						)}
					</div>

					{/* Upload Progress */}
					{isUploading && (
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">
									Uploading {uploadProgress.current} of {uploadProgress.total}
								</span>
								<span className="font-medium">
									{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%
								</span>
							</div>
							<Progress value={(uploadProgress.current / uploadProgress.total) * 100} />
						</div>
					)}

					{/* Upload Button */}
					<div className="flex gap-2">
						<Button
							onClick={startUpload}
							disabled={files.length === 0 || !fileType || isUploading}
							className="flex-1"
						>
							{isUploading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Uploading...
								</>
							) : (
								`Upload ${files.length > 0 ? files.length : ""} ${files.length === 1 ? "Photo" : "Photos"}`
							)}
						</Button>
						{files.length > 0 && !isUploading && (
							<Button
								variant="outline"
								onClick={() => {
									files.forEach(f => URL.revokeObjectURL(f.preview));
									setFiles([]);
								}}
							>
								Clear All
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
