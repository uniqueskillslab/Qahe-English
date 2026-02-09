'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { AudioRecorder, formatDuration } from '@/utils/audioUtils';
import { RecordingState, RecordingStatus } from '@/types';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
  disabled?: boolean;
}

export default function VoiceRecorder({ 
  onRecordingComplete, 
  maxDuration = 300, // 5 minutes default
  disabled = false 
}: VoiceRecorderProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    audioUrl: null,
  });

  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRecorderRef.current) {
        audioRecorderRef.current.cleanup();
      }
      if (recordingState.audioUrl) {
        URL.revokeObjectURL(recordingState.audioUrl);
      }
    };
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingState(prev => {
        const newDuration = prev.duration + 1;
        
        // Auto-stop when max duration reached
        if (newDuration >= maxDuration) {
          stopRecording();
          return prev;
        }
        
        return { ...prev, duration: newDuration };
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setStatus('recording');
      
      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder();
        await audioRecorderRef.current.initialize();
      }

      await audioRecorderRef.current.startRecording();
      
      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));

      startTimer();
    } catch (err: any) {
      setError(err.message);
      setStatus('idle');
      console.error('Recording start error:', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (!audioRecorderRef.current) return;

      stopTimer();
      const audioBlob = await audioRecorderRef.current.stopRecording();
      const audioUrl = URL.createObjectURL(audioBlob);

      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioBlob,
        audioUrl,
      }));

      setStatus('completed');
      onRecordingComplete(audioBlob, recordingState.duration);
    } catch (err: any) {
      setError(err.message);
      console.error('Recording stop error:', err);
    }
  };

  const pauseRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.pauseRecording();
      stopTimer();
      setRecordingState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const resumeRecording = () => {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.resumeRecording();
      startTimer();
      setRecordingState(prev => ({ ...prev, isPaused: false }));
    }
  };

  const resetRecording = () => {
    stopTimer();
    if (audioRecorderRef.current) {
      audioRecorderRef.current.cleanup();
      audioRecorderRef.current = null;
    }
    if (recordingState.audioUrl) {
      URL.revokeObjectURL(recordingState.audioUrl);
    }
    
    setRecordingState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      audioUrl: null,
    });
    
    setStatus('idle');
    setError(null);
    setIsPlaying(false);
  };

  const playAudio = () => {
    if (recordingState.audioUrl && audioElementRef.current) {
      audioElementRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const getDurationColor = () => {
    const percentage = (recordingState.duration / maxDuration) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      {/* Timer Display */}
      <div className="text-center">
        <div className={`text-3xl font-mono font-bold ${getDurationColor()}`}>
          {formatDuration(recordingState.duration)}
        </div>
        <div className="text-sm text-gray-500">
          Max: {formatDuration(maxDuration)}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center space-x-4">
        {status === 'idle' && (
          <button
            onClick={startRecording}
            disabled={disabled}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full p-4 transition-colors"
            title="Start Recording"
          >
            <Mic size={24} />
          </button>
        )}

        {status === 'recording' && (
          <>
            {!recordingState.isPaused ? (
              <button
                onClick={pauseRecording}
                className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-4 transition-colors"
                title="Pause Recording"
              >
                <Pause size={24} />
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 transition-colors"
                title="Resume Recording"
              >
                <Play size={24} />
              </button>
            )}
            
            <button
              onClick={stopRecording}
              className="bg-gray-800 hover:bg-gray-900 text-white rounded-full p-4 transition-colors"
              title="Stop Recording"
            >
              <Square size={24} />
            </button>
          </>
        )}

        {status === 'completed' && (
          <>
            <button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors"
              title={isPlaying ? "Pause Playback" : "Play Recording"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={resetRecording}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-full p-4 transition-colors"
              title="Record Again"
            >
              <RotateCcw size={24} />
            </button>
          </>
        )}
      </div>

      {/* Status Display */}
      <div className="text-center">
        {status === 'recording' && !recordingState.isPaused && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording...</span>
          </div>
        )}
        
        {status === 'recording' && recordingState.isPaused && (
          <div className="text-yellow-600 font-medium">Recording Paused</div>
        )}
        
        {status === 'completed' && (
          <div className="text-green-600 font-medium">Recording Complete</div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Hidden Audio Element for Playback */}
      {recordingState.audioUrl && (
        <audio
          ref={audioElementRef}
          src={recordingState.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            recordingState.duration >= maxDuration ? 'bg-red-500' :
            recordingState.duration >= maxDuration * 0.75 ? 'bg-yellow-500' :
            'bg-green-500'
          }`}
          style={{
            width: `${Math.min((recordingState.duration / maxDuration) * 100, 100)}%`
          }}
        ></div>
      </div>
    </div>
  );
}