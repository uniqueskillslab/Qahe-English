'use client';

import { useState } from 'react';
import { IELTSAnalysis } from '@/types';
import { getBandDescriptor } from '@/utils/ieltsUtils';
import { TrendingUp, Clock, FileText, Target, BookOpen, Star, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface ScoreDisplayProps {
  analysis: IELTSAnalysis;
  onNewAttempt?: () => void;
}

export default function ScoreDisplay({ analysis, onNewAttempt }: ScoreDisplayProps) {
  // State for collapsible sections
  const [isResponseExpanded, setIsResponseExpanded] = useState(false);
  const [isEnhancedExpanded, setIsEnhancedExpanded] = useState(false);
  const [isFeedbackExpanded, setIsFeedbackExpanded] = useState(false);
  const [isVocabularyExpanded, setIsVocabularyExpanded] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Enhanced version generator for expert-level responses
  const generateExpertEnhancement = (originalText: string): string => {
    if (!originalText) return '';
    
    // Add sophisticated vocabulary and natural expansions
    const expertPhrases = [
      "Furthermore, it's worth considering that",
      "From a comprehensive perspective,",
      "What particularly strikes me is that",
      "I would argue that",
      "It's imperative to acknowledge that",
      "One cannot overlook the significance of",
      "In my extensive experience,",
      "Undoubtedly, the ramifications of this extend to"
    ];
    
    const sophisticatedConnectors = [
      "Nevertheless, ",
      "Consequently, ",
      "Moreover, ",
      "In contrast, ",
      "Similarly, ",
      "Subsequently, "
    ];
    
    // Split the original text into sentences
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length === 0) return originalText;
    
    let enhancedText = originalText;
    
    // Add introductory sophistication
    const randomIntro = expertPhrases[Math.floor(Math.random() * expertPhrases.length)];
    enhancedText = randomIntro + " " + enhancedText.toLowerCase();
    
    // Add connecting phrases between sentences
    const connector = sophisticatedConnectors[Math.floor(Math.random() * sophisticatedConnectors.length)];
    enhancedText += ". " + connector + "this perspective not only demonstrates linguistic sophistication but also reflects a nuanced understanding of the complexities inherent in such discussions.";
    
    // Add a concluding sophisticated statement
    enhancedText += " Ultimately, the articulation of such viewpoints necessitates both analytical thinking and precise linguistic expression, characteristics that exemplify advanced communicative competence.";
    
    return enhancedText;
  };

  // Vocabulary analysis functions
  const extractKeyWords = (text: string): string[] => {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'is', 'are', 'was',
      'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'can', 'may', 'might', 'must', 'very', 'really', 'quite', 'so', 'too',
      'just', 'only', 'also', 'well', 'like', 'know', 'think', 'get', 'go', 'come', 'see', 'want'
    ]);

    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word))
      .slice(0, 8);
  };

  const getVocabularyUpgrades = (words: string[], transcript: string): Array<{original: string, advanced: string, definition: string}> => {
    const upgrades: Record<string, {advanced: string, definition: string}> = {
      good: { advanced: "exceptional", definition: "Outstanding or remarkably good" },
      great: { advanced: "phenomenal", definition: "Extraordinarily impressive or remarkable" },
      bad: { advanced: "detrimental", definition: "Causing harm or damage" },
      big: { advanced: "substantial", definition: "Of considerable importance, size, or worth" },
      small: { advanced: "negligible", definition: "So small as to be not worth considering" },
      nice: { advanced: "commendable", definition: "Deserving praise" },
      hard: { advanced: "challenging", definition: "Testing one's abilities" },
      easy: { advanced: "straightforward", definition: "Uncomplicated and easy to understand" },
      important: { advanced: "paramount", definition: "Of the highest importance" },
      different: { advanced: "distinctive", definition: "Characteristic of one thing and distinguishing it from others" },
      interesting: { advanced: "compelling", definition: "Evoking interest through being unusual or exciting" },
      people: { advanced: "individuals", definition: "Single human beings as distinct from a group" },
      things: { advanced: "elements", definition: "Essential or characteristic parts of something" },
      happy: { advanced: "elated", definition: "Extremely happy and excited" },
      sad: { advanced: "melancholic", definition: "A pensive sadness" },
      money: { advanced: "capital", definition: "Wealth in the form of money or assets" },
      help: { advanced: "facilitate", definition: "Make an action or process easier or more achievable" },
      show: { advanced: "demonstrate", definition: "Give a practical exhibition and explanation of" },
      make: { advanced: "construct", definition: "Build or create something" },
      many: { advanced: "numerous", definition: "Great in number; many" },
      very: { advanced: "exceptionally", definition: "To an unusually high degree" },
      really: { advanced: "genuinely", definition: "In a truthful way; authentically" },
      place: { advanced: "vicinity", definition: "The area near or surrounding a particular place" },
      way: { advanced: "methodology", definition: "A system of methods used in a particular area of study" },
      work: { advanced: "endeavor", definition: "An attempt to achieve a goal" },
      time: { advanced: "duration", definition: "The time during which something continues" },
      life: { advanced: "existence", definition: "The condition that distinguishes animals and plants" },
      world: { advanced: "society", definition: "The community of people living in a particular region" },
      problem: { advanced: "predicament", definition: "A difficult, unpleasant, or embarrassing situation" },
      idea: { advanced: "concept", definition: "An abstract idea or general notion" },
      fact: { advanced: "reality", definition: "The state of things as they actually exist" },
      change: { advanced: "transformation", definition: "A marked change in form, nature, or appearance" }
    };

    const foundUpgrades = words
      .filter(word => upgrades[word])
      .map(word => ({
        original: word,
        advanced: upgrades[word].advanced,
        definition: upgrades[word].definition
      }));

    // Smart analysis for words not in dictionary
    const smartUpgrades: Array<{original: string, advanced: string, definition: string}> = [];
    
    // Analyze common patterns in speech
    if (transcript.toLowerCase().includes('i like')) {
      smartUpgrades.push({
        original: "I like",
        advanced: "I find appealing",
        definition: "To regard with favor or approval"
      });
    }
    
    if (transcript.toLowerCase().includes('i think')) {
      smartUpgrades.push({
        original: "I think",
        advanced: "I believe",
        definition: "To have confidence in the truth or reliability of"
      });
    }

    // Look for repetitive words
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Suggest alternatives for repeated words
    Object.entries(wordFreq).forEach(([word, count]) => {
      if (count > 2 && word.length > 3) {
        const alternatives = getWordAlternatives(word);
        if (alternatives.length > 0) {
          smartUpgrades.push({
            original: word,
            advanced: alternatives[0],
            definition: `Alternative to avoid repetition of "${word}"`
          });
        }
      }
    });

    return [...foundUpgrades, ...smartUpgrades].slice(0, 4);
  };

  const getWordAlternatives = (word: string): string[] => {
    const alternatives: Record<string, string[]> = {
      said: ["mentioned", "stated", "remarked", "expressed"],
      went: ["proceeded", "traveled", "journeyed", "ventured"],
      came: ["arrived", "appeared", "emerged", "materialized"],
      looked: ["observed", "examined", "scrutinized", "inspected"],
      wanted: ["desired", "sought", "aspired", "yearned"],
      needed: ["required", "necessitated", "demanded", "called for"],
      started: ["commenced", "initiated", "embarked", "launched"],
      finished: ["completed", "concluded", "finalized", "accomplished"],
      tried: ["attempted", "endeavored", "sought", "strived"]
    };
    
    return alternatives[word.toLowerCase()] || [];
  };

  const getSynonyms = (words: string[], transcript: string): Array<{word: string, synonyms: string[], context?: string}> => {
    const synonymMap: Record<string, {synonyms: string[], context: string}> = {
      understand: { synonyms: ["comprehend", "grasp", "perceive", "recognize"], context: "mental process" },
      discuss: { synonyms: ["examine", "analyze", "deliberate", "explore"], context: "conversation" },
      explain: { synonyms: ["clarify", "elaborate", "demonstrate", "illustrate"], context: "clarification" },
      believe: { synonyms: ["consider", "maintain", "assume", "suppose"], context: "opinion" },
      support: { synonyms: ["advocate", "endorse", "champion", "uphold"], context: "backing" },
      change: { synonyms: ["transform", "modify", "alter", "evolve"], context: "modification" },
      improve: { synonyms: ["enhance", "refine", "upgrade", "optimize"], context: "betterment" },
      problem: { synonyms: ["challenge", "issue", "difficulty", "obstacle"], context: "trouble" },
      solution: { synonyms: ["resolution", "remedy", "approach", "strategy"], context: "answer" },
      experience: { synonyms: ["encounter", "undergo", "witness", "observe"], context: "occurrence" },
      create: { synonyms: ["generate", "produce", "develop", "establish"], context: "making" },
      learn: { synonyms: ["acquire", "absorb", "master", "discover"], context: "education" },
      important: { synonyms: ["significant", "crucial", "vital", "essential"], context: "priority" },
      different: { synonyms: ["distinct", "varied", "diverse", "unique"], context: "variation" },
      interesting: { synonyms: ["fascinating", "engaging", "captivating", "intriguing"], context: "appeal" },
      effective: { synonyms: ["efficient", "successful", "productive", "beneficial"], context: "results" },
      popular: { synonyms: ["widespread", "prevalent", "favored", "celebrated"], context: "acceptance" },
      difficult: { synonyms: ["challenging", "demanding", "complex", "arduous"], context: "hardship" }
    };

    const foundSynonyms = words
      .filter(word => synonymMap[word] || synonymMap[word.replace(/s$/, '')])
      .map(word => {
        const baseWord = synonymMap[word] ? word : word.replace(/s$/, '');
        const data = synonymMap[baseWord] || synonymMap[word];
        return {
          word: baseWord,
          synonyms: data.synonyms,
          context: data.context
        };
      });

    // Analyze transcript for common verbs and suggest synonyms
    const smartSynonyms: Array<{word: string, synonyms: string[], context: string}> = [];
    
    const commonVerbs = ['get', 'make', 'do', 'go', 'see', 'know', 'take', 'come', 'think', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call'];
    const transcriptWords = transcript.toLowerCase().split(/\s+/);
    
    commonVerbs.forEach(verb => {
      if (transcriptWords.includes(verb) && !foundSynonyms.some(s => s.word === verb)) {
        const verbSynonyms = getVerbSynonyms(verb);
        if (verbSynonyms.length > 0) {
          smartSynonyms.push({
            word: verb,
            synonyms: verbSynonyms,
            context: "common verb"
          });
        }
      }
    });

    return [...foundSynonyms, ...smartSynonyms].slice(0, 4);
  };

  const getVerbSynonyms = (verb: string): string[] => {
    const verbMap: Record<string, string[]> = {
      get: ["obtain", "acquire", "receive", "procure"],
      make: ["create", "produce", "construct", "fabricate"],
      do: ["perform", "execute", "accomplish", "undertake"],
      go: ["proceed", "advance", "travel", "venture"],
      see: ["observe", "witness", "perceive", "notice"],
      know: ["understand", "comprehend", "recognize", "realize"],
      take: ["acquire", "obtain", "seize", "capture"],
      come: ["arrive", "approach", "emerge", "appear"],
      think: ["consider", "ponder", "reflect", "contemplate"],
      look: ["observe", "examine", "study", "inspect"],
      want: ["desire", "seek", "crave", "aspire"],
      give: ["provide", "offer", "present", "contribute"],
      use: ["utilize", "employ", "apply", "implement"],
      find: ["discover", "locate", "identify", "uncover"],
      tell: ["inform", "communicate", "convey", "express"],
      ask: ["inquire", "question", "request", "interrogate"],
      work: ["function", "operate", "perform", "labor"],
      seem: ["appear", "look", "sound", "feel"],
      feel: ["sense", "experience", "perceive", "detect"],
      try: ["attempt", "endeavor", "strive", "seek"],
      leave: ["depart", "exit", "abandon", "vacate"],
      call: ["telephone", "summon", "contact", "invoke"]
    };
    
    return verbMap[verb] || [];
  };

  const keyWords = extractKeyWords(analysis.transcript);
  const vocabularyUpgrades = getVocabularyUpgrades(keyWords, analysis.transcript);
  const synonymSuggestions = getSynonyms(keyWords, analysis.transcript);

  // Generate strengths based on the user's response
  const generateStrengths = (transcript: string, wordCount: number, duration: number, scores: any): string[] => {
    const strengths: string[] = [];
    const words = transcript.toLowerCase().split(/\s+/);
    const wpm = (wordCount / duration) * 60;

    // Length and fluency analysis
    if (wordCount > 100) {
      strengths.push("Demonstrated excellent verbal fluency with a comprehensive and well-developed response");
    } else if (wordCount > 50) {
      strengths.push("Provided a solid response with good elaboration and detail");
    }

    // Word variety analysis
    const uniqueWords = new Set(words);
    if (uniqueWords.size / words.length > 0.7) {
      strengths.push("Showcased impressive vocabulary range with minimal repetition");
    }

    // Speaking pace analysis
    if (wpm >= 140 && wpm <= 180) {
      strengths.push("Maintained an excellent speaking pace that demonstrates natural fluency");
    } else if (wpm >= 120) {
      strengths.push("Spoke at a good, measured pace that allows for clear understanding");
    }

    // Content quality analysis
    if (transcript.includes('example') || transcript.includes('for instance') || transcript.includes('such as')) {
      strengths.push("Effectively used specific examples to support points and enhance clarity");
    }

    // Complex language structures
    if (transcript.includes('although') || transcript.includes('however') || transcript.includes('despite') || transcript.includes('whereas')) {
      strengths.push("Demonstrated sophisticated language use with complex sentence structures");
    }

    // Opinion and reasoning
    if (transcript.includes('think') || transcript.includes('believe') || transcript.includes('opinion') || transcript.includes('feel')) {
      strengths.push("Clearly expressed personal viewpoints and opinions with confidence");
    }

    // Coherence markers
    if (transcript.includes('firstly') || transcript.includes('secondly') || transcript.includes('finally') || transcript.includes('moreover') || transcript.includes('furthermore')) {
      strengths.push("Used effective discourse markers to organize ideas logically");
    }

    // Score-based analysis
    if (scores.overall >= 7) {
      strengths.push("Achieved a strong overall score demonstrating advanced English proficiency");
    } else if (scores.overall >= 6) {
      strengths.push("Demonstrated competent communication skills with clear message delivery");
    }

    // Ensure we have at least 2-3 strengths
    if (strengths.length < 2) {
      strengths.push("Attempted to address the topic with personal engagement");
      strengths.push("Showed willingness to express ideas in English with reasonable clarity");
    }

    return strengths.slice(0, 4); // Limit to 4 strengths maximum
  };

  const identifiedStrengths = generateStrengths(analysis.transcript, analysis.wordCount, analysis.duration, analysis.scores);

  // Analyze word repetition in the response  
  const analyzeWordRepetition = (transcript: string): Array<{word: string, count: number, suggestions: string[]}> => {
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those', 'is', 'are', 'was',
      'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'can', 'may', 'might', 'must', 'so', 'too', 'just', 'only', 'also', 'well'
    ]);

    const words = transcript.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !commonWords.has(word));

    const wordCount: Record<string, number> = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const repetitionSuggestions: Record<string, string[]> = {
      think: ["believe", "consider", "feel", "suppose"],
      good: ["excellent", "beneficial", "positive", "valuable"],
      bad: ["negative", "problematic", "concerning", "challenging"],
      like: ["enjoy", "appreciate", "prefer", "favor"],
      people: ["individuals", "persons", "citizens", "residents"],
      things: ["aspects", "elements", "factors", "items"],
      really: ["genuinely", "truly", "certainly", "definitely"],
      very: ["extremely", "particularly", "remarkably", "exceptionally"],
      important: ["significant", "crucial", "vital", "essential"],
      different: ["various", "distinct", "diverse", "alternative"],
      because: ["since", "due to", "owing to", "as a result of"],
      maybe: ["perhaps", "possibly", "potentially", "conceivably"],
      always: ["constantly", "consistently", "invariably", "perpetually"],
      never: ["rarely", "seldom", "hardly ever", "scarcely"],
      make: ["create", "produce", "generate", "develop"],
      get: ["obtain", "acquire", "receive", "gain"]
    };

    return Object.entries(wordCount)
      .filter(([word, count]) => count >= 2)
      .map(([word, count]) => ({
        word,
        count,
        suggestions: repetitionSuggestions[word] || getWordAlternatives(word) || ["vary your vocabulary"]
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const repeatedWords = analyzeWordRepetition(analysis.transcript);

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
      <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-3xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl font-bold transition-all duration-300 group-hover:scale-105 shadow-xl ${
        score >= 8 ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
        score >= 6.5 ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white' :
        score >= 5 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
        'bg-gradient-to-br from-red-400 to-rose-500 text-white'
      }`}>
        {score}
      </div>
      <p className="text-xs sm:text-sm font-semibold text-gray-800 mt-2 sm:mt-3">{label}</p>
      <p className="text-xs text-gray-500">{getBandDescriptor(score)}</p>
    </div>
  );

  const ScoreBar = ({ score, label }: { score: number; label: string }) => (
    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center text-xs sm:text-sm mb-2 sm:mb-3">
        <span className="font-semibold text-gray-800 text-sm sm:text-base">{label}</span>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="font-bold text-gray-900 text-base sm:text-lg">{score}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-1 sm:px-2 py-1 rounded-full">{getBandDescriptor(score)}</span>
        </div>
      </div>
      <div className="relative w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
        <div
          className={`h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out shadow-inner ${
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
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Overall Score Hero Section */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl sm:rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/40 shadow-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Your IELTS Speaking Assessment</h2>
          <div className="relative inline-block">
            <div className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center text-3xl sm:text-4xl lg:text-6xl font-bold shadow-2xl transition-all duration-500 hover:scale-105 ${
              analysis.scores.overall >= 8 ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white' :
              analysis.scores.overall >= 6.5 ? 'bg-gradient-to-br from-blue-400 to-indigo-500 text-white' :
              analysis.scores.overall >= 5 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
              'bg-gradient-to-br from-red-400 to-rose-500 text-white'
            }`}>
              {analysis.scores.overall}
            </div>
            <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="mt-4 sm:mt-6">
            <p className="text-lg sm:text-xl font-semibold text-gray-700">{getBandDescriptor(analysis.scores.overall)}</p>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Overall Band Score</p>
            
            {/* Speaking Duration and Word Count */}
            <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{Math.round(analysis.duration / 60)} min</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{analysis.wordCount} words</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Word Repetition Analysis */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/40 shadow-xl">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Vocabulary Variety Analysis
        </h3>
        
        {repeatedWords.length > 0 ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
              <p className="text-amber-800 text-sm font-medium mb-3">
                Words used multiple times - Consider these alternatives for better variety:
              </p>
              <div className="grid gap-2 sm:gap-3">
                {repeatedWords.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-amber-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 space-y-2 sm:space-y-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-amber-700 font-semibold text-base sm:text-lg">"{item.word}"</span>
                        <div className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {item.count}x
                        </div>
                      </div>
                      <div className="text-xs text-amber-600 sm:text-right">
                        Used {item.count} times
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Consider these alternatives:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.suggestions.slice(0, 4).map((suggestion, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium hover:shadow-sm transition-shadow cursor-pointer">
                            {suggestion}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-xs text-blue-800">
                  <p className="font-medium">Vocabulary Tip</p>
                  <p className="mt-1">Using varied vocabulary demonstrates language proficiency. Try replacing repeated words with synonyms to achieve higher band scores.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-green-700">Excellent Vocabulary Variety!</h4>
            </div>
            <p className="text-green-800 font-medium leading-relaxed">
              No significant word repetition detected. Your response demonstrates good vocabulary range and variety - a key strength for higher IELTS band scores.
            </p>
            <div className="mt-4 text-sm text-green-700">
              <p>• Vocabulary diversity: <strong>Excellent</strong></p>
              <p>• Word variation: <strong>Natural</strong></p>
              <p>• Language sophistication: <strong>Appropriate</strong></p>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl overflow-hidden">
        <button
          onClick={() => setIsFeedbackExpanded(!isFeedbackExpanded)}
          className="w-full p-4 sm:p-6 lg:p-8 text-left hover:bg-white/60 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Detailed Feedback</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {isFeedbackExpanded ? 'Hide' : 'Show'}
              </span>
              {isFeedbackExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        </button>
        {isFeedbackExpanded && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
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
                {/* Display real generated strengths */}
                {identifiedStrengths.map((strength, index) => (
                  <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-green-800 font-medium leading-relaxed">{strength}</p>
                    </div>
                  </div>
                ))}
                
                {/* Show additional AI analysis if available */}
                {analysis.feedback.strengths && analysis.feedback.strengths.length > 0 && (
                  analysis.feedback.strengths.map((strength, index) => (
                    <div key={`ai-${index}`} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 mt-0.5 shrink-0">
                          {identifiedStrengths.length + index + 1}
                        </div>
                        <p className="text-green-800 font-medium leading-relaxed">{strength}</p>
                      </div>
                    </div>
                  ))
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
        )}
      </div>

      {/* Enhanced Version */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl overflow-hidden">
        <button
          onClick={() => setIsEnhancedExpanded(!isEnhancedExpanded)}
          className="w-full p-4 sm:p-6 lg:p-8 text-left hover:bg-white/60 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Enhanced Version
            </h3>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">
                {isEnhancedExpanded ? 'Hide' : 'Show'}
              </span>
              {isEnhancedExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </div>
          </div>
        </button>
        {isEnhancedExpanded && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
            {analysis.feedback.improvementGuidance.betterVersion ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200 shadow-inner">
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-800 leading-relaxed text-base sm:text-lg font-medium">
                      {isExpertMode 
                        ? generateExpertEnhancement(analysis.feedback.improvementGuidance.betterVersion)
                        : analysis.feedback.improvementGuidance.betterVersion
                      }
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-emerald-200 space-y-2 sm:space-y-0">
                    <div className="flex items-center text-xs sm:text-sm text-emerald-700">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-1 sm:mr-2">
                        <svg className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>
                        {isExpertMode 
                          ? 'Expert-level Band 9 enhancement with natural flow'
                          : 'AI-improved version targeting higher band scores'
                        }
                      </span>
                    </div>
                    <button
                      onClick={() => setIsExpertMode(!isExpertMode)}
                      className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                        isExpertMode 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg hover:shadow-xl'
                      } transform hover:scale-105 active:scale-95`}
                    >
                      {isExpertMode ? (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span>Show Standard</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          <span>Make Expert Level</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
                {isExpertMode && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-purple-200">
                    <div className="flex items-start space-x-2 sm:space-x-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="text-xs text-purple-800">
                        <p className="font-medium">Expert Enhancement Applied</p>
                        <p className="mt-1">This version demonstrates Band 9 characteristics: sophisticated vocabulary, complex structures, and natural discourse markers.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
                <p className="text-emerald-800 font-medium leading-relaxed text-sm sm:text-base">Enhanced version analysis will be available with your next response.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vocabulary Upgrades & Synonyms */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl overflow-hidden">
        <button
          onClick={() => setIsVocabularyExpanded(!isVocabularyExpanded)}
          className="w-full p-4 sm:p-6 lg:p-8 text-left hover:bg-white/60 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Vocabulary Upgrades & Synonyms
            </h3>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">
                {isVocabularyExpanded ? 'Hide' : 'Show'}
              </span>
              {isVocabularyExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </div>
          </div>
        </button>
        {isVocabularyExpanded && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {/* Advanced Vocabulary Suggestions */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-200">
                <h4 className="text-base sm:text-lg font-semibold text-purple-700 mb-3 sm:mb-4 flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Advanced Vocabulary Suggestions
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {vocabularyUpgrades.length > 0 ? (
                    vocabularyUpgrades.map((upgrade, index) => (
                      <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 lg:space-x-3">
                            <span className="text-gray-600 line-through text-sm sm:text-base">{upgrade.original}</span>
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            <span className="text-purple-700 font-semibold text-sm sm:text-base">{upgrade.advanced}</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 italic">{upgrade.definition}</p>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-100">
                      <div className="mb-2 sm:mb-3">
                        <p className="text-gray-700 font-medium text-sm sm:text-base">Based on your response analysis:</p>
                      </div>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        <p>• Your vocabulary shows good sophistication for this topic</p>
                        <p>• Try incorporating more descriptive adjectives for enhanced expression</p>
                        <p>• Consider using topic-specific terminology to demonstrate expertise</p>
                        <p>• Word count: {analysis.wordCount} words - {analysis.wordCount > 100 ? 'Excellent length!' : 'Try expanding your ideas further'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Synonym Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200">
                <h4 className="text-base sm:text-lg font-semibold text-blue-700 mb-3 sm:mb-4 flex items-center">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  Synonym Recommendations
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  {synonymSuggestions.length > 0 ? (
                    synonymSuggestions.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                          <span className="text-blue-700 font-semibold capitalize text-sm sm:text-base">{item.word}:</span>
                          {item.context && (
                            <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full self-start sm:self-auto">
                              {item.context}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {item.synonyms.map((synonym, idx) => (
                            <span key={idx} className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-200 transition-colors cursor-pointer">
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-100">
                      <div className="mb-2 sm:mb-3">
                        <p className="text-gray-700 font-medium text-sm sm:text-base">Vocabulary Enhancement Opportunities:</p>
                      </div>
                      <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                        <p>• Use words like "discuss", "analyze", "consider" to unlock more suggestions</p>
                        <p>• Try expressing opinions with "I believe", "In my view", "It seems to me"</p>
                        <p>• Add connectives like "furthermore", "however", "consequently"</p>
                        <p>• Speaking pace: {Math.round((analysis.wordCount / analysis.duration) * 60)} WPM - {(analysis.wordCount / analysis.duration) * 60 > 140 ? 'Good fluency!' : 'Consider speaking more fluently'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Transcript */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/40 shadow-xl overflow-hidden">
        <button
          onClick={() => setIsResponseExpanded(!isResponseExpanded)}
          className="w-full p-4 sm:p-6 lg:p-8 text-left hover:bg-white/60 transition-colors duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-slate-400 to-gray-500 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m-10 4h10m-10 4h10M3 6h18a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </div>
              Your Original Response
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {isResponseExpanded ? 'Hide' : 'Show'}
              </span>
              {isResponseExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>
          </div>
        </button>
        {isResponseExpanded && (
          <div className="px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-inner">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-800 leading-relaxed text-base sm:text-lg">{analysis.transcript}</p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-200 space-y-1 sm:space-y-0">
                <span>Recorded on {new Date(analysis.analysisDate).toLocaleDateString()}</span>
                <span>{analysis.wordCount} words in {Math.round(analysis.duration)} seconds</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {onNewAttempt && (
        <div className="text-center">
          <button
            onClick={onNewAttempt}
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Practice Another Topic</span>
          </button>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 sm:mt-3 px-4 sm:px-0">
            Continue practicing to improve your IELTS speaking skills
          </p>
        </div>
      )}
    </div>
  );
}