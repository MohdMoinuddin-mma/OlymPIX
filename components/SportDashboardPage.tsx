import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon, DashboardIcon, AnalysisIcon, ExerciseIcon, DietaryIcon, InjuryRecoveryIcon, SettingsIcon,
    StrictTrainerIcon, FriendlyMentorIcon, OlympicProIcon, ChillBuddyIcon, CheckCircleIcon, TrendUpIcon, FireIcon,
    BrainIcon, MoonIcon, ChatBubbleIcon
} from './icons';
import type { ModuleTab, CoachPersona } from '../types';
import PerformanceAnalysisPage from './PerformanceAnalysisPage';
import ExercisePlanPage from './ExercisePlanPage';
import DietaryPlanPage from './DietaryPlanPage';
import InjuryRecoveryPlanPage from './InjuryRecoveryPlanPage';
import Chatbot from './Chatbot';

interface SportDashboardPageProps {
    sport: string;
    userName: string | null;
    onGoBack: () => void;
}

const TABS: ModuleTab[] = ['Unified Dashboard', 'Performance Analysis', 'Exercise Plan', 'Dietary Plan', 'Injury Recovery Plan'];
const PERSONAS: { name: CoachPersona, icon: React.FC<any>, description: string }[] = [
    { name: 'Friendly Mentor', icon: FriendlyMentorIcon, description: "Encouraging and understanding. Celebrates wins and helps you through setbacks." },
    { name: 'Strict Trainer', icon: StrictTrainerIcon, description: "No excuses. Direct, demanding, and results-focused. Pushes you to your limits." },
    { name: 'Olympic Pro', icon: OlympicProIcon, description: "Elite-level coaching. Data-driven, strategic, and focused on peak performance." },
    { name: 'Chill Buddy', icon: ChillBuddyIcon, description: "Laid-back and easy-going. Keeps fitness fun and stress-free." },
];

const OverallScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (score / 100) * circumference;
    const scoreColor = score >= 80 ? 'text-[#4ADE80]' : score >= 60 ? 'text-[#FCD34D]' : 'text-[#EF4444]';
    const ringColor = score >= 80 ? '#4ADE80' : score >= 60 ? '#FCD34D' : '#EF4444';

    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="absolute w-full h-full" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-in-out"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div className="text-center">
                <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-gray-400 text-lg">/100</span>
            </div>
        </div>
    );
};

const KpiCard: React.FC<{ title: string; value: string; trend?: string; icon: React.ReactNode; }> = ({ title, value, trend, icon }) => (
    <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2 text-gray-400">
            {icon}
            <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && <p className="text-xs text-green-400">{trend}</p>}
    </div>
);


const UnifiedDashboard: React.FC<{ sport: string, persona: CoachPersona }> = ({ sport, persona }) => {
    // Mock data for demonstration
    const [dashboardData, setDashboardData] = useState({
        overallScore: 0,
        performanceScore: 85,
        exerciseCompletion: 92,
        dietAdherence: 78,
        recoveryStatus: 95,
        streak: 15,
        sleep: 7.5,
        stress: 4,
    });

    useEffect(() => {
        const perf = 0.35 * dashboardData.performanceScore;
        const ex = 0.30 * dashboardData.exerciseCompletion;
        const diet = 0.20 * dashboardData.dietAdherence;
        const rec = 0.15 * dashboardData.recoveryStatus;
        const finalScore = Math.round(perf + ex + diet + rec);

        const timeout = setTimeout(() => setDashboardData(prev => ({ ...prev, overallScore: finalScore })), 500);
        return () => clearTimeout(timeout);
    }, [dashboardData.performanceScore, dashboardData.exerciseCompletion, dashboardData.dietAdherence, dashboardData.recoveryStatus]);


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-1 bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6 flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold mb-4">Overall Performance Score</h2>
                    <OverallScoreGauge score={dashboardData.overallScore} />
                    <p className="mt-4 text-center text-gray-300">An aggregate score based on all modules.</p>
                </div>
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <KpiCard title="Performance" value={`${dashboardData.performanceScore}/100`} icon={<AnalysisIcon className="w-4 h-4" />} trend="+5 this week" />
                    <KpiCard title="Exercise" value={`${dashboardData.exerciseCompletion}%`} icon={<ExerciseIcon className="w-4 h-4" />} trend="On track" />
                    <KpiCard title="Diet Plan" value={`${dashboardData.dietAdherence}%`} icon={<DietaryIcon className="w-4 h-4" />} trend="Needs work" />
                    <KpiCard title="Recovery" value={`${dashboardData.recoveryStatus}%`} icon={<InjuryRecoveryIcon className="w-4 h-4" />} trend="Excellent" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><BrainIcon className="w-6 h-6 text-[#C8F560]" /> AI Cross-Module Insights</h2>
                    <div className="space-y-4 text-gray-300">
                        <p className="p-3 bg-white/5 rounded-lg border-l-4 border-[#00E0FF]"><strong>Diet → Performance:</strong> Your performance score averages 12 points higher on days you hit 90%+ of your calorie target. Consistent nutrition fuels better results!</p>
                        <p className="p-3 bg-white/5 rounded-lg border-l-4 border-[#EF4444]"><strong>Exercise → Recovery:</strong> Your shoulder recovery is progressing slower than expected. You've missed 40% of rehab exercises this week. Consistency is key for recovery.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8">
                    <div className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6">
                         <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FireIcon className="w-6 h-6 text-orange-400" /> Current Streak</h2>
                         <div className="text-center">
                            <p className="text-5xl font-bold text-white">{dashboardData.streak} <span className="text-2xl">Days</span></p>
                            <p className="text-gray-400">Keep up the great work!</p>
                         </div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-6">
                         <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><MoonIcon className="w-6 h-6 text-sky-400" /> Sleep & Stress <span className="text-xs bg-sky-500/50 text-white px-2 py-0.5 rounded-full">Coming Soon</span></h2>
                         <div className="text-center text-gray-400">
                            <p>Manually track sleep and stress to get even smarter workout adjustments. Wearable integration coming soon!</p>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SportDashboardPage: React.FC<SportDashboardPageProps> = ({ sport, userName, onGoBack }) => {
    const [activeTab, setActiveTab] = useState<ModuleTab>('Unified Dashboard');
    const [selectedPersona, setSelectedPersona] = useState<CoachPersona>('Friendly Mentor');
    const [showPersonaSettings, setShowPersonaSettings] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Unified Dashboard':
                return <UnifiedDashboard sport={sport} persona={selectedPersona} />;
            case 'Performance Analysis':
                return <PerformanceAnalysisPage sport={sport} onGoBack={() => setActiveTab('Unified Dashboard')} />;
            case 'Exercise Plan':
                return <ExercisePlanPage sport={sport} onGoBack={() => setActiveTab('Unified Dashboard')} />;
            case 'Dietary Plan':
                return <DietaryPlanPage sport={sport} onGoBack={() => setActiveTab('Unified Dashboard')} />;
            case 'Injury Recovery Plan':
                return <InjuryRecoveryPlanPage sport={sport} onGoBack={() => setActiveTab('Unified Dashboard')} />;
            default:
                return null;
        }
    };
    
    const getTabIcon = (tabName: ModuleTab) => {
        switch(tabName) {
            case 'Unified Dashboard': return <DashboardIcon className="w-5 h-5" />;
            case 'Performance Analysis': return <AnalysisIcon className="w-5 h-5" />;
            case 'Exercise Plan': return <ExerciseIcon className="w-5 h-5" />;
            case 'Dietary Plan': return <DietaryIcon className="w-5 h-5" />;
            case 'Injury Recovery Plan': return <InjuryRecoveryIcon className="w-5 h-5" />;
        }
    };

    return (
        <div className="relative">
            <header className="mb-6 md:mb-8">
                 <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={onGoBack} 
                        className="flex items-center gap-2 text-gray-400 hover:text-[#00E0FF] transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Sports
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 hidden md:block">Welcome, {userName}!</span>
                         <button 
                            onClick={() => setShowPersonaSettings(true)}
                            className="flex items-center gap-2 text-gray-400 hover:text-[#C8F560] transition-colors"
                            aria-label="Change AI Coach Persona"
                        >
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#C8F560]">
                    {sport} Dashboard
                </h1>
            </header>

            <nav className="mb-8 flex justify-center">
                <div className="flex space-x-2 md:space-x-4 bg-black/30 border border-white/10 rounded-full p-2 backdrop-blur-sm">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center justify-center gap-2 px-3 py-2 md:px-5 md:py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                                activeTab === tab ? 'bg-[#C8F560] text-black' : 'text-gray-300 hover:bg-white/10'
                            }`}
                        >
                            {getTabIcon(tab)}
                            <span className="hidden md:inline">{tab}</span>
                        </button>
                    ))}
                </div>
            </nav>
            
            <div className="min-h-[500px]">
                {renderTabContent()}
            </div>

            {/* Persona Settings Modal */}
            {showPersonaSettings && (
                 <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 flex items-center justify-center" onClick={() => setShowPersonaSettings(false)}>
                    <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-[#C8F560]/50 rounded-2xl p-8 max-w-4xl w-full mx-4" onClick={e => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold text-center mb-2 text-[#C8F560]">Select AI Coach Persona</h2>
                        <p className="text-center text-gray-400 mb-6">Your coach's tone and advice style will adapt to your choice.</p>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           {PERSONAS.map(p => (
                                <button key={p.name} onClick={() => { setSelectedPersona(p.name); setShowPersonaSettings(false); }}
                                    className={`p-4 rounded-xl text-center border-2 transition-all duration-300 ${selectedPersona === p.name ? 'border-[#C8F560] bg-[#C8F560]/10 scale-105' : 'border-gray-800 bg-white/5 hover:border-gray-600'}`}>
                                    <p.icon className={`w-10 h-10 mx-auto mb-3 ${selectedPersona === p.name ? 'text-[#C8F560]' : 'text-white'}`} />
                                    <h3 className="font-semibold text-white">{p.name}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{p.description}</p>
                                    {selectedPersona === p.name && <CheckCircleIcon className="w-6 h-6 text-[#C8F560] absolute -top-2 -right-2 bg-[#121212] rounded-full"/>}
                                </button>
                           ))}
                        </div>
                    </div>
                 </div>
            )}
            
            {/* Floating Chatbot */}
            <div className="fixed bottom-8 right-8 z-30">
                {isChatOpen && (
                    <div className="w-[350px] h-[500px] mb-4">
                         <Chatbot moduleConfig={{ module: 'Unified Dashboard', sport: sport, persona: selectedPersona, context: { mockData: true } }} />
                    </div>
                )}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="w-16 h-16 bg-gradient-to-br from-[#00E0FF] to-[#C8F560] rounded-full text-black shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Toggle AI Coach Chat"
                >
                    <ChatBubbleIcon className="w-8 h-8"/>
                </button>
            </div>
        </div>
    );
};

export default SportDashboardPage;