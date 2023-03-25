"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/config";

const Profile = () => {
	const [user, loading, error] = useAuthState(auth);

	return (
		<div className="flex flex-col items-center">
			<h1 className="font-bold text-4xl">Welcome, John</h1>
			<button
				onClick={() => {
					console.log(user);
				}}
			>
				TEST
			</button>
		</div>
	);
};

export default Profile;
