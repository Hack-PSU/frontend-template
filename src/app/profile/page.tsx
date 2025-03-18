"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook"; // or wherever it's located
import { useCreateWalletPass } from "@/lib/api/wallet/hook"; // your custom hook
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import googleWalletImg from "../../../public/google_wallet.svg"; // <-- import your SVG
import QRCode from "react-qr-code";
import Link from "next/link";

export default function Profile() {
	const { isAuthenticated, user, logout, isLoading } = useFirebase();
	const router = useRouter();
	const { data: userData } = useUserInfoMe();

	// Prepare the createWalletPass mutation
	const { mutateAsync: createWalletPass } = useCreateWalletPass();

	const [showQRCode, setShowQRCode] = useState(true);
	const toggleQRCode = () => setShowQRCode((prev) => !prev);

	// Handle add-to-wallet click
	const handleAddToGoogleWallet = async () => {
		try {
			if (!user) return; // Just a safeguard
			// Call the mutation, passing the user’s UID (or whichever ID your backend needs)
			const response = await createWalletPass(user.uid);

			// Assuming the response has a `link` property with the URL
			if (response?.walletLink) {
				window.open(response.walletLink, "_blank");
			} else {
				console.error("No wallet link received:", response);
			}
		} catch (error) {
			console.error("Error creating wallet pass:", error);
			alert("Failed to create Google Wallet pass.");
		}
	};

	useEffect(() => {
		// If auth is resolved and we're not authenticated, redirect
		if (!isLoading && !isAuthenticated) {
			router.push("/signin");
		} else if (user && userData) {
			// If user is logged in but missing registration info, redirect
			if (!userData.registration) {
				router.push("/register");
			}
		}
	}, [isAuthenticated, user, userData, router, isLoading]);

	const handleSignOut = async () => {
		try {
			await logout();
			router.push("/");
		} catch (error) {
			console.error("Error signing out:", error);
			alert("An error occurred while trying to sign out.");
		}
	};

	const handleReimbursement = async () => {
		if (user) {
			router.push("/reimbursements");
		} else {
			router.push("/signin");
			alert("Must be logged in to submit reimbursement form");
		}
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl bg-gradient-to-r from-[#00000080] to-[#000000f1] border-red-500 border-4 rounded-lg px-6 py-10 shadow-lg sm:px-12">
				{/* Profile header */}
				<div className="text-center">
					<div className="flex justify-center mb-4">
						{user?.photoURL ? (
							<Image
								src={user.photoURL}
								alt="Profile Picture"
								width={80}
								height={80}
								className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
							/>
						) : (
							<AccountCircleIcon style={{ fontSize: 80, color: "white" }} />
						)}
					</div>
					<h2 className="text-xl sm:text-2xl font-bold text-white">Profile</h2>
				</div>

				

				{/* Basic info */}
				<dl className="mt-6 space-y-4 divide-y divide-white text-white text-base sm:text-lg">
					<div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center">
						<div className="font-medium sm:w-64 sm:flex-none sm:pr-6">Name</div>
						<div className="mt-1 sm:mt-0 sm:flex-auto">
							{isLoading
								? "Loading..."
								: userData?.firstName + " " + userData?.lastName}
						</div>
					</div>
					<div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center">
						<div className="font-medium sm:w-64 sm:flex-none sm:pr-6">
							Email
						</div>
						<div className="mt-1 sm:mt-0 sm:flex-auto">{user?.email}</div>
					</div>
				</dl>

				{/* QR code section */}
				<div className="mt-8">
					<h2 className="text-lg sm:text-xl font-semibold text-white">
						QR Code
					</h2>
					<p className="mt-2 text-sm sm:text-lg text-white">
						Bring this QR Code to sign in for the Hackathons and Workshops.
					</p>
					<button
						type="button"
						className="mt-4 w-full text-sm sm:text-base px-4 py-2 font-light rounded-md border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-colors duration-300"
						onClick={toggleQRCode}
					>
						{showQRCode ? "Hide QR Code" : "View QR Code"}
					</button>
					{showQRCode && (
						<div className="mt-2 mb-2 flex justify-center">
							<div className="bg-white p-2 sm:p-4">
								<QRCode
									value={`HACKPSU_${user?.uid ?? ""}`}
									size={300}
									level="H"
								/>
							</div>
						</div>
					)}
				</div>

				{/* ADD TO GOOGLE WALLET BUTTON */}
				<div className="mt-8 flex flex-col items-center">
					<button
						type="button"
						onClick={handleAddToGoogleWallet}
						className="hover:opacity-80 transition-opacity duration-200"
					>
						<Image
							src={googleWalletImg}
							alt="Add to Google Wallet"
							width={200}
							height={50}
							priority
						/>
					</button>
				</div>

				<div className="mt-8">
					<button
						type="button"
						className="w-full text-sm sm:text-base px-4 py-2 font-light rounded-md border-2 border-blue-500 text-white hover:bg-blue-500 transition-colors duration-300"
						onClick={handleReimbursement}
					>
						Submit Reimbursement Form
					</button>
				</div>

				{/* Sign-out button */}
				<div className="mt-8">
					<button
						type="button"
						className="w-full text-sm sm:text-base px-4 py-2 font-light rounded-md border-2 border-red-500 text-white hover:bg-red-500 transition-colors duration-300"
						onClick={handleSignOut}
					>
						Sign Out
					</button>
				</div>
			</div>
		</div>
	);
}