import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize the variables with proper types
let app: FirebaseApp;
let auth: Auth;

try {
  // Check if all required Firebase config values are present
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    throw new Error("Firebase configuration is incomplete. Make sure all environment variables are set.");
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Use Auth emulator if in development mode
  if (import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_EMULATOR === "true") {
    connectAuthEmulator(auth, "http://localhost:9099");
    console.log("Using Firebase Auth Emulator");
  }
  
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  
  // Create a fallback Firebase app and auth for development
  // This allows the app to function without throwing exceptions
  app = {} as FirebaseApp;
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: any) => {
      callback(null);
      return () => {}; // Return unsubscribe function
    }
  } as unknown as Auth;
  
  console.warn("Using fallback Firebase implementation. Authentication will not work.");
}

export { auth };
export default app;