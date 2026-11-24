import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET all installed apps for current user
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  try {
    const installs = await sql`
      SELECT a.*, i.installed_at
      FROM installs i
      JOIN apps a ON i.app_id = a.id
      WHERE i.user_id = ${user.userId}
      ORDER BY i.installed_at DESC
    `;
    return NextResponse.json({ installs });
  } catch (error) {
    console.error('Installs error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
