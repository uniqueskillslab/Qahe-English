'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IELTSPart, IELTSAnalysis } from '@/types';
import TopicDisplay from '@/components/TopicDisplay';
import QuestionByQuestion from '@/components/QuestionByQuestion';
import ScoreDisplay from '@/components/ScoreDisplay';
import { Loader2 } from 'lucide-react';

type AppState = 'topic-selection' | 'recording' | 'processing' | 'results';

export default function Home() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>('topic-selection');
  const [currentTopic, setCurrentTopic] = useState<IELTSPart | null>(null);
  const [analysis, setAnalysis] = useState<IELTSAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allTranscripts, setAllTranscripts] = useState<string[]>([]);
  const [allDurations, setAllDurations] = useState<number[]>([]);
  const [hasAdvancedQuestions, setHasAdvancedQuestions] = useState(false);

  const fetchNewTopic = useCallback(async (part?: 1 | 2 | 3) => {
    try {
      setLoading(true);
      setError(null);
      setHasAdvancedQuestions(false); // Reset question advancement state
      
      const url = part ? `/api/topics?part=${part}` : '/api/topics';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch topic');
      }
      
      const data = await response.json();
      setCurrentTopic(data.topic);
      setAppState('recording');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleQuestionByQuestionComplete = useCallback(async (transcripts: string[], durations: number[]) => {
    setAllTranscripts(transcripts);
    setAllDurations(durations);
    
    if (!currentTopic) {
      setError('No topic selected');
      return;
    }
    
    try {
      setAppState('processing');
      setError(null);
      
      // Combine all transcripts
      const combinedTranscript = transcripts.join(' ');
      const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
      
      const analysisResponse = await fetch('/api/analyze-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: combinedTranscript,
          duration: totalDuration,
          topicTitle: currentTopic.title,
          part: currentTopic.part,
        }),
      });
      
      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Failed to analyze speech');
      }
      
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData.analysis);
      setAppState('results');
    } catch (err: any) {
      setError(err.message);
      setAppState('recording');
    }
  }, [currentTopic]);

  const handleNewAttempt = useCallback(() => {
    setAnalysis(null);
    setCurrentTopic(null);
    setAllTranscripts([]);
    setAllDurations([]);
    setAppState('topic-selection');
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            QAHE - IELTS Practice Platform
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Master your IELTS Speaking & Writing skills with AI-powered feedback
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-red-800">Something went wrong</p>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content based on current state */}
        <div className="space-y-8">
          {/* Topic Selection - Hide when showing results */}
          {appState !== 'results' && (
            <>
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <TopicDisplay
                  topic={currentTopic}
                  onNewTopic={fetchNewTopic}
                  onHome={() => {
                    setCurrentTopic(null);
                    setAppState('topic-selection');
                    setHasAdvancedQuestions(false);
                  }}
                  showNewTopicButton={!hasAdvancedQuestions}
                  loading={loading}
                />
              </div>
              
              {/* IELTS Writing Practice Module Card */}
              {appState === 'topic-selection' && !currentTopic && (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                        IELTS Writing Practice
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                        Master your <strong>IELTS Writing</strong> skills with AI-powered feedback. Practice Task 1 & Task 2 
                        with realistic exam conditions, timers, word counters, and instant band score analysis.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-blue-700 mb-2">Task 1 Academic</h4>
                          <p className="text-sm text-blue-600">Graph, chart, table & process descriptions with 20-min timer</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                          <div className="w-10 h-10 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 9M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-green-700 mb-2">Task 1 General</h4>
                          <p className="text-sm text-green-600">Letter writing practice with formal, semi-formal & informal styles</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-purple-700 mb-2">Task 2 Essays</h4>
                          <p className="text-sm text-purple-600">Opinion, discussion & problem-solution essays with 40-min timer</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6 max-w-lg mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium text-orange-700">Live Timer & Word Count</span>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 border border-pink-100">
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <span className="text-sm font-medium text-pink-700">AI Band Score Feedback</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                        onClick={() => router.push('/writing')}
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Start Writing Practice
                      </button>
                      
                      <p className="text-xs text-gray-500 mt-4">
                        ✍️ Complete writing solution with authentic IELTS tasks & AI examiner feedback
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Advanced Audio Worklet Demo Card */}
              {appState === 'topic-selection' && !currentTopic && (
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                  <div className="p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.78 0-2.678-2.153-1.415-3.414l5-5A2 2 0 009 9.172V5L8 4z" />
                        </svg>
                      </div>
                      
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        Advanced Audio Analysis
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl mx-auto">
                        Experience our cutting-edge <strong>Audio Worklet technology</strong> with real-time voice processing, 
                        detailed word-level pronunciation analysis, and comprehensive IELTS scoring.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-blue-700 mb-2">Real-time Processing</h4>
                          <p className="text-sm text-blue-600">Live volume and pitch detection during recording</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                          <div className="w-10 h-10 bg-green-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-green-700 mb-2">Pronunciation Scoring</h4>
                          <p className="text-sm text-green-600">Individual word accuracy with phonetic feedback</p>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-purple-700 mb-2">Advanced Analytics</h4>
                          <p className="text-sm text-purple-600">Comprehensive IELTS scoring with fluency metrics</p>
                        </div>
                      </div>
                      
                      <a 
                        href="/audio-worklet-demo" 
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Try Advanced Audio Analysis
                      </a>
                      
                      <p className="text-xs text-gray-500 mt-4">
                        💡 Features cutting-edge Audio Worklet technology with intelligent fallbacks
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recording Interface */}
          {appState === 'recording' && currentTopic && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <QuestionByQuestion 
                topic={currentTopic}
                onComplete={handleQuestionByQuestionComplete}
                onNewTopic={() => {
                  setCurrentTopic(null);
                  setAppState('topic-selection');
                  setHasAdvancedQuestions(false);
                }}
                onHome={() => {
                  setCurrentTopic(null);
                  setAppState('topic-selection');
                  setHasAdvancedQuestions(false);
                }}
                onQuestionAdvance={() => setHasAdvancedQuestions(true)}
              />
            </div>
          )}

          {/* Processing */}
          {appState === 'processing' && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-lg">
                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-20 animate-ping"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  AI Analysis in Progress
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our advanced AI examiner is carefully analyzing your speaking performance, 
                  evaluating fluency, vocabulary, grammar, and pronunciation to provide 
                  detailed professional feedback.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span>This may take a few moments</span>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {appState === 'results' && analysis && (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <ScoreDisplay
                analysis={analysis}
                onNewAttempt={handleNewAttempt}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
