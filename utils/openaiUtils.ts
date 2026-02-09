import OpenAI from 'openai';
import { IELTSAnalysis, IELTSScore } from '@/types';

// Create OpenAI client - this should only be called server-side
export function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export async function transcribeAudio(audioFile: File): Promise<string> {
  const openai = createOpenAIClient();
  
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "text",
      temperature: 0.2,
    });
    
    return transcription;
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function analyzeIELTSSpeech(
  transcript: string,
  duration: number,
  topicTitle: string,
  part: number
): Promise<IELTSAnalysis> {
  const openai = createOpenAIClient();
  
  try {
    const prompt = createAnalysisPrompt(transcript, duration, topicTitle, part);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert IELTS speaking examiner with years of experience. 
          Your task is to analyze speech transcripts and provide accurate IELTS band scores 
          according to the official IELTS speaking assessment criteria. Be precise, fair, 
          and constructive in your feedback.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysis = completion.choices[0]?.message?.content;
    if (!analysis) {
      throw new Error('No analysis received from OpenAI');
    }

    return parseAnalysis(analysis, transcript, duration);
  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze speech');
  }
}

function createAnalysisPrompt(transcript: string, duration: number, topicTitle: string, part: number): string {
  const wordCount = transcript.split(' ').length;
  const speakingRate = Math.round((wordCount / duration) * 60); // words per minute

  return `
Please analyze this IELTS Speaking Part ${part} response and provide detailed scoring:

**Topic**: ${topicTitle}
**Duration**: ${Math.round(duration)} seconds
**Word Count**: ${wordCount}
**Speaking Rate**: ${speakingRate} words per minute

**Transcript**: 
${transcript}

Please provide your analysis in the following JSON format:

{
  "scores": {
    "fluencyCoherence": 6.5,
    "lexicalResource": 6.0,
    "grammaticalRange": 6.0,
    "pronunciation": 6.0,
    "overall": 6.0
  },
  "feedback": {
    "fluencyCoherence": "Detailed feedback on fluency and coherence...",
    "lexicalResource": "Detailed feedback on vocabulary usage...",
    "grammaticalRange": "Detailed feedback on grammar...",
    "pronunciation": "Estimated feedback on pronunciation based on transcript analysis...",
    "overallFeedback": "Overall assessment summary...",
    "improvementSuggestions": [
      "Specific suggestion 1",
      "Specific suggestion 2",
      "Specific suggestion 3"
    ]
  }
}

**Scoring Criteria:**

**Fluency and Coherence (0-9):**
- Assess speech flow, hesitations, repetitions, self-corrections
- Look for logical sequencing and use of cohesive devices
- Consider appropriate pausing and rhythm

**Lexical Resource (0-9):**
- Evaluate vocabulary range, precision, and appropriateness
- Check for idiomatic language and colloquial expressions
- Assess attempts at using less common vocabulary

**Grammatical Range and Accuracy (0-9):**
- Analyze variety of sentence structures used
- Check accuracy of grammar and complexity
- Note any systematic errors vs. occasional slips

**Pronunciation (0-9) - Estimated:**
- Based on transcript, infer potential pronunciation issues
- Consider word stress, sentence stress, and intonation patterns
- Look for evidence of clear communication despite any issues

**Overall Band Score:**
- Calculate as average of the four criteria
- Consider task achievement for the specific part
- Ensure scores reflect official IELTS descriptors

Please be specific in your feedback and provide actionable improvement suggestions.
`;
}

function parseAnalysis(analysisText: string, transcript: string, duration: number): IELTSAnalysis {
  try {
    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in analysis response');
    }

    const parsedAnalysis = JSON.parse(jsonMatch[0]);
    
    return {
      transcript,
      scores: {
        fluencyCoherence: parsedAnalysis.scores.fluencyCoherence,
        lexicalResource: parsedAnalysis.scores.lexicalResource,
        grammaticalRange: parsedAnalysis.scores.grammaticalRange,
        pronunciation: parsedAnalysis.scores.pronunciation,
        overall: parsedAnalysis.scores.overall,
      },
      feedback: {
        fluencyCoherence: parsedAnalysis.feedback.fluencyCoherence,
        lexicalResource: parsedAnalysis.feedback.lexicalResource,
        grammaticalRange: parsedAnalysis.feedback.grammaticalRange,
        pronunciation: parsedAnalysis.feedback.pronunciation,
        overallFeedback: parsedAnalysis.feedback.overallFeedback,
        improvementSuggestions: parsedAnalysis.feedback.improvementSuggestions,
        improvementGuidance: {
          isRelevantResponse: true,
          specificImprovements: [],
        }
      },
      wordCount: transcript.split(' ').length,
      duration,
      analysisDate: new Date(),
    };
  } catch (error) {
    console.error('Error parsing analysis:', error);
    throw new Error('Failed to parse analysis results');
  }
}