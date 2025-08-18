"use client";

import { useState, useMemo } from "react";
import { useAllProjects } from "@/lib/api/judging";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, Folder, ExternalLink } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function ExpoPage() {
	const { data: projects, isLoading, error } = useAllProjects();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const categories = useMemo(() => {
		if (!projects) return [];
		const categorySet = new Set<string>();
		projects.forEach((project) => {
			if (project.categories) {
				const projectCategories = project.categories
					.split(",")
					.map((cat) => cat.trim());
				projectCategories.forEach((cat) => categorySet.add(cat));
			}
		});
		return Array.from(categorySet).filter(Boolean).sort();
	}, [projects]);

	const filteredProjects = useMemo(() => {
		if (!projects) return [];

		return projects.filter((project) => {
			const matchesSearch = project.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesCategory =
				selectedCategory === "all" ||
				(project.categories &&
					project.categories
						.toLowerCase()
						.includes(selectedCategory.toLowerCase()));

			return matchesSearch && matchesCategory;
		});
	}, [projects, searchTerm, selectedCategory]);

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="flex items-center space-x-2">
					<Loader2 className="h-6 w-6 animate-spin" />
					<span className="text-lg">Loading projects...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-transparent py-8 px-4">
				<div className="mx-auto max-w-6xl">
					<Card className="border-red-500">
						<CardContent className="py-6">
							<div className="text-center text-red-500">
								<p className="text-lg font-semibold">Error loading projects</p>
								<p className="text-sm mt-2">Please try again later</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-transparent py-8 px-4">
			<div className="mx-auto max-w-6xl space-y-6">
				<Card className="border-2 border-red-500 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl md:text-3xl font-bold">
							Project Expo
						</CardTitle>
						<p className="text-slate-300">
							Discover all the amazing projects built at HackPSU
						</p>
					</CardHeader>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Filter className="h-5 w-5" />
							<span>Filter & Search</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="search" className="flex items-center space-x-2">
									<Search className="h-4 w-4" />
									<span>Search Projects</span>
								</Label>
								<Input
									id="search"
									type="text"
									placeholder="Search by project name..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="category">Filter by Category</Label>
								<Select
									value={selectedCategory}
									onValueChange={setSelectedCategory}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Categories</SelectItem>
										{categories.map((category) => (
											<SelectItem key={category} value={category}>
												{category}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="flex items-center justify-between text-sm text-gray-600">
							<span>
								Showing {filteredProjects.length} of {projects?.length || 0}{" "}
								projects
							</span>
							{categories.length > 0 && (
								<span>{categories.length} categories available</span>
							)}
						</div>
					</CardContent>
				</Card>

				{filteredProjects.length === 0 ? (
					<Card>
						<CardContent className="py-8">
							<div className="text-center">
								<Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
								<p className="text-lg font-medium text-gray-600">
									No projects found
								</p>
								<p className="text-sm text-gray-500 mt-1">
									{searchTerm || selectedCategory !== "all"
										? "Try adjusting your search or filter criteria"
										: "No projects are currently available"}
								</p>
							</div>
						</CardContent>
					</Card>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredProjects.map((project) => (
							<Card
								key={project.id}
								className="hover:shadow-lg transition-shadow duration-200"
							>
								<CardHeader>
									<CardTitle className="text-lg font-semibold line-clamp-2">
										{project.name}
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{project.categories && (
										<div className="space-y-2">
											<Label className="text-sm font-medium text-gray-600">
												Categories
											</Label>
											<div className="flex flex-wrap gap-2">
												{project.categories
													.split(",")
													.map((category, index) => (
														<Badge
															key={index}
															variant="secondary"
															className="text-xs"
														>
															{category.trim()}
														</Badge>
													))}
											</div>
										</div>
									)}

									{project.devpostLink && (
										<div className="pt-2">
											<Button
												variant="outline"
												size="sm"
												className="w-full"
												onClick={() =>
													window.open(project.devpostLink, "_blank")
												}
											>
												<ExternalLink className="mr-2 h-4 w-4" />
												View on Devpost
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
