import { NextRequest, NextResponse } from 'next/server';
import { getRandomTopic, getTopicsByPart } from '@/data/ieltsTopics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const part = searchParams.get('part');

    let topic;
    if (part) {
      const partNumber = parseInt(part) as 1 | 2 | 3;
      if (![1, 2, 3].includes(partNumber)) {
        return NextResponse.json(
          { error: 'Invalid part number. Must be 1, 2, or 3.' },
          { status: 400 }
        );
      }
      topic = getRandomTopic(partNumber);
    } else {
      topic = getRandomTopic();
    }

    return NextResponse.json({ topic });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topic' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { part } = await request.json();
    
    if (part && ![1, 2, 3].includes(part)) {
      return NextResponse.json(
        { error: 'Invalid part number. Must be 1, 2, or 3.' },
        { status: 400 }
      );
    }

    const topics = part ? getTopicsByPart(part) : [];
    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    );
  }
}