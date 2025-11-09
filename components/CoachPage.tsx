import React from 'react';
import { CheckCircleIcon, RadioIcon } from './icons';

interface TrackableItem {
    title: string;
    detail: string;
    completed: boolean;
}

interface DailyTrackerProps {
    title: string;
    icon: React.ReactNode;
    items: TrackableItem[];
    onToggleItem: (index: number) => void;
}

const DailyTracker: React.FC<DailyTrackerProps> = ({ title, icon, items, onToggleItem }) => {
    const completedCount = items.filter(item => item.completed).length;
    const totalCount = items.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    if (items.length === 0) {
        return null; // Don't render if there are no items
    }

    return (
        <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
                {icon}
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-gray-300">Daily Progress</span>
                    <span className="font-semibold text-white">{completedCount} / {totalCount}</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-[#C8F560] to-[#00E0FF] h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {/* Items List */}
            <ul className="space-y-3">
                {items.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={() => onToggleItem(index)}
                            className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all border text-left ${
                                item.completed
                                    ? 'bg-[#C8F560]/10 border-[#C8F560]/50'
                                    : 'bg-gray-900/50 hover:bg-gray-900 border-gray-800'
                            }`}
                        >
                            <div className="flex-shrink-0">
                                {item.completed ? (
                                    <CheckCircleIcon className="w-6 h-6 text-[#C8F560]" />
                                ) : (
                                    <RadioIcon className="w-6 h-6 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <p className={`font-semibold ${item.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                                    {item.title}
                                </p>
                                <p className="text-sm text-gray-400">{item.detail}</p>
                            </div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DailyTracker;