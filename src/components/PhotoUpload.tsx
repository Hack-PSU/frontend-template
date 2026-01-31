"use client";

import React, { useRef, useState } from "react";
import { useUploadPhoto } from "@/lib/api/photo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Camera, Loader2, Lock, Globe } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
	const [isPublic, setIsPublic] = useState<boolean>(true);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<{
		current: number;
		total: number;
	}>({ current: 0, total: 0 });

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
		const validVideoTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];

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
			setFiles((prev) => [...prev, ...newFiles]);
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
		setFiles((prev) => {
			const newFiles = [...prev];
			// Revoke object URL to prevent memory leak
			URL.revokeObjectURL(newFiles[index].preview);
			newFiles.splice(index, 1);
			return newFiles;
		});
	};

	const startUpload = async () => {
		if (files.length === 0) {
			toast.error("Please select at least one file");
			return;
		}

		setIsUploading(true);
		setUploadProgress({ current: 0, total: files.length });

		let successCount = 0;
		let failCount = 0;
		const fileType = isPublic ? "public" : "private";

		for (let i = 0; i < files.length; i++) {
			try {
				await upload.mutateAsync({ file: files[i].file, fileType });
				successCount++;
				setUploadProgress({ current: i + 1, total: files.length });
			} catch (err: any) {
				failCount++;
				toast.error(
					`Failed to upload ${files[i].file.name}: ${err?.message || "Unknown error"}`
				);
			}
		}

		// Clean up
		files.forEach((f) => URL.revokeObjectURL(f.preview));
		setFiles([]);
		setIsPublic(true);
		setIsUploading(false);
		setUploadProgress({ current: 0, total: 0 });
		onUploaded?.();

		// Show summary toast
		if (successCount > 0) {
			toast.success(
				`${successCount} ${successCount === 1 ? "photo" : "photos"} uploaded successfully!`,
				{
					description:
						"Your photos are being reviewed by our moderation team and will appear in your gallery once approved.",
					duration: 6000,
				}
			);
		}

		if (failCount > 0) {
			toast.error(
				`${failCount} ${failCount === 1 ? "photo" : "photos"} failed to upload.`
			);
		}
	};

	return (
		<Card className="bg-white/80 backdrop-blur-sm border-2 shadow-xl">
			<CardContent className="pt-6">
				<div className="space-y-6">
					{/* Upload Area */}
					<div
						onDragOver={(e) => e.preventDefault()}
						onDragEnter={() => setIsDragging(true)}
						onDragLeave={() => setIsDragging(false)}
						onDrop={handleDrop}
						className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
							isDragging
								? "border-primary bg-primary/10 scale-[1.02]"
								: "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20"
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
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
									{files.map((fileWithPreview, idx) => (
										<div key={idx} className="relative aspect-square group">
											{fileWithPreview.file.type.startsWith("video/") ? (
												<video
													src={fileWithPreview.preview}
													className="w-full h-full object-cover rounded-lg ring-2 ring-muted"
												/>
											) : (
												<img
													src={fileWithPreview.preview}
													alt={`preview ${idx + 1}`}
													className="w-full h-full object-cover rounded-lg ring-2 ring-muted"
												/>
											)}
											<button
												onClick={() => removeFile(idx)}
												className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100 z-10"
												aria-label="Remove file"
											>
												<X className="h-3.5 w-3.5" />
											</button>
										</div>
									))}
								</div>
								<div className="text-center pt-2">
									<p className="text-sm font-medium text-foreground mb-3">
										{files.length} {files.length === 1 ? "file" : "files"}{" "}
										selected
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
							<div className="text-center py-6">
								<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
									<Camera className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									Upload Photos or Videos
								</h3>
								<p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
									Drag and drop your files here, or click the button below to
									browse
								</p>
								<Button
									type="button"
									onClick={() => inputRef.current?.click()}
									className="mb-3"
								>
									<Upload className="h-4 w-4 mr-2" />
									Choose Files
								</Button>
								<p className="text-xs text-muted-foreground">
									Supports: JPG, PNG, GIF, WebP, MP4, MOV (max 100MB each)
								</p>
							</div>
						)}
					</div>

					{/* Privacy Toggle */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Privacy Settings</Label>
						<div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
							<svg
								className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<p>
								All photos are reviewed by our moderation team before appearing
								in galleries. <strong>Public photos</strong> will be visible to
								everyone once approved. <strong>Private photos</strong> will
								only be visible to you.
							</p>
						</div>
						<RadioGroup
							value={isPublic ? "public" : "private"}
							onValueChange={(value) => setIsPublic(value === "public")}
							disabled={isUploading}
							className="grid grid-cols-1 sm:grid-cols-2 gap-3"
						>
							<div>
								<RadioGroupItem
									value="public"
									id="public"
									className="peer sr-only"
								/>
								<Label
									htmlFor="public"
									className="flex flex-col items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
								>
									<div className="flex items-center gap-3 w-full">
										<div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
											<Globe className="h-5 w-5 text-blue-500" />
										</div>
										<div className="flex-1">
											<div className="font-semibold">Public</div>
											<div className="text-xs text-muted-foreground">
												Visible to everyone in the gallery
											</div>
										</div>
									</div>
								</Label>
							</div>
							<div>
								<RadioGroupItem
									value="private"
									id="private"
									className="peer sr-only"
								/>
								<Label
									htmlFor="private"
									className="flex flex-col items-start gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
								>
									<div className="flex items-center gap-3 w-full">
										<div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
											<Lock className="h-5 w-5 text-purple-500" />
										</div>
										<div className="flex-1">
											<div className="font-semibold">Private</div>
											<div className="text-xs text-muted-foreground">
												Only visible to you
											</div>
										</div>
									</div>
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Upload Progress */}
					{isUploading && (
						<div className="space-y-2 p-4 bg-muted/50 rounded-lg">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground font-medium">
									Uploading {uploadProgress.current} of {uploadProgress.total}
								</span>
								<span className="font-semibold text-primary">
									{Math.round(
										(uploadProgress.current / uploadProgress.total) * 100
									)}
									%
								</span>
							</div>
							<Progress
								value={(uploadProgress.current / uploadProgress.total) * 100}
								className="h-2"
							/>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-3 pt-2">
						<Button
							onClick={startUpload}
							disabled={files.length === 0 || isUploading}
							className="flex-1 h-11"
							size="lg"
						>
							{isUploading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Uploading...
								</>
							) : (
								<>
									<Upload className="h-4 w-4 mr-2" />
									Upload{" "}
									{files.length > 0
										? `${files.length} ${files.length === 1 ? "Photo" : "Photos"}`
										: ""}
								</>
							)}
						</Button>
						{files.length > 0 && !isUploading && (
							<Button
								variant="outline"
								onClick={() => {
									files.forEach((f) => URL.revokeObjectURL(f.preview));
									setFiles([]);
								}}
								className="h-11"
							>
								<X className="h-4 w-4 mr-2" />
								Clear
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
