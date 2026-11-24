import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await sql`SELECT * FROM apps WHERE id = ${parseInt(id)}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    // Fetch reviews
    const reviews = await sql`
      SELECT r.*, u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.app_id = ${parseInt(id)}
      ORDER BY r.created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({ app: result[0], reviews });
  } catch (error) {
    console.error('App detail error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
