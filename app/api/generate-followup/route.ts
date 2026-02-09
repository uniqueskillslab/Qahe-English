import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userResponse, originalQuestion, part, topicTitle } = await request.json();

    if (!userResponse || !originalQuestion || !part) {
      return NextResponse.json(
        { error: 'Missing required fields: userResponse, originalQuestion, and part are required.' },
        { status: 400 }
      );
    }

    const followUpQuestions = await generateFollowUpQuestions(
      userResponse,
      originalQuestion,
      part,
      topicTitle
    );

    return NextResponse.json({ followUpQuestions });

  } catch (error) {
    console.error('Error generating follow-up questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate follow-up questions' },
      { status: 500 }
    );
  }
}

async function generateFollowUpQuestions(
  userResponse: string,
  originalQuestion: string, 
  part: number,
  topicTitle?: string
): Promise<string[]> {
  const prompt = createFollowUpPrompt(userResponse, originalQuestion, part, topicTitle);
  
  try {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'IELTS-Speaking-Practice/1.0'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an IELTS Speaking Examiner creating natural follow-up questions based on a candidate's response.

RULES:
1. Generate 2-3 relevant follow-up questions
2. Questions should be natural extensions of the candidate's answer
3. Match the appropriate IELTS Part ${part} style and difficulty
4. Questions should encourage deeper exploration of topics the candidate mentioned
5. Use proper examiner language and tone
6. Return ONLY a JSON array of question strings

QUALITY STANDARDS:
- Questions should feel like natural conversation flow
- Build upon specific details the candidate provided
- Encourage elaboration on interesting points they raised
- Match IELTS examination standards and format`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from API');
    }

    // Parse JSON response
    try {
      const questions = JSON.parse(content);
      if (Array.isArray(questions)) {
        return questions.slice(0, 3); // Limit to 3 questions
      }
    } catch {
      // If JSON parsing fails, extract questions manually
      const lines = content.split('\n').filter((line: string) => line.trim());
      return lines.slice(0, 3);
    }

    return [];
  } catch (error) {
    console.error('Failed to generate follow-up questions:', error);
    return []; // Return empty array rather than throw
  }
}

function createFollowUpPrompt(
  userResponse: string,
  originalQuestion: string,
  part: number,
  topicTitle?: string
): string {
  return `
IELTS SPEAKING PART ${part} FOLLOW-UP GENERATION

====================
CONTEXT
====================
Topic: ${topicTitle || 'General'}
Original Question: "${originalQuestion}"
Candidate Response: "${userResponse}"

====================
TASK
====================
Based on the candidate's response, generate 2-3 natural follow-up questions that:

1. **Build on their answer:** Reference specific details they mentioned
2. **Encourage elaboration:** Ask them to expand on interesting points
3. **Maintain natural flow:** Feel like a real conversation
4. **Match IELTS standards:** Use appropriate Part ${part} question styles

${part === 1 ? `
Part 1 Follow-ups should:
- Be direct and personal
- Explore their experiences and preferences
- Stay conversational and friendly
- Be answerable in 1-2 sentences

Examples: "You mentioned X, can you tell me more about that?" / "How long have you been...?" / "What do you enjoy most about...?"
` : part === 2 ? `
Part 2 Follow-ups should:
- Focus on details they didn't fully cover
- Ask about specific aspects of their experience
- Encourage storytelling and examples
- Be more detailed and descriptive

Examples: "You talked about X, can you describe...?" / "What was the most challenging part of...?" / "How did you feel when...?"
` : `
Part 3 Follow-ups should:
- Explore broader implications and comparisons
- Ask for opinions on related social issues
- Encourage analytical thinking
- Be more abstract and discussion-oriented

Examples: "You mentioned X, how do you think this affects society?" / "What are the advantages and disadvantages of...?" / "How has this changed over time?"
`}

Return ONLY a clean JSON array of questions:
["Question 1?", "Question 2?", "Question 3?"]
`;
}