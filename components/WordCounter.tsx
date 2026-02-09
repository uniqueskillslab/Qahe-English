'use client';

import { useMemo } from 'react';
import { FileText, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface WordCounterProps {
  /**
   * The text content to analyze
   */
  text: string;
  /**
   * Target word count for the task
   */
  targetWords: number;
  /**
   * Task type for specific feedback
   */
  taskType: 'task1' | 'task2';
  /**
   * Additional CSS classes
   */
  className?: string;
}

export default function WordCounter({ 
  text, 
  targetWords, 
  taskType, 
  className = '' 
}: WordCounterProps) {
  
  // Calculate word and character counts
  const stats = useMemo(() => {
    const trimmedText = text.trim();
    
    // Count words (split by whitespace and filter empty strings)
    const words = trimmedText === '' ? [] : trimmedText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    // Count characters (with and without spaces)
    const charactersWithSpaces = text.length;
    const charactersWithoutSpaces = text.replace(/\s/g, '').length;
    
    // Count paragraphs (split by double line breaks)
    const paragraphs = trimmedText === '' ? 0 : trimmedText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    
    return {
      wordCount,
      charactersWithSpaces,
      charactersWithoutSpaces,
      paragraphs
    };
  }, [text]);

  // Get word count status and feedback
  const getWordCountStatus = () => {
    const { wordCount } = stats;
    const percentage = (wordCount / targetWords) * 100;
    
    if (wordCount === 0) {
      return {
        status: 'empty',
        color: 'text-gray-500 bg-gray-50 border-gray-200',
        icon: FileText,
        message: 'Start writing...'
      };
    }
    
    if (percentage < 80) {
      return {
        status: 'under',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        icon: AlertTriangle,
        message: 'Too short - keep writing!'
      };
    }
    
    if (percentage >= 80 && percentage <= 120) {
      return {
        status: 'good',
        color: 'text-green-600 bg-green-50 border-green-200',
        icon: CheckCircle,
        message: 'Good word count!'
      };
    }
    
    return {
      status: 'over',
      color: 'text-red-600 bg-red-50 border-red-200',
      icon: AlertTriangle,
      message: 'Too long - consider editing'
    };
  };

  const wordStatus = getWordCountStatus();
  const Icon = wordStatus.icon;

  // Get task-specific feedback
  const getTaskFeedback = () => {
    const { wordCount } = stats;
    
    if (taskType === 'task1') {
      if (wordCount < 150) return 'Task 1 requires at least 150 words';
      if (wordCount > 200) return 'Consider staying closer to 150-200 words for Task 1';
      return 'Perfect length for Task 1';
    } else {
      if (wordCount < 250) return 'Task 2 requires at least 250 words';
      if (wordCount > 350) return 'Consider staying closer to 250-300 words for Task 2';
      return 'Perfect length for Task 2';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Word Count Display */}
      <div className={`
        flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200
        ${wordStatus.color}
      `}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {stats.wordCount}
            </span>
            <span className="text-sm font-medium">
              / {targetWords} words
            </span>
            <Target className="w-4 h-4" />
          </div>
          
          <div className="text-sm mt-1">
            {wordStatus.message}
          </div>
        </div>
        
        <div className="text-right text-sm">
          <div className="font-medium">
            {((stats.wordCount / targetWords) * 100).toFixed(0)}%
          </div>
          <div className="text-xs opacity-75">
            of target
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`
              h-2 rounded-full transition-all duration-300 ease-out
              ${stats.wordCount === 0 
                ? 'bg-gray-300' 
                : wordStatus.status === 'good' 
                  ? 'bg-green-500' 
                  : wordStatus.status === 'under' 
                    ? 'bg-orange-500' 
                    : 'bg-red-500'
              }
            `}
            style={{ 
              width: `${Math.min((stats.wordCount / targetWords) * 100, 100)}%` 
            }}
          />
        </div>
        
        <div className="text-xs text-gray-600 text-center">
          {getTaskFeedback()}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Words</div>
          <div className="text-lg font-bold text-gray-800">{stats.wordCount}</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Characters</div>
          <div className="text-lg font-bold text-gray-800">{stats.charactersWithSpaces}</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">No Spaces</div>
          <div className="text-lg font-bold text-gray-800">{stats.charactersWithoutSpaces}</div>
        </div>
        
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Paragraphs</div>
          <div className="text-lg font-bold text-gray-800">{stats.paragraphs}</div>
        </div>
      </div>
    </div>
  );
}