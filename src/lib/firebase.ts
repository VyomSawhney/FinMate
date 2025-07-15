import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAG_kjN1BVgiIenlkyEAy1tbp-a5VFdkBI",
  authDomain: "finmate-b3b55.firebaseapp.com",
  projectId: "finmate-b3b55",
  storageBucket: "finmate-b3b55.firebasestorage.app",
  messagingSenderId: "441224019586",
  appId: "1:441224019586:web:5ba271c7f0befb8828be9b",
  measurementId: "G-738WPMY45B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in browser
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics }; 