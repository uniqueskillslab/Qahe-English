'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, FileText, PenTool, Target, ChevronRight } from 'lucide-react';

export default function WritingDashboard() {
  const router = useRouter();

  const taskCards = [
    {
      id: 'task-1-academic',
      title: 'Task 1 Academic',
      description: 'Describe charts, graphs, tables, maps, and process diagrams',
      timeLimit: '20 minutes',
      minWords: 150,
      examples: 'Bar charts, line graphs, pie charts, maps, processes',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      route: '/writing/task-1-academic',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    },
    {
      id: 'task-1-general',
      title: 'Task 1 General',
      description: 'Write formal, semi-formal, and informal letters',
      timeLimit: '20 minutes',
      minWords: 150,
      examples: 'Complaint letters, application letters, invitations',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      route: '/writing/task-1-general',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 9M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    },
    {
      id: 'task-2-essay',
      title: 'Task 2 Essay',
      description: 'Write opinion, discussion, and problem-solution essays',
      timeLimit: '40 minutes',
      minWords: 250,
      examples: 'Opinion essays, argumentative essays, problem-solution',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      route: '/writing/task-2',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="
                  flex items-center space-x-2 px-3 py-2 rounded-lg
                  text-gray-600 hover:text-gray-800 hover:bg-gray-100
                  transition-colors duration-200
                "
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-800">IELTS Writing Practice</h1>
                <p className="text-sm text-gray-600">Choose a task to start practicing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Master IELTS Writing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice authentic IELTS writing tasks with time limits, word counters, 
            and instant feedback. Choose from academic or general training formats.
          </p>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {taskCards.map((task) => (
            <div
              key={task.id}
              className={`
                bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border-2 ${task.borderColor}
                transform transition-all duration-200 hover:scale-105 hover:shadow-xl
                overflow-hidden group cursor-pointer
              `}
              onClick={() => router.push(task.route)}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${task.color} text-white p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {task.icon}
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{task.title}</h3>
                <p className="text-sm opacity-90">{task.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Task Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">{task.timeLimit}</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">Minimum {task.minWords} words</span>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-500 mt-0.5" />
                    <span className="text-gray-600 text-sm leading-relaxed">{task.examples}</span>
                  </div>
                </div>

                {/* Sample Questions Note */}
                <div className={`bg-gradient-to-r ${task.bgColor} rounded-lg p-3 border ${task.borderColor}`}>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">5+ practice questions</span> with authentic IELTS format
                  </p>
                </div>

                {/* Start Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(task.route);
                  }}
                  className={`
                    w-full flex items-center justify-center space-x-2 py-3 rounded-xl
                    bg-gradient-to-r ${task.color} text-white font-medium
                    hover:shadow-lg transition-all duration-200
                    group-hover:scale-105
                  `}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Start Practice</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Writing Tips Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            📝 General Writing Tips
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">⏰ Time Management</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Plan before writing (5 minutes)</li>
                <li>• Leave time for checking (5 minutes)</li>
                <li>• Practice with timer regularly</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">📝 Structure & Content</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Clear introduction and conclusion</li>
                <li>• One main idea per paragraph</li>
                <li>• Use linking words effectively</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 Language & Accuracy</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Vary your vocabulary and sentence structures</li>
                <li>• Check grammar and spelling</li>
                <li>• Meet minimum word requirements</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}