'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { formatDuration } from '@/utils/audioUtils';
import { AudioWorkletRecorder, AudioAnalysis, WordLevelResult } from '@/utils/audioWorkletUtils';
import { RecordingStatus } from '@/types';

interface VoiceRecorderWorkletProps {
  onRecordingComplete: (audioBlob: Blob, duration: number, wordResults?: WordLevelResult[]) => void;
  maxDuration?: number;
  disabled?: boolean;
  showRealTimeAnalysis?: boolean;
}

export default function VoiceRecorderWorklet({
  onRecordingComplete,
  maxDuration = 300,
  disabled = false,
  showRealTimeAnalysis = true
}: VoiceRecorderWorkletProps) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordResults, setWordResults] = useState<WordLevelResult[]>([]);

  // Real-time analysis state
  const [currentVolume, setCurrentVolume] = useState(0);
  const [currentPitch, setCurrentPitch] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeHistory, setVolumeHistory] = useState<number[]>([]);

  const recorderRef = useRef<AudioWorkletRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorderRef.current) {
        recorderRef.current.cleanup();
      }
    };
  }, []);

  const handleAudioAnalysis = (analysis: AudioAnalysis) => {
    setCurrentVolume(analysis.volume);
    setCurrentPitch(analysis.pitch);
    setIsSpeaking(analysis.isSpeaking);
    
    // Keep volume history for visualization
    setVolumeHistory(prev => {
      const newHistory = [...prev, analysis.volume];
      return newHistory.slice(-50); // Keep last 50 samples
    });
  };

  const startRecording = async () => {
    try {
      setError(null);
      setShowSuccess(false);
      setAudioBlob(null);
      setWordResults([]);
      setVolumeHistory([]);
      
      if (!recorderRef.current) {
        recorderRef.current = new AudioWorkletRecorder();
        await recorderRef.current.initialize(handleAudioAnalysis);
      }

      await recorderRef.current.startRecording();
      setStatus('recording');
      startTimeRef.current = Date.now();
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setDuration(elapsed);
        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 100);

    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(err.message || 'Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;

    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      const blob = await recorderRef.current.stopRecording();
      setAudioBlob(blob);
      setShowSuccess(true);
      setStatus('completed');

      // Start pronunciation analysis
      setIsAnalyzing(true);
      try {
        const results = await analyzePronunciation(blob);
        setWordResults(results);
        onRecordingComplete(blob, duration, results);
      } catch (error) {
        console.error('Pronunciation analysis failed:', error);
        onRecordingComplete(blob, duration, []);
      } finally {
        setIsAnalyzing(false);
      }

    } catch (err: any) {
      setError(err.message);
    }
  };

  const analyzePronunciation = async (audioBlob: Blob): Promise<WordLevelResult[]> => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      console.log('Sending audio for pronunciation analysis:', audioBlob.size, 'bytes');
      
      const response = await fetch('/api/pronunciation-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Pronunciation analysis API error:', response.status, errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Pronunciation analysis result:', result);
      return result.wordResults || [];
    } catch (error: any) {
      console.error('Pronunciation analysis failed:', error);
      // Return empty array instead of throwing to allow the demo to continue
      return [];
    }
  };

  const resetRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setStatus('idle');
    setDuration(0);
    setError(null);
    setAudioBlob(null);
    setShowSuccess(false);
    setWordResults([]);
    setCurrentVolume(0);
    setCurrentPitch(0);
    setIsSpeaking(false);
    setVolumeHistory([]);
  };

  const getVolumeColor = () => {
    if (currentVolume < 0.1) return 'bg-gray-300';
    if (currentVolume < 0.3) return 'bg-yellow-400';
    if (currentVolume < 0.7) return 'bg-green-400';
    return 'bg-green-500';
  };

  const getPronunciationColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Analysis Display */}
      {showRealTimeAnalysis && status === 'recording' && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-sm font-semibold mb-3">Real-time Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Volume Meter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Volume</span>
                <span className="text-xs font-mono">{Math.round(currentVolume * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-150 ${getVolumeColor()}`}
                  style={{ width: `${currentVolume * 100}%` }}
                />
              </div>
            </div>

            {/* Speaking Indicator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Speaking</span>
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
              <div className={`text-xs px-2 py-1 rounded ${isSpeaking ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {isSpeaking ? 'Detected' : 'Silence'}
              </div>
            </div>
          </div>

          {/* Volume History Visualization */}
          <div className="mt-4">
            <span className="text-xs text-gray-600 mb-2 block">Volume History</span>
            <div className="flex items-end h-12 space-x-1">
              {volumeHistory.map((vol, idx) => (
                <div 
                  key={idx}
                  className={`flex-1 rounded-t ${getVolumeColor()}`}
                  style={{ height: `${Math.max(2, vol * 48)}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {status === 'idle' && (
            <button
              onClick={startRecording}
              disabled={disabled}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
                disabled 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 hover:scale-105'
              }`}
            >
              <Mic className="w-8 h-8" />
            </button>
          )}

          {status === 'recording' && (
            <button
              onClick={stopRecording}
              className="w-20 h-20 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all animate-pulse"
            >
              <Square className="w-8 h-8" />
            </button>
          )}

          {(status === 'completed' || showSuccess) && (
            <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Duration Display */}
        <div className="text-2xl font-mono">
          {formatDuration(duration)}
          <span className="text-sm text-gray-500 ml-2">
            / {formatDuration(maxDuration)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              duration >= maxDuration ? 'bg-red-500' :
              duration >= maxDuration * 0.75 ? 'bg-yellow-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, (duration / maxDuration) * 100)}%` }}
          />
        </div>
      </div>

      {/* Audio Player */}
      {audioBlob && status === 'completed' && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-center text-gray-700 mb-4">Recording completed!</p>
          <audio
            controls
            src={URL.createObjectURL(audioBlob)}
            className="w-full"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Pronunciation Analysis Results */}
      {isAnalyzing && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-700">Analyzing pronunciation...</span>
          </div>
        </div>
      )}

      {wordResults.length > 0 && (
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-semibold mb-4">Pronunciation Analysis</h3>
          <div className="space-y-3">
            {wordResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{result.word}</span>
                    <span className={`text-sm font-semibold ${getPronunciationColor(result.accuracy)}`}>
                      {result.accuracy}%
                    </span>
                  </div>
                  {result.pronunciation.errors.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-red-600">
                        Issues: {result.pronunciation.errors.join(', ')}
                      </span>
                    </div>
                  )}
                  {result.pronunciation.suggestions.length > 0 && (
                    <div className="mt-1">
                      <span className="text-xs text-blue-600">
                        Tip: {result.pronunciation.suggestions[0]}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {result.startTime.toFixed(1)}s - {result.endTime.toFixed(1)}s
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {(status === 'completed' || error) && (
        <div className="text-center">
          <button
            onClick={resetRecording}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Record Again</span>
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}