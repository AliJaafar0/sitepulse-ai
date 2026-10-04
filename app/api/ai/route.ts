import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const scanId = body?.scanId;

    if (!scanId) {
      return NextResponse.json(
        { error: 'scanId is required' },
        { status: 400 }
      );
    }

    const scan = await db.scan.findUnique({
      where: { id: scanId },
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found' },
        { status: 404 }
      );
    }

    const score = 70;

    let summary: string;
    let actions: string[];

    if (score >= 90) {
      summary =
        'Your website is in excellent health. Performance, security, accessibility, and SEO are currently strong.';

      actions = [
        'Continue monitoring website performance regularly.',
        'Keep dependencies and security packages up to date.',
        'Maintain caching and optimization settings.',
      ];
    } else if (score >= 75) {
      summary =
        'Your website is performing well, but there are still some areas that can be improved.';

      actions = [
        'Review the latest scan findings and fix remaining warnings.',
        'Optimize images and static resources.',
        'Review SEO metadata and security headers.',
      ];
    } else if (score >= 60) {
      summary =
        'Your website needs improvement in several areas to achieve better health and performance.';

      actions = [
        'Improve page loading speed and server response time.',
        'Compress images and minify JavaScript and CSS files.',
        'Fix SEO, accessibility, and security warnings.',
      ];
    } else {
      summary =
        'Your website has several important issues that should be addressed as soon as possible.';

      actions = [
        'Resolve high-priority security and performance issues first.',
        'Reduce page size and optimize website resources.',
        'Review SEO and accessibility problems from the latest scan.',
      ];
    }

    return NextResponse.json({
      summary,
      actions,
    });
  } catch (error) {
    console.error('AI route error:', error);

    return NextResponse.json({
      summary:
        'The website scan was completed. Continue monitoring and improving the detected areas.',
      actions: [
        'Review the latest scan findings.',
        'Optimize website performance.',
        'Keep security and dependencies up to date.',
      ],
    });
  }
}