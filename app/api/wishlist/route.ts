import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const items = await sql`
    SELECT a.*, w.added_at
    FROM wishlist w
    JOIN apps a ON w.app_id = a.id
    WHERE w.user_id = ${user.userId}
    ORDER BY w.added_at DESC
  `;
  return NextResponse.json({ wishlist: items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const { app_id } = await req.json();
  await sql`
    INSERT INTO wishlist (user_id, app_id)
    VALUES (${user.userId}, ${app_id})
    ON CONFLICT DO NOTHING
  `;
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const { app_id } = await req.json();
  await sql`
    DELETE FROM wishlist WHERE user_id = ${user.userId} AND app_id = ${app_id}
  `;
  return NextResponse.json({ success: true });
}
