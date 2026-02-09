'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, FileText, Timer as TimerIcon, CheckCircle, Loader2 } from 'lucide-react';
import Timer from '@/components/Timer';
import WordCounter from '@/components/WordCounter';
import WritingEditor from '@/components/WritingEditor';
import { WritingQuestion } from '@/data/writingQuestions';

interface WritingPracticeLayoutProps {
  /**
   * Current question data
   */
  question: WritingQuestion;
  /**
   * Function to get a new random question
   */
  onNewQuestion: () => void;
  /**
   * Task type for word counter configuration
   */
  taskType: 'task1' | 'task2';
  /**
   * Page title for display
   */
  pageTitle: string;
}

export default function WritingPracticeLayout({
  question,
  onNewQuestion,
  taskType,
  pageTitle
}: WritingPracticeLayoutProps) {
  const router = useRouter();
  const [currentText, setCurrentText] = useState('');
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Generate storage key for this specific question
  const storageKey = `writing-${question.type}-${question.id}`;

  // Clear stored text when question changes
  useEffect(() => {
    setCurrentText('');
    setSubmissionResult(null); // Clear previous results
  }, [question.id]);

  // Handle timer completion
  const handleTimeUp = () => {
    alert('Time is up! You can continue writing, but consider reviewing and finalizing your answer.');
  };

  // Handle new question
  const handleNewQuestion = () => {
    if (currentText.trim() && !confirm('Getting a new question will clear your current answer. Continue?')) {
      return;
    }
    
    // Clear localStorage for current question
    localStorage.removeItem(storageKey);
    onNewQuestion();
  };

  // Handle reset answer
  const handleResetAnswer = () => {
    if (!currentText.trim() || confirm('Are you sure you want to clear your answer? This cannot be undone.')) {
      localStorage.removeItem(storageKey);
      setCurrentText('');
      setSubmissionResult(null);
    }
  };

  // Handle submit for evaluation
  const handleSubmit = async () => {
    if (!currentText.trim()) {
      alert('Please write your answer before submitting.');
      return;
    }

    const wordCount = currentText.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount < question.minWords) {
      if (!confirm(`Your answer has only ${wordCount} words, but ${question.minWords} words are required. Submit anyway?`)) {
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      // Simulate API call for evaluation (replace with real API later)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock evaluation result
      const mockResult = {
        overallBand: Math.floor(Math.random() * 3) + 6, // 6.0 - 8.5
        taskResponseScore: Math.floor(Math.random() * 3) + 6,
        coherenceScore: Math.floor(Math.random() * 3) + 6,
        lexicalScore: Math.floor(Math.random() * 3) + 6,
        grammarScore: Math.floor(Math.random() * 3) + 6,
        wordCount,
        feedback: [
          'Good vocabulary range with some sophisticated words',
          'Clear paragraph structure with logical progression',
          'Some minor grammatical errors that don\'t impede understanding',
          'Task requirements adequately addressed',
          'Consider varying sentence structures for higher scores'
        ],
        strengths: ['Clear organization', 'Good task response', 'Appropriate vocabulary'],
        improvements: ['Grammar accuracy', 'Sentence variety', 'More sophisticated language']
      };
      
      setSubmissionResult(mockResult);
    } catch (error) {
      alert('Failed to evaluate your writing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Target word count based on task type
  const targetWords = taskType === 'task1' ? 175 : 275; // Slightly above minimum for better scoring

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button and title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/writing')}
                className="
                  flex items-center space-x-2 px-3 py-2 rounded-lg
                  text-gray-600 hover:text-gray-800 hover:bg-gray-100
                  transition-colors duration-200
                "
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-lg font-semibold text-gray-800">{pageTitle}</h1>
                <p className="text-sm text-gray-600">{question.title}</p>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsTimerVisible(!isTimerVisible)}
                className="
                  flex items-center space-x-2 px-3 py-2 rounded-lg
                  text-gray-600 hover:text-gray-800 hover:bg-gray-100
                  transition-colors duration-200
                "
                title={isTimerVisible ? 'Hide Timer' : 'Show Timer'}
              >
                <TimerIcon className="w-4 h-4" />
                <span>{isTimerVisible ? 'Hide' : 'Show'} Timer</span>
              </button>
              
              <button
                onClick={handleNewQuestion}
                className="
                  flex items-center space-x-2 px-3 py-2 rounded-lg
                  bg-blue-500 hover:bg-blue-600 text-white
                  transition-colors duration-200
                "
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Question</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Timer Bar (when visible) */}
      {isTimerVisible && (
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto">
            <Timer
              duration={question.timeLimit}
              autoStart={false}
              onTimeUp={handleTimeUp}
              onTick={setTimeRemaining}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Column - Question */}
          <div className="space-y-6">
            {/* Question Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6" />
                  <div>
                    <h2 className="text-lg font-semibold">{question.title}</h2>
                    <p className="text-blue-100 text-sm">
                      {question.timeLimit} minutes • Minimum {question.minWords} words
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose prose-blue max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {question.prompt}
                  </div>
                </div>

                {/* Task Description */}
                {question.taskDescription && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Task Overview:</h4>
                    <p className="text-blue-700 text-sm">{question.taskDescription}</p>
                  </div>
                )}

                {/* Writing Tips */}
                {question.tips && question.tips.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">💡 Writing Tips:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {question.tips.map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Word Counter */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6">
                <WordCounter
                  text={currentText}
                  targetWords={targetWords}
                  taskType={taskType}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Writing Editor */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="p-6">
                <WritingEditor
                  storageKey={storageKey}
                  onChange={setCurrentText}
                  placeholder={`Start writing your ${taskType === 'task1' ? 'Task 1' : 'Task 2'} response here...\n\nRemember:\n• Minimum ${question.minWords} words\n• ${question.timeLimit} minutes time limit\n• Check grammar and spelling\n• Plan before writing`}
                  minHeight="min-h-[500px]"
                />

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between items-center">
                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={!currentText.trim() || isSubmitting}
                    className="
                      flex items-center space-x-2 px-6 py-3 rounded-lg
                      bg-gradient-to-r from-green-500 to-emerald-500 
                      hover:from-green-600 hover:to-emerald-600
                      disabled:from-gray-300 disabled:to-gray-400
                      text-white font-medium transition-all duration-200
                      shadow-lg hover:shadow-xl disabled:shadow-none
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Checking...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Check My Writing</span>
                      </>
                    )}
                  </button>

                  {/* Reset Button */}
                  <button
                    onClick={handleResetAnswer}
                    disabled={!currentText.trim() || isSubmitting}
                    className="
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      bg-red-500 hover:bg-red-600 disabled:bg-gray-300
                      text-white text-sm font-medium transition-colors duration-200
                    "
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Answer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Time Remaining
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {(currentText.trim().split(/\s+/).filter(word => word.length > 0).length / targetWords * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-wide">
                    Target Progress
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Results */}
            {submissionResult && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6" />
                    <div>
                      <h3 className="text-lg font-semibold">Writing Evaluation</h3>
                      <p className="text-green-100 text-sm">AI Assessment Complete</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Overall Score */}
                  <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      Band {submissionResult.overallBand}.0
                    </div>
                    <div className="text-sm text-blue-700 font-medium">
                      Overall IELTS Band Score
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-800">{submissionResult.taskResponseScore}.0</div>
                      <div className="text-xs text-gray-600">Task Achievement</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-800">{submissionResult.coherenceScore}.0</div>
                      <div className="text-xs text-gray-600">Coherence & Cohesion</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-800">{submissionResult.lexicalScore}.0</div>
                      <div className="text-xs text-gray-600">Lexical Resource</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-lg font-bold text-gray-800">{submissionResult.grammarScore}.0</div>
                      <div className="text-xs text-gray-600">Grammar & Accuracy</div>
                    </div>
                  </div>

                  {/* Word Count */}
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                    <div className="text-sm text-yellow-800">
                      <span className="font-medium">Word Count:</span> {submissionResult.wordCount} words
                      {submissionResult.wordCount < question.minWords && (
                        <span className="text-red-600 ml-2">⚠️ Below minimum requirement</span>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">✅ Strengths:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {submissionResult.strengths.map((strength: string, index: number) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">🔧 Areas for Improvement:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {submissionResult.improvements.map((improvement: string, index: number) => (
                          <li key={index}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">💡 Detailed Feedback:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {submissionResult.feedback.map((feedback: string, index: number) => (
                          <li key={index}>• {feedback}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}