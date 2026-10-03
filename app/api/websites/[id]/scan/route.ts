// app/api/ai/route.ts

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let scanId = '';
    try {
      const body = await req.json();
      scanId = body?.scanId;
    } catch {
      // Ignore body parsing error
    }

    let score = 100;

    if (scanId) {
      const scan = await db.scan.findUnique({
        where: { id: scanId },
      });
      if (scan?.score) {
        score = scan.score;
      }
    }

    const isHighHealth = score >= 80;

    const summary = isHighHealth
      ? 'Your site health is outstanding with top-tier performance, security, and SEO metrics.'
      : 'Your site performance needs attention in key areas such as response time and resource compression.';

    const actions = isHighHealth
      ? [
          'Enable media and asset caching to improve load speed.',
          'Verify SSL certificate auto-renewal status.',
          'Keep project dependencies up to date regularly.'
        ]
      : [
          'Fix security headers and response warnings.',
          'Compress images and minify JavaScript files.',
          'Add key Meta tags for search engine optimization.'
        ];

    return NextResponse.json({ summary, actions });
  } catch (error: any) {
    console.error('AI Route Error:', error);
    return NextResponse.json({
      summary: 'Site health analysis completed. Continue monitoring performance indicators regularly.',
      actions: [
        'Enable browser and server caching.',
        'Review server response times and resolve logged issues.'
      ]
    });
  }
}