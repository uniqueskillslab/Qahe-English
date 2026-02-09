'use client';

import { Clock, RefreshCw, BookOpen } from 'lucide-react';
import { IELTSPart } from '@/types';

interface TopicDisplayProps {
  topic: IELTSPart | null;
  onNewTopic: (part?: 1 | 2 | 3) => void;
  loading?: boolean;
}

export default function TopicDisplay({ 
  topic, 
  onNewTopic, 
  loading = false
}: TopicDisplayProps) {
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Topic Selected</h3>
        <p className="text-gray-500 mb-4">Choose a speaking part to get started</p>
        
        <div className="space-y-2">
          <button
            onClick={() => onNewTopic(1)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
          >
            Part 1 - Introduction & Interview
          </button>
          <button
            onClick={() => onNewTopic(2)}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
          >
            Part 2 - Long Turn
          </button>
          <button
            onClick={() => onNewTopic(3)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors"
          >
            Part 3 - Two-way Discussion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Topic Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className={`${getPartColor(topic.part)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            Part {topic.part}
          </span>
          <span className="text-sm text-gray-600">{getPartDescription(topic.part)}</span>
        </div>
        
        <button
          onClick={() => onNewTopic(topic.part)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          title="Get new topic"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Topic Content */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">{topic.title}</h2>
        
        {topic.description && (
          <p className="text-gray-600">{topic.description}</p>
        )}

        {topic.questions && topic.questions.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-800">
              {topic.part === 2 ? 'You should say:' : 'Questions to consider:'}
            </h3>
            <ul className="space-y-1">
              {topic.questions.map((question, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-gray-400 mr-2 flex-shrink-0">•</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Time Information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 bg-gray-50 rounded p-3">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>Speaking time: {topic.timeLimit} minute{topic.timeLimit > 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Ready to Record Message */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-800 font-medium">Ready to start speaking!</p>
        <p className="text-green-600 text-sm">Click the record button below to begin your response.</p>
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Try another topic:</span>
          <div className="space-x-2">
            {[1, 2, 3].map((part) => (
              <button
                key={part}
                onClick={() => onNewTopic(part as 1 | 2 | 3)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  topic.part === part 
                    ? `${getPartColor(part)} text-white`
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {part}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}