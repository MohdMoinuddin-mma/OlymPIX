import React from 'react';
import { LogoIcon } from './icons';
import { PrimaryButton } from './AuthComponents';

interface LandingPageProps {
  onNavigate: (page: 'login' | 'register') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
      <header className="flex flex-col items-center">
        <LogoIcon className="w-24 h-24 text-white mb-2 animate-pulse" style={{filter: 'drop-shadow(0 0 10px #C8F560)'}}/>
        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-[0.2em] uppercase" style={{textShadow: '0 0 15px rgba(255,255,255,0.5)'}}>
            OlympiX
        </h1>
        <p className="mt-4 text-xl text-gray-300">
            Your Personal AI Sports Coach
        </p>
      </header>
      
      <div className="mt-16 w-full max-w-sm space-y-4">
          <PrimaryButton onClick={() => onNavigate('login')}>
            Login
          </PrimaryButton>
          <PrimaryButton onClick={() => onNavigate('register')}>
            Register
          </PrimaryButton>
      </div>
    </div>
  );
};

export default LandingPage;