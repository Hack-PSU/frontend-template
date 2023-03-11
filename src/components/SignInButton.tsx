import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";

const SignInButton = () => {
	const [modalVisible, setModalVisibility] = useState(false);

	const openModal = () => {
		setModalVisibility(true);
		console.log("Modal is open");
	};

	const toggleVisibility = () => {
		setModalVisibility(!modalVisible);
	};

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
						Sign in to your existing HackPSU account here, or create one.
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
							defaultValue="John Durrell"
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
							defaultValue="jdisverycool45"
						/>
					</fieldset>
					<div className="flex justify-end">
						<Dialog.Close asChild>
							<button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
								Save changes
							</button>
						</Dialog.Close>
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
