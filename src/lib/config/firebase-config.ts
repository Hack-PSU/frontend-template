import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// export const firebaseConfig: FirebaseOptions = {
// 	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// 	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// 	databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
// 	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// 	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// 	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// 	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
export const firebaseConfig: FirebaseOptions = {
	apiKey: "AIzaSyCpvAPdiIcqKV_NTyt6DZgDUNyjmA6kwzU",
	authDomain: "hackpsu18.firebaseapp.com",
	databaseURL: "https://hackpsu18.firebaseio.com",
	projectId: "hackpsu18",
	storageBucket: "hackpsu18.appspot.com",
	messagingSenderId: "1002677206617",
	appId: "1:1002677206617:web:93e9e28debdbc11c733b48",
	measurementId: "G-L0M33JP8NK",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
