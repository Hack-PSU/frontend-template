"use client";

import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	createContext,
	FC,
} from "react";
import * as Sentry from "@sentry/nextjs";
import {
	Auth,
	AuthError,
	AuthErrorCodes,
	getIdToken,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut,
	User,
	createUserWithEmailAndPassword,
	onIdTokenChanged,
	signInWithPopup,
	GoogleAuthProvider,
	sendPasswordResetEmail,
	GithubAuthProvider,
} from "firebase/auth";
import { initApi, resetApi } from "@/lib/api";

export enum FirebaseAuthError {
	NONE,
	INVALID_EMAIL,
	INVALID_PASSWORD,
	EMAIL_EXISTS,
	WEAK_PASSWORD,
}

type FirebaseProviderHooks = {
	isAuthenticated: boolean;
	user?: User;
	token: string;
	error: FirebaseAuthError;
	signUpWithEmailAndPassword(
		email: string,
		password: string
	): Promise<SignUpResponse>;
	loginWithEmailAndPassword(
		email: string,
		password: string
	): Promise<LoginResponse>;
	signInWithGoogle(): Promise<LoginResponse>;
	signInWithGithub(): Promise<LoginResponse>;
	logout(next?: () => Promise<void>): Promise<void>;
	userDataLoaded: boolean;
	resetPassword(email: string): Promise<{ success: boolean; error?: string }>;
};

type Props = {
	children: React.ReactNode;
	auth: Auth;
};

const FirebaseContext = createContext<FirebaseProviderHooks>(
	{} as FirebaseProviderHooks
);

interface SignUpResponse {
	success: boolean;
	error?: string;
}

interface LoginResponse {
	success: boolean;
	error?: string;
}

const FirebaseProvider: FC<Props> = ({ children, auth }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [user, setUser] = useState<User | undefined>();
	const [error, setError] = useState<FirebaseAuthError>(FirebaseAuthError.NONE);
	const [token, setToken] = useState<string>("");
	const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false);

	const getUserIdToken = useCallback(async (user: User) => {
		return await getIdToken(user);
	}, []);

	const resolveAuthError = useCallback((error: AuthError) => {
		switch (error.code) {
			case AuthErrorCodes.EMAIL_EXISTS:
				setError(FirebaseAuthError.EMAIL_EXISTS);
				break;
			case AuthErrorCodes.INVALID_EMAIL:
				setError(FirebaseAuthError.INVALID_EMAIL);
				break;
			case AuthErrorCodes.INVALID_PASSWORD:
				setError(FirebaseAuthError.INVALID_PASSWORD);
				break;
			case AuthErrorCodes.WEAK_PASSWORD:
				setError(FirebaseAuthError.WEAK_PASSWORD);
				break;
		}
	}, []);

	const resolveAuthState = useCallback(
		async (user?: User) => {
			if (user) {
				const token = await getUserIdToken(user);
				setToken(token);
				setUser(user);
				setIsAuthenticated(true);
				Sentry.setUser({ id: user.uid, email: user.email || "" });
			} else {
				setUser(undefined);
				setIsAuthenticated(false);
				setError(FirebaseAuthError.NONE);
				Sentry.setUser(null);
			}
			setUserDataLoaded(true);
		},
		[getUserIdToken]
	);

	const signUpWithEmailAndPassword: FirebaseProviderHooks["signUpWithEmailAndPassword"] =
		useCallback(
			async (email: string, password: string): Promise<SignUpResponse> => {
				setError(FirebaseAuthError.NONE);
				try {
					const userCredential = await createUserWithEmailAndPassword(
						auth,
						email,
						password
					);
					if (userCredential.user) {
						await resolveAuthState(userCredential.user);
						return { success: true };
					} else {
						return { success: false, error: "User not created" };
					}
				} catch (e) {
					resolveAuthError(e as AuthError);
					return { success: false, error: e?.toString() ?? "Sign-up failed" };
				}
			},
			[auth, resolveAuthError, resolveAuthState]
		);

	const loginWithEmailAndPassword: FirebaseProviderHooks["loginWithEmailAndPassword"] =
		useCallback(
			async (email, password): Promise<LoginResponse> => {
				setError(FirebaseAuthError.NONE);
				try {
					const userCredential = await signInWithEmailAndPassword(
						auth,
						email,
						password
					);
					if (userCredential.user) {
						await resolveAuthState(userCredential.user);
						return { success: true };
					} else {
						return { success: false, error: "User not found" };
					}
				} catch (e) {
					resolveAuthError(e as AuthError);
					return { success: false, error: e?.toString() ?? "Login failed" };
				}
			},
			[auth, resolveAuthError, resolveAuthState]
		);

	const signInWithGoogle: FirebaseProviderHooks["signInWithGoogle"] =
		useCallback(async (): Promise<LoginResponse> => {
			setError(FirebaseAuthError.NONE);
			try {
				const provider = new GoogleAuthProvider();
				const userCredential = await signInWithPopup(auth, provider);
				if (userCredential.user) {
					await resolveAuthState(userCredential.user);
					return { success: true };
				} else {
					return { success: false, error: "Google sign-in failed" };
				}
			} catch (e) {
				resolveAuthError(e as AuthError);
				return {
					success: false,
					error: e?.toString() ?? "Google sign-in failed",
				};
			}
		}, [auth, resolveAuthError, resolveAuthState]);

	const signInWithGithub: FirebaseProviderHooks["signInWithGithub"] =
		useCallback(async (): Promise<LoginResponse> => {
			setError(FirebaseAuthError.NONE);
			try {
				const provider = new GithubAuthProvider();
				const userCredential = await signInWithPopup(auth, provider);
				if (userCredential.user) {
					await resolveAuthState(userCredential.user);
					return { success: true };
				} else {
					return { success: false, error: "Github sign-in failed" };
				}
			} catch (e) {
				resolveAuthError(e as AuthError);
				return {
					success: false,
					error: e?.toString() ?? "Github sign-in failed",
				};
			}
		}, [auth, resolveAuthError, resolveAuthState]);

	const logout: FirebaseProviderHooks["logout"] = useCallback(
		async (next) => {
			try {
				await signOut(auth);
				setToken("");
				setIsAuthenticated(false);
				setUserDataLoaded(false);
				await next?.();
			} catch (e) {}
		},
		[auth]
	);

	const resetPassword: FirebaseProviderHooks["resetPassword"] = useCallback(
		async (email: string): Promise<{ success: boolean; error?: string }> => {
			try {
				await sendPasswordResetEmail(auth, email);
				return { success: true };
			} catch (e) {
				return {
					success: false,
					error: e?.toString() ?? "Password reset failed",
				};
			}
		},
		[auth]
	);

	useEffect(() => {
		return onAuthStateChanged(auth, async (user) => {
			await resolveAuthState(user ?? undefined);
		});
	}, [auth, resolveAuthState]);

	useEffect(() => {
		return onIdTokenChanged(auth, async (user) => {
			// initialize api if user exists

			if (user) {
				await initApi(user);
			} else {
				resetApi();
			}
		});
	}, [auth]);

	const value = useMemo(
		() => ({
			isAuthenticated,
			user,
			error,
			token,
			signUpWithEmailAndPassword,
			loginWithEmailAndPassword,
			signInWithGoogle,
			signInWithGithub,
			logout,
			userDataLoaded,
			resetPassword,
		}),
		[
			isAuthenticated,
			user,
			error,
			token,
			signUpWithEmailAndPassword,
			loginWithEmailAndPassword,
			signInWithGoogle,
			signInWithGithub,
			logout,
			resetPassword,
			userDataLoaded,
		]
	);

	return (
		<FirebaseContext.Provider value={value}>
			{children}
		</FirebaseContext.Provider>
	);
};

export const useFirebase = () => useContext(FirebaseContext);
export default FirebaseProvider;
