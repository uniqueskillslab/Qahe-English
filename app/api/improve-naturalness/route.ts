import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Check if GitHub token is configured
    if (!process.env.GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    const naturalText = await improveNaturalness(text);

    return NextResponse.json({ naturalText });

  } catch (error: any) {
    console.error('Naturalness improvement error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to improve naturalness' },
      { status: 500 }
    );
  }
}

async function improveNaturalness(text: string): Promise<string> {
  const prompt = `Take this IELTS Band 9 level response and make it sound more natural and conversational while maintaining the high vocabulary and grammar quality. Make it sound like a real person speaking, not AI-generated text.

Original text: "${text}"

Instructions:
- Keep the Band 9 vocabulary and grammar quality
- Make it sound more conversational and natural
- Use more natural speech patterns and flow
- Add subtle personality and human-like expressions
- Remove any overly formal or robotic phrasing
- Make it sound like genuine human speech while maintaining sophistication

Return only the improved natural version without any explanations or formatting.`;

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
            content: 'You are an expert at making text sound natural and human-like while maintaining high quality. Transform formal or AI-like text into natural, conversational speech patterns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7, // Higher temperature for more natural variability
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub Models API error:', response.status, errorText);
      throw new Error(`GitHub Models API failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const naturalText = result.choices[0]?.message?.content;
    
    if (!naturalText) {
      throw new Error('No natural text received from GitHub Models API');
    }

    return naturalText.trim();
  } catch (error) {
    console.error('GitHub Models API naturalness error:', error);
    throw error;
  }
}