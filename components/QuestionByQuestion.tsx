'use client';

import { useState } from 'react';
import { IELTSPart } from '@/types';
import VoiceRecorderWithSpeechAPI from './VoiceRecorderWithSpeechAPI';
import ScoreDisplay from './ScoreDisplay';

interface QuestionByQuestionProps {
  topic: IELTSPart;
  onComplete: (allTranscripts: string[], allDurations: number[]) => void;
  onNewTopic: () => void;
  onHome: () => void;
  onQuestionAdvance?: () => void;
}

export default function QuestionByQuestion({ topic, onComplete, onNewTopic, onHome, onQuestionAdvance }: QuestionByQuestionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [recordings, setRecordings] = useState<{ transcript: string; duration: number }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [immediateResult, setImmediateResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);

  const questions = [...(topic.questions || []), ...followUpQuestions];
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleRecordingComplete = (transcript: string, duration: number) => {
    const newRecording = { transcript, duration };
    
    // For multiple recordings of the same question, replace the previous one instead of accumulating
    const updatedRecordings = [...recordings.slice(0, currentQuestionIndex), newRecording];
    setRecordings(updatedRecordings);

    // Clear any immediate results when submitting answer
    setImmediateResult(null);

    if (isLastQuestion) {
      // All questions completed
      const allTranscripts = updatedRecordings.map(r => r.transcript);
      const allDurations = updatedRecordings.map(r => r.duration);
      onComplete(allTranscripts, allDurations);
    } else {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleImmediateResult = async (transcript: string, duration: number) => {
    setIsAnalyzing(true);
    setImmediateResult(null);

    try {
      console.log('Sending analysis request:', {
        transcript,
        duration,
        topicTitle: currentQuestion,
        part: topic.part,
      });

      const response = await fetch('/api/analyze-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          duration,
          topicTitle: currentQuestion,
          part: topic.part,
        }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        // The API returns { analysis } so we need to extract the analysis object
        const data = responseData;
        console.log('Processing response data:', data);
        
        if (data.analysis) {
          setImmediateResult(data.analysis);
          
          // Generate follow-up questions based on user's response
          if (transcript && transcript.length > 10) {
            await generateFollowUpQuestions(transcript, currentQuestion);
          }
        } else {
          console.error('No analysis object in response:', data);
          setImmediateResult({
            error: 'Invalid response format from analysis service.',
            transcript,
            duration
          });
        }
      } else {
        console.error('API returned error:', responseData);
        setImmediateResult({
          error: responseData.error || 'Analysis failed. Please try again.',
          transcript,
          duration
        });
      }
    } catch (error) {
      console.error('Network error analyzing speech:', error);
      setImmediateResult({
        error: 'Network error. Please check your connection and try again.',
        transcript,
        duration
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFollowUpQuestions = async (userResponse: string, originalQuestion: string) => {
    try {
      const response = await fetch('/api/generate-followup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userResponse,
          originalQuestion,
          part: topic.part,
          topicTitle: topic.title
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.followUpQuestions && Array.isArray(data.followUpQuestions)) {
          setFollowUpQuestions(data.followUpQuestions);
        }
      }
    } catch (error) {
      console.log('Could not generate follow-up questions:', error);
      // Fail silently as this is an enhancement feature
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setImmediateResult(null);
      // Clear follow-ups when going back to original questions
      if (currentQuestionIndex <= (topic.questions?.length || 0)) {
        setFollowUpQuestions([]);
      }
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setImmediateResult(null);
      onQuestionAdvance?.();
    }
  };

  if (!questions.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 px-4">{topic.title}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-4">{topic.description}</p>
          
          <VoiceRecorderWithSpeechAPI
            onRecordingComplete={handleRecordingComplete}
            onGetImmediateResult={handleImmediateResult}
            disabled={isRecording}
            maxDuration={topic.timeLimit * 60}
          />
          
          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="py-8">
              <div className="inline-flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-lg font-medium">Analyzing your response...</span>
              </div>
            </div>
          )}

          {/* Immediate Result Display */}
          {immediateResult && !isAnalyzing && (
            <div className="space-y-4 mt-8">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your Result</h3>
              </div>
              {immediateResult.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <div className="text-red-600 font-medium mb-2">Analysis Error</div>
                  <p className="text-red-700 text-sm">{immediateResult.error}</p>
                  <button
                    onClick={() => setImmediateResult(null)}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <ScoreDisplay 
                  analysis={immediateResult} 
                  onNewAttempt={() => setImmediateResult(null)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-4">{topic.title}</h1>
        <p className="text-sm sm:text-base text-gray-600">Answer questions 1-{questions.length}</p>
      </div>

      {/* Navigation and Question */}
      <div className="space-y-6 sm:space-y-8">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            ← Previous Question
          </button>
          
          <button
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            Next Question →
          </button>
        </div>

        {/* Question */}
        <div className="text-center space-y-4 sm:space-y-6">
          <div>
            {/* Question Header with Type Indication */}
            <div className="mb-2 sm:mb-3">
              {currentQuestionIndex < (topic.questions?.length || 0) ? (
                <h3 className="text-base sm:text-lg font-medium text-gray-700">
                  Question {currentQuestionIndex + 1}:
                </h3>
              ) : (
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-medium text-blue-700">
                    Follow-up Question {currentQuestionIndex - (topic.questions?.length || 0) + 1}:
                  </h3>
                  <p className="text-xs text-blue-600">
                    ✨ Based on your previous response
                  </p>
                </div>
              )}
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 max-w-3xl mx-auto px-4">
              {currentQuestion}
            </h2>
            
            {/* Progress Indicator */}
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600'
                        : index < currentQuestionIndex
                        ? 'bg-green-500'
                        : index < (topic.questions?.length || 0)
                        ? 'bg-gray-300'
                        : 'bg-blue-200'
                    }`}
                    title={
                      index < (topic.questions?.length || 0)
                        ? `Original Question ${index + 1}`
                        : `Follow-up Question ${index - (topic.questions?.length || 0) + 1}`
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recording Interface */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-8">
            <VoiceRecorderWithSpeechAPI
              onRecordingComplete={handleRecordingComplete}
              onGetImmediateResult={handleImmediateResult}
              disabled={isRecording}
              maxDuration={topic.timeLimit * 60}
            />
          </div>
        </div>

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="text-center py-8">
            <div className="inline-flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-lg font-medium">Analyzing your response...</span>
            </div>
          </div>
        )}

        {/* Immediate Result Display */}
        {immediateResult && !isAnalyzing && (
          <div className="space-y-4">
            <div className="text-center">
              {currentQuestionIndex < (topic.questions?.length || 0) ? (
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Your Result for Question {currentQuestionIndex + 1}
                </h3>
              ) : (
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  Your Result for Follow-up Question {currentQuestionIndex - (topic.questions?.length || 0) + 1}
                </h3>
              )}
              <p className="text-gray-600 text-sm mb-4">
                You can continue to the next question or practice this question again.
              </p>
            </div>
            {immediateResult.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 font-medium mb-2">Analysis Error</div>
                <p className="text-red-700 text-sm">{immediateResult.error}</p>
                <button
                  onClick={() => setImmediateResult(null)}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <ScoreDisplay 
                analysis={immediateResult} 
                onNewAttempt={() => setImmediateResult(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}