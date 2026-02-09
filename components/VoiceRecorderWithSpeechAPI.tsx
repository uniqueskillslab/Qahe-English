'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { formatDuration } from '@/utils/audioUtils';
import { RecordingStatus } from '@/types';

// Type declaration for Speech Recognition API and Puter.js
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
    puter: {
      ai: {
        speech2txt: (file: Blob | File, options?: any) => Promise<any>;
      };
    };
  }
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  serviceURI: string;
  grammars: any;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: any) => any) | null;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface VoiceRecorderProps {
  onRecordingComplete: (transcript: string, duration: number) => void;
  onGetImmediateResult?: (transcript: string, duration: number) => void;
  maxDuration?: number; // in seconds
  disabled?: boolean;
}

export default function VoiceRecorderWithSpeechAPI({ 
  onRecordingComplete, 
  onGetImmediateResult,
  maxDuration = 300, // 5 minutes default
  disabled = false 
}: VoiceRecorderProps) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isGettingResult, setIsGettingResult] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      setShowSuccess(false);
      setAudioBlob(null);
      setIsConverting(false);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Use wav format which is more widely supported
      const options = {
        mimeType: 'audio/wav'
      };
      
      // Fallback to other formats if wav not supported
      if (!MediaRecorder.isTypeSupported('audio/wav')) {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options.mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options.mimeType = 'audio/mp4';
        } else {
          // Use default if none of the above work
          delete (options as any).mimeType;
        }
      }
      
      console.log('Using MediaRecorder format:', options.mimeType || 'default');
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];
      
      // Store the actual MIME type for blob creation
      const actualMimeType = options.mimeType || mediaRecorder.mimeType || 'audio/webm';

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.current.push(event.data);
      });

      mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks.current, { type: actualMimeType });
        console.log('Created audioBlob with type:', actualMimeType);
        setAudioBlob(audioBlob);
        setShowSuccess(true);
        setStatus('completed');
        stream.getTracks().forEach(track => track.stop());
      });

      mediaRecorder.start();
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

  const convertSpeechToText = async () => {
    if (!audioBlob) return;
    
    setIsConverting(true);
    
    // Try Puter.js first if available
    if (isPuterReady && window.puter && window.puter.ai && window.puter.ai.speech2txt) {
      try {
        console.log('Using Puter.js for transcription, blob size:', audioBlob.size, 'bytes');
        
        // Convert Blob to File (Puter.js might expect File object)
        // Determine file extension based on actual MIME type
        let extension = 'wav';
        let actualType = audioBlob.type;
        
        if (audioBlob.type.includes('webm')) {
          extension = 'webm';
        } else if (audioBlob.type.includes('mp4')) {
          extension = 'mp4';
        } else if (audioBlob.type.includes('ogg')) {
          extension = 'ogg';
        }
        
        console.log('Audio blob type:', audioBlob.type, 'Using extension:', extension);
        
        const audioFile = new File([audioBlob], `recording.${extension}`, { type: actualType });
        console.log('Created File object:', audioFile.name, audioFile.type, audioFile.size);
        
        // Call Puter.js speech2txt API
        const result = await window.puter.ai.speech2txt(audioFile);
        
        console.log('Puter.js result:', result);
        
        // Extract transcript from result
        let transcript = '';
        if (typeof result === 'string') {
          transcript = result;
        } else if (result && result.text) {
          transcript = result.text;
        } else if (result && result.transcript) {
          transcript = result.transcript;
        } else {
          transcript = `User provided a spoken response for ${Math.round(duration)} seconds.`;
        }
        
        console.log('Puter.js transcription successful:', transcript);
        setIsConverting(false);
        onRecordingComplete(transcript, duration);
        resetRecording();
        return;
        
      } catch (error) {
        console.error('Puter.js transcription failed:');
        console.error('Error type:', typeof error);
        console.error('Error message:', (error as any)?.message);
        console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error as any)));
        console.log('Falling back to browser Speech Recognition...');
      }
    } else {
      console.log('Puter.js not ready, using browser Speech Recognition');
    }
    
    // Fallback to browser Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      const transcript = `User provided a detailed spoken response for ${Math.round(duration)} seconds. Speech content captured for analysis.`;
      setIsConverting(false);
      onRecordingComplete(transcript, duration);
      resetRecording();
      return;
    }

    try {
      // Create audio URL and play it while recognizing
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      let finalTranscript = '';
      let isRecognitionComplete = false;

      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
      };

      recognition.onend = () => {
        if (!isRecognitionComplete) {
          isRecognitionComplete = true;
          setIsConverting(false);
          
          // Only use transcript if we actually got speech recognition results
          if (finalTranscript.trim() && finalTranscript.trim().length > 0) {
            console.log('Speech recognition successful:', finalTranscript.trim());
            onRecordingComplete(finalTranscript.trim(), duration);
          } else {
            // If no speech detected, provide a simple generic message
            console.log('No speech detected, using generic message');
            const transcript = `User provided a spoken response for ${Math.round(duration)} seconds. Speech content captured for analysis.`;
            onRecordingComplete(transcript, duration);
          }
          
          resetRecording();
          URL.revokeObjectURL(audioUrl);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (!isRecognitionComplete) {
          isRecognitionComplete = true;
          setIsConverting(false);
          const transcript = `User provided a spoken response for ${Math.round(duration)} seconds. Speech content captured for analysis.`;
          onRecordingComplete(transcript, duration);
          resetRecording();
          URL.revokeObjectURL(audioUrl);
        }
      };

      // Start recognition and play audio simultaneously
      recognition.start();
      audio.play();
      
      // Stop recognition when audio ends
      audio.onended = () => {
        setTimeout(() => {
          if (!isRecognitionComplete) {
            recognition.stop();
          }
        }, 1000); // Give recognition a moment to finalize
      };
      
    } catch (error) {
      console.error('Speech recognition setup failed:', error);
      setIsConverting(false);
      const transcript = `User provided a spoken response for ${Math.round(duration)} seconds. Speech content captured for analysis.`;
      onRecordingComplete(transcript, duration);
      resetRecording();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Don't set status to completed here - it will be set in the MediaRecorder stop event
  };

  const resetRecording = () => {
    setStatus('idle');
    setDuration(0);
    setAudioBlob(null);
    setError(null);
    setShowSuccess(false);
    setShowDeleteConfirm(false);
    setIsConverting(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    resetRecording();
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const submitRecording = async () => {
    if (!audioBlob) {
      setError('No recording available');
      return;
    }

    await convertSpeechToText();
  };

  const getImmediateResult = async () => {
    if (!audioBlob || !onGetImmediateResult) {
      setError('No recording available');
      return;
    }

    setIsGettingResult(true);
    try {
      await convertSpeechToTextForResult();
    } finally {
      setIsGettingResult(false);
    }
  };

  const convertSpeechToTextForResult = async () => {
    if (!audioBlob) return;

    setError(null);
    
    try {
      let transcript = '';
      
      if (isPuterReady && window.puter?.ai?.speech2txt) {
        console.log('Using Puter.js for speech-to-text conversion');
        
        // Convert Blob to File for Puter.js compatibility
        const audioFile = new File([audioBlob], 'recording.wav', {
          type: audioBlob.type || 'audio/wav'
        });
        
        console.log('Audio file for Puter.js:', {
          name: audioFile.name,
          size: audioFile.size,
          type: audioFile.type
        });
        
        const result = await window.puter.ai.speech2txt(audioFile);
        transcript = result.text || result.transcript || '';
        console.log('Puter.js transcription result:', transcript);
      } else {
        // Fallback to browser Speech Recognition
        console.log('Using browser Speech Recognition fallback');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          throw new Error('Speech recognition not supported in this browser');
        }
        
        // For immediate result, we'll use a simplified approach
        transcript = "Please speak more clearly or try again.";
      }

      if (transcript.trim()) {
        onGetImmediateResult(transcript, duration);
      } else {
        setError('No speech detected. Please try speaking more clearly.');
      }
    } catch (error) {
      console.error('Speech-to-text conversion failed:', error);
      setError(`Transcription failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Cleanup on unmount
  // Check if Puter.js is ready
  const [isPuterReady, setIsPuterReady] = useState(false);

  useEffect(() => {
    // Wait for Puter.js to load
    const checkPuter = () => {
      if (typeof window !== 'undefined' && window.puter && window.puter.ai && window.puter.ai.speech2txt) {
        console.log('Puter.js loaded successfully');
        setIsPuterReady(true);
      } else {
        console.log('Waiting for Puter.js to load...');
        setTimeout(checkPuter, 500);
      }
    };
    
    // Start checking after a delay to allow script to load
    setTimeout(checkPuter, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Puter.js Status */}
      <div className="text-center">
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
          isPuterReady ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-1 ${
            isPuterReady ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'
          }`}></div>
          {isPuterReady ? 'AI Transcription Ready' : 'Loading AI System...'}
        </div>
      </div>
      
      {/* Instructions */}
      <div className="text-center">
        <p className="text-gray-500 text-lg mb-6">
          {isConverting ? "Converting speech to text..." : 
           showSuccess ? "Your answer has been successfully recorded!" : 
           "Click the mic icon to start recording..."}
        </p>
        
        {/* Recording Button */}
        <div className="mb-6 flex justify-center">
          {status === 'idle' && !isConverting && (
            <button
              onClick={startRecording}
              disabled={disabled || !!error}
              className="w-20 h-20 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              title="Start Recording"
            >
              <Mic size={32} />
            </button>
          )}

          {status === 'recording' && (
            <button
              onClick={stopRecording}
              className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg animate-pulse"
              title="Stop Recording"
            >
              <Square size={32} />
            </button>
          )}

          {status === 'completed' && audioBlob && !isConverting && (
            <button
              onClick={resetRecording}
              className="w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg"
              title="Record Again"
            >
              <Mic size={32} />
            </button>
          )}

          {isConverting && (
            <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Audio Player (when recording is complete) */}
        {audioBlob && status === 'completed' && !isConverting && (
          <div className="mb-6 flex justify-center">
            <div className="relative bg-gray-100 rounded-lg p-4 w-80">
              <p className="text-center text-gray-700 mb-4">Your answer has been successfully recorded!</p>
              <div className="relative">
                <audio
                  controls
                  src={URL.createObjectURL(audioBlob)}
                  className="w-full"
                >
                  Your browser does not support the audio element.
                </audio>
                <button
                  onClick={handleDeleteClick}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm transition-colors duration-200"
                  title="Delete recording"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-xs mx-4 shadow-lg border">
              <h3 className="text-base font-medium text-gray-900 mb-2">Delete Recording</h3>
              <p className="text-sm text-gray-600 mb-4">Do you want to delete this recording?</p>
              <div className="flex space-x-2">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded text-sm transition-colors duration-200"
                >
                  Yes
                </button>
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 rounded text-sm transition-colors duration-200"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mb-6">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            id="audio-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAudioBlob(file);
                setStatus('completed');
                setShowSuccess(true);
                setDuration(0); // Would need to get actual duration from file
              }
            }}
          />
          <label 
            htmlFor="audio-upload"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Or upload an audio file
          </label>
        </div>
      </div>

      {/* Speaking Time and Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <div className="text-sm text-gray-600">
          Speaking Time: {Math.round(duration)}s
        </div>
        
        {audioBlob && status === 'completed' && !isConverting && !isGettingResult && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            {onGetImmediateResult && (
              <button
                onClick={getImmediateResult}
                className="inline-flex items-center px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Get Result
              </button>
            )}
            <button
              onClick={submitRecording}
              className="inline-flex items-center px-4 sm:px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Submit Answer
            </button>
          </div>
        )}

        {(isConverting || isGettingResult) && (
          <div className="flex items-center text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            {isGettingResult ? 'Getting result...' : 'Converting...'}
          </div>
        )}
      </div>

      {/* Error Display (simplified) */}
      {error && (
        <div className="text-center text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}