'use client';

import { useState, useEffect } from 'react';
import WritingPracticeLayout from '@/components/WritingPracticeLayout';
import { getRandomQuestion, task1AcademicQuestions, WritingQuestion } from '@/data/writingQuestions';

export default function Task1AcademicPage() {
  const [currentQuestion, setCurrentQuestion] = useState<WritingQuestion | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial question on mount
  useEffect(() => {
    const newQuestion = getRandomQuestion('task1-academic');
    setCurrentQuestion(newQuestion);
    setIsLoading(false);
  }, []);

  // Handle getting a new question
  const handleNewQuestion = () => {
    const newQuestion = getRandomQuestion('task1-academic');
    setCurrentQuestion(newQuestion);
  };

  // Show loading state
  if (isLoading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <WritingPracticeLayout
      question={currentQuestion}
      onNewQuestion={handleNewQuestion}
      taskType="task1"
      pageTitle="Task 1 Academic"
    />
  );
}