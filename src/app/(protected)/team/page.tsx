"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe, useUser } from "@/lib/api/user/hook";
import {
	useAllTeams,
	useCreateTeam,
	useUpdateTeam,
	useAddUserToTeamByEmail,
	TeamEntity,
} from "@/lib/api/team";
import { useProjectsByTeamId } from "@/lib/api/judging";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
	Users,
	Plus,
	Edit,
	UserPlus,
	UserMinus,
	Loader2,
	Lock,
	LogOut,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

export default function Team() {
	const { isAuthenticated, user, isLoading } = useFirebase();
	const router = useRouter();
	const { isLoading: isUserLoading, data: userData } = useUserInfoMe();
	const { data: teams, error: teamsError } = useAllTeams();

	const { mutateAsync: createTeam, isPending: isCreating } = useCreateTeam();
	const { mutateAsync: updateTeam, isPending: isUpdating } = useUpdateTeam();
	const { mutateAsync: addUserByEmail, isPending: isAddingUser } =
		useAddUserToTeamByEmail();

	const [showCreateDialog, setShowCreateDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [showAddUserDialog, setShowAddUserDialog] = useState(false);
	const [teamName, setTeamName] = useState("");
	const [userEmail, setUserEmail] = useState("");

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

	// Check if team has submitted a project (which locks the team)
	const { data: teamProjects, error: projectsError } = useProjectsByTeamId(
		userTeam?.id || ""
	);
	const hasSubmittedProject = teamProjects && teamProjects.length > 0;

	useEffect(() => {
		if (isUserLoading) return;
		if (!userData || !userData.registration) router.push("/register");
	}, [userData, router, isUserLoading]);

	// Show error toasts for API failures
	useEffect(() => {
		if (teamsError) {
			toast.error("Failed to load teams. Please refresh the page.");
		}
	}, [teamsError]);

	useEffect(() => {
		if (projectsError) {
			toast.error(
				"Failed to check project status. Some features may not work correctly."
			);
		}
	}, [projectsError]);

	const handleCreateTeam = async () => {
		if (!teamName.trim()) {
			toast.error("Please enter a team name");
			return;
		}

		try {
			await createTeam({
				name: teamName,
				member1: userData?.id,
			});
			toast.success("Team created successfully!");
			setShowCreateDialog(false);
			setTeamName("");
		} catch (error) {
			console.error("Error creating team:", error);
			toast.error("Failed to create team. Please try again.");
		}
	};

	const handleRenameTeam = async () => {
		if (!userTeam || !teamName.trim()) {
			toast.error("Please enter a team name");
			return;
		}

		try {
			await updateTeam({
				id: userTeam.id,
				data: { name: teamName },
			});
			toast.success("Team renamed successfully!");
			setShowEditDialog(false);
			setTeamName("");
		} catch (error) {
			console.error("Error renaming team:", error);
			toast.error("Failed to rename team. Please try again.");
		}
	};

	const handleAddUser = async () => {
		if (!userTeam || !userEmail.trim()) {
			toast.error("Please enter a valid email");
			return;
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(userEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		// Check team capacity
		const currentMembers = getTeamMembers(userTeam).length;
		if (currentMembers >= 5) {
			toast.error("Team is already at maximum capacity (5 members)");
			return;
		}

		try {
			await addUserByEmail({
				id: userTeam.id,
				data: { email: userEmail },
			});
			toast.success("User added to team successfully!");
			setShowAddUserDialog(false);
			setUserEmail("");
		} catch (error: any) {
			console.error("Error adding user:", error);
			toast.error("Failed to add user. Please check the email and try again.");
		}
	};

	const handleRemoveUser = async (memberField: string) => {
		if (!userTeam) return;

		try {
			await updateTeam({
				id: userTeam.id,
				data: { [memberField]: null },
			});
			toast.success("User removed from team successfully!");
		} catch (error) {
			console.error("Error removing user:", error);
			toast.error("Failed to remove user. Please try again.");
		}
	};

	const handleLeaveTeam = async () => {
		if (!userTeam || !userData?.id) return;

		const memberField = getTeamMembers(userTeam).find(
			(member) => member.isCurrentUser
		)?.field;

		if (!memberField) return;

		try {
			await updateTeam({
				id: userTeam.id,
				data: { [memberField]: null },
			});
			toast.success("You have left the team successfully!");
			router.push("/profile");
		} catch (error) {
			console.error("Error leaving team:", error);
			toast.error("Failed to leave team. Please try again.");
		}
	};

	const getTeamMembers = (team: TeamEntity) => {
		return [
			team.member1,
			team.member2,
			team.member3,
			team.member4,
			team.member5,
		]
			.map((memberId, index) => ({
				id: memberId,
				field: `member${index + 1}` as keyof TeamEntity,
				isCurrentUser: memberId === userData?.id,
			}))
			.filter(
				(member) => member.id !== null && member.id !== undefined
			) as Array<{
			id: string;
			field: keyof TeamEntity;
			isCurrentUser: boolean;
		}>;
	};

	const canModifyTeam =
		userTeam?.isActive &&
		!hasSubmittedProject &&
		[
			userTeam.member1,
			userTeam.member2,
			userTeam.member3,
			userTeam.member4,
			userTeam.member5,
		].includes(userData?.id);

	const TeamMemberDisplay = ({
		member,
	}: {
		member: { id: string; field: keyof TeamEntity; isCurrentUser: boolean };
	}) => {
		const { data: memberData, isLoading } = useUser(member.id);

		if (isLoading) {
			return (
				<div className="flex items-center justify-between p-3 border rounded-lg">
					<div className="flex items-center space-x-3">
						<div>
							<p className="font-medium">Loading...</p>
						</div>
					</div>
				</div>
			);
		}

		const displayName = memberData
			? `${memberData.firstName} ${memberData.lastName}`
			: "Unknown User";

		return (
			<div className="flex items-center justify-between p-3 border rounded-lg">
				<div className="flex items-center space-x-3">
					<div>
						<p className="font-medium">{displayName}</p>
						{member.isCurrentUser && (
							<p className="text-sm text-gray-500">You</p>
						)}
					</div>
				</div>
				{canModifyTeam && !member.isCurrentUser && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleRemoveUser(member.field)}
						className="text-red-600 hover:text-red-700"
					>
						<UserMinus className="h-4 w-4" />
					</Button>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span className="text-lg">Loading team...</span>
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
				{/* Team Header */}
				<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<Users className="h-16 w-16 text-red-400" />
						</div>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							{userTeam ? userTeam.name : "Team Management"}
						</CardTitle>
						<CardDescription className="text-slate-300">
							{userTeam
								? "Team management and member overview"
								: "Create or join a team for HackPSU"}
						</CardDescription>
						{userTeam && (!userTeam.isActive || hasSubmittedProject) && (
							<div className="flex items-center justify-center space-x-2 mt-2 text-yellow-400">
								<Lock className="h-5 w-5" />
								<span className="text-sm font-medium">
									{hasSubmittedProject
										? "Team locked - Project submitted"
										: "Team is locked"}
								</span>
							</div>
						)}
					</CardHeader>
				</Card>

				{userTeam ? (
					<>
						{/* Team Members */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center space-x-2">
									<Users className="h-6 w-6" />
									<span>Team Members</span>
									<span className="text-sm text-gray-500">
										({getTeamMembers(userTeam).length}/5)
									</span>
								</CardTitle>
								<CardDescription>
									Manage your team members and invite new ones
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{getTeamMembers(userTeam).map((member) => (
									<TeamMemberDisplay key={member.id} member={member} />
								))}
								{getTeamMembers(userTeam).length < 5 && canModifyTeam && (
									<Button
										variant="outline"
										className="w-full"
										onClick={() => setShowAddUserDialog(true)}
										disabled={isAddingUser}
									>
										{isAddingUser ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<UserPlus className="mr-2 h-4 w-4" />
										)}
										Add Team Member
									</Button>
								)}
							</CardContent>
						</Card>

						{/* Team Actions */}
						<Card>
							<CardHeader>
								<CardTitle>Team Actions</CardTitle>
								<CardDescription>Manage your team settings</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{canModifyTeam && (
									<Button
										onClick={() => {
											setTeamName(userTeam.name);
											setShowEditDialog(true);
										}}
										className="w-full"
										variant="default"
										size="lg"
										disabled={isUpdating}
									>
										{isUpdating ? (
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										) : (
											<Edit className="mr-2 h-4 w-4" />
										)}
										Rename Team
									</Button>
								)}

								{userTeam.isActive && !hasSubmittedProject && (
									<>
										<Separator />
										<Button
											onClick={handleLeaveTeam}
											variant="destructive"
											className="w-full"
											size="lg"
											disabled={isUpdating}
										>
											{isUpdating ? (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											) : (
												<LogOut className="mr-2 h-4 w-4" />
											)}
											Leave Team
										</Button>
									</>
								)}

								{(!userTeam.isActive || hasSubmittedProject) && (
									<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
										<p className="text-sm text-yellow-800">
											<strong>Team is locked:</strong>
											{hasSubmittedProject
												? " Your team has been locked because a project has been submitted. No further changes can be made."
												: " Your team has been locked and no further changes can be made."}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</>
				) : (
					// Create Team Section
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<Plus className="h-6 w-6" />
								<span>Create a Team</span>
							</CardTitle>
							<CardDescription>
								You&apos;re not part of any team yet. Create one to get started.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								onClick={() => setShowCreateDialog(true)}
								className="w-full"
								size="lg"
								disabled={isCreating}
							>
								{isCreating ? (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								) : (
									<Plus className="mr-2 h-4 w-4" />
								)}
								Create New Team
							</Button>
						</CardContent>
					</Card>
				)}

				{/* Create Team Dialog */}
				<Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create New Team</DialogTitle>
							<DialogDescription>
								Enter a name for your new team.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="team-name">Team Name</Label>
								<Input
									id="team-name"
									placeholder="Enter team name"
									value={teamName}
									onChange={(e) => setTeamName(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleCreateTeam()}
								/>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => {
										setShowCreateDialog(false);
										setTeamName("");
									}}
								>
									Cancel
								</Button>
								<Button onClick={handleCreateTeam} disabled={isCreating}>
									{isCreating && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Team
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>

				{/* Edit Team Dialog */}
				<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Rename Team</DialogTitle>
							<DialogDescription>
								Enter a new name for your team.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="edit-team-name">Team Name</Label>
								<Input
									id="edit-team-name"
									placeholder="Enter new team name"
									value={teamName}
									onChange={(e) => setTeamName(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleRenameTeam()}
								/>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => {
										setShowEditDialog(false);
										setTeamName("");
									}}
								>
									Cancel
								</Button>
								<Button onClick={handleRenameTeam} disabled={isUpdating}>
									{isUpdating && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Rename Team
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>

				{/* Add User Dialog */}
				<Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add Team Member</DialogTitle>
							<DialogDescription>
								Enter the email address of the user you want to add to your
								team.
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4">
							<div>
								<Label htmlFor="user-email">Email Address</Label>
								<Input
									id="user-email"
									type="email"
									placeholder="Enter user's email"
									value={userEmail}
									onChange={(e) => setUserEmail(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
								/>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => {
										setShowAddUserDialog(false);
										setUserEmail("");
									}}
								>
									Cancel
								</Button>
								<Button onClick={handleAddUser} disabled={isAddingUser}>
									{isAddingUser && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Add Member
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
