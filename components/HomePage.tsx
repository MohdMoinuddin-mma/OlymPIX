import React from 'react';
import { LogoIcon } from './icons';

interface HomePageProps {
    userName: string | null;
    onSelectSport: (sportName: string) => void;
    onLogout: () => void;
}

const sports = [
  { name: 'Gymnastics', imageUrl: 'https://plus.unsplash.com/premium_photo-1664304743600-f8f4a7d5fefd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735' },
  { name: 'Weightlifting', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop&grayscale=1' },
  { name: 'Archery', imageUrl: 'https://plus.unsplash.com/premium_photo-1664304726300-3aaee5c13cfb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074' },
  { name: 'Swimming', imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=800&auto=format&fit=crop&grayscale=1' },
  { name: 'Boxing', imageUrl: 'https://images.unsplash.com/flagged/photo-1574005280900-3ff489fa1f70?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Karate', imageUrl: 'https://plus.unsplash.com/premium_photo-1667941272772-70243b7b4f63?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170'},
  { name: 'Tennis', imageUrl: 'https://plus.unsplash.com/premium_photo-1666913667082-c1fecc45275d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Cycling', imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=800&auto=format&fit=crop&grayscale=1' },
  { name: 'Golf', imageUrl: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop&grayscale=1' },
  { name: 'Skiing', imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=800&auto=format&fit=crop&grayscale=1' },
  { name: 'Skateboarding', imageUrl: 'https://plus.unsplash.com/premium_photo-1683993551934-9368a6a84985?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
  { name: 'Judo', imageUrl: 'https://plus.unsplash.com/premium_photo-1664304810860-e52bc04796e1?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1014' },
  { name: 'Taekwondo', imageUrl: 'https://images.unsplash.com/photo-1514050566906-8d077bae7046?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1173' },
  { name: 'Fencing', imageUrl: 'https://plus.unsplash.com/premium_photo-1664304787831-91d68314450c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074' },
  { name: 'Windsurfing', imageUrl: 'https://plus.unsplash.com/premium_photo-1661955507143-a5755fdebbce?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170' },
];

const HomePage: React.FC<HomePageProps> = ({ userName, onSelectSport, onLogout }) => {
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-center">
                 {userName && <h2 className="text-white text-xl font-semibold">Welcome, {userName}!</h2>}
                 <div className="flex-grow"></div>
                 <button
                    onClick={onLogout}
                    className="px-4 py-2 text-sm font-semibold bg-transparent border-2 border-[#00E0FF] text-[#00E0FF] rounded-lg hover:bg-[#00E0FF] hover:text-black transition-all duration-300"
                    style={{boxShadow: '0 0 8px rgba(0, 224, 255, 0.5)'}}
                >
                    Logout
                </button>
            </div>

            <header className="text-center mb-8 md:mb-12 pt-24 flex flex-col items-center">
                <LogoIcon className="w-20 h-20 text-white mb-2" />
                <h1 className="text-5xl md:text-6xl font-bold text-white tracking-[0.2em] uppercase">
                    OlympiX
                </h1>
                <p className="mt-3 text-lg text-gray-400">
                    Your Personal AI Sports Coach
                </p>
            </header>

            <div className="max-w-4xl mx-auto">
                 <h2 className="text-2xl font-semibold mb-2 text-center text-white">Select a Sport</h2>
                 <p className="text-center text-gray-500 mb-6">
                    Get instant expert feedback on your form and technique.
                 </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
                    {sports.map((sport) => (
                    <button
                        key={sport.name}
                        onClick={() => onSelectSport(sport.name)}
                        className="aspect-[3/4] rounded-2xl text-center transition-all duration-300 border-2 bg-gray-900 border-gray-800 text-white hover:border-[#C8F560] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#C8F560]/50 relative overflow-hidden group"
                        style={{'--glow-color': '#C8F560'} as React.CSSProperties}
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                            style={{ backgroundImage: `url('${sport.imageUrl}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <span className="absolute bottom-4 left-0 right-0 text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--glow-color)]" style={{textShadow: '0 0 10px var(--glow-color)'}}>{sport.name}</span>
                    </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;