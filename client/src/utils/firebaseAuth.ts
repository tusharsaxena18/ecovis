import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  UserCredential,
  User as FirebaseUser,
  Auth,
  AuthError,
  AuthErrorCodes
} from "firebase/auth";
import { auth as firebaseAuth } from "./firebase";

// Ensure we have a properly typed auth instance
const auth: Auth = firebaseAuth;

// Import the User type directly - avoid importing from auth.tsx to prevent circular dependencies
type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  location?: string;
  ecoScore: number;
  createdAt: Date;
};

// Set up Google Auth Provider
const googleProvider = new GoogleAuthProvider();
// Add scopes for additional permissions
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Helper function to handle auth errors and provide user-friendly messages
const handleAuthError = (error: unknown): Error => {
  console.error("Firebase auth error:", error);
  
  if (error && typeof error === 'object' && 'code' in error) {
    const authError = error as AuthError;
    
    switch(authError.code) {
      case AuthErrorCodes.USER_DELETED:
        return new Error("No account found with this email. Please register first.");
      case AuthErrorCodes.INVALID_PASSWORD:
        return new Error("Incorrect password. Please try again.");
      case AuthErrorCodes.EMAIL_EXISTS:
        return new Error("This email is already in use. Try logging in instead.");
      case AuthErrorCodes.POPUP_CLOSED_BY_USER:
        return new Error("Authentication cancelled. Please try again.");
      case AuthErrorCodes.INVALID_EMAIL:
        return new Error("The email address is invalid.");
      case AuthErrorCodes.OPERATION_NOT_ALLOWED:
        return new Error("This authentication method is not enabled. Please contact support.");
      case AuthErrorCodes.NETWORK_REQUEST_FAILED:
        return new Error("Network error. Please check your connection and try again.");
      default:
        return new Error(`Authentication failed: ${authError.message}`);
    }
  }
  
  return new Error("Authentication failed. Please try again later.");
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign in with email/password
export const signInWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Register with email/password
export const registerWithEmail = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // If displayName is provided, update the user profile
    if (displayName && userCredential.user) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    return userCredential;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    return await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

// Convert Firebase user to app user
export const firebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  // Create a deterministic numeric ID from Firebase UID
  // This creates a consistent mapping from Firebase UID to our numeric ID system
  const uidNum = parseInt(firebaseUser.uid.replace(/[^0-9]/g, '').substring(0, 6) || "123456", 10);
  
  return {
    id: uidNum % 1000000, // Ensure ID is within a reasonable range
    username: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'user',
    email: firebaseUser.email || '',
    fullName: firebaseUser.displayName || undefined,
    ecoScore: 0, // Default score, would be fetched from backend in a real app
    createdAt: new Date(),
    location: undefined
  };
};