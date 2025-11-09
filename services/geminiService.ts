import { GoogleGenAI, Chat, Part, Type } from '@google/genai';
import { ModuleType, CoachPersona } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ChatConfig {
    module: ModuleType | 'General' | 'Unified Dashboard';
    sport: string;
    persona?: CoachPersona;
    context?: any;
}

// Helper function to convert a File object to a base64 string for the API
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
        resolve(base64Data);
      };
      reader.onerror = (err) => {
        reject(err);
      }
      reader.readAsDataURL(file);
    });
    return {
      inlineData: {
        mimeType: file.type,
        data: await base64EncodedDataPromise,
      },
    };
  };

export const getMediaFeedback = async (file: File, sport: string): Promise<string> => {
  try {
    const isVideo = file.type.startsWith('video/');

    const videoFeedbackInstruction = isVideo 
      ? "For videos, provide specific, timestamped feedback. List each piece of feedback as a bullet point in the 'Feedback' section, like '- [MM:SS] - [Your feedback for this moment]'." 
      : "For images, the feedback should be a concise paragraph.";

    const prompt = `You are an advanced AI sports coach capable of analyzing human motion from videos or images across multiple sports.

Your task:
1. The user has selected the sport: "${sport}".
2. Analyze the athlete's form, technique, and body alignment from the uploaded media for this sport.
3. Provide:
   - A score from 0–100 evaluating their overall form.
   - Personalized feedback (2–3 sentences) on what they did well and what to improve. ${videoFeedbackInstruction}
   - A short improvement tip or micro plan (1 line).

4. Format your answer exactly as follows, with no extra text or explanations before or after:

Category: ${sport}
Score: [XX/100]
Feedback: [Your feedback here]
Improvement Tip: [1 short actionable suggestion]`;
    
    const mediaPart = await fileToGenerativePart(file);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: [{ parts: [ {text: prompt}, mediaPart ] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error getting media feedback:", error);
    return "Sorry, I couldn't analyze the media right now. Please try again.";
  }
};

const getSystemInstruction = (config: ChatConfig): string => {
    let baseInstruction = "You are an AI sports coach. ";

    // Define persona characteristics
    switch (config.persona) {
        case 'Strict Trainer':
            baseInstruction += "You are a Strict Trainer. Your tone is commanding, firm, and results-focused. You have high expectations, offer minimal praise, and use tough love to push the user to their limits.";
            break;
        case 'Olympic Pro':
            baseInstruction += "You are an Olympic Pro coach. Your tone is professional, analytical, and strategic. You are data-driven and focused on peak performance and optimization.";
            break;
        case 'Chill Buddy':
            baseInstruction += "You are a Chill Buddy. Your tone is casual, relaxed, and friendly. You keep fitness fun and stress-free with a low-pressure approach.";
            break;
        case 'Friendly Mentor':
        default:
            baseInstruction += "You are Coach Nova, a Friendly Mentor. Your tone is encouraging, supportive, warm, and patient. You celebrate wins and help the user through setbacks. Use emojis lightly for energy and clarity (e.g., 🕒 🥣 💧).";
            break;
    }

    switch (config.module) {
        case 'Unified Dashboard':
            return `${baseInstruction}\n\nYour current task is to act as a holistic coach for a ${config.sport} athlete, analyzing their unified dashboard.
- The user's data is: ${JSON.stringify(config.context, null, 2)}.
- Answer questions about their overall score, trends, and connections between modules.
- Provide clear, data-driven explanations and actionable advice based on their complete profile.`;
        case 'Performance Analysis':
            return `${baseInstruction}\n\nIMPORTANT CONTEXT: The user just received the following analysis on their ${config.sport} performance:\n${config.context}\nBase your conversation on this feedback.`;

        case 'Exercise Plan':
            return `${baseInstruction}\n\nYour current task is to act as a strength and conditioning coach for ${config.sport}.
- When the user asks for a workout, provide a plan for ONLY ONE DAY.
- Each day should include 3-5 relevant exercises.
- Provide a coachMessage in your defined persona.
- Keep the instructions realistic, simple, and varied across days. Do not repeat workouts.`;
        
        case 'Dietary Plan':
            return `${baseInstruction}\n\nYour current task is to act as a sports nutritionist for a ${config.sport} athlete.
- The user has provided their details: Height ${config.context.height}, Weight ${config.context.weight}.
- They may also provide a body image with their first message. Use this information to estimate their physique and needs.
- When the user asks for a meal plan, provide a plan for ONLY ONE DAY.
- Each day should show Breakfast, Lunch, and Dinner.
- Ensure the nutrition aligns with ${config.sport}.
- Provide a coachMessage in your defined persona.`;

        case 'Injury Recovery Plan':
            return `${baseInstruction}\n\nYour current task is to act as a physical recovery specialist for a ${config.sport} athlete.
- The user has indicated an issue with their ${config.context.bodyPart}. All advice must be safe for this condition.
- When the user asks for a recovery plan, provide a simple plan for the day.
- The plan should include 2-4 light recovery exercises and 1-2 general recovery tips.
- IMPORTANT: Always include a disclaimer to consult a doctor or physical therapist for serious injuries.`;
        
        default:
             return `${baseInstruction}\n\nYour role is to be a general AI coach for ${config.sport}. Answer general training questions and provide motivation.`;
    }
};

export const createChat = (config: ChatConfig): Chat => {
  const systemInstruction = getSystemInstruction(config);
    
  const chatConfig: any = {
    model: 'gemini-2.5-flash',
    config: {
        systemInstruction: systemInstruction,
    },
  };

  if (config.module === 'Exercise Plan') {
    chatConfig.config.responseMimeType = 'application/json';
    chatConfig.config.responseSchema = {
        type: Type.OBJECT,
        properties: {
            exercises: {
                type: Type.ARRAY,
                description: 'A list of exercises for the daily workout plan.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: 'Name of the exercise.' },
                        detail: { type: Type.STRING, description: 'Details like reps, sets, or duration.' }
                    },
                    required: ['name', 'detail']
                }
            },
            coachMessage: { type: Type.STRING, description: 'A conversational message for the user accompanying the plan, matching the persona.' }
        },
        required: ['exercises', 'coachMessage']
    };
  }

  if (config.module === 'Dietary Plan') {
    chatConfig.config.responseMimeType = 'application/json';
    chatConfig.config.responseSchema = {
        type: Type.OBJECT,
        properties: {
            meals: {
                type: Type.OBJECT,
                description: 'An object containing the meal descriptions for the day.',
                properties: {
                    breakfast: { type: Type.STRING, description: 'Description of the breakfast meal.' },
                    lunch: { type: Type.STRING, description: 'Description of the lunch meal.' },
                    dinner: { type: Type.STRING, description: 'Description of the dinner meal.' }
                },
                required: ['breakfast', 'lunch', 'dinner']
            },
            coachMessage: { type: Type.STRING, description: 'A conversational message for the user accompanying the plan, matching the persona.' }
        },
        required: ['meals', 'coachMessage']
    };
  }
    
  return ai.chats.create(chatConfig);
};