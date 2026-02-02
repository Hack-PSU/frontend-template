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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
	GraduationCap,
	Loader2,
	ArrowLeft,
	Check,
	Plus,
	X,
} from "lucide-react";

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
		<div
			className="min-h-screen py-8 px-4"
			style={{ backgroundColor: "#4d1170" }}
		>
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
					<CardHeader className="text-center">
						<div className="flex justify-center mb-4">
							<GraduationCap className="h-16 w-16 text-red-400" />
						</div>
						<CardTitle className="text-2xl md:text-3xl font-bold">
							Extra Credit Classes
						</CardTitle>
						<CardDescription className="text-slate-300">
							Select the classes you want to receive extra credit for attending
							HackPSU
						</CardDescription>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<div>
								<CardTitle className="flex items-center space-x-2">
									<GraduationCap className="h-6 w-6" />
									<span>Extra Credit Classes</span>
								</CardTitle>
								<CardDescription>
									Click to add or remove classes for extra credit
								</CardDescription>
							</div>
							{assignedClasses && assignedClasses.length > 0 && (
								<Badge variant="secondary" className="text-sm">
									{assignedClasses.length} selected
								</Badge>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{allClassesLoading || assignedClassesLoading ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-6 w-6 animate-spin" />
								<span className="ml-2">Loading classes...</span>
							</div>
						) : allClasses && allClasses.length > 0 ? (
							<div className="space-y-3">
								{allClasses.map((classItem) => {
									const assigned = isClassAssigned(classItem.id);
									const isProcessing = processingClassId === classItem.id;

									return (
										<div
											key={classItem.id}
											className={`flex items-center justify-between p-4 border-2 rounded-lg transition-all cursor-pointer ${
												assigned
													? "border-green-500 bg-green-50 hover:bg-green-100"
													: "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
											} ${
												isProcessing || isAssigning || isUnassigning
													? "opacity-50 cursor-not-allowed"
													: ""
											}`}
											onClick={() =>
												!isProcessing &&
												!isAssigning &&
												!isUnassigning &&
												handleToggleClass(classItem.id, assigned)
											}
										>
											<div className="flex items-center space-x-3">
												<div
													className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
														assigned
															? "border-green-600 bg-green-600"
															: "border-gray-300"
													}`}
												>
													{assigned && <Check className="h-4 w-4 text-white" />}
												</div>
												<div>
													<div
														className={`font-medium ${
															assigned ? "text-green-900" : "text-gray-900"
														}`}
													>
														{classItem.name}
													</div>
												</div>
											</div>
											<div className="flex items-center space-x-2">
												{isProcessing ? (
													<Loader2 className="h-5 w-5 animate-spin text-gray-400" />
												) : (
													<Button
														variant={assigned ? "destructive" : "default"}
														size="sm"
														onClick={(e) => {
															e.stopPropagation();
															handleToggleClass(classItem.id, assigned);
														}}
														disabled={isAssigning || isUnassigning}
													>
														{assigned ? (
															<>
																<X className="h-4 w-4 mr-1" />
																Remove
															</>
														) : (
															<>
																<Plus className="h-4 w-4 mr-1" />
																Add
															</>
														)}
													</Button>
												)}
											</div>
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
			</div>
		</div>
	);
}
