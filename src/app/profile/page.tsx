"use client";

import QRCode from "react-qr-code";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import "./profile.css";

export default function Example() {
	// Temporarily redirect to old frontend.
	const { isAuthenticated, user } = useFirebase();
	const router = useRouter();

	// TODO: FIX GLITCH WITH REDIRECTING ON REFRESH OF PROFILE PAGE
	// useEffect(() => {
	// 	if (!isAuthenticated) {
	// 		router.push("/signin");
	// 	}
	// }, [isAuthenticated]);

	const handleDeleteAccount = () => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (confirmDelete) {
			// Handle deletion here.
		}
	};

	const [showQRCode, setShowQRCode] = useState(false); // State to control the QR code visibility

	// Function to toggle QR code visibility
	const toggleQRCode = () => {
		setShowQRCode(!showQRCode);
	};

	if (!isAuthenticated) {
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
											<div className="leading-7 text-white">
												{user?.displayName}
											</div>
											<button type="button" className="update-button">
												Update
											</button>
										</dd>
									</div>
									<div className="profile-detail">
										<dt className="font-medium leading-7 text-white sm:w-64 sm:flex-none sm:pr-6">
											Email
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											<div className="leading-7 text-white">{user?.email}</div>
											<button type="button" className="update-button">
												Update
											</button>
										</dd>
									</div>
									<div className="profile-detail">
										<dt className="font-medium leading-7 text-white sm:w-64 sm:flex-none sm:pr-6">
											Password
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											<div className="leading-7 text-white">•</div>
											<button type="button" className="update-button">
												Update
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
		return <></>;
	}
}
