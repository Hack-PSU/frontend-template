import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from "./FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook";
import FullScreenLoading from "@/components/FullScreenLoading/FullScreenLoading";
import Navbar from "@/components/Navbar";

type AuthGuardProps = {
	children: React.ReactNode;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { isLoading, isAuthenticated } = useFirebase();
	const { data: userData } = useUserInfoMe();

	useEffect(() => {
		if (isLoading) return;

		if (pathname === "/signin") {
			if (isAuthenticated) {
				if (userData && userData.registration) {
					router.push("/profile");
				} else {
					router.push("/register");
				}
			}
		}
		else if (pathname === "/register") {
			if (!isAuthenticated) {
				router.push("/signin");
			} else if (userData && userData.registration) {
				router.push("/profile");
			}
		}
		else if (pathname === "/profile" || pathname === "/reimbursements") {
			if (!isAuthenticated) {
				router.push("/signin");
			} else if (userData && !userData.registration) {
				router.push("/register");
			}
		}
	}, [isLoading, isAuthenticated, pathname, router, userData]);

	if (isLoading) {
		return (
			<>
				<FullScreenLoading />
			</>
		);
	}

	return <><FullScreenLoading /></>;
};

export default AuthGuard;
