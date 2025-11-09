import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { ArrowLeftIcon, ExerciseIcon } from './icons';
import DailyTracker from './CoachPage'; // Re-using CoachPage for the DailyTracker component
import type { Exercise } from '../types';

interface ExercisePlanPageProps {
    sport: string;
    onGoBack: () => void;
}

const ExercisePlanPage: React.FC<ExercisePlanPageProps> = ({ sport, onGoBack }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);

    const handlePlanReceived = (plan: Omit<Exercise, 'completed'>[]) => {
        const newExercises = plan.map(ex => ({ ...ex, completed: false }));
        setExercises(newExercises);
    };

    const handleToggleExercise = (index: number) => {
        setExercises(prev => 
            prev.map((ex, i) => 
                i === index ? { ...ex, completed: !ex.completed } : ex
            )
        );
    };

    return (
        <div>
            <header className="mb-8 md:mb-12">
                <button 
                    onClick={onGoBack} 
                    className="flex items-center gap-2 text-gray-400 hover:text-[#00E0FF] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to {sport} Dashboard
                </button>
                <h1 className="text-3xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#C8F560] to-[#00E0FF]">
                    Exercise Plan
                </h1>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col items-center justify-center text-center">
                        <ExerciseIcon className="w-24 h-24 text-[#C8F560]"/>
                        <h2 className="text-2xl font-semibold text-white mt-4">Your Daily Workout Hub</h2>
                        <p className="text-gray-400 mt-2 max-w-sm">
                            Chat with Coach Nova to get your personalized daily exercise plan for {sport}. Your plan for today will appear below.
                        </p>
                    </div>
                    {exercises.length > 0 && (
                         <DailyTracker
                            title="Today's Workout"
                            icon={<ExerciseIcon className="w-8 h-8 text-[#C8F560]" />}
                            items={exercises.map(ex => ({ title: ex.name, detail: ex.detail, completed: ex.completed }))}
                            onToggleItem={handleToggleExercise}
                        />
                    )}
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Chat with Coach Nova</h2>
                    <Chatbot 
                        moduleConfig={{
                            module: 'Exercise Plan',
                            sport: sport,
                        }}
                        onPlanReceived={handlePlanReceived}
                    />
                </div>
            </div>
        </div>
    );
};

export default ExercisePlanPage;