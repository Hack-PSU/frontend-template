"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFirebase } from "@/lib/providers/FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook";
import { useAllExtraCreditClasses } from "@/lib/api/extra-credit/hook";
import {
	useUserExtraCreditClasses,
	useAssignExtraCreditClass,
	useUnassignExtraCreditClass,
} from "@/lib/api/user/hook";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";

export default function ExtraCredit() {
	const { user, isAuthenticated, isLoading: authLoading } = useFirebase();
	const router = useRouter();
	const { data: userInfo, isLoading: userInfoLoading } = useUserInfoMe();
	const { data: allClasses, isLoading: allClassesLoading } =
		useAllExtraCreditClasses();
	const { data: assignedClasses, isLoading: assignedClassesLoading } =
		useUserExtraCreditClasses(user?.uid || "");

	const { mutateAsync: assignClass, isPending: isAssigning } =
		useAssignExtraCreditClass();
	const { mutateAsync: unassignClass, isPending: isUnassigning } =
		useUnassignExtraCreditClass();

	const [processingClassId, setProcessingClassId] = useState<number | null>(
		null
	);

	const isClassAssigned = (classId: number) => {
		return assignedClasses?.some((c) => c.id === classId) || false;
	};

	const handleToggleClass = async (
		classId: number,
		isCurrentlyAssigned: boolean
	) => {
		if (!user?.uid) {
			toast.error("Please sign in to manage extra credit classes");
			return;
		}

		setProcessingClassId(classId);
		try {
			if (isCurrentlyAssigned) {
				await unassignClass({ userId: user.uid, classId });
				toast.success("Extra credit class removed");
			} else {
				await assignClass({ userId: user.uid, classId });
				toast.success("Extra credit class assigned");
			}
		} catch (error: any) {
			console.error("Error toggling class:", error);
			const errorMessage =
				error?.message || "Failed to update extra credit class";
			toast.error(errorMessage);
		} finally {
			setProcessingClassId(null);
		}
	};

	if (authLoading || userInfoLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span className="text-lg">Loading...</span>
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
				<Button
					variant="ghost"
					onClick={() => router.push("/profile")}
					className="mb-4"
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to Profile
				</Button>

				<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
					<CardHeader>
						<CardTitle className="text-2xl md:text-3xl font-bold flex items-center space-x-2">
							<GraduationCap className="h-8 w-8" />
							<span>Extra Credit Classes</span>
						</CardTitle>
						<CardDescription className="text-slate-300">
							Select the classes you want to receive extra credit for attending
							HackPSU
						</CardDescription>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Available Classes</CardTitle>
						<CardDescription>
							Check the classes you&apos;re enrolled in to receive extra credit
						</CardDescription>
					</CardHeader>
					<CardContent>
						{allClassesLoading || assignedClassesLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin" />
								<span className="ml-2">Loading classes...</span>
							</div>
						) : allClasses && allClasses.length > 0 ? (
							<div className="space-y-4">
								{allClasses.map((classItem) => {
									const assigned = isClassAssigned(classItem.id);
									const isProcessing = processingClassId === classItem.id;

									return (
										<div
											key={classItem.id}
											className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
										>
											<Checkbox
												id={`class-${classItem.id}`}
												checked={assigned}
												disabled={isProcessing || isAssigning || isUnassigning}
												onCheckedChange={() =>
													handleToggleClass(classItem.id, assigned)
												}
											/>
											<label
												htmlFor={`class-${classItem.id}`}
												className="flex-1 cursor-pointer"
											>
												<div className="font-medium">{classItem.name}</div>
												{classItem.hackathonId && (
													<div className="text-sm text-gray-500">
														Hackathon: {classItem.hackathonId}
													</div>
												)}
											</label>
											{isProcessing && (
												<Loader2 className="h-4 w-4 animate-spin text-gray-400" />
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className="text-center py-8 text-gray-500">
								<GraduationCap className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p>No extra credit classes available at this time</p>
							</div>
						)}
					</CardContent>
				</Card>

				{assignedClasses && assignedClasses.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Your Selected Classes</CardTitle>
							<CardDescription>
								Classes you&apos;ve selected for extra credit
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{assignedClasses.map((classItem) => (
									<div
										key={classItem.id}
										className="p-3 bg-green-50 border border-green-200 rounded-lg"
									>
										<div className="font-medium text-green-900">
											{classItem.name}
										</div>
										{classItem.hackathonId && (
											<div className="text-sm text-green-700">
												Hackathon: {classItem.hackathonId}
											</div>
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
