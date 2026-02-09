'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface TimerProps {
  /**
   * Duration in minutes
   */
  duration: number;
  /**
   * Auto-start timer on mount
   */
  autoStart?: boolean;
  /**
   * Callback when timer reaches 00:00
   */
  onTimeUp?: () => void;
  /**
   * Callback with remaining time in seconds
   */
  onTick?: (remainingSeconds: number) => void;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export default function Timer({ 
  duration, 
  autoStart = false, 
  onTimeUp, 
  onTick, 
  className = '' 
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start timer
  const startTimer = () => {
    setIsRunning(true);
    setIsFinished(false);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsRunning(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeRemaining(duration * 60);
  };

  // Timer effect
  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;
          
          // Callback with remaining time
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            setIsFinished(true);
            onTimeUp?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeRemaining, onTimeUp, onTick]);

  // Get timer color based on remaining time
  const getTimerColor = () => {
    const totalSeconds = duration * 60;
    const percentage = (timeRemaining / totalSeconds) * 100;
    
    if (percentage <= 10) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage <= 25) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (percentage <= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Timer Display */}
      <div className={`
        flex items-center space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-200
        ${isFinished ? 'text-red-600 bg-red-50 border-red-200 animate-pulse' : getTimerColor()}
      `}>
        <Clock className="w-5 h-5" />
        <span className="text-lg font-mono font-bold">
          {formatTime(timeRemaining)}
        </span>
        {isFinished && (
          <span className="ml-2 text-sm font-medium">Time's up!</span>
        )}
      </div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-2">
        {!isRunning ? (
          <button
            onClick={startTimer}
            disabled={isFinished}
            className="
              flex items-center justify-center w-10 h-10 rounded-full
              bg-green-500 hover:bg-green-600 disabled:bg-gray-300
              text-white transition-colors duration-200
            "
            title="Start Timer"
          >
            <Play className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="
              flex items-center justify-center w-10 h-10 rounded-full
              bg-orange-500 hover:bg-orange-600
              text-white transition-colors duration-200
            "
            title="Pause Timer"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="
            flex items-center justify-center w-10 h-10 rounded-full
            bg-gray-500 hover:bg-gray-600
            text-white transition-colors duration-200
          "
          title="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Time Progress Bar */}
      <div className="flex-1 min-w-0">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`
              h-2 rounded-full transition-all duration-1000 ease-linear
              ${isFinished 
                ? 'bg-red-500' 
                : timeRemaining / (duration * 60) > 0.5 
                  ? 'bg-green-500' 
                  : timeRemaining / (duration * 60) > 0.25 
                    ? 'bg-yellow-500' 
                    : 'bg-orange-500'
              }
            `}
            style={{ width: `${(timeRemaining / (duration * 60)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}