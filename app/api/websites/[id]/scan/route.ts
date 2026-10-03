import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { scanId } = await req.json();

    if (!scanId) {
      return NextResponse.json(
        { error: 'Scan ID is required' },
        { status: 400 }
      );
    }

    // جلب بيانات الفحص بشكل آمن
    const scan = await db.scan.findUnique({
      where: { id: scanId },
    });

    if (!scan) {
      return NextResponse.json(
        { error: 'Scan record not found' },
        { status: 404 }
      );
    }

    // بناء خطة العمل والتوصيات استناداً لنتائج الفحص
    const isHighHealth = (scan.score || 0) >= 80;

    const summary = isHighHealth
      ? 'الموقع يعمل بأداء ممتاز واستقرار عالٍ. الحفاظ على الممارسات الحالية سيعزز من استمرارية كفاءة الأداء وأمن البيانات.'
      : 'يحتاج الموقع إلى بعض التحسينات للارتقاء بمستوى الأداء والأمان وتجربة المستخدم.';

    const actions = isHighHealth
      ? [
          'تفعيل التخزين المؤقت (Caching) للوسائط والتصميم لزيادة سرعة التحميل.',
          'التحقق من إعدادات التجديد التلقائي لشهادة الأمان SSL.',
          'متابعة تحديثات الحزم والكتبات البرمجية المستخدمة دورياً.'
        ]
      : [
          'معالجة الثغرات والتنبيهات الأمنية في الاستجابات.',
          'ضغط الصور وتصغير حجم ملفات JavaScript لتحسين Performance.',
          'إضافة الوسوم الوصفية (Meta Tags) الضرورية لتحسين SEO.'
        ];

    return NextResponse.json({ summary, actions });
  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Unable to generate insights.', details: error?.message },
      { status: 500 }
    );
  }
}