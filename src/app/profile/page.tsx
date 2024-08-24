"use client";

import QRCode from "react-qr-code";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readFromDatabase } from "@/lib/database";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Example() {
	const { isAuthenticated, userDataLoaded, user, logout } = useFirebase();
	const router = useRouter();
	// Database copy of user data
	const [userData, setUserData] = useState<any | null>(null);

	// Redirect if not authenticated
	useEffect(() => {
		if (userDataLoaded && isAuthenticated) {
			readFromDatabase("users", {})
				.then((data: any) => {
					// data is a json object {}, if it is empty or does not contain the registration field, redirect to register page
					if (!!(data && Object.keys(data).length === 0)) {
						router.push("/register");
					} else if (data && data.registration === null) {
						router.push("/register");
					}
					setUserData(data);
				})
				.catch((error) => {
					router.push("/register");
				});
		} else if (userDataLoaded && !isAuthenticated) {
			router.push("/signin");
		} else {
			router.push("/");
		}
	}, [router, isAuthenticated, userDataLoaded, user]);

	const signOut = async () => {
		try {
			await logout();
			router.push("/");
		} catch (error) {
			console.error("Error signing out:", error);
			alert("An error occurred while trying to sign out.");
		}
	};

	const [showQRCode, setShowQRCode] = useState(true);

	// Function to toggle QR code visibility
	const toggleQRCode = () => {
		setShowQRCode((prevState) => !prevState);
	};

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
			<div className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl">
				<div className="bg-gradient-to-r from-[#00000080] to-[#000000f1] border-green-500 border-4 rounded-lg px-6 py-10 shadow-lg sm:px-12">
					<div className="text-center">
						<div className="flex justify-center mb-4">
							{user?.photoURL ? (
								<img
									className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
									src={user?.photoURL}
									alt="Profile"
								/>
							) : (
								<AccountCircleIcon style={{ fontSize: 80, color: "white" }} />
							)}
						</div>
						<h2 className="text-xl sm:text-2xl font-bold text-white">
							Profile
						</h2>
					</div>

					<dl className="mt-6 space-y-4 divide-y divide-white text-white text-base sm:text-lg">
						<div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center">
							<div className="font-medium sm:w-64 sm:flex-none sm:pr-6">
								Name
							</div>
							<div className="mt-1 sm:mt-0 sm:flex-auto">
								{userData?.firstName + " " + userData?.lastName}
							</div>
						</div>
						<div className="pt-4 sm:pt-6 flex flex-col sm:flex-row sm:items-center">
							<div className="font-medium sm:w-64 sm:flex-none sm:pr-6">
								Email
							</div>
							<div className="mt-1 sm:mt-0 sm:flex-auto">{user?.email}</div>
						</div>
					</dl>

					<div className="mt-8">
						<h2 className="text-lg sm:text-xl font-semibold text-white">
							QR Code
						</h2>
						<p className="mt-2 text-sm sm:text-lg text-white">
							Bring this QR Code to sign-in for the Hackathons and Workshops.
						</p>
						<button
							type="button"
							className="mt-4 w-full text-sm sm:text-base px-4 py-2 font-light rounded-md border-2 border-white text-white hover:bg-white hover:text-indigo-600 transition-colors duration-300"
							onClick={toggleQRCode}
						>
							{showQRCode ? "Hide QR Code" : "View QR Code"}
						</button>
						{showQRCode && (
							<div className="mt-2 mb-2 white flex justify-center">
								<div className="bg-white p-2 sm:p-4">
									<QRCode
										value={"HACKPSU_" + user?.uid ?? ""}
										size={300}
										level="H"
									/>
								</div>
							</div>
						)}
					</div>

					<div className="mt-8">
						<button
							type="button"
							className="w-full text-sm sm:text-base px-4 py-2 font-light rounded-md border-2 border-red-500 text-white hover:bg-red-500 transition-colors duration-300"
							onClick={signOut}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
