import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [locationField, setLocationField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Use the enhanced auth context which provides fallback values if context is unavailable
  const { login, loginWithGoogle, register, isAuthenticated, loading: authLoading, authError: contextAuthError } = useAuth();
  
  // Update our local auth error state if we get an error from the context
  useEffect(() => {
    if (contextAuthError && contextAuthError !== authError) {
      setAuthError(contextAuthError);
    }
  }, [contextAuthError, authError]);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setLocation('/');
    }
  }, [isAuthenticated, authLoading, setLocation]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        // Using email for login now that we're using Firebase
        await login(email, password);
        toast({
          title: "Login successful",
          description: "Welcome back to EcoVis!",
        });
      } else {
        await register({
          username,
          password,
          email,
          fullName: fullName || undefined,
          location: locationField || undefined,
        });
        toast({
          title: "Registration successful",
          description: "Welcome to EcoVis!",
        });
      }
      
      setLocation('/');
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle Firebase specific error messages
      let errorMessage = "An error occurred during authentication";
      
      if (error.code) {
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            errorMessage = "Invalid email or password";
            break;
          case 'auth/email-already-in-use':
            errorMessage = "Email already in use";
            break;
          case 'auth/weak-password':
            errorMessage = "Password is too weak";
            break;
          case 'auth/invalid-email':
            errorMessage = "Invalid email format";
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      toast({
        title: isLogin ? "Login failed" : "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      toast({
        title: "Google Sign-in successful",
        description: "Welcome to EcoVis!",
      });
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: "Google Sign-in failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset fields
    setUsername('');
    setPassword('');
    setEmail('');
    setFullName('');
    setLocationField('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-neutral-600">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10a7 7 0 0114 0v4a7 7 0 01-14 0v-4z" />
            </svg>
          </div>
          <h1 className="font-heading text-3xl font-bold text-neutral-800">EcoVis</h1>
          <p className="mt-2 text-neutral-600">Manage waste smartly. Save the planet.</p>
        </div>
        
        {authError && (
          <div className="mb-4 p-3 text-sm rounded bg-red-100 text-red-800 border border-red-200">
            <p>{authError}</p>
            <p className="mt-1 font-medium">Please refresh the page or try again later.</p>
          </div>
        )}
        
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                    className="mt-1"
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400" />
                    )}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="fullName">Full Name (Optional)</Label>
                    <Input 
                      id="fullName" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input 
                      id="location" 
                      value={locationField}
                      onChange={(e) => setLocationField(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
              
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember-me" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                      Forgot password?
                    </a>
                  </div>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  isLogin ? "Sign in with Email" : "Sign up with Email"
                )}
              </Button>
              
              {isLogin && (
                <>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                    </svg>
                    Sign in with Google
                  </Button>
                </>
              )}
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
