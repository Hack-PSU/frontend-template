import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";

const SignInButton = () => {
	const [modalVisible, setModalVisibility] = useState(false);

	const openModal = () => {
		setModalVisibility(true);
		console.log("Modal is open");
	};

	const closeModal = () => {
		setModalVisibility(false);
	};

	return (
		<Dialog.Root open={modalVisible} onOpenChange={closeModal}>
			<Dialog.Trigger
				className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
				onClick={openModal}
			>
				Sign In
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
				<Dialog.Content className="bg-white rounded-lg shadow-lg p-6">
					<Dialog.Title>Sign In</Dialog.Title>
					<Dialog.Description>
						Make changes to your profile here. Click save when you're done.
					</Dialog.Description>
					<Dialog.Close className="absolute top-0 right-0 p-2">
						<span className="sr-only">Close</span>
					</Dialog.Close>
					<h2 className="text-lg font-semibold mb-4">Sign In</h2>
					<form className="space-y-4">
						<div>
							<label htmlFor="email">Email:</label>
							<input
								type="email"
								id="email"
								name="email"
								className="border border-gray-400 p-2 w-full rounded"
							/>
						</div>
						<div>
							<label htmlFor="password">Password:</label>
							<input
								type="password"
								id="password"
								name="password"
								className="border border-gray-400 p-2 w-full rounded"
							/>
						</div>
						<button
							type="submit"
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
						>
							Sign In
						</button>
					</form>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default SignInButton;
