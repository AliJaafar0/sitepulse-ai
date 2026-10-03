import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // عدّل مسار prisma إذا كان مختلفاً لديك

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: websiteId } = await params;

    // محاكاة درجات الفحص
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
      { error: 'Failed to create scan', details: error?.message },
      { status: 500 }
    );
  }
}