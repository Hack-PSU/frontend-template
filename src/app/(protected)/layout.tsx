import { AuthGuard, Role } from "@/lib/providers/AuthGuard";
import { Toaster } from "sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{" "}
			<Toaster richColors />
			<AuthGuard config={{ minimumRole: Role.NONE }}>{children}</AuthGuard>
			<Toaster />
			{" "}
		</>
	);
}
