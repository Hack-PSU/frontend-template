import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import {
	useAuthState,
	useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { auth } from "@/lib/config";
import { useRouter } from "next/navigation";

const SignInButton = () => {
	const [modalVisible, setModalVisibility] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [signInWithEmailAndPassword, user, loading, error] =
		useSignInWithEmailAndPassword(auth);
	const router = useRouter();

	const openModal = () => {
		setModalVisibility(true);
	};

	const toggleVisibility = () => {
		setModalVisibility(!modalVisible);
	};

	useEffect(() => {
		if (user) {
			router.push("/profile");
		}
	}, [user]);

	return (
		<Dialog.Root open={modalVisible} onOpenChange={toggleVisibility}>
			<Dialog.Trigger
				className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
				onClick={openModal}
			>
				Sign In
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
				<Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8">
					<Dialog.Title className="text-2xl font-bold mb-4">
						Sign In
					</Dialog.Title>
					<Dialog.Description className="mb-8">
						Sign in to your existing HackPSU account here, or{" "}
						<Link href={"/signup"} className="text-blue-600">
							create one
						</Link>
						.
					</Dialog.Description>
					<fieldset className="mb-4">
						<label
							className="block text-gray-700 font-bold mb-2"
							htmlFor="name"
						>
							Username
						</label>
						<input
							className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="name"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</fieldset>
					<fieldset className="mb-8">
						<label
							className="block text-gray-700 font-bold mb-2"
							htmlFor="username"
						>
							Password
						</label>
						<input
							className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="username"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</fieldset>
					<div className="flex justify-center">
						<button
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
							onClick={() => {
								signInWithEmailAndPassword(email, password);
							}}
						>
							Sign In
						</button>
					</div>
					<Dialog.Close asChild>
						<button className="absolute top-0 right-0 m-3">
							<Cross2Icon className="h-6 w-6 text-gray-700" />
						</button>
					</Dialog.Close>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default SignInButton;
