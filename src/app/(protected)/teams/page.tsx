"use client";

import { useState, useEffect } from "react";
import {
	useMyTeam,
	useTeamRoster,
	useCreateTeam,
	useAddMember,
	useChangeLead,
	useRemoveMember,
	useRenameTeam,
	TeamRole,
} from "@/lib/api/teams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { useFirebase } from "@/lib/providers/FirebaseProvider";

export default function TeamsPage() {
	const { user } = useFirebase();
	const {
		data: myTeam,
		isLoading: teamLoading,
		error: teamError,
	} = useMyTeam();
	const { data: teamRoster, isLoading: rosterLoading } = useTeamRoster(
		myTeam?.teamId || ""
	);

	const createTeamMutation = useCreateTeam();
	const addMemberMutation = useAddMember();
	const changeLeadMutation = useChangeLead();
	const removeMemberMutation = useRemoveMember();
	const renameTeamMutation = useRenameTeam();

	const [createTeamName, setCreateTeamName] = useState("");
	const [addMemberEmail, setAddMemberEmail] = useState("");
	const [newTeamName, setNewTeamName] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showAddMemberModal, setShowAddMemberModal] = useState(false);
	const [showRenameModal, setShowRenameModal] = useState(false);

	const isTeamLead = myTeam?.role === TeamRole.LEAD;

	useEffect(() => {
		if (myTeam) {
			setNewTeamName(myTeam.teamName);
		}
	}, [myTeam]);

	const handleCreateTeam = async () => {
		if (!createTeamName.trim()) return;

		try {
			await createTeamMutation.mutateAsync({ teamName: createTeamName.trim() });
			setCreateTeamName("");
			setShowCreateModal(false);
		} catch (error) {
			console.error("Failed to create team:", error);
		}
	};

	const handleAddMember = async () => {
		if (!addMemberEmail.trim() || !myTeam) return;

		try {
			await addMemberMutation.mutateAsync({
				teamId: myTeam.teamId,
				userEmail: addMemberEmail.trim(),
			});
			setAddMemberEmail("");
			setShowAddMemberModal(false);
		} catch (error) {
			console.error("Failed to add member:", error);
		}
	};

	const handleRenameTeam = async () => {
		if (
			!newTeamName.trim() ||
			!myTeam ||
			newTeamName.trim() === myTeam.teamName
		)
			return;

		try {
			await renameTeamMutation.mutateAsync({
				teamId: myTeam.teamId,
				newTeamName: newTeamName.trim(),
			});
			setShowRenameModal(false);
		} catch (error) {
			console.error("Failed to rename team:", error);
		}
	};

	const handleChangeLead = async (newLeadUserId: string) => {
		if (!myTeam) return;

		try {
			await changeLeadMutation.mutateAsync({
				teamId: myTeam.teamId,
				newLeadUserId,
			});
		} catch (error) {
			console.error("Failed to change lead:", error);
		}
	};

	const handleLeaveTeam = async () => {
		if (!user?.uid) return;

		const confirmed = window.confirm(
			"Are you sure you want to leave this team?"
		);
		if (!confirmed) return;

		try {
			await removeMemberMutation.mutateAsync(user.uid);
		} catch (error) {
			console.error("Failed to leave team:", error);
		}
	};

	if (teamLoading) {
		return (
			<div className="container mx-auto p-6">
				<div className="flex items-center justify-center min-h-64">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	if (teamError) {
		return (
			<div className="container mx-auto p-6">
				<Alert>
					<p>Failed to load team information. Please try again.</p>
				</Alert>
			</div>
		);
	}

	if (!myTeam) {
		return (
			<div className="container mx-auto p-6 max-w-2xl">
				<Card>
					<CardHeader>
						<CardTitle>Team Management</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-gray-600">
							You are not currently part of a team.
						</p>

						<Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
							<DialogTrigger asChild>
								<Button>Create New Team</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Create New Team</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label htmlFor="teamName">Team Name</Label>
										<Input
											id="teamName"
											value={createTeamName}
											onChange={(e) => setCreateTeamName(e.target.value)}
											placeholder="Enter team name"
											maxLength={80}
										/>
									</div>
									<div className="flex justify-end space-x-2">
										<Button
											variant="outline"
											onClick={() => setShowCreateModal(false)}
										>
											Cancel
										</Button>
										<Button
											onClick={handleCreateTeam}
											disabled={
												!createTeamName.trim() || createTeamMutation.isPending
											}
										>
											{createTeamMutation.isPending
												? "Creating..."
												: "Create Team"}
										</Button>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-6 max-w-4xl">
			<div className="space-y-6">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								{myTeam.teamName}
								<Badge variant={isTeamLead ? "default" : "secondary"}>
									{isTeamLead ? "Team Lead" : "Member"}
								</Badge>
							</CardTitle>
						</div>
						<div className="flex gap-2">
							{isTeamLead && (
								<>
									<Dialog
										open={showRenameModal}
										onOpenChange={setShowRenameModal}
									>
										<DialogTrigger asChild>
											<Button variant="outline" size="sm">
												Rename Team
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Rename Team</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label htmlFor="newTeamName">New Team Name</Label>
													<Input
														id="newTeamName"
														value={newTeamName}
														onChange={(e) => setNewTeamName(e.target.value)}
														placeholder="Enter new team name"
														maxLength={80}
													/>
												</div>
												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														onClick={() => setShowRenameModal(false)}
													>
														Cancel
													</Button>
													<Button
														onClick={handleRenameTeam}
														disabled={
															!newTeamName.trim() ||
															newTeamName.trim() === myTeam.teamName ||
															renameTeamMutation.isPending
														}
													>
														{renameTeamMutation.isPending
															? "Renaming..."
															: "Rename"}
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>

									<Dialog
										open={showAddMemberModal}
										onOpenChange={setShowAddMemberModal}
									>
										<DialogTrigger asChild>
											<Button size="sm">Add Member</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Add Team Member</DialogTitle>
											</DialogHeader>
											<div className="space-y-4">
												<div>
													<Label htmlFor="memberEmail">Member Email</Label>
													<Input
														id="memberEmail"
														type="email"
														value={addMemberEmail}
														onChange={(e) => setAddMemberEmail(e.target.value)}
														placeholder="Enter member's email address"
													/>
												</div>
												<div className="flex justify-end space-x-2">
													<Button
														variant="outline"
														onClick={() => setShowAddMemberModal(false)}
													>
														Cancel
													</Button>
													<Button
														onClick={handleAddMember}
														disabled={
															!addMemberEmail.trim() ||
															addMemberMutation.isPending
														}
													>
														{addMemberMutation.isPending
															? "Adding..."
															: "Add Member"}
													</Button>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</>
							)}
							<Button
								variant="destructive"
								size="sm"
								onClick={handleLeaveTeam}
								disabled={removeMemberMutation.isPending}
							>
								{removeMemberMutation.isPending ? "Leaving..." : "Leave Team"}
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						{rosterLoading ? (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
							</div>
						) : (
							<div className="space-y-4">
								<h3 className="font-semibold text-lg">
									Team Members ({teamRoster?.length || 0}/5)
								</h3>
								<div className="grid gap-3">
									{teamRoster?.map((member) => (
										<div
											key={member.id}
											className="flex items-center justify-between p-3 border rounded-lg"
										>
											<div className="flex items-center gap-3">
												<div>
													<div className="font-medium">
														{member.user?.firstName} {member.user?.lastName}
														{member.userId === user?.uid && " (You)"}
													</div>
													<div className="text-sm text-gray-500">
														{member.user?.email}
													</div>
												</div>
												<Badge
													variant={
														member.role === TeamRole.LEAD
															? "default"
															: "secondary"
													}
												>
													{member.role === TeamRole.LEAD ? "Lead" : "Member"}
												</Badge>
											</div>
											{isTeamLead &&
												member.role !== TeamRole.LEAD &&
												member.userId !== user?.uid && (
													<Button
														variant="outline"
														size="sm"
														onClick={() => handleChangeLead(member.userId)}
														disabled={changeLeadMutation.isPending}
													>
														Make Lead
													</Button>
												)}
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
