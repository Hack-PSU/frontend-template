import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFirebase } from "./FirebaseProvider";
import { useUserInfoMe } from "@/lib/api/user/hook";


import FullScreenLoading from "@/components/FullScreenLoading/FullScreenLoading";

type AuthGuardProps = {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({children}) => {
    const pathname = usePathname();
    const router = useRouter();
    const {isLoading, isAuthenticated, user} = useFirebase();
	const { data: userData } = useUserInfoMe();


    useEffect(() => {
        if (pathname == "/profile" && !isLoading && !isAuthenticated) {
			router.push("/signin");
		} else if (user && userData) {
			if (!userData.registration) {
				router.push("/register");
			}
		}
    }, [isAuthenticated, user, userData, router, isLoading, pathname]);

    if (isLoading && isAuthenticated)
    {
        return <FullScreenLoading/>;
    }

    return <>{children}</>;
}

export default AuthGuard;