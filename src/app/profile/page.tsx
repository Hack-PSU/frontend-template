"use client";

import QRCode from "react-qr-code";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Example() {
	const { isAuthenticated, user } = useFirebase();
	const router = useRouter();

	// TODO: FIX GLITCH WITH REDIRECTING ON REFRESH OF PROFILE PAGE
	useEffect(() => {
		if (!isAuthenticated) {
			router.push("/signin");
		}
	}, [isAuthenticated]);
	return (
		<>
			<div className="mx-auto max-w-7xl pt-16 lg:flex lg:gap-x-16 lg:px-8">
				<main className="px-4 py-16 sm:px-6 lg:flex-auto lg:px-0 lg:py-20">
					<div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
						<div>
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Profile
							</h2>
							<p className="mt-1 text-sm leading-6 text-gray-500">
								Edit the information you share with HackPSU.
							</p>

							<dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
								<div className="pt-6 sm:flex">
									<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
										Name
									</dt>
									<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
										<div className="text-gray-900">{user?.displayName}</div>
										<button
											type="button"
											className="font-semibold text-indigo-600 hover:text-indigo-500"
										>
											Update
										</button>
									</dd>
								</div>
								<div className="pt-6 sm:flex">
									<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
										Email
									</dt>
									<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
										<div className="text-gray-900">{user?.email}</div>
										<button
											type="button"
											className="font-semibold text-indigo-600 hover:text-indigo-500"
										>
											Update
										</button>
									</dd>
								</div>
								<div className="pt-6 sm:flex">
									<dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
										Password
									</dt>
									<dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
										<div className="text-gray-900">•••••••••••</div>
										<button
											type="button"
											className="font-semibold text-indigo-600 hover:text-indigo-500"
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
								Use this code to sign in to the event.
							</p>
							<QRCode value="hackpsu.org" className="" />
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
