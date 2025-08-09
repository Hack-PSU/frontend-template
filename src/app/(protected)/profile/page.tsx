"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook";
import {
	useCreateWalletPass,
	useCreateAppleWalletPass,
} from "@/lib/api/wallet/hook";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
	User,
	Mail,
	QrCode,
	Wallet,
	FileText,
	LogOut,
	Eye,
	EyeOff,
	Loader2,
	FolderOpen,
} from "lucide-react";

export default function Profile() {
	const { isAuthenticated, user, logout, isLoading } = useFirebase();
	const router = useRouter();
	const { isLoading: isUserLoading, data: userData } = useUserInfoMe();

	// Mutations for wallet integration
	const { mutateAsync: createWalletPass, isPending: isCreatingGoogleWallet } =
		useCreateWalletPass();
	const {
		mutateAsync: createAppleWalletPass,
		isPending: isCreatingAppleWallet,
	} = useCreateAppleWalletPass();

	const [showQRCode, setShowQRCode] = useState(false);

	const toggleQRCode = () => setShowQRCode((prev) => !prev);

	useEffect(() => {
		// if user data is still loading, do not redirect
		if (isUserLoading) return;

		if (!userData || !userData.registration) router.push("/register");
	}, [userData, router]);

	// Handle add-to-Google Wallet click
	const handleAddToGoogleWallet = async () => {
		try {
			if (!user) {
				toast.error("Please sign in to add to Google Wallet");
				return;
			}

			const response = await createWalletPass(user.uid);
			if (response?.walletLink) {
				window.open(response.walletLink, "_blank");
				toast.success("Google Wallet pass created successfully!");
			} else {
				throw new Error("No wallet link received");
			}
		} catch (error) {
			console.error("Error creating wallet pass:", error);
			toast.error("Failed to create Google Wallet pass. Please try again.");
		}
	};

	// Handle add-to-Apple Wallet click
	const handleAddToAppleWallet = async () => {
		try {
			if (!user) {
				toast.error("Please sign in to add to Apple Wallet");
				return;
			}

			const response = await createAppleWalletPass(user.uid);
			const blobUrl = URL.createObjectURL(response);
			const link = document.createElement("a");
			link.href = blobUrl;
			link.download = "hackpsu_pass.pkpass";
			link.type = "application/vnd.apple.pkpass";
			link.click();

			// Clean up
			URL.revokeObjectURL(blobUrl);

			toast.success("Apple Wallet pass downloaded successfully!");
		} catch (error) {
			console.error("Error creating Apple Wallet pass:", error);
			toast.error("Failed to create Apple Wallet pass. Please try again.");
		}
	};

	const handleSignOut = async () => {
		try {
			await logout();
			router.push("/");
			toast.success("You have been successfully signed out.");
		} catch (error) {
			console.error("Error signing out:", error);
			toast.error("An error occurred while signing out. Please try again.");
		}
	};

	const handleReimbursement = () => {
		if (user) {
			router.push("/reimbursements");
		} else {
			router.push("/");
			toast.error("Please sign in to submit a reimbursement form.");
		}
	};

	const handleExpo = () => {
		router.push("/expo");
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span className="text-lg">Loading profile...</span>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		router.push("/");
		return null;
	}

	return (
		<div className="min-h-screen bg-transparent py-8 px-4">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Profile Header */}
				<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<Avatar className="h-24 w-24">
								<AvatarImage src={user.photoURL || ""} alt="Profile Picture" />
								<AvatarFallback className="bg-slate-700 text-white text-2xl">
									<User className="h-12 w-12" />
								</AvatarFallback>
							</Avatar>
						</div>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							{userData?.firstName && userData?.lastName
								? `${userData.firstName} ${userData.lastName}`
								: "Profile"}
						</CardTitle>
						<CardDescription className="text-slate-300">
							HackPSU Participant
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-center space-x-2">
							<Mail className="h-5 w-5" />
							<span className="text-sm md:text-base">{user.email}</span>
						</div>
					</CardContent>
				</Card>

				{/* QR Code Section */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<QrCode className="h-6 w-6" />
							<span>Check-in QR Code</span>
						</CardTitle>
						<CardDescription>
							Use this QR code to sign in for hackathons and workshops
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button
							onClick={toggleQRCode}
							variant="outline"
							className="w-full bg-transparent"
							size="lg"
						>
							{showQRCode ? (
								<>
									<EyeOff className="mr-2 h-4 w-4" />
									Hide QR Code
								</>
							) : (
								<>
									<Eye className="mr-2 h-4 w-4" />
									Show QR Code
								</>
							)}
						</Button>

						{showQRCode && (
							<div className="flex justify-center">
								<div className="bg-white p-4 rounded-lg shadow-lg">
									<QRCode
										value={`HACKPSU_${user.uid}`}
										size={Math.min(300, window.innerWidth - 120)}
										level="H"
									/>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Wallet Integration */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Wallet className="h-6 w-6" />
							<span>Add to Wallet</span>
						</CardTitle>
						<CardDescription>
							Save your HackPSU pass to your digital wallet for easy access
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex justify-center">
								{isCreatingGoogleWallet ? (
									<div className="flex items-center justify-center w-[200px] h-[60px] bg-gray-100 rounded">
										<Loader2 className="h-6 w-6 animate-spin" />
									</div>
								) : (
									<Image
										src="/google_wallet.svg"
										alt="Add to Google Wallet"
										width={200}
										height={60}
										className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
										onClick={handleAddToGoogleWallet}
										priority
									/>
								)}
							</div>

							<div className="flex justify-center">
								{isCreatingAppleWallet ? (
									<div className="flex items-center justify-center w-[200px] h-[60px] bg-gray-100 rounded">
										<Loader2 className="h-6 w-6 animate-spin" />
									</div>
								) : (
									<Image
										src="/apple_wallet.svg"
										alt="Add to Apple Wallet"
										width={200}
										height={60}
										className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
										onClick={handleAddToAppleWallet}
										priority
									/>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Actions */}
				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Manage your HackPSU experience</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button
							onClick={handleExpo}
							className="w-full"
							variant="default"
							size="lg"
						>
							<FolderOpen className="mr-2 h-4 w-4" />
							View Project Expo
						</Button>

						<Button
							onClick={handleReimbursement}
							className="w-full"
							variant="default"
							size="lg"
						>
							<FileText className="mr-2 h-4 w-4" />
							Submit Reimbursement Form
						</Button>

						<Separator />

						<Button
							onClick={handleSignOut}
							variant="destructive"
							className="w-full"
							size="lg"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
