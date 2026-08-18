import { AuthGuard, Role } from "@/lib/providers/AuthGuard";
import { Toaster } from "sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="subpage-bg min-h-screen pt-24 md:pt-28 lg:pt-32">
			<Toaster richColors />
			<AuthGuard config={{ minimumRole: Role.NONE }}>{children}</AuthGuard>
			<Toaster />
		</div>
	);
}
