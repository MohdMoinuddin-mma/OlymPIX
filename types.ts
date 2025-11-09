export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface AnalysisResult {
  category: string;
  score: string;
  feedback: string;
  improvementTip: string;
}

export type ModuleType = 'Performance Analysis' | 'Exercise Plan' | 'Dietary Plan' | 'Injury Recovery Plan';
export type ModuleTab = 'Unified Dashboard' | ModuleType;
export type CoachPersona = 'Strict Trainer' | 'Friendly Mentor' | 'Olympic Pro' | 'Chill Buddy';

export interface Exercise {
  name: string;
  detail: string; // e.g., "3 sets of 10 reps" or "30 seconds"
  completed: boolean;
}

export interface Meal {
    name: 'Breakfast' | 'Lunch' | 'Dinner';
    description: string;
    completed: boolean;
}