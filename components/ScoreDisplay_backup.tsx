'use client';

import { IELTSAnalysis } from '@/types';
import { getBandDescriptor } from '@/utils/ieltsUtils';
import { TrendingUp, Clock, FileText, Target, BookOpen, Star, AlertTriangle } from 'lucide-react';

interface ScoreDisplayProps {
  analysis: IELTSAnalysis;
  onNewAttempt?: () => void;
}

export default function ScoreDisplay({ analysis, onNewAttempt }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-50';
    if (score >= 6.5) return 'text-blue-600 bg-blue-50';
    if (score >= 5) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6.5) return 'bg-blue-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const ScoreCircle = ({ score, label }: { score: number; label: string }) => (
    <div className="text-center group">
      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold transition-all duration-300 group-hover:scale-105 shadow-xl ${
        score >= 8 ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
        score >= 6.5 ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white' :
        score >= 5 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
        'bg-gradient-to-br from-red-400 to-rose-500 text-white'
      }`}>
        {score}
      </div>
      <p className="text-sm font-semibold text-gray-800 mt-3">{label}</p>
      <p className="text-xs text-gray-500">{getBandDescriptor(score)}</p>
    </div>
  );

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center text-sm mb-3">
        <span className="font-semibold text-gray-800">{label}</span>
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gray-900 text-lg">{score}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{getBandDescriptor(score)}</span>
        </div>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-1000 ease-out shadow-inner ${
            score >= 8 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
            score >= 6.5 ? 'bg-gradient-to-r from-blue-400 to-indigo-500' :
            score >= 5 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
            'bg-gradient-to-r from-red-400 to-rose-500'
          }`}
          style={{ width: `${(score / 9) * 100}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Overall Score Hero Section */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-2xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Your IELTS Speaking Assessment</h2>
          <div className="relative inline-block">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center text-6xl font-bold shadow-2xl transition-all duration-500 hover:scale-105 ${
              analysis.scores.overall >= 8 ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
              analysis.scores.overall >= 6.5 ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white' :
              analysis.scores.overall >= 5 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
              'bg-gradient-to-br from-red-400 to-rose-500 text-white'
            }`}>
              {analysis.scores.overall}
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="mt-6">
            <p className="text-xl font-semibold text-gray-700">{getBandDescriptor(analysis.scores.overall)}</p>
            <p className="text-base text-gray-600 mt-1">Overall Band Score</p>
          </div>
          {analysis.analysisSource && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-700 font-medium">Analyzed by {analysis.analysisSource}</span>
            </div>
          )}
          
          {/* AI Evaluation Disclaimer */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-xs text-amber-800">
                <p className="font-medium">AI-Generated Assessment</p>
                <p className="mt-1">This evaluation is provided for practice purposes and may not reflect official IELTS scoring standards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <Target className="mr-3 w-8 h-8 text-blue-500" />
          Detailed Score Breakdown
        </h3>

        {/* Individual Scores Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <ScoreCircle score={analysis.scores.fluencyCoherence} label="Fluency & Coherence" />
          <ScoreCircle score={analysis.scores.lexicalResource} label="Lexical Resource" />
          <ScoreCircle score={analysis.scores.grammaticalRange} label="Grammar" />
          <ScoreCircle score={analysis.scores.pronunciation} label="Pronunciation" />
        </div>

        {/* Score Bars */}
        <div className="space-y-4">
          <ScoreBar score={analysis.scores.fluencyCoherence} label="Fluency & Coherence" />
          <ScoreBar score={analysis.scores.lexicalResource} label="Lexical Resource" />
          <ScoreBar score={analysis.scores.grammaticalRange} label="Grammatical Range & Accuracy" />
          <ScoreBar score={analysis.scores.pronunciation} label="Pronunciation" />
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{Math.round(analysis.duration)}s</div>
          <div className="text-sm text-gray-600 mt-1">Speaking Duration</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((analysis.duration / 120) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{analysis.wordCount}</div>
          <div className="text-sm text-gray-600 mt-1">Total Words</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min((analysis.wordCount / 200) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white/40 shadow-xl text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {Math.round((analysis.wordCount / analysis.duration) * 60)}
          </div>
          <div className="text-sm text-gray-600 mt-1">Words per Minute</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(((analysis.wordCount / analysis.duration) * 60 / 180) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Detailed Feedback</h3>
        
        {/* Strengths */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            Strengths Identified
          </h4>
          <div className="grid gap-3">
            {analysis.feedback.strengths && analysis.feedback.strengths.length > 0 ? (
              analysis.feedback.strengths.map((strength, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-green-800 font-medium leading-relaxed">{strength}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <p className="text-green-800 font-medium leading-relaxed">Detailed strengths analysis will be available soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            Areas for Improvement
          </h4>
          <div className="grid gap-3">
            {analysis.feedback.improvementSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-orange-800 font-medium leading-relaxed">{suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Guidance placeholder */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Improvement Guidance</h3>
        <p className="text-gray-600">Advanced feedback features coming soon...</p>
      </div>

      {/* Transcript */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/40 shadow-xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-gray-500 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m-10 4h10m-10 4h10M3 6h18a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z" />
            </svg>
          </div>
          Your Original Response
        </h3>
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-inner">
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-800 leading-relaxed text-lg">{analysis.transcript}</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
            <span>Recorded on {new Date(analysis.analysisDate).toLocaleDateString()}</span>
            <span>{analysis.wordCount} words in {Math.round(analysis.duration)} seconds</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {onNewAttempt && (
        <div className="text-center">
          <button
            onClick={onNewAttempt}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Practice Another Topic</span>
          </button>
          <p className="text-gray-600 text-sm mt-3">
            Continue practicing to improve your IELTS speaking skills
          </p>
        </div>
      )}
    </div>
  );
}