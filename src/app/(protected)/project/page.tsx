"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook";
import { useAllTeams } from "@/lib/api/team";
import {
	useProjectsByTeamId,
	useCreateProject,
	usePatchProject,
	PROJECT_CATEGORIES,
	ProjectCategory,
} from "@/lib/api/judging";
import { useFlagState } from "@/lib/api/flag/hook";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
	FileText,
	Loader2,
	Lock,
	CheckCircle,
	AlertCircle,
	Calendar,
} from "lucide-react";

export default function Project() {
	const { isAuthenticated, user, isLoading } = useFirebase();
	const router = useRouter();
	const { isLoading: isUserLoading, data: userData } = useUserInfoMe();
	const { data: teams, error: teamsError } = useAllTeams();

	const [projectName, setProjectName] = useState("");
	const [githubLink, setGithubLink] = useState("");
	const [devpostLink, setDevpostLink] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<
		ProjectCategory[]
	>([]);

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

	const {
		data: teamProjects,
		isLoading: isProjectsLoading,
		error: projectsError,
	} = useProjectsByTeamId(userTeam?.id || "");
	const existingProject = teamProjects?.[0]; // Teams can only have one project

	const { mutateAsync: createProject, isPending: isCreating } =
		useCreateProject();
	const { mutateAsync: patchProject, isPending: isUpdating } =
		usePatchProject();

	// Feature flag check - use same flag as reimbursement for now
	const {
		data: projectSubmissionFlag,
		isLoading: flagLoading,
		error: flagError,
	} = useFlagState("ProjectSubmission");

	useEffect(() => {
		if (isUserLoading) return;
		if (!userData || !userData.registration) router.push("/register");
	}, [userData, router, isUserLoading]);

	// Show error toasts for API failures
	useEffect(() => {
		if (teamsError) {
			toast.error("Failed to load team data. Please refresh the page.");
		}
	}, [teamsError]);

	useEffect(() => {
		if (projectsError) {
			toast.error("Failed to load project data. Please refresh the page.");
		}
	}, [projectsError]);

	useEffect(() => {
		if (flagError) {
			toast.error(
				"Failed to check submission status. Please refresh the page."
			);
		}
	}, [flagError]);

	// Initialize form with existing project data
	useEffect(() => {
		if (existingProject) {
			setProjectName(existingProject.name);
			setGithubLink(existingProject.githubLink || "");
			setDevpostLink(existingProject.devpostLink || "");
			if (existingProject.categories) {
				const categories = existingProject.categories
					.split(",")
					.map((c) => c.trim()) as ProjectCategory[];
				setSelectedCategories(
					categories.filter((c) => PROJECT_CATEGORIES.includes(c))
				);
			}
		}
	}, [existingProject]);

	const handleCategoryChange = (
		category: ProjectCategory,
		checked: boolean
	) => {
		if (checked) {
			setSelectedCategories((prev) => [...prev, category]);
		} else {
			setSelectedCategories((prev) => prev.filter((c) => c !== category));
		}
	};

	const handleSubmitProject = async () => {
		if (!projectName.trim()) {
			toast.error("Please enter a project name");
			return;
		}

		if (!userTeam) {
			toast.error("You must be part of a team to submit a project");
			return;
		}

		// Validate Github Link - required
		if (!githubLink.trim()) {
			toast.error("Github link is required");
			return;
		}

		if (!isValidGithubUrl(githubLink)) {
			toast.error("Please enter a valid Github URL (must be from github.com)");
			return;
		}

		// Validate Devpost link - now required
		if (!devpostLink.trim()) {
			toast.error("Devpost link is required");
			return;
		}

		if (!isValidDevpostUrl(devpostLink)) {
			toast.error(
				"Please enter a valid Devpost URL (must be from devpost.com)"
			);
			return;
		}

		// Additional validation
		if (!userTeam?.isActive && !hasSubmittedProject) {
			toast.error("Your team is not active. Cannot submit project.");
			return;
		}

		try {
			const projectData = {
				name: projectName.trim(),
				categories:
					selectedCategories.length > 0
						? selectedCategories.join(", ")
						: undefined,
				teamId: userTeam.id,
				githubLink: githubLink.trim(),
				devpostLink: devpostLink.trim(),
			};

			if (existingProject) {
				await patchProject({
					id: existingProject.id,
					data: projectData,
				});
				toast.success("Project updated successfully!");
			} else {
				await createProject(projectData);
				toast.success("Project submitted successfully!");
			}
		} catch (error) {
			console.error("Error submitting project:", error);
			toast.error("Failed to submit project. Please try again.");
		}
	};

	const isValidGithubUrl = (url: string) => {
		try {
			const parsedUrl = new URL(url);
			return (
				parsedUrl.hostname === "github.com" ||
				parsedUrl.hostname === "www.github.com"
			);
		} catch (_) {
			return false;
		}
	};

	const isValidDevpostUrl = (url: string) => {
		try {
			const parsedUrl = new URL(url);
			return (
				parsedUrl.hostname === "devpost.com" ||
				parsedUrl.hostname === "www.devpost.com"
			);
		} catch (_) {
			return false;
		}
	};

	const isProjectSubmissionEnabled = projectSubmissionFlag?.isEnabled ?? false;
	const canSubmitProject = userTeam?.isActive && isProjectSubmissionEnabled;
	const canUpdateProject = userTeam?.isActive && isProjectSubmissionEnabled;
	const hasSubmittedProject = !!existingProject;

	if (isLoading || flagLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span className="text-lg">Loading project...</span>
				</div>
			</div>
		);
	}

	if (!isAuthenticated || !user) {
		router.push("/");
		return null;
	}

	if (!userTeam) {
		return (
			<div
				className="min-h-screen py-8 px-4"
				style={{ backgroundColor: "#4d1170" }}
			>
				<div className="mx-auto max-w-4xl space-y-6">
					<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
						<CardHeader className="text-center">
							<div className="flex justify-center mb-4">
								<AlertCircle className="h-16 w-16 text-red-400" />
							</div>
							<CardTitle className="text-2xl md:text-3xl font-bold">
								No Team Found
							</CardTitle>
							<CardDescription className="text-slate-300">
								You must be part of a team to submit a project
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								onClick={() => router.push("/team")}
								className="w-full"
								size="lg"
							>
								Create or Join a Team
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-transparent py-8 px-4">
			<div className="mx-auto max-w-4xl space-y-6">
				{/* Project Header */}
				<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							{hasSubmittedProject ? (
								<CheckCircle className="h-16 w-16 text-green-400" />
							) : (
								<FileText className="h-16 w-16 text-red-400" />
							)}
						</div>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							{hasSubmittedProject ? "Update Project" : "Submit Project"}
						</CardTitle>
						<CardDescription className="text-slate-300">
							{hasSubmittedProject
								? "Update your project information"
								: "Submit your project for judging"}
						</CardDescription>
						{!canSubmitProject && (
							<div className="flex items-center justify-center space-x-2 mt-2 text-yellow-400">
								{!isProjectSubmissionEnabled ? (
									<>
										<Calendar className="h-5 w-5" />
										<span className="text-sm font-medium">
											Project submissions not yet open
										</span>
									</>
								) : (
									<>
										<Lock className="h-5 w-5" />
										<span className="text-sm font-medium">Team is locked</span>
									</>
								)}
							</div>
						)}
					</CardHeader>
				</Card>

				{/* Project Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<FileText className="h-6 w-6" />
							<span>Project Details</span>
						</CardTitle>
						<CardDescription>
							{hasSubmittedProject
								? "Update your project information."
								: "Enter your project information."}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{isProjectsLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin mr-2" />
								<span>Loading project data...</span>
							</div>
						) : (
							<>
								{/* Project Name */}
								<div className="space-y-2">
									<Label htmlFor="project-name">Project Name *</Label>
									<Input
										id="project-name"
										placeholder="Enter your project name"
										value={projectName}
										onChange={(e) => setProjectName(e.target.value)}
										disabled={!canUpdateProject}
									/>
								</div>

								{/* Github Link */}
								<div className="space-y-2">
									<Label htmlFor="github-link">Github Link *</Label>
									<Input
										id="github-link"
										type="url"
										placeholder="https://github.com/your-profile/your-project"
										value={githubLink}
										onChange={(e) => setGithubLink(e.target.value)}
										disabled={!canUpdateProject}
									/>
								</div>

								{/* Devpost Link */}
								<div className="space-y-2">
									<Label htmlFor="devpost-link">Devpost Link *</Label>
									<Input
										id="devpost-link"
										type="url"
										placeholder="https://devpost.com/software/your-project"
										value={devpostLink}
										onChange={(e) => setDevpostLink(e.target.value)}
										disabled={!canUpdateProject}
									/>
								</div>

								{/* Categories */}
								<div className="space-y-4">
									<Label>Categories (Optional - Select if applicable)</Label>
									<div className="space-y-3">
										{PROJECT_CATEGORIES.map((category) => (
											<div
												key={category}
												className="flex items-center space-x-2"
											>
												<Checkbox
													id={category}
													checked={selectedCategories.includes(category)}
													onCheckedChange={(checked) =>
														handleCategoryChange(category, checked as boolean)
													}
													disabled={!canUpdateProject}
												/>
												<Label
													htmlFor={category}
													className="text-sm font-medium"
												>
													{category}
												</Label>
											</div>
										))}
									</div>
								</div>

								{/* Team Information */}
								<div className="space-y-2">
									<Label>Team</Label>
									<div className="p-4 bg-gray-50 rounded-lg">
										<p className="font-medium">{userTeam.name}</p>
										<p className="text-sm text-gray-600">
											{hasSubmittedProject
												? "Team membership is locked after project submission"
												: "Team membership will be locked after project submission"}
										</p>
									</div>
								</div>

								{(canSubmitProject ||
									(hasSubmittedProject && canUpdateProject)) && (
									<>
										<Separator />
										<Button
											onClick={handleSubmitProject}
											className="w-full"
											size="lg"
											disabled={isCreating || isUpdating}
										>
											{(isCreating || isUpdating) && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											{hasSubmittedProject
												? "Update Project"
												: "Submit Project"}
										</Button>
									</>
								)}

								{(!canSubmitProject && !hasSubmittedProject) ||
								(hasSubmittedProject && !canUpdateProject) ? (
									<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
										<p className="text-sm text-yellow-800">
											{!isProjectSubmissionEnabled ? (
												<>
													<strong>Project submissions closed:</strong> Project
													submissions and updates are not available.
												</>
											) : (
												<>
													<strong>Team is locked:</strong> Your team has been
													locked and project submissions are no longer allowed.
												</>
											)}
										</p>
									</div>
								) : null}
							</>
						)}
					</CardContent>
				</Card>

				{hasSubmittedProject && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center space-x-2">
								<CheckCircle className="h-6 w-6 text-green-600" />
								<span>Submission Status</span>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<p className="text-green-600 font-medium">
									Project successfully submitted!
								</p>
								<p className="text-sm text-gray-600">
									Your project &quot;{existingProject.name}&quot; has been
									submitted for judging. You can update project details as
									needed.
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
