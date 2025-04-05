import React, { ReactNode } from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/utils/auth';
import LoadingSpinner from './LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Use the enhanced auth context which provides fallback values if context is unavailable
  const { isAuthenticated, loading, authError } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-neutral-600">Loading your account...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show auth error if present
    if (authError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go to Login
          </button>
        </div>
      );
    }
    
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;