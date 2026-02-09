import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Speech-to-text API called');
    
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      console.error('No audio file provided');
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    console.log('Audio file received:', audioFile.name, audioFile.size, 'bytes');

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log('OpenAI not configured, using fallback transcription');
      return NextResponse.json({ 
        transcript: 'This is a demo transcription. Please configure your OpenAI API key for actual speech-to-text functionality.',
        success: true,
        source: 'fallback'
      });
    }

    try {
      // Use OpenAI Whisper to transcribe the audio
      const { transcribeAudio } = await import('@/utils/openaiUtils');
      const transcript = await transcribeAudio(audioFile);
      
      console.log('Transcription successful, length:', transcript.length);
      
      return NextResponse.json({ 
        transcript,
        success: true,
        source: 'openai'
      });

    } catch (transcriptionError: any) {
      console.error('OpenAI transcription failed:', transcriptionError);
      
      // Fallback response
      return NextResponse.json({ 
        transcript: 'Transcription service temporarily unavailable. This is a demo response for testing purposes.',
        success: true,
        source: 'fallback',
        warning: 'Transcription failed, using fallback'
      });
    }

  } catch (error: any) {
    console.error('Speech-to-text error:', error);
    
    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: error.message },
      { status: 500 }
    );
  }
}