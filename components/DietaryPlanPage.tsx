import React, { useState, useRef, useEffect } from 'react';
import Chatbot from './Chatbot';
import { ArrowLeftIcon, DietaryIcon, UploadIcon } from './icons';
import DailyTracker from './CoachPage'; // Re-using CoachPage for the DailyTracker component
import type { Meal } from '../types';

interface DietaryPlanPageProps {
    sport: string;
    onGoBack: () => void;
}

interface UserInfo {
    height: string;
    weight: string;
    imageData?: { mimeType: string; data: string };
}

const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result as string;
            const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
            resolve({ mimeType: file.type, data: base64Data });
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};

const DietaryPlanPage: React.FC<DietaryPlanPageProps> = ({ sport, onGoBack }) => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [meals, setMeals] = useState<Meal[]>([]);

    useEffect(() => {
        if (!file) {
          setPreviewUrl(null);
          return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);
    
    const handlePlanReceived = (plan: { breakfast: string; lunch: string; dinner: string; }) => {
        const newMeals: Meal[] = [
            { name: 'Breakfast', description: plan.breakfast, completed: false },
            { name: 'Lunch', description: plan.lunch, completed: false },
            { name: 'Dinner', description: plan.dinner, completed: false },
        ];
        setMeals(newMeals);
    };

    const handleToggleMeal = (index: number) => {
        setMeals(prev => 
            prev.map((meal, i) => 
                i === index ? { ...meal, completed: !meal.completed } : meal
            )
        );
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (height && weight) {
            let imageData;
            if (file) {
                imageData = await fileToBase64(file);
            }
            setUserInfo({ height, weight, imageData });
        }
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
                    Dietary Plan
                </h1>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800">
                        <h2 className="text-2xl font-semibold text-white mb-4">Your Details</h2>
                        {!userInfo ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <p className="text-gray-400">Enter your details so Coach Nova can create a tailored plan for you.</p>
                                <div>
                                    <label htmlFor="height" className="block text-sm font-medium text-gray-300">Height (cm)</label>
                                    <input
                                        type="number"
                                        id="height"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        placeholder="e.g., 180"
                                        className="mt-1 block w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#C8F560]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="weight" className="block text-sm font-medium text-gray-300">Weight (kg)</label>
                                    <input
                                        type="number"
                                        id="weight"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        placeholder="e.g., 75"
                                        className="mt-1 block w-full bg-gray-900 border border-gray-800 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-[#C8F560]"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300">Body Image (Optional)</label>
                                    <div 
                                        className="mt-1 w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-black/50 cursor-pointer hover:border-[#C8F560] hover:bg-gray-900 transition-colors"
                                        onClick={triggerFileInput}
                                    >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Body preview" className="max-h-full max-w-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <UploadIcon className="mx-auto h-10 w-10" />
                                            <p className="mt-2 text-sm">Click to upload an image</p>
                                            <p className="text-xs">For a more accurate analysis</p>
                                        </div>
                                    )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                <button type="submit" className="w-full bg-[#C8F560] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#b0d954] transition-colors">
                                    Save & Start Chat
                                </button>
                            </form>
                        ) : (
                            <div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                        <span className="font-medium text-gray-300">Height:</span>
                                        <span className="font-semibold text-white">{userInfo.height} cm</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                                        <span className="font-medium text-gray-300">Weight:</span>
                                        <span className="font-semibold text-white">{userInfo.weight} kg</span>
                                    </div>
                                    {previewUrl && (
                                        <div>
                                            <span className="block text-sm font-medium text-gray-300 mb-2">Submitted Image:</span>
                                            <img src={previewUrl} alt="Body preview" className="w-full max-h-48 object-contain rounded-lg bg-black/50" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-400 mt-6 text-center bg-gray-900/30 p-3 rounded-lg">
                                    Your details are saved. Ask Coach Nova for your meal plan!
                                </p>
                            </div>
                        )}
                    </div>
                    {userInfo && (
                        meals.length > 0 ? (
                            <DailyTracker
                                title="Today's Meal Plan"
                                icon={<DietaryIcon className="w-8 h-8 text-[#C8F560]" />}
                                items={meals.map(meal => ({ title: meal.name, detail: meal.description, completed: meal.completed }))}
                                onToggleItem={handleToggleMeal}
                            />
                        ) : (
                             <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 text-center text-gray-400 flex flex-col items-center justify-center min-h-[150px]">
                                <DietaryIcon className="w-12 h-12 text-[#C8F560]/50 mb-4"/>
                                <p className="font-semibold text-white">Your Meal Plan Will Appear Here</p>
                                <p className="text-sm">Just ask Coach Nova in the chat.</p>
                            </div>
                        )
                    )}
                </div>
                <div className="bg-[#121212] p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Chat with Coach Nova</h2>
                    {userInfo ? (
                        <Chatbot 
                            moduleConfig={{
                                module: 'Dietary Plan',
                                sport: sport,
                                context: userInfo,
                            }}
                            onPlanReceived={handlePlanReceived}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-center text-gray-400">
                            <p>Please enter your details on the left to activate the nutrition chat.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DietaryPlanPage;