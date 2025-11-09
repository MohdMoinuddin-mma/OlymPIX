import React, { useState } from 'react';
import Chatbot from './Chatbot';
import { ArrowLeftIcon, InjuryRecoveryIcon } from './icons';

interface InjuryRecoveryPlanPageProps {
    sport: string;
    onGoBack: () => void;
}

const bodyParts = ['Shoulder', 'Elbow', 'Knee', 'Ankle', 'Back', 'Wrist', 'Neck'];

const InjuryRecoveryPlanPage: React.FC<InjuryRecoveryPlanPageProps> = ({ sport, onGoBack }) => {
    const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);

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
                <h1 className="text-3xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#FF0055] to-orange-400">
                    Injury Recovery Plan
                </h1>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800">
                     <h2 className="text-2xl font-semibold text-white mb-4">Select Area of Concern</h2>
                     {!selectedBodyPart ? (
                        <>
                            <p className="text-gray-400 mb-6">Choose the area you'd like to focus on for recovery. This will help Coach Nova provide safe and relevant exercises.</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {bodyParts.map(part => (
                                    <button 
                                        key={part} 
                                        onClick={() => setSelectedBodyPart(part)}
                                        className="p-4 rounded-lg text-center font-semibold text-white bg-gray-900 hover:bg-[#FF0055]/20 transition-colors border border-gray-800"
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full">
                            <InjuryRecoveryIcon className="w-24 h-24 text-[#FF0055]"/>
                            <h3 className="text-2xl font-semibold text-white mt-4">Focusing on: {selectedBodyPart}</h3>
                            <p className="text-gray-400 mt-2">
                                Great, let's work on your recovery. Chat with Coach Nova to get your gentle exercise plan for today.
                            </p>
                            <button onClick={() => setSelectedBodyPart(null)} className="mt-6 text-sm text-[#00E0FF] hover:underline">
                                Select a different area
                            </button>
                        </div>
                     )}
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Chat with Coach Nova</h2>
                    {selectedBodyPart ? (
                        <Chatbot 
                            moduleConfig={{
                                module: 'Injury Recovery Plan',
                                sport: sport,
                                context: { bodyPart: selectedBodyPart },
                            }} 
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-center text-gray-400">
                            <p>Please select an area of concern on the left to activate the recovery chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InjuryRecoveryPlanPage;