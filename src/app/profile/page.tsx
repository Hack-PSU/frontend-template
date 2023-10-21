"use client";

import QRCode from "react-qr-code";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

export default function Example() {
  // Temporarily redirect to old frontend.
  useEffect(() => {
    window.location.replace("https://register.hackpsu.org/profile");
  });

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

	if (isAuthenticated) {
		return (
			<>
				<div className="mx-auto max-w-3xl pt-16 lg:flex lg:gap-x-8 lg:px-8">
					<main className="px-4 py-8 sm:px-6 lg:flex-auto lg:px-0 lg:py-10">
						<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
							<div>
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-base font-semibold leading-7 text-gray-900">
											Profile
										</h2>
										<p className="mt-1 text-sm leading-6 text-gray-500">
											Edit the information you share with HackPSU.
										</p>
									</div>
									<button
										type="button"
										className="text-[15px] px-4 py-2 font-light rounded-md border-2 text-red-600 hover:border-red-500"
										onClick={handleDeleteAccount}
									>
										Delete Account
									</button>
								</div>

								<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
									<div className="pt-6 sm:flex items-center">
										<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
											Name
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											<div className="text-gray-900">{user?.displayName}</div>
											<button
												type="button"
												className="text-[15px] px-4 py-1 font-light rounded-md border-[1px] text-indigo-600 hover:border-indigo-600"
											>
												Update
											</button>
										</dd>
									</div>
									<div className="pt-6 sm:flex items-center">
										<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
											Email
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											<div className="text-gray-900">{user?.email}</div>
											<button
												type="button"
												className="text-[15px] px-4 py-1 font-light rounded-md border-[1px] text-indigo-600 hover:border-indigo-600"
											>
												Update
											</button>
										</dd>
									</div>
									<div className="pt-6 sm:flex items-center">
										<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
											Password
										</dt>
										<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto items-center">
											<div className="text-gray-900">•••••••••••</div>
											<button
												type="button"
												className="text-[15px] px-4 py-1 font-light rounded-md border-[1px] text-indigo-600 hover:border-indigo-600"
											>
												Update
											</button>
										</dd>
									</div>
								</dl>
							</div>
							<div>
								<h2 className="text-base font-semibold leading-7 text-gray-900">
									QR Code
								</h2>
								<p className="mt-1 text-sm leading-6 text-gray-500">
									Bring this QR Code to sign-in for the Hackathons and
									Workshops.
								</p>
								<br></br>
								<button
									type="button"
									className="w-[257px] text-[15px] px-4 py-2 font-light rounded-md border-2 text-indigo-600 hover:border-indigo-600"
									onClick={toggleQRCode}
								>
									{showQRCode ? "Hide QR Code" : "View QR Code"}
								</button>
								{showQRCode && (
									<div className="mt-2">
										{" "}
										{/* Add margin-top to create a small gap */}
										<QRCode value="hackpsu.org" className="" />
									</div>
								)}
							</div>
						</div>
					</main>
				</div>
			</>
		);
	} else {
		return <></>;
	}
}
