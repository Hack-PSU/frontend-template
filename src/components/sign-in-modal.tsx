import Modal from "@/components/shared/modal";
import {
	useState,
	Dispatch,
	SetStateAction,
	useCallback,
	useMemo,
} from "react";
import Image from "next/image";
import Logo from "../../assets/HackPSUBWLogo1.png";

const SignInModal = ({
	showSignInModal,
	setShowSignInModal,
}: {
	showSignInModal: boolean;
	setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) => {
	const [signInClicked, setSignInClicked] = useState(false);

	return (
		<Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
			<div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-gray-200">
				<div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center md:px-16">
					<Image
						src={Logo}
						alt="Logo"
						className="h-40 w-40 rounded-full"
						width={40}
						height={40}
					/>

					<h3 className="font-display text-2xl font-bold">Sign In</h3>
				</div>

				<div className="flex flex-col items-center space-y-4 bg-gray-50 px-4 py-8 md:px-16">
					<button
						disabled={signInClicked}
						className={`${
							signInClicked
								? "cursor-not-allowed border-gray-200 bg-gray-100"
								: "border border-gray-200 bg-white text-black hover:bg-gray-50"
						} flex h-10 w-full items-center justify-center space-x-3 rounded-md border text-sm shadow-sm transition-all duration-75 focus:outline-none`}
						onClick={() => {
							setSignInClicked(true);
						}}
					>
						<p>Sign In with your Burger King Account</p>
					</button>
					<p>Alternatively, sign in with</p>
					<div className="flex flex-row gap-4">
						<p>Google</p>
						<p>GitHub</p>
						<p>Apple</p>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export function useSignInModal() {
	const [showSignInModal, setShowSignInModal] = useState(false);

	const SignInModalCallback = useCallback(() => {
		return (
			<SignInModal
				showSignInModal={showSignInModal}
				setShowSignInModal={setShowSignInModal}
			/>
		);
	}, [showSignInModal, setShowSignInModal]);

	return useMemo(
		() => ({ setShowSignInModal, SignInModal: SignInModalCallback }),
		[setShowSignInModal, SignInModalCallback]
	);
}