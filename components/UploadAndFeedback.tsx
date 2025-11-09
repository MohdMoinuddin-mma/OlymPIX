import React, { useState, useEffect, useRef } from 'react';
import { getMediaFeedback } from '../services/geminiService';
import type { AnalysisResult } from '../types';
import { UploadIcon } from './icons';

interface UploadAndFeedbackProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  selectedSport: string;
}

interface ParsedFeedback {
  timestamp?: string;
  seconds?: number;
  text: string;
}

const UploadAndFeedback: React.FC<UploadAndFeedbackProps> = ({ onAnalysisComplete, selectedSport }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset state when sport changes for a fresh start
  useEffect(() => {
    setFile(null);
    setPreviewUrl(null);
    setFileType(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }, [selectedSport]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setFileType(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileType(file.type.startsWith('image/') ? 'image' : 'video');

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysisResult(null);
      setError(null);
    }
  };
  
  const parseAIResponse = (responseText: string): AnalysisResult | null => {
      const categoryMatch = responseText.match(/Category: (.*)/);
      const scoreMatch = responseText.match(/Score: (.*)/);
      // Use a non-greedy match and allow for whitespace (including newlines) after "Feedback:"
      const feedbackMatch = responseText.match(/Feedback:\s*([\s\S]*?)Improvement Tip:/);
      const tipMatch = responseText.match(/Improvement Tip: (.*)/);

      if (categoryMatch && scoreMatch && feedbackMatch && tipMatch) {
          return {
              category: categoryMatch[1].trim(),
              score: scoreMatch[1].trim(),
              feedback: feedbackMatch[1].trim(),
              improvementTip: tipMatch[1].trim(),
          };
      }
      return null;
  }

  const handleGetFeedback = async () => {
    if (!file) return;
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    const aiResponse = await getMediaFeedback(file, selectedSport);
    const parsedResult = parseAIResponse(aiResponse);

    if (parsedResult) {
      setAnalysisResult(parsedResult);
      onAnalysisComplete(parsedResult);
    } else {
      setAnalysisResult(null);
      setError(`Sorry, I couldn't parse the analysis from the AI. Raw response:\n\n"${aiResponse}"`);
    }

    setIsLoading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const handleTimestampClick = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play().catch(console.error);
    }
  };

  const parseVideoFeedback = (text: string): ParsedFeedback[] => {
    const lines = text.split('\n').filter(line => line.trim().startsWith('-'));
    const feedbackItems: ParsedFeedback[] = [];
    const regex = /-\s*\[(\d{1,2}):(\d{2})\]\s*-\s*(.*)/;

    for (const line of lines) {
        const match = line.match(regex);
        if (match) {
            const minutes = parseInt(match[1], 10);
            const seconds = parseInt(match[2], 10);
            const totalSeconds = minutes * 60 + seconds;
            feedbackItems.push({
                timestamp: `[${match[1].padStart(2, '0')}:${match[2]}]`,
                seconds: totalSeconds,
                text: match[3].trim(),
            });
        }
    }
    
    // If no timestamps found but there is text, return the whole text as one item
    if (feedbackItems.length === 0 && text.trim().length > 0) {
         return [{ text: text.trim() }];
    }
    return feedbackItems;
  };

  const parsedVideoFeedbackItems = analysisResult && fileType === 'video' ? parseVideoFeedback(analysisResult.feedback) : [];

  return (
    <div className="flex flex-col items-center space-y-4">
      <div 
        className="w-full h-64 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center bg-black/50 cursor-pointer hover:border-[#00E0FF] hover:bg-gray-900 transition-colors"
        onClick={triggerFileInput}
      >
        {previewUrl ? (
          fileType === 'image' ? (
            <img src={previewUrl} alt="Pose preview" className="max-h-full max-w-full object-contain rounded-lg" />
          ) : (
            <video ref={videoRef} src={previewUrl} controls className="max-h-full max-w-full object-contain rounded-lg" />
          )
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="mx-auto h-12 w-12" />
            <p>Click to upload an image or video</p>
            <p className="text-xs">Analyze your {selectedSport} form</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
      />

      {file && (
        <button
          onClick={handleGetFeedback}
          disabled={isLoading}
          className="w-full bg-[#00E0FF] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#00c4e0] disabled:bg-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            `Analyze My ${selectedSport} Form`
          )}
        </button>
      )}

      {error && !isLoading && (
        <div className="w-full mt-4 p-4 bg-[#FF0055]/10 rounded-lg border border-[#FF0055] text-center">
            <h3 className="font-semibold text-lg text-[#FF0055]">Analysis Error</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {analysisResult && !isLoading && (
        <div className="w-full mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-800 space-y-4">
            <div className="flex items-center text-center border-b border-gray-800 pb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-sm text-[#00E0FF] uppercase tracking-wider">Category</h3>
                    <p className="text-lg font-bold text-white">{analysisResult.category}</p>
                </div>
                <div className="flex-1 border-x border-gray-800 px-2">
                    <h3 className="font-semibold text-sm text-[#00E0FF] uppercase tracking-wider">Score</h3>
                    <p className="text-4xl font-bold text-white">
                        {analysisResult.score.split('/')[0]}<span className="text-xl text-gray-400">/100</span>
                    </p>
                </div>
            </div>

            <div className="text-left pt-2">
                <h3 className="font-semibold text-lg text-[#00E0FF] mb-2">Coaching Feedback</h3>
                {fileType === 'video' && parsedVideoFeedbackItems.length > 0 && parsedVideoFeedbackItems[0].timestamp ? (
                    <ul className="space-y-2">
                        {parsedVideoFeedbackItems.map((item, index) => (
                           <li key={index} className="flex items-start gap-2 p-2 rounded-md bg-gray-900">
                                {item.timestamp && typeof item.seconds === 'number' ? (
                                    <button
                                        onClick={() => handleTimestampClick(item.seconds!)}
                                        className="font-mono bg-[#00E0FF]/20 text-[#00E0FF] px-2 py-1 rounded text-sm hover:bg-[#00E0FF]/40 transition-colors flex-shrink-0"
                                        aria-label={`Jump to ${item.timestamp} in video`}
                                    >
                                        {item.timestamp}
                                    </button>
                                ) : <div className="w-2 h-2 mt-2.5 bg-[#00E0FF] rounded-full flex-shrink-0"></div>}
                                <p className="text-gray-300 pt-0.5">{item.text}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-300 whitespace-pre-wrap">{analysisResult.feedback}</p>
                )}
            </div>
            
            <div className="text-left pt-4 border-t border-gray-800">
                <h3 className="font-semibold text-lg text-[#C8F560] mb-2">⚡️ Improvement Tip</h3>
                <p className="text-gray-300">{analysisResult.improvementTip}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default UploadAndFeedback;