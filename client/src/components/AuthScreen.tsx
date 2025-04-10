import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createHeart } from '../lib/utils';
import { LoginForm } from '../lib/types';
import { signInWithGoogle } from '../lib/firebase';

interface AuthScreenProps {
  onLogin: (username: string, password: string) => Promise<any>;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
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
    setLoginError(null);
    setIsLoading(true);
    
    try {
      const result = await signInWithGoogle();
      // Pass the user to the main app
      if (result.user) {
        // We need to adapt the response to work with our existing onLogin handler
        // which expects username and password
        await onLogin(result.user.username, 'google-auth');
      }
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

      <style jsx>{`
        .heart {
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #FF6B6B;
          transform: rotate(45deg);
          animation: heartfloat 4s ease-in-out infinite;
        }
        .heart:before, .heart:after {
          content: "";
          position: absolute;
          width: 20px;
          height: 20px;
          background-color: #FF6B6B;
          border-radius: 50%;
        }
        .heart:before {
          top: -10px;
          left: 0;
        }
        .heart:after {
          top: 0;
          left: -10px;
        }
        @keyframes heartfloat {
          0%, 100% {
            transform: rotate(45deg) translateY(0);
            opacity: 1;
          }
          50% {
            transform: rotate(45deg) translateY(-20px);
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthScreen;
