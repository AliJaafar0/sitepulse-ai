import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    summary: 'AI route is working correctly!',
    actions: [
      'Test action number 1',
      'Test action number 2',
      'Test action number 3',
    ],
  });
}