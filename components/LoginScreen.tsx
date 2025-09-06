
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (email: string | null) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen w-full bg-theme-bg bg-cover bg-center text-theme-text-primary font-sans flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-theme-glass border border-theme-border rounded-2xl shadow-2xl p-8 text-center animate-zoomIn">
        <div className="mx-auto mb-8 flex flex-col items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-theme-accent"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"/></svg>
          <h1 className="text-3xl font-bold text-theme-text-primary">Welcome to Nebula</h1>
          <p className="text-theme-text-secondary">Your academic life, organized.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full bg-black/20 border border-theme-border rounded-lg p-3 text-theme-text-primary focus:ring-2 focus:ring-theme-primary transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-black/20 border border-theme-border rounded-lg p-3 text-theme-text-primary focus:ring-2 focus:ring-theme-primary transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-theme-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Login or Sign Up
          </button>
        </form>
        
        <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-theme-border"></div>
            <span className="flex-shrink mx-4 text-xs text-theme-text-secondary">OR</span>
            <div className="flex-grow border-t border-theme-border"></div>
        </div>
        
        <button 
            onClick={() => onLogin(null)}
            className="w-full py-3 px-4 bg-black/20 text-theme-text-primary font-semibold rounded-lg hover:bg-black/40 transition-colors"
          >
            Continue as Guest
        </button>

        <div className="mt-6 text-xs text-theme-text-secondary">
          <p>Login to save your data on this device.</p>
           <p className="mt-1">Guest data is not saved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;