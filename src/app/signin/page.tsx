"use client";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Alert from "@/components/common/Alert";
import {
	Google as GoogleIcon,
	GitHub as GithubIcon,
	Microsoft as MicrosoftIcon,
} from "@mui/icons-material";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { track } from "@vercel/analytics";

const AuthPage: React.FC = () => {
	const {
		loginWithEmailAndPassword,
		signUpWithEmailAndPassword,
		signInWithGoogle,
		signInWithGithub,
		signInWithMicrosoft,
		resetPassword,
		isAuthenticated,
	} = useFirebase();
	const router = useRouter();

	const [authData, setAuthData] = useState({ email: "", password: "" });
	const [alertMessage, setAlertMessage] = useState("");
	const [showAlert, setShowAlert] = useState(false);

	// Redirect authenticated users
	useEffect(() => {
		if (isAuthenticated) {
			router.push("/profile");
		}
	}, [isAuthenticated, router]);

	// Track signin page view
	useEffect(() => {
		track("signin_page_view");
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setAuthData((prev) => ({ ...prev, [name]: value }));
	};

	const handleLogin = async (e: FormEvent) => {
		e.preventDefault();
		try {
			try {
				track("login", {
					method: "email",
					email: authData.email,
				});
				await loginWithEmailAndPassword(authData.email, authData.password);
				router.push("/profile");
			} catch (err: any) {
				signUpWithEmailAndPassword(authData.email, authData.password);
				router.push("/register");
			}
		} catch (err: any) {
			setAlertMessage(err.message || "Login failed");
			setShowAlert(true);
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			track("login", {
				method: "google",
			});
			await signInWithGoogle();
			router.push("/profile");
		} catch (err: any) {
			setAlertMessage(err.message || "Google sign-in failed");
			setShowAlert(true);
		}
	};

	const handleGithubSignIn = async () => {
		try {
			track("login", {
				method: "github",
			});
			await signInWithGithub();
			router.push("/profile");
		} catch (err: any) {
			setAlertMessage(err.message || "GitHub sign-in failed");
			setShowAlert(true);
		}
	};

	const handleMicrosoftSignIn = async () => {
		try {
			track("login", { method: "microsoft" });
			await signInWithMicrosoft();
			router.push("/profile");
		} catch (err: any) {
			setAlertMessage(err.message || "Microsoft sign-in failed");
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
		try {
			await resetPassword(authData.email);
			setAlertMessage(
				"Password reset email sent! Please check your inbox/spam folder."
			);
			setShowAlert(true);
		} catch (err: any) {
			setAlertMessage(err.message || "Failed to send reset email");
			setShowAlert(true);
		}
	};

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
						{/* Email / Password form */}
						<form className="space-y-6" onSubmit={handleLogin}>
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
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
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
										className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
										onChange={handleChange}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
								<button
									type="submit"
									className="flex-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
								>
									Sign In
								</button>
								<button
									type="button"
									onClick={handleForgotPassword}
									className="text-sm text-indigo-600 hover:text-indigo-500"
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
								className="flex w-full items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<GoogleIcon className="mr-2" />
								Sign in with Google
							</button>
						</div>

						<div className="mt-6">
							<button
								type="button"
								onClick={handleGithubSignIn}
								className="flex w-full items-center justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
							>
								<GithubIcon className="mr-2" />
								Sign in with GitHub
							</button>
						</div>
					</div>

					<div className="bg-slate-100 mt-10 p-2 shadow sm:rounded-lg sm:px-12">
						<p className="text-center text-sm text-gray-500">
							Already have an account? Use the form above to sign in.
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
