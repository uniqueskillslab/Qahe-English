'use client';

import { WordLevelResult } from '@/types';

interface PronunciationResultsProps {
  wordResults: WordLevelResult[];
  overallPronunciationScore?: number;
  showPhonemes?: boolean;
}

export default function PronunciationResults({ 
  wordResults, 
  overallPronunciationScore,
  showPhonemes = false 
}: PronunciationResultsProps) {
  
  if (wordResults.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-500">No pronunciation analysis available</p>
      </div>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (accuracy >= 80) return 'text-green-500 bg-green-50 border-green-100';
    if (accuracy >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (accuracy >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getBandScore = (accuracy: number) => {
    if (accuracy >= 95) return '9.0';
    if (accuracy >= 90) return '8.5';
    if (accuracy >= 85) return '8.0';
    if (accuracy >= 80) return '7.5';
    if (accuracy >= 75) return '7.0';
    if (accuracy >= 70) return '6.5';
    if (accuracy >= 65) return '6.0';
    if (accuracy >= 60) return '5.5';
    if (accuracy >= 55) return '5.0';
    return '4.0';
  };

  const excellentWords = wordResults.filter(w => w.accuracy >= 90);
  const goodWords = wordResults.filter(w => w.accuracy >= 70 && w.accuracy < 90);
  const needsImprovementWords = wordResults.filter(w => w.accuracy < 70);

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      {overallPronunciationScore && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800">
              Overall Pronunciation Score
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-700">
                {getBandScore(overallPronunciationScore * 10)}/9.0
              </span>
              <span className="text-sm text-blue-600">
                ({Math.round(overallPronunciationScore * 10)}% accuracy)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded border border-green-200">
          <div className="text-2xl font-bold text-green-600">{excellentWords.length}</div>
          <div className="text-sm text-green-700">Excellent (90%+)</div>
        </div>
        <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{goodWords.length}</div>
          <div className="text-sm text-yellow-700">Good (70-89%)</div>
        </div>
        <div className="text-center p-3 bg-red-50 rounded border border-red-200">
          <div className="text-2xl font-bold text-red-600">{needsImprovementWords.length}</div>
          <div className="text-sm text-red-700">Needs Work (&lt;70%)</div>
        </div>
      </div>

      {/* Words Needing Improvement - Show First */}
      {needsImprovementWords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-700 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Words to Focus On
          </h3>
          <div className="grid gap-3">
            {needsImprovementWords.map((result, idx) => (
              <div key={idx} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-semibold text-red-800">
                        {result.word}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm font-medium border ${getAccuracyColor(result.accuracy)}`}>
                        {result.accuracy}%
                      </span>
                      {showPhonemes && result.pronunciation.phonemes.length > 0 && (
                        <span className="text-sm text-gray-600 font-mono">
                          /{result.pronunciation.phonemes.join('')}/
                        </span>
                      )}
                    </div>
                    
                    {result.pronunciation.errors.length > 0 && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-red-700">Issues:</span>
                        <ul className="text-sm text-red-600 ml-4">
                          {result.pronunciation.errors.map((error, errIdx) => (
                            <li key={errIdx}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {result.pronunciation.suggestions.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-blue-700">Suggestions:</span>
                        <ul className="text-sm text-blue-600 ml-4">
                          {result.pronunciation.suggestions.map((suggestion, sugIdx) => (
                            <li key={sugIdx}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 ml-4">
                    {result.startTime.toFixed(1)}s
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Words - Detailed View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Detailed Word Analysis
          </h3>
          <span className="text-sm text-gray-500">
            {wordResults.length} words analyzed
          </span>
        </div>
        
        <div className="space-y-2">
          {wordResults.map((result, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded border hover:shadow-sm transition-shadow ${
                result.accuracy >= 90 ? 'bg-green-50 border-green-200' :
                result.accuracy >= 70 ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800">
                    {result.word}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getAccuracyColor(result.accuracy)}`}>
                    {result.accuracy}%
                  </span>
                  {showPhonemes && result.pronunciation.phonemes.length > 0 && (
                    <span className="text-xs text-gray-500 font-mono">
                      /{result.pronunciation.phonemes.join('')}/
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>{result.startTime.toFixed(1)}s - {result.endTime.toFixed(1)}s</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    Confidence: {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
              
              {(result.pronunciation.errors.length > 0 || result.pronunciation.suggestions.length > 0) && (
                <div className="mt-2 text-xs space-y-1">
                  {result.pronunciation.errors.length > 0 && (
                    <div className="text-red-600">
                      Issues: {result.pronunciation.errors.join(', ')}
                    </div>
                  )}
                  {result.pronunciation.suggestions.length > 0 && (
                    <div className="text-blue-600">
                      Tip: {result.pronunciation.suggestions[0]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Practice Suggestions */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Practice Recommendations</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Focus on the words marked in red - practice them slowly and clearly</li>
          <li>• Record yourself saying difficult words and compare with native speakers</li>
          <li>• Pay attention to mouth position and tongue placement</li>
          <li>• Use the phonetic transcriptions to understand correct pronunciation</li>
          <li>• Practice in context - use these words in full sentences</li>
        </ul>
      </div>
    </div>
  );
}