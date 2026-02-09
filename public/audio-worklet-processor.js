class AudioAnalyzerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 1024;
    this.sampleRate = 16000;
    this.volumeHistory = [];
    this.pitchHistory = [];
    this.frameCount = 0;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    if (input.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      // Copy input to output (passthrough)
      for (let i = 0; i < inputChannel.length; i++) {
        outputChannel[i] = inputChannel[i];
      }

      // Analyze audio
      const analysis = this.analyzeAudio(inputChannel);
      
      // Send analysis data to main thread every 10 frames (~100ms at 48kHz)
      if (this.frameCount % 10 === 0) {
        this.port.postMessage({
          type: 'audioAnalysis',
          data: analysis
        });
      }
      
      this.frameCount++;
    }

    return true;
  }

  analyzeAudio(audioData) {
    // Calculate RMS volume
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i];
    }
    const rms = Math.sqrt(sum / audioData.length);
    const volume = Math.max(0, Math.min(1, rms * 10)); // Normalize and scale

    // Simple pitch detection using autocorrelation
    const pitch = this.detectPitch(audioData);

    // Keep history for smoothing
    this.volumeHistory.push(volume);
    this.pitchHistory.push(pitch);
    
    if (this.volumeHistory.length > 10) {
      this.volumeHistory.shift();
      this.pitchHistory.shift();
    }

    // Calculate smoothed values
    const smoothVolume = this.volumeHistory.reduce((a, b) => a + b, 0) / this.volumeHistory.length;
    const smoothPitch = this.pitchHistory.filter(p => p > 0).reduce((a, b) => a + b, 0) / 
                        Math.max(1, this.pitchHistory.filter(p => p > 0).length);

    return {
      volume: smoothVolume,
      pitch: smoothPitch || 0,
      timestamp: currentTime,
      isSpeaking: volume > 0.01
    };
  }

  detectPitch(audioData) {
    const minFreq = 80;  // Minimum frequency to detect
    const maxFreq = 400; // Maximum frequency to detect
    const minPeriod = Math.floor(this.sampleRate / maxFreq);
    const maxPeriod = Math.floor(this.sampleRate / minFreq);

    let bestPeriod = 0;
    let bestCorrelation = 0;

    // Autocorrelation-based pitch detection
    for (let period = minPeriod; period <= maxPeriod && period < audioData.length / 2; period++) {
      let correlation = 0;
      for (let i = 0; i < audioData.length - period; i++) {
        correlation += audioData[i] * audioData[i + period];
      }
      
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    if (bestPeriod > 0 && bestCorrelation > 0.3) {
      return this.sampleRate / bestPeriod;
    }

    return 0; // No pitch detected
  }
}

registerProcessor('audio-analyzer-processor', AudioAnalyzerProcessor);