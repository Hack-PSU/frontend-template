import { AuthGuard, Role } from "@hackpsu/react-sdk";
import { Toaster } from "sonner";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="subpage-bg min-h-screen pt-24 md:pt-28 lg:pt-32">
			<Toaster richColors />
			<AuthGuard minimumRole={Role.NONE}>{children}</AuthGuard>
			<Toaster />
		</div>
	);
}
