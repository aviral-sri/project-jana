import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createHeart } from '../lib/utils';
import { LoginForm } from '../lib/types';

interface AuthScreenProps {
  onLogin: (username: string, password: string) => Promise<any>;
  onGoogleLogin?: () => Promise<any>;
}

const AuthScreen = ({ onLogin, onGoogleLogin }: AuthScreenProps) => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    username: '',
    password: ''
  });
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize hearts effect
  useEffect(() => {
    const heartsContainer = document.getElementById('hearts-container');
    if (!heartsContainer) return;
    
    const intervalId = setInterval(() => {
      createHeart(heartsContainer);
    }, 300);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      await onLogin(loginForm.username, loginForm.password);
      // Login successful, parent component will handle redirect
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid username or password');
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    if (!onGoogleLogin) {
      toast({
        title: "Google Login Not Available",
        description: "Google sign-in is not configured for this application.",
        variant: "destructive"
      });
      return;
    }
    
    setLoginError(null);
    setIsLoading(true);
    
    try {
      await onGoogleLogin();
      // Login successful, parent component will handle redirect
    } catch (error) {
      console.error('Google login error:', error);
      setLoginError('Failed to login with Google');
      toast({
        title: "Google Login Failed",
        description: "We couldn't sign you in with Google. Please try again or use username/password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="auth-screen" className="fixed inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 flex flex-col items-center justify-center z-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <h1 className="font-accent text-4xl md:text-5xl text-primary mb-6">Project Jana</h1>
          <p className="text-neutral-dark mb-8 font-body">Enter the password to continue to our special place</p>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-left mb-1">Username</label>
              <input 
                type="text" 
                id="username" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Username"
                value={loginForm.username}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-left mb-1">Password</label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleInputChange}
                disabled={isLoading}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Enter Our Space'}
            </button>
          </form>
          
          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>
          
          {loginError && (
            <div id="login-error" className="mt-4 text-error">
              <p>{loginError}</p>
            </div>
          )}
          
          <div className="mt-8 text-sm text-gray-500">
            <p>"Two souls with but a single thought, two hearts that beat as one."</p>
          </div>
        </div>
      </div>
      
      {/* Floating hearts animation */}
      <div id="hearts-container" className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Heart elements will be dynamically added via JS */}
      </div>
    </div>
  );
};

export default AuthScreen;
