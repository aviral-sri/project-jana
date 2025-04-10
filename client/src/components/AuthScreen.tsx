import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { createHeart } from '../lib/utils';

interface AuthScreenProps {
  onLogin: (passkey: string) => Promise<any>;
}

const AuthScreen = ({ onLogin }: AuthScreenProps) => {
  const [passkey, setPasskey] = useState('');
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
    setPasskey(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    try {
      await onLogin(passkey);
      // Login successful, parent component will handle redirect
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Invalid passkey');
      toast({
        title: "Access Denied",
        description: "Please enter the correct passkey to enter our special place.",
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
          <p className="text-neutral-dark mb-8 font-body">Enter the passkey to continue to our special place</p>
          
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="passkey" className="block text-sm font-medium text-left mb-1">Passkey</label>
              <input 
                type="password" 
                id="passkey" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="Enter our special passkey"
                value={passkey}
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
              {isLoading ? 'Unlocking...' : 'Enter Our Space'}
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
    </div>
  );
};

export default AuthScreen;
