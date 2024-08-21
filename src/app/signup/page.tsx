"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import Alert from "@/components/common/Alert";

/* Signup is used to add a user to the Firebase DB. */

const Signup: React.FC = () => {
	const { signUpWithEmailAndPassword, loginWithEmailAndPassword } =
		useFirebase();
	const router = useRouter();

	const handleSignup = async (event: FormEvent) => {
		event.preventDefault();
		if (!signupData.email || !signupData.password) {
			return;
		}

		// Sign the user up and log them in
		const res: any = await signUpWithEmailAndPassword(
			signupData.email,
			signupData.password
		);
		if (res.success) {
			await loginWithEmailAndPassword(signupData.email, signupData.password);
			router.push("/");
		} else if (res.error === "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
			router.push("/signin");
		} else {
			setAlertMessage(res.error);
			setShowAlert(true);
		}
	};

	interface SignupData {
		email: string;
		password: string;
	}

	const [signupData, setSignupData] = useState<SignupData>({
		email: "",
		password: "",
	});
	const [isMounted, setIsMounted] = useState(false);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setSignupData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Alert
	const [showAlert, setShowAlert] = useState<boolean>(false);
	const [alertMessage, setAlertMessage] = useState<string>("");

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
						Create an account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
					<div className="bg-slate-100 px-6 py-12 shadow sm:rounded-lg sm:px-12">
						<form className="space-y-6" onSubmit={handleSignup}>
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

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Create account
								</button>
							</div>
						</form>
					</div>

					<div className="bg-slate-100 mt-10 p-2 shadow sm:rounded-lg sm:px-12">
						<p className="text-center text-sm text-gray-500">
							Already have an account?{" "}
							<Link
								href="/signin"
								className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
							>
								Log in here.
							</Link>
						</p>
					</div>
				</div>
			</div>

			{/** Alert handler */}
			{showAlert && (
				<Alert message={alertMessage} onClose={() => setShowAlert(false)} />
			)}
		</>
	);
};

export default Signup;
