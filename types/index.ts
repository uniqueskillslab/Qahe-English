export interface IELTSPart {
  id: string;
  part: 1 | 2 | 3;
  title: string;
  description: string;
  questions?: string[];
  timeLimit: number; // in minutes
  preparationTime?: number; // in minutes, for part 2
}

export interface IELTSScore {
  lexicalResource: number;
  grammaticalRange: number;
  overall: number;
}

export interface IELTSAnalysis {
  transcript: string;
  scores: IELTSScore;
  feedback: {
    lexicalResource: string;
    grammaticalRange: string;
    overallFeedback: string;
    strengths?: string[]; // Optional strengths identified
    improvementSuggestions: string[];
    improvementGuidance: {
      isRelevantResponse: boolean;
      specificImprovements: string[];
      exampleResponse?: string; // 8-band example if response was irrelevant or poor
      betterVersion?: string; // Improved version of their response
    };
  };
  wordCount: number;
  duration: number; // in seconds
  analysisDate: Date;
  analysisSource?: string; // Which AI service was used
}

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export interface SessionResult {
  id: string;
  topic: IELTSPart;
  analysis: IELTSAnalysis;
  createdAt: Date;
}

export type RecordingStatus = 'idle' | 'recording' | 'paused' | 'completed';

// Audio Worklet and Pronunciation Analysis Types
export interface AudioAnalysis {
  volume: number;
  pitch: number;
  timestamp: number;
  isSpeaking: boolean;
}

export interface PronunciationAnalysis {
  word: string;
  phonemes: string[];
  accuracy: number;
  errors: string[];
  suggestions: string[];
}

export interface WordLevelResult {
  word: string;
  startTime: number;
  endTime: number;
  accuracy: number;
  pronunciation: PronunciationAnalysis;
  confidence: number;
}

export interface EnhancedIELTSAnalysis extends IELTSAnalysis {
  pronunciationScore?: number;
  wordLevelResults?: WordLevelResult[];
  fluencyMetrics?: {
    speechRate: number; // words per minute
    pauseCount: number;
    fillerWords: number;
    articulation: number; // clarity score
  };
}