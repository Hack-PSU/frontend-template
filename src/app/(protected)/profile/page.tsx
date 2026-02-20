"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe, useUser } from "@/lib/api/user/hook";
import {
	useCreateWalletPass,
	useCreateAppleWalletPass,
} from "@/lib/api/wallet/hook";
import { useAllTeams } from "@/lib/api/team";
import { useFlagState } from "@/lib/api/flag/hook";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
	Users,
	Lock,
	GraduationCap,
	HelpCircle,
	Shield,
	Upload,
} from "lucide-react";
import { useUpdateUser } from "@/lib/api/user/hook";
import { Roofing, Room } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { usePatchApplicationStatus } from "@/lib/api/registration/hook";
import type { RegistrationEntity } from "@/lib/api/registration/entity";

// Role definitions matching AuthGuard
enum Role {
	NONE = 0,
	VOLUNTEER = 1,
	TEAM = 2,
	EXEC = 3,
	TECH = 4,
	FINANCE = 5,
}

// Mapping from application status to its respective color
const applicationStatusColorMap = new Map<string, string>([
	["pending", "text-purple-400"],
	["accepted", "text-blue-400"],
	["rejected", "text-red-600"],
	["waitlisted", "text-orange-300"],
	["confirmed", "text-green-600"],
	["declined", "text-stone-500"],
]);

// Utility to get user role from token
function getUserRole(token: string | undefined): number {
	if (!token) return Role.NONE;

	try {
		const decoded: any = jwtDecode(token);
		const productionRole = decoded.claims?.production;
		const stagingRole = decoded.claims?.staging;
		return productionRole ?? stagingRole ?? Role.NONE;
	} catch (error) {
		console.error("Error decoding token:", error);
		return Role.NONE;
	}
}

// Get role name for display
function getRoleName(role: number): string {
	const roleNames: { [key: number]: string } = {
		[Role.NONE]: "Participant",
		[Role.VOLUNTEER]: "Volunteer",
		[Role.TEAM]: "Team Member",
		[Role.EXEC]: "Executive",
		[Role.TECH]: "Tech Team",
		[Role.FINANCE]: "Finance",
	};
	return roleNames[role] || "Unknown";
}

export default function Profile() {
	const { isAuthenticated, user, logout, isLoading, token } = useFirebase();
	const router = useRouter();
	const { isLoading: isUserLoading, data: userData } = useUserInfoMe();
	const { data: teams } = useAllTeams();
	const [now, setNow] = useState(() => Date.now());

	// Mutations for wallet integration
	const { mutateAsync: createWalletPass, isPending: isCreatingGoogleWallet } =
		useCreateWalletPass();
	const {
		mutateAsync: createAppleWalletPass,
		isPending: isCreatingAppleWallet,
	} = useCreateAppleWalletPass();

	// Mutation for resume upload
	const { mutateAsync: uploadResume, isPending: isUploadingResume } =
		useUpdateUser();

	const {
		mutateAsync: patchApplicationStatus,
		isPending: isPatchingApplicationStatus,
	} = usePatchApplicationStatus();

	const [showQRCode, setShowQRCode] = useState(false);
	const [showResumeModal, setShowResumeModal] = useState(false);
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [rsvpConfirmOpen, setRsvpConfirmOpen] = useState(false);
	const [rsvpPendingStatus, setRsvpPendingStatus] = useState<
		"confirmed" | "declined" | null
	>(null);

	// Feature flag checks
	const { data: helpDeskFlag } = useFlagState("HelpDesk");
	const { data: roomReservationFlag } = useFlagState("RoomReservation");

	// Check if user is an organizer (role > 0)
	const userRole = getUserRole(token);
	const isOrganizer = userRole > Role.NONE;

	// Check if user has a confirmed application
	const applicationStatus = (userData?.registration as any)?.applicationStatus;
	const isConfirmed = applicationStatus === "confirmed";
	console.log("User Data: " + JSON.stringify(userData));
	console.log(
		"Registration: " + JSON.stringify(userData?.registration?.applicationStatus)
	);
	const toggleQRCode = () => setShowQRCode((prev) => !prev);

	useEffect(() => {
		// if user data is still loading, do not redirect
		if (isUserLoading) return;

		// Only redirect to registration if user is a participant (not an organizer) and not registered
		if (!isOrganizer && (!userData || !userData.registration)) {
			router.push("/register");
		}
	}, [userData, router, isUserLoading, isOrganizer]);

	useEffect(() => {
		const timer = window.setInterval(() => {
			setNow(Date.now());
		}, 60_000);
		return () => window.clearInterval(timer);
	}, []);

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

	const handleTeam = () => {
		router.push("/team");
	};

	const handleReserve = () => {
		router.push("/reservation");
	};

	const handleProject = () => {
		router.push("/project");
	};

	const handleExtraCredit = () => {
		router.push("/extra-credit");
	};

	// Find user's team
	const userTeam = teams?.find((team) =>
		[
			team.member1,
			team.member2,
			team.member3,
			team.member4,
			team.member5,
		].includes(userData?.id)
	);

	const getTeamMembers = () => {
		if (!userTeam) return [];
		return [
			userTeam.member1,
			userTeam.member2,
			userTeam.member3,
			userTeam.member4,
			userTeam.member5,
		].filter(Boolean);
	};

	const TeamMemberDisplay = ({ memberId }: { memberId: string }) => {
		const { data: memberData, isLoading } = useUser(memberId);

		if (isLoading) {
			return <span className="text-sm text-gray-600">Loading...</span>;
		}

		if (!memberData) {
			return <span className="text-sm text-gray-600">Unknown User</span>;
		}

		const displayName = `${memberData.firstName} ${memberData.lastName}`;
		const isCurrentUser = memberId === userData?.id;

		return (
			<div className="text-sm text-gray-600">
				{isCurrentUser ? `${displayName} (You)` : displayName}
			</div>
		);
	};

	const handleResumeUpload = async () => {
		if (!resumeFile) {
			return toast.error("Please select a PDF file to upload");
		}

		// Validate file type
		if (resumeFile.type !== "application/pdf") {
			return toast.error("Only PDF files are accepted");
		}

		// Validate file size (5MB max)
		if (resumeFile.size > 5 * 1024 * 1024) {
			return toast.error("File size must be less than 5MB");
		}

		if (!userData?.id) {
			return toast.error("User ID not found");
		}

		try {
			await uploadResume({
				id: userData.id,
				data: { resume: resumeFile } as any,
			});
			toast.success("Resume uploaded successfully!");
			setResumeFile(null);
			setShowResumeModal(false);
		} catch (error) {
			console.error("Error uploading resume:", error);
			toast.error("Failed to upload resume. Please try again.");
		}
	};

	const registration = userData?.registration as RegistrationEntity | undefined;
	const rsvpDeadline = registration?.rsvpDeadline;
	const isOnTime = typeof rsvpDeadline === "number" && rsvpDeadline >= now;
	const showRsvp = registration?.applicationStatus === "accepted" && isOnTime;
	const formattedRsvpDeadline =
		typeof rsvpDeadline === "number"
			? new Date(rsvpDeadline).toLocaleString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "2-digit",
					minute: "2-digit",
					timeZoneName: "short",
				})
			: null;

	const openRsvpConfirm = (status: "confirmed" | "declined") => {
		setRsvpPendingStatus(status);
		setRsvpConfirmOpen(true);
	};

	const handleRsvpConfirm = async () => {
		if (!userData?.id || !rsvpPendingStatus) return;
		try {
			await patchApplicationStatus({
				userId: userData.id,
				status: rsvpPendingStatus,
			});
			toast.success(
				rsvpPendingStatus === "confirmed"
					? "You're attending HackPSU! We can't wait to see you."
					: "Your response has been recorded."
			);
			setRsvpConfirmOpen(false);
			setRsvpPendingStatus(null);
		} catch (error) {
			console.error("RSVP error:", error);
			const message =
				error instanceof Error ? error.message : "Something went wrong.";
			toast.error(
				message.includes("400")
					? "Invalid request. Please try again."
					: message.includes("404")
						? "Registration not found."
						: "Failed to submit RSVP. Please try again."
			);
			setRsvpConfirmOpen(false);
			setRsvpPendingStatus(null);
		}
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
		<div
			className="min-h-screen py-8 px-4"
			style={{ backgroundColor: "#4d1170" }}
		>
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Profile Header */}
				<Card
					className="border-4 border-[#ff88e9ff] bg-gradient-to-r from-slate-900 to-slate-800 text-white"
					style={{
						boxShadow:
							"0 -6px 10px #ff88e9cc, 0 6px 10px #ff88e9cc, inset 0 -10px 10px rgba(255, 136, 233, 0.1), inset 0 10px 10px rgba(255, 136, 233, 0.1)",
					}}
				>
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
								: user.email || "Profile"}
						</CardTitle>
						<CardDescription className="text-slate-300 flex items-center justify-center gap-2">
							{isOrganizer && <Shield className="h-4 w-4" />}
							{isOrganizer
								? `HackPSU ${getRoleName(userRole)}`
								: isConfirmed
									? "HackPSU Participant"
									: "HackPSU Applicant"}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-center space-x-2">
							<Mail className="h-5 w-5" />
							<span className="text-sm md:text-base">{user.email}</span>
						</div>
						{isOrganizer && (
							<div className="bg-slate-700/50 rounded-lg p-3 mt-4">
								<p className="text-sm text-slate-200 text-center">
									You are viewing this profile as an organizer. Participant
									actions are disabled.
								</p>
							</div>
						)}
						{!isOrganizer && userData?.registration && (
							<div className="bg-slate-700/50 rounded-lg p-3 mt-4">
								<p className={`text-2xl text-slate-200 text-center`}>
									Application Status:{" "}
									<span
										className={`font-bold ${applicationStatusColorMap.get(userData.registration.applicationStatus)}`}
									>
										{userData.registration.applicationStatus.toUpperCase()}
									</span>
								</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* RSVP Section - only when accepted and not organizer */}
				{showRsvp && !isOrganizer && (
					<Card>
						<CardHeader>
							<CardTitle>Will you be attending HackPSU?</CardTitle>
							<CardDescription>
								Please confirm your attendance so we can plan accordingly.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{formattedRsvpDeadline !== null && (
								<div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3">
									<p className="text-sm font-semibold text-amber-900">
										You must RSVP by - {formattedRsvpDeadline}
									</p>
								</div>
							)}
							<div className="flex flex-col gap-3 w-full">
								<Button
									variant="success"
									onClick={() => openRsvpConfirm("confirmed")}
									disabled={isPatchingApplicationStatus}
									className="w-full"
								>
									<Check className="h-4 w-4" />
									{isPatchingApplicationStatus ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										"Yes"
									)}
								</Button>
								<Button
									variant="destructive"
									onClick={() => openRsvpConfirm("declined")}
									disabled={isPatchingApplicationStatus}
									className="w-full"
								>
									<X className="h-4 w-4" />
									No
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				{/* QR Code Section */}
				{isOrganizer || isConfirmed ? (
					<>
						{isConfirmed && (
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
						)}

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
												className={`transition-opacity duration-200 ${
													isOrganizer
														? "opacity-30 cursor-not-allowed"
														: "cursor-pointer hover:opacity-80"
												}`}
												onClick={
													isOrganizer ? undefined : handleAddToGoogleWallet
												}
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
												className={`transition-opacity duration-200 ${
													isOrganizer
														? "opacity-30 cursor-not-allowed"
														: "cursor-pointer hover:opacity-80"
												}`}
												onClick={
													isOrganizer ? undefined : handleAddToAppleWallet
												}
												priority
											/>
										)}
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Team Section */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Users className="h-6 w-6" />
									<span>Your Team</span>
								</CardTitle>
								<CardDescription>
									{userTeam
										? "Team information and management"
										: "Create or join a team for HackPSU"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{userTeam ? (
									<>
										<div className="flex items-center justify-between">
											<div>
												<h3 className="font-semibold text-lg">
													{userTeam.name}
												</h3>
											</div>
											{!userTeam.isActive && (
												<div className="flex items-center space-x-2 text-yellow-600">
													<Lock className="h-4 w-4" />
													<span className="text-sm font-medium">Locked</span>
												</div>
											)}
										</div>
										<div className="space-y-2">
											<p className="text-sm font-medium">
												Members ({getTeamMembers().length}/5):
											</p>
											<div className="space-y-1">
												{getTeamMembers().map((memberId) => (
													<TeamMemberDisplay
														key={memberId}
														memberId={memberId!}
													/>
												))}
											</div>
										</div>
										<Button
											onClick={handleTeam}
											className="w-full"
											variant="default"
											size="lg"
											disabled={isOrganizer}
										>
											<Users className="mr-2 h-4 w-4" />
											Manage Team
										</Button>
										{roomReservationFlag?.isEnabled && (
											<Button
												onClick={handleReserve}
												className="w-full"
												variant="default"
												size="lg"
												disabled={isOrganizer}
											>
												<Room className="mr-2 h-4 w-4" />
												Reserve Room
											</Button>
										)}
									</>
								) : (
									<>
										<p className="text-gray-600">
											{isOrganizer
												? "Team management is for participants only."
												: "You're not part of any team yet."}
										</p>
										<Button
											onClick={handleTeam}
											className="w-full"
											variant="default"
											size="lg"
											disabled={isOrganizer}
										>
											<Users className="mr-2 h-4 w-4" />
											Create or Join Team
										</Button>
									</>
								)}
							</CardContent>
						</Card>

						{/* Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Quick Actions</CardTitle>
								<CardDescription>
									{isOrganizer
										? "View-only organizer access"
										: "Manage your HackPSU experience"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button
									onClick={handleProject}
									className="w-full"
									variant="default"
									size="lg"
									disabled={isOrganizer}
								>
									<FileText className="mr-2 h-4 w-4" />
									Submit Project
								</Button>

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
									disabled={isOrganizer}
								>
									<FileText className="mr-2 h-4 w-4" />
									Submit Reimbursement Form
								</Button>

								<Button
									onClick={handleExtraCredit}
									className="w-full"
									variant="default"
									size="lg"
									disabled={isOrganizer}
								>
									<GraduationCap className="mr-2 h-4 w-4" />
									Manage Extra Credit
								</Button>

								<Button
									onClick={() => setShowResumeModal(true)}
									className="w-full"
									variant="default"
									size="lg"
									disabled={isOrganizer}
								>
									<Upload className="mr-2 h-4 w-4" />
									Upload Resume
								</Button>

								{helpDeskFlag?.isEnabled && (
									<Button
										onClick={() =>
											window.open("https://qstack.hackpsu.org", "_blank")
										}
										className="w-full"
										variant="default"
										size="lg"
									>
										<HelpCircle className="mr-2 h-4 w-4" />
										Get Help / Submit a Ticket
									</Button>
								)}

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
					</>
				) : (
					<Card>
						<CardHeader>
							<CardTitle>Actions Unavailable</CardTitle>
							<CardDescription>
								Access to our features is currently unavailable. Once confirmed,
								you’ll gain full access to QR check-in, wallet passes, team
								features, and project tools.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
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
				)}

				{/* Resume Upload Modal */}
				<Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Upload Resume</DialogTitle>
							<DialogDescription>
								Upload your resume in PDF format (max 5MB)
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="resume-file">Select PDF File</Label>
								<input
									id="resume-file"
									type="file"
									accept=".pdf"
									onChange={(e) => {
										const file = e.target.files?.[0] || null;
										if (file && file.type !== "application/pdf") {
											toast.error("Only PDF files are accepted");
											e.target.value = "";
											setResumeFile(null);
											return;
										}
										setResumeFile(file);
									}}
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								/>
							</div>

							{resumeFile && (
								<div className="rounded-md bg-green-50 p-3 border border-green-200">
									<p className="text-sm text-green-700 font-medium">
										Selected: {resumeFile.name}
									</p>
									<p className="text-xs text-green-600 mt-1">
										Size: {(resumeFile.size / 1024).toFixed(1)} KB
									</p>
								</div>
							)}

							<div className="flex justify-end space-x-2 pt-2">
								<Button
									variant="outline"
									onClick={() => {
										setShowResumeModal(false);
										setResumeFile(null);
									}}
									disabled={isUploadingResume}
								>
									Cancel
								</Button>
								<Button
									onClick={handleResumeUpload}
									disabled={!resumeFile || isUploadingResume}
								>
									{isUploadingResume ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Uploading...
										</>
									) : (
										<>
											<Upload className="mr-2 h-4 w-4" />
											Upload
										</>
									)}
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>

				{/* RSVP confirmation modal */}
				<Dialog
					open={rsvpConfirmOpen}
					onOpenChange={(open) => {
						setRsvpConfirmOpen(open);
						if (!open) setRsvpPendingStatus(null);
					}}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>Are you sure?</DialogTitle>
							<DialogDescription>
								{rsvpPendingStatus === "confirmed" ? (
									<>
										<div>
											You are confirming that you will attend HackPSU. This
											cannot be undone.
										</div>
										<div className="mt-2">
											<strong>IMPORTANT:</strong> If you confirm and do not
											attend, you may be banned from the next hackathon.
										</div>
									</>
								) : (
									"You are declining your spot. This cannot be undone."
								)}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter className="gap-2 sm:gap-0">
							<Button
								variant="outline"
								onClick={() => {
									setRsvpConfirmOpen(false);
									setRsvpPendingStatus(null);
								}}
								disabled={isPatchingApplicationStatus}
							>
								Cancel
							</Button>
							<Button
								variant={
									rsvpPendingStatus === "declined" ? "destructive" : "success"
								}
								onClick={handleRsvpConfirm}
								disabled={isPatchingApplicationStatus}
							>
								{isPatchingApplicationStatus ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									"Confirm"
								)}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
