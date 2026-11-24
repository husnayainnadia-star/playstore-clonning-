import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

  const { id } = await params;
  const appId = parseInt(id);
  const { rating, comment } = await req.json();

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating harus antara 1-5' }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO reviews (user_id, app_id, rating, comment)
      VALUES (${user.userId}, ${appId}, ${rating}, ${comment || null})
      ON CONFLICT (user_id, app_id)
      DO UPDATE SET rating = ${rating}, comment = ${comment || null}
    `;

    // Recalculate avg rating
    const avg = await sql`
      SELECT AVG(rating)::NUMERIC(2,1) as avg_rating, COUNT(*) as cnt
      FROM reviews WHERE app_id = ${appId}
    `;
    await sql`
      UPDATE apps
      SET rating = ${avg[0].avg_rating}, review_count = ${avg[0].cnt}
      WHERE id = ${appId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
