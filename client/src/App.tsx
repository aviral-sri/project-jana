import { useState, useEffect } from 'react';
import { useAuth } from './lib/hooks';
import AuthScreen from './components/AuthScreen';
import Home from './pages/Home';
import { Toaster } from "@/components/ui/toaster";

function App() {
  const { user, loading, login, logout } = useAuth();
  const [showAuthScreen, setShowAuthScreen] = useState(true);
  
  useEffect(() => {
    if (user) {
      setShowAuthScreen(false);
    } else {
      setShowAuthScreen(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-primary font-accent">Loading Project Jana...</div>
      </div>
    );
  }

  return (
    <div id="app" className="min-h-screen flex flex-col">
      {showAuthScreen ? (
        <AuthScreen onLogin={login} />
      ) : (
        <Home user={user} onLogout={logout} />
      )}
      <Toaster />
    </div>
  );
}

export default App;
