import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createChat } from '../services/geminiService';
import type { ChatMessage, AnalysisResult, ModuleType, CoachPersona } from '../types';
import { SendIcon } from './icons';

interface ModuleConfig {
    module: ModuleType | 'General' | 'Unified Dashboard';
    sport: string;
    persona?: CoachPersona;
    context?: any;
}

interface ChatbotProps {
  moduleConfig: ModuleConfig;
  onPlanReceived?: (plan: any) => void;
}

const getInitialMessage = (config: ModuleConfig): ChatMessage => {
    const baseMessage = { id: 'initial', sender: 'ai' as const };
    switch (config.module) {
        case 'Unified Dashboard':
            return {
                ...baseMessage,
                text: `Welcome to your Unified Dashboard for ${config.sport}! I'm your AI coach. I've analyzed all your data. Ask me anything, like "How can I improve my overall score?" or "Why did my performance drop last week?" Let's get started!`
            };
        case 'Performance Analysis':
            if (config.context) {
                const analysisContext = config.context as AnalysisResult;
                return {
                    ...baseMessage,
                    text: `I've analyzed your ${analysisContext.category} performance!\n\nYou scored ${analysisContext.score}. My main feedback is: "${analysisContext.feedback.trim()}"\n\nMy tip for you is to: ${analysisContext.improvementTip}\n\nAsk me anything about this analysis!`,
                };
            }
            return {
                ...baseMessage,
                text: "Upload your performance, and I'll give you a detailed analysis. You can also ask me general questions about training!",
            };
        case 'Exercise Plan':
            return {
                ...baseMessage,
                text: `Ready to train for ${config.sport}? I'm here to help. To get started, just ask for "Day 1" or "today's workout." Your plan will appear on the left. Let's get stronger! 💪`,
            };
        case 'Dietary Plan':
             return {
                ...baseMessage,
                text: `Let's fuel your ${config.sport} performance! I've reviewed your details. To get your first meal plan, ask for "Day 1" or "what should I eat today?". Your meal tracker will appear on the left. 🍎`,
            };
        case 'Injury Recovery Plan':
             return {
                ...baseMessage,
                text: `Let's focus on recovery for your ${config.context.bodyPart}. I'm here to help. Ask for "today's recovery plan" to get some gentle exercises and tips. Remember to listen to your body!`,
            };
        default:
            return {
                ...baseMessage,
                text: 'Select a sport, upload your performance, and I\'ll give you a detailed analysis. You can also ask me general questions about training!',
            };
    }
};

const Chatbot: React.FC<ChatbotProps> = ({ moduleConfig, onPlanReceived }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstUserMessageSent, setIsFirstUserMessageSent] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = createChat(moduleConfig);
    setMessages([getInitialMessage(moduleConfig)]);
    setIsFirstUserMessageSent(false); // Reset on new module config
  }, [moduleConfig]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (chatRef.current) {
        let result;
        const isDietaryModule = moduleConfig.module === 'Dietary Plan';
        const imageData = moduleConfig.context?.imageData;

        if (isDietaryModule && !isFirstUserMessageSent && imageData) {
            const imagePart = {
                inlineData: {
                    mimeType: imageData.mimeType,
                    data: imageData.data,
                },
            };
            const textPart = { text: input };
            result = await chatRef.current.sendMessage({ message: [textPart, imagePart] });
            setIsFirstUserMessageSent(true);
        } else {
            result = await chatRef.current.sendMessage({ message: input });
        }
        
        const responseText = result.text.trim();
        let aiMessageText = '';
        let planData = null;

        const isPlanModule = moduleConfig.module === 'Exercise Plan' || moduleConfig.module === 'Dietary Plan';

        if (isPlanModule) {
            try {
                // The response from the AI is a JSON string, so we parse it.
                const parsedResponse = JSON.parse(responseText);
                aiMessageText = parsedResponse.coachMessage || "Here is your plan!";
                planData = parsedResponse.exercises || parsedResponse.meals;
                if (onPlanReceived && planData) {
                    onPlanReceived(planData);
                }
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
                // Fallback to raw text if JSON parsing fails for some reason
                aiMessageText = responseText;
            }
        } else {
            aiMessageText = responseText;
        }

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiMessageText,
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Oops! Something went wrong. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/30 rounded-2xl">
      <div className="p-4 flex-grow overflow-y-auto pr-2 -mr-2 space-y-4 mb-4 min-h-[300px] md:min-h-0">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E0FF] to-[#C8F560] flex items-center justify-center text-black font-bold flex-shrink-0">
                AI
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-[#00E0FF] text-black rounded-br-none'
                  : 'bg-[#1F1F1F] text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E0FF] to-[#C8F560] flex items-center justify-center text-black font-bold flex-shrink-0">
                    AI
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#1F1F1F] rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center space-x-2 p-4 border-t border-white/10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI coach..."
          className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00E0FF] transition-shadow"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-[#00E0FF] text-black p-2 rounded-full hover:bg-[#00c4e0] disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;