"use client";

import React, { useRef, useState } from "react";
import { useUploadPhoto } from "@/lib/api/photo/hook";
import { Button } from "@/components/ui/button";

export default function PhotoUpload({
	onUploaded,
}: {
	onUploaded?: () => void;
}) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const upload = useUploadPhoto();
	const [isUploading, setIsUploading] = useState(false);

	const onPick = (f?: File) => {
		if (!f) return;
		setFile(f);
		setPreview(URL.createObjectURL(f));
	};

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (f) onPick(f);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		const f = e.dataTransfer.files?.[0];
		if (f) onPick(f);
	};

	const startUpload = async () => {
		if (!file) return;
		setIsUploading(true);
		try {
			await upload.mutateAsync({ file });
			setFile(null);
			setPreview(null);
			onUploaded?.();
		} catch (e) {
			console.error(e);
			alert("Upload failed");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div>
			<div
				onDragOver={(e) => e.preventDefault()}
				onDragEnter={() => setIsDragging(true)}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`p-4 border-2 border-[#215172] rounded-md ${isDragging ? "border-[#215172]-400 bg-blue-50" : "border-dashed"}`}
			>
				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					hidden
					onChange={handleFile}
				/>
				<div className="flex items-center justify-between">
					<div>
						<p className="font-medium">Drag & drop a photo or</p>
						<button
							className="text-sm text-blue-600 underline"
							onClick={() => inputRef.current?.click()}
						>
							Select a file
						</button>
					</div>
					{preview && (
						<img
							src={preview}
							alt="preview"
							className="h-20 object-cover rounded"
						/>
					)}
				</div>
			</div>

			<div className="mt-3 flex space-x-2">
				<Button onClick={startUpload} disabled={!file || isUploading} style={{ backgroundColor: "#215172", color: "white" }}>
					{isUploading ? "Uploading..." : "Upload"}
				</Button>
				<Button
					variant="ghost"
					onClick={() => {
						setFile(null);
						setPreview(null);
					}}
					style={{ backgroundColor: "#215172", color: "white" }}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
}
