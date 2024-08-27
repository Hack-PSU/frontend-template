"use client";
import Image from "next/image";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import Alert from "@/components/common/Alert";
import { Google as GoogleIcon } from "@mui/icons-material";

const AuthPage: React.FC = () => {
	const {
		signUpWithEmailAndPassword,
		loginWithEmailAndPassword,
		signInWithGoogle,
		isAuthenticated,
		userDataLoaded,
		resetPassword,
	} = useFirebase();
	const router = useRouter();

	const [authData, setAuthData] = useState<{ email: string; password: string }>(
		{
			email: "",
			password: "",
		}
	);
	const [isMounted, setIsMounted] = useState(false);

	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");

	useEffect(() => {
		if (userDataLoaded && isAuthenticated) {
			router.push("/profile");
		}
		setIsMounted(true);
	}, [isAuthenticated, userDataLoaded, router]);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setAuthData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const { email, password } = authData;

		// Attempt to sign up the user
		const signUpRes = await signUpWithEmailAndPassword(email, password);
		if (signUpRes.success) {
			// Successful sign-up, proceed to register
			await loginWithEmailAndPassword(email, password);
			router.push("/register");
		} else if (
			signUpRes.error &&
			signUpRes.error.includes("auth/email-already-in-use")
		) {
			// Email already in use, try signing in
			const signInRes = await loginWithEmailAndPassword(email, password);
			if (signInRes.success) {
				// Successful sign-in, redirect to profile
				router.push("/profile");
			} else {
				// Sign-in failed, show alert
				setAlertMessage(
					signInRes.error ? signInRes.error : "Unknown error occurred"
				);
				setShowAlert(true);
			}
		} else {
			// Other sign-up errors
			setAlertMessage(
				signUpRes.error ? signUpRes.error : "Unknown error occurred"
			);
			setShowAlert(true);
		}
	};

	const handleGoogleSignIn = async () => {
		const res = await signInWithGoogle();
		if (res.success) {
			router.push("/");
		} else {
			setAlertMessage(res.error ? res.error : "Unknown error occurred");
			setShowAlert(true);
		}
	};

	const handleForgotPassword = async () => {
		if (!authData.email) {
			setAlertMessage(
				"Please enter your email address to reset your password."
			);
			setShowAlert(true);
			return;
		}

		const res = await resetPassword(authData.email);
		if (res.success) {
			setAlertMessage("Password reset email sent! Please check your inbox / spam folder.");
		} else {
			setAlertMessage(res.error ? res.error : "Error sending reset email.");
		}
		setShowAlert(true);
	};

	if (!isMounted) return null;

	return (
		<>
			<div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-md">
					<Image
						className="mx-auto w-auto"
						src="/hackpsu-bw-logo1.png"
						alt="HackPSU logo"
						width={100}
						height={100}
					/>
					<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
						Sign in or create an account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="bg-slate-100 px-6 py-12 shadow sm:rounded-lg sm:px-12">
						<form className="space-y-6" onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={handleChange}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Password
								</label>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										required
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex justify-between">
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Continue
								</button>
								<button
									type="button"
									onClick={handleForgotPassword}
									className="text-sm text-indigo-600 hover:text-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Forgot password?
								</button>
							</div>
						</form>

						<div className="relative mt-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-slate-100 px-2 text-gray-500">or</span>
							</div>
						</div>

						<div className="mt-6">
							<button
								type="button"
								onClick={handleGoogleSignIn}
								className="flex w-full justify-center items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								<GoogleIcon className="mr-2" />
								Sign in with Google
							</button>
						</div>
					</div>

					<div className="bg-slate-100 mt-10 p-2 shadow sm:rounded-lg sm:px-12">
						<p className="text-center text-sm text-gray-500">
							Already have an account? Just enter your email and password and
							click continue.
						</p>
					</div>
				</div>
			</div>

			{showAlert && (
				<Alert message={alertMessage} onClose={() => setShowAlert(false)} />
			)}
		</>
	);
};

export default AuthPage;
