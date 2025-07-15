import { AuthGuard, Role } from "@/lib/providers/AuthGuard";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{" "}
			<AuthGuard config={{ minimumRole: Role.NONE }}>{children}</AuthGuard>{" "}
		</>
	);
}
