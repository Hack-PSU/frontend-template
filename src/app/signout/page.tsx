"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";

export default function SignOut() {
	const { logout } = useFirebase();
	const router = useRouter();

	useEffect(() => {
		const handleSignOut = async () => {
			await logout();
			router.push("/");
		};

		handleSignOut();
	}, [logout, router]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="text-center font-bold">Signing out...</div>
		</div>
	);
}
