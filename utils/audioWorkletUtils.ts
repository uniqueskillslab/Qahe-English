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

export class AudioWorkletRecorder {
  private audioContext: AudioContext | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioWorkletNode: AudioWorkletNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private stream: MediaStream | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private onAnalysisCallback?: (analysis: AudioAnalysis) => void;

  async initialize(onAnalysisCallback?: (analysis: AudioAnalysis) => void): Promise<void> {
    try {
      this.onAnalysisCallback = onAnalysisCallback;
      
      // Get microphone stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        }
      });

      // Create AudioContext
      this.audioContext = new AudioContext({ sampleRate: 16000 });
      
      try {
        // Try to load Audio Worklet
        await this.audioContext.audioWorklet.addModule('/audio-worklet-processor.js');
        
        // Create nodes
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyserNode = this.audioContext.createAnalyser();
        this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'audio-analyzer-processor');
        
        // Connect audio graph
        source.connect(this.analyserNode);
        this.analyserNode.connect(this.audioWorkletNode);
        this.audioWorkletNode.connect(this.audioContext.destination);
        
        // Listen for analysis data
        this.audioWorkletNode.port.onmessage = (event) => {
          if (event.data.type === 'audioAnalysis' && this.onAnalysisCallback) {
            this.onAnalysisCallback(event.data.data);
          }
        };
        
        console.log('Audio Worklet loaded successfully');
        
      } catch (workletError) {
        console.warn('Audio Worklet failed to load, using fallback analysis:', workletError);
        
        // Fallback: basic analyser node without worklet
        const source = this.audioContext.createMediaStreamSource(this.stream);
        this.analyserNode = this.audioContext.createAnalyser();
        source.connect(this.analyserNode);
        
        // Start basic monitoring for fallback
        this.startBasicAnalysis();
      }

      // Setup MediaRecorder for recording
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

    } catch (error: any) {
      throw new Error(`Failed to initialize audio worklet recorder: ${error?.message || 'Unknown error'}`);
    }
  }

  async startRecording(): Promise<void> {
    if (!this.mediaRecorder || !this.audioContext) {
      throw new Error('Audio worklet recorder not initialized');
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.audioChunks = [];
    this.mediaRecorder.start(100);
    this.isRecording = true;
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = () => {
        reject(new Error('Recording failed'));
      };

      this.mediaRecorder.stop();
    });
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  private fallbackAnalysisInterval?: NodeJS.Timeout;

  getRecordingState(): string {
    return this.mediaRecorder?.state || 'inactive';
  }

  private startBasicAnalysis(): void {
    if (!this.analyserNode || !this.onAnalysisCallback) return;
    
    this.fallbackAnalysisInterval = setInterval(() => {
      if (!this.analyserNode || !this.onAnalysisCallback) return;
      
      // Get frequency data for basic analysis
      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyserNode.getByteFrequencyData(dataArray);
      
      // Calculate simple volume from frequency data
      const sum = dataArray.reduce((acc, val) => acc + val, 0);
      const average = sum / bufferLength;
      const volume = Math.min(1, average / 128); // Normalize to 0-1
      
      // Simple analysis without complex processing
      const analysis = {
        volume,
        pitch: 0, // No pitch detection in fallback
        timestamp: Date.now() / 1000,
        isSpeaking: volume > 0.01
      };
      
      this.onAnalysisCallback(analysis);
    }, 100);
  }

  getFrequencyData(): Uint8Array | null {
    if (!this.analyserNode) return null;
    
    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  cleanup(): void {
    if (this.fallbackAnalysisInterval) {
      clearInterval(this.fallbackAnalysisInterval);
      this.fallbackAnalysisInterval = undefined;
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect();
      this.audioWorkletNode = null;
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
  }
}