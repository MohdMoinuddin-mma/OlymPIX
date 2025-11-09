import React, { useState } from 'react';
import UploadAndFeedback from './UploadAndFeedback';
import Chatbot from './Chatbot';
import type { AnalysisResult } from '../types';
import { ArrowLeftIcon } from './icons';

interface PerformanceAnalysisPageProps {
    sport: string;
    onGoBack: () => void;
}

const PerformanceAnalysisPage: React.FC<PerformanceAnalysisPageProps> = ({ sport, onGoBack }) => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

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
                <h1 className="text-3xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#00E0FF] to-[#C8F560]">
                    Performance Analysis
                </h1>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Upload to Analyze</h2>
                    <UploadAndFeedback 
                        onAnalysisComplete={(result) => setAnalysisResult(result)} 
                        selectedSport={sport}
                    />
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Chat with Coach Nova</h2>
                    <Chatbot 
                        moduleConfig={{
                            module: 'Performance Analysis',
                            sport: sport,
                            context: analysisResult ? `Category: ${analysisResult.category}\nScore: ${analysisResult.score}\nFeedback: ${analysisResult.feedback}\nImprovement Tip: ${analysisResult.improvementTip}` : undefined,
                        }} 
                    />
                </div>
            </div>
        </div>
    );
}

export default PerformanceAnalysisPage;