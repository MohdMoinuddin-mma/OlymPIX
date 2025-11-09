import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SportDashboardPage from './components/SportDashboardPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDetailsPage from './components/UserDetailsPage';

type Page = 'landing' | 'login' | 'register' | 'userDetails' | 'app';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const navigate = (newPage: Page) => {
    setIsFadingOut(true);
    setTimeout(() => {
      setPage(newPage);
      setIsFadingOut(false);
    }, 300);
  };
  
  const handleLoginSuccess = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    navigate('app');
  };

  const handleRegisterSuccess = () => {
    navigate('userDetails');
  };

  const handleUserDetailsFinish = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
    navigate('app');
  };

  const handleLogout = () => {
    setIsFadingOut(true);
    setTimeout(() => {
        setIsAuthenticated(false);
        setUserName(null);
        setSelectedSport(null);
        setPage('landing');
        setIsFadingOut(false);
    }, 300);
  };

  const handleSelectSport = (sportName: string) => {
    setSelectedSport(sportName);
  };

  const handleGoHome = () => {
    setSelectedSport(null);
  };

  const renderAppContent = () => {
    if (selectedSport) {
      return <SportDashboardPage sport={selectedSport} onGoBack={handleGoHome} userName={userName} />;
    }
    return <HomePage userName={userName} onSelectSport={handleSelectSport} onLogout={handleLogout} />;
  };

  const renderPage = () => {
    if (isAuthenticated) {
        return renderAppContent();
    }
    switch (page) {
        case 'login':
            return <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => navigate('landing')} />;
        case 'register':
            return <RegisterPage onRegisterSuccess={handleRegisterSuccess} onBack={() => navigate('landing')} />;
        case 'userDetails':
            return <UserDetailsPage onFinish={handleUserDetailsFinish} />;
        case 'landing':
        default:
            return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] to-[#121212] text-white font-sans overflow-x-hidden">
      <div 
        style={{'--image-url': `url('https://images.unsplash.com/photo-1517836357463-d257699373c3?q=80&w=2070&auto=format&fit=crop')`} as React.CSSProperties}
        className="absolute inset-0 bg-[image:var(--image-url)] bg-cover bg-center opacity-10"
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <main className="container mx-auto p-4 md:p-8 relative z-10">
        <div className={`transition-opacity duration-300 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            {renderPage()}
        </div>
      </main>
      <footer className="text-center mt-8 pb-8 text-gray-500 relative z-10">
        <p>© 2024 OLYMPIX. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;