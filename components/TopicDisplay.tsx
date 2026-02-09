'use client';

import { useState, useEffect } from 'react';
import { Clock, RefreshCw, BookOpen } from 'lucide-react';
import { IELTSPart } from '@/types';
import { formatDuration } from '@/utils/audioUtils';

interface TopicDisplayProps {
  topic: IELTSPart | null;
  onNewTopic: (part?: 1 | 2 | 3) => void;
  onHome?: () => void;
  showNewTopicButton?: boolean;
  loading?: boolean;
  preparationTime?: number;
  onPreparationComplete?: () => void;
}

export default function TopicDisplay({ 
  topic, 
  onNewTopic, 
  onHome,
  showNewTopicButton = true,
  loading = false,
  preparationTime,
  onPreparationComplete 
}: TopicDisplayProps) {
  const [prepTimeLeft, setPrepTimeLeft] = useState<number | null>(null);
  const [isPreparationPhase, setIsPreparationPhase] = useState(false);

  useEffect(() => {
    if (preparationTime && preparationTime > 0) {
      setPrepTimeLeft(preparationTime * 60); // Convert minutes to seconds
      setIsPreparationPhase(true);
    }
  }, [preparationTime]);

  useEffect(() => {
    if (prepTimeLeft && prepTimeLeft > 0) {
      const timer = setTimeout(() => {
        setPrepTimeLeft(prev => {
          if (prev && prev <= 1) {
            setIsPreparationPhase(false);
            // Defer the callback to avoid updating state during render
            setTimeout(() => onPreparationComplete?.(), 0);
            return null;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [prepTimeLeft, onPreparationComplete]);

  const getPartColor = (part: number) => {
    switch (part) {
      case 1: return 'bg-blue-500';
      case 2: return 'bg-green-500';
      case 3: return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPartDescription = (part: number) => {
    switch (part) {
      case 1: return 'Introduction & Interview';
      case 2: return 'Long Turn';
      case 3: return 'Two-way Discussion';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse space-y-4 sm:space-y-6">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3"></div>
              <div className="h-3 sm:h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
            <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-5/6"></div>
            <div className="h-4 sm:h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5"></div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl"></div>
            <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl"></div>
            <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl sm:rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="p-4 sm:p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
            Choose Your IELTS Speaking Part
          </h3>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-4 sm:px-0">
            Select which part of the IELTS speaking test you'd like to practice
          </p>
          
          <div className="grid gap-3 sm:gap-4 max-w-lg mx-auto px-4 sm:px-0">
            <button
              onClick={() => onNewTopic(1)}
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-bold text-base sm:text-lg">Part 1</div>
                  <div className="text-blue-100 text-xs sm:text-sm">Introduction & Interview</div>
                </div>
                <div className="text-xl sm:text-2xl opacity-75 group-hover:opacity-100 transition-opacity">🙋‍♀️</div>
              </div>
            </button>
            
            <button
              onClick={() => onNewTopic(2)}
              className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-bold text-base sm:text-lg">Part 2</div>
                  <div className="text-green-100 text-xs sm:text-sm">Long Turn (1-2 minutes)</div>
                </div>
                <div className="text-xl sm:text-2xl opacity-75 group-hover:opacity-100 transition-opacity">🎤</div>
              </div>
            </button>
            
            <button
              onClick={() => onNewTopic(3)}
              className="group relative bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-bold text-base sm:text-lg">Part 3</div>
                  <div className="text-purple-100 text-xs sm:text-sm">Two-way Discussion</div>
                </div>
                <div className="text-xl sm:text-2xl opacity-75 group-hover:opacity-100 transition-opacity">💬</div>
              </div>
            </button>
          </div>
          
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-amber-200 mx-4 sm:mx-0">
            <p className="text-amber-800 text-xs sm:text-sm font-medium">
              🎆 Pro Tip: Start with Part 1 if you're new to IELTS speaking practice!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
      {/* Modern Topic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg ${
            topic.part === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
            topic.part === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
            'bg-gradient-to-br from-purple-500 to-indigo-600'
          }`}>
            {topic.part}
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">{getPartDescription(topic.part)}</h2>
            <p className="text-xs sm:text-sm text-gray-500">IELTS Speaking Part {topic.part}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          {showNewTopicButton && (
            <button
              onClick={() => onNewTopic(topic.part)}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm w-full sm:w-auto"
              title="Get new topic"
            >
              <RefreshCw size={14} className="sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">New Topic</span>
            </button>
          )}
          
          {onHome && (
            <button
              onClick={onHome}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 hover:bg-gray-700 border border-gray-200 hover:border-gray-300 rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm w-full sm:w-auto text-white"
              title="Go to home"
            >
              <span className="text-xs sm:text-sm font-medium">🏠 Home</span>
            </button>
          )}
        </div>
      </div>

      {/* Preparation Timer */}
      {isPreparationPhase && prepTimeLeft !== null && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Clock className="text-white" size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-sm sm:text-base">Preparation Time</h3>
                <p className="text-xs sm:text-sm text-amber-700">Think about your response</p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-600">
                {formatDuration(prepTimeLeft)}
              </div>
              <p className="text-xs text-amber-600">remaining</p>
            </div>
          </div>
          <p className="text-amber-800 text-xs sm:text-sm">
            Use this time to organize your thoughts and make mental notes for your response.
          </p>
        </div>
      )}
    </div>
  );
}