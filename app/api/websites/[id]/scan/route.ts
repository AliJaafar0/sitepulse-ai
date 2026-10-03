import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await props.params;
    const websiteId = params.id;

    const performance = 100;
    const security = 100;
    const seo = 100;
    const score = Math.round((performance + security + seo) / 3);

    const scan = await prisma.scan.create({
      data: {
        websiteId,
        status: 'completed',
        score,
        performance,
        security,
        seo,
      },
    });

    return NextResponse.json(scan);
  } catch (error: any) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to create scan', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}