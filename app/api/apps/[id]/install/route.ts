import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST — install app
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const { id } = await params;
  const appId = parseInt(id);

  try {
    await sql`
      INSERT INTO installs (user_id, app_id)
      VALUES (${user.userId}, ${appId})
      ON CONFLICT (user_id, app_id) DO NOTHING
    `;

    // Update download count
    await sql`
      UPDATE apps SET review_count = review_count + 1 WHERE id = ${appId}
    `;

    return NextResponse.json({ success: true, installed: true });
  } catch (error) {
    console.error('Install error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — uninstall app
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const { id } = await params;

  await sql`
    DELETE FROM installs
    WHERE user_id = ${user.userId} AND app_id = ${parseInt(id)}
  `;

  return NextResponse.json({ success: true, installed: false });
}
