import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Called once to set up database schema + seed data
export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    console.error('Init error:', error);
    return NextResponse.json({ error: 'Failed to initialize DB' }, { status: 500 });
  }
}
