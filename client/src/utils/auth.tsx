import { createContext, useContext, ReactNode } from 'react';

// Define User type for the app
export type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  location?: string;
  ecoScore: number;
  createdAt: Date;
};

// Default guest user
const guestUser: User = {
  id: 1,
  username: 'guest',
  email: 'guest@example.com',
  fullName: 'Guest User',
  location: 'Earth',
  ecoScore: 50,
  createdAt: new Date()
};

// Define a simplified auth context type without actual authentication
type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  authError: string | null;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: true,
  user: guestUser,
  loading: false,
  authError: null
});

// Simplified auth provider that always provides the guest user
export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: true,
      user: guestUser,
      loading: false,
      authError: null
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access the guest user
export const useAuth = () => {
  return useContext(AuthContext);
};
