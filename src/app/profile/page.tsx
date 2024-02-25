"use client";

import QRCode from "react-qr-code";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import "./profile.css";

export default function Example() {
	const { isAuthenticated, user } = useFirebase();
	const router = useRouter();
	const [showQRCode, setShowQRCode] = useState(false);
	const [editingField, setEditingField] = useState(null);
	const [name, setName] = useState(user?.displayName || "Current Name");
	const [email, setEmail] = useState(user?.email || "example@example.com");
	const [password, setPassword] = useState("••••••••••");

	const handleDeleteAccount = () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (confirmDelete) {
			// Handle deletion here.
		}
	};

	const toggleQRCode = () => {
		setShowQRCode(!showQRCode);
	};

	const handleUpdateClick = (field) => {
		setEditingField(field === editingField ? null : field);
	};

	const handleSaveClick = () => {
		// You can perform additional actions here like updating the database
	};

	if (isAuthenticated) {
		return (
			<>
				<div className="container">
					<div className="profile-container">
						<main className="profile-content">
							<div className="profile-info">
								<div className="profile-header">
									<h2 className="text-base font-semibold leading-7 text-white">
										PROFILE
									</h2>
									<button
										type="button"
										className="delete-button"
										onClick={handleDeleteAccount}
									>
										Delete Account
									</button>
								</div>
								<div className="text-center profile-text">
									Edit the information you share with HackPSU.
								</div>
								<dl className="profile-details">
									<div className="profile-detail">
										<dt className="font-medium leading-7 text-white sm:w-64 sm:flex-none sm:pr-6">
											Name
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											{editingField === "name" ? (
												<input
													type="text"
													value={name}
													onChange={(e) => setName(e.target.value)}
													className="text-black"
												/>
											) : (
												<div className="leading-7 text-white">{name}</div>
											)}
											<button
												type="button"
												className="update-button"
												onClick={() => handleUpdateClick("name")}
											>
												{editingField === "name" ? "Save" : "Update"}
											</button>
										</dd>
									</div>
									<div className="profile-detail">
										<dt className="font-medium leading-7 text-white sm:w-64 sm:flex-none sm:pr-6">
											Email
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											{editingField === "email" ? (
												<input
													type="email"
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													className="text-black"
												/>
											) : (
												<div className="leading-7 text-white">{email}</div>
											)}
											<button
												type="button"
												className="update-button"
												onClick={() => handleUpdateClick("email")}
											>
												{editingField === "email" ? "Save" : "Update"}
											</button>
										</dd>
									</div>
									<div className="profile-detail">
										<dt className="font-medium leading-7 text-white sm:w-64 sm:flex-none sm:pr-6">
											Password
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											{editingField === "password" ? (
												<input
													type="password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													className="text-black"
												/>
											) : (
												<div className="leading-7 text-white">{password}</div>
											)}
											<button
												type="button"
												className="update-button"
												onClick={() => handleUpdateClick("password")}
											>
												{editingField === "password" ? "Save" : "Update"}
											</button>
										</dd>
									</div>
								</dl>
							</div>
						</main>
					</div>
					<div className="qr-container">
						<div className="qr-button-container">
							<p className="mt-1 text-sm leading-7 text-white">
								Bring this QR Code to sign-in for the Hackathons and Workshops.
							</p>
							<br />
							<button
								type="button"
								className="qr-button"
								onClick={toggleQRCode}
							>
								{showQRCode ? "Hide QR Code" : "View QR Code"}
							</button>
							{showQRCode && (
								<div className="qr-code">
									<QRCode value="hackpsu.org" />
								</div>
							)}
						</div>
					</div>
				</div>
			</>
		);
	} else {
		useEffect(() => {
			window.location.replace("https://register.hackpsu.org/signup");
		}, []);
	}
}
