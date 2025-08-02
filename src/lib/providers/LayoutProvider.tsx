"use client";
import { AuthGuard } from "./AuthGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FirebaseProvider } from "./FirebaseProvider";
import { auth } from "@/lib/config/firebase";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});

export default function LayoutProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<FirebaseProvider>
				<QueryClientProvider client={queryClient}>
					<Navbar />
					{children}
				</QueryClientProvider>
			</FirebaseProvider>
		</>
	);
}
