import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Basic system health checks
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      services: {
        api: {
          status: 'operational',
          description: 'API endpoints are functioning normally'
        },
        ai: {
          status: process.env.GITHUB_TOKEN ? 'operational' : 'warning',
          description: process.env.GITHUB_TOKEN 
            ? 'AI analysis service is configured'
            : 'AI service requires GITHUB_TOKEN configuration'
        },
        speech: {
          status: 'operational',
          description: 'Speech processing capabilities available'
        }
      },
      features: [
        'IELTS Speaking Practice (Parts 1, 2, 3)',
        'AI-Powered Speech Analysis',
        'Real-time Voice Recording',
        'Pronunciation Assessment', 
        'Follow-up Question Generation',
        'Writing Practice Module'
      ],
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: 'MB'
      }
    };

    return NextResponse.json(healthStatus, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'System health check failed',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// Also support POST for monitoring services
export async function POST(request: NextRequest) {
  return GET(request);
}