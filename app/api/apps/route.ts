import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await initDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search   = searchParams.get('search');
    const featured = searchParams.get('featured');
    const limit    = parseInt(searchParams.get('limit') || '20');

    let apps;

    if (search) {
      apps = await sql`
        SELECT * FROM apps
        WHERE name ILIKE ${'%' + search + '%'}
           OR developer ILIKE ${'%' + search + '%'}
        ORDER BY download_count DESC
        LIMIT ${limit}
      `;
    } else if (category) {
      apps = await sql`
        SELECT * FROM apps
        WHERE category = ${category}
        ORDER BY rating DESC
        LIMIT ${limit}
      `;
    } else if (featured === 'true') {
      apps = await sql`
        SELECT * FROM apps WHERE is_featured = true ORDER BY rating DESC
      `;
    } else {
      apps = await sql`
        SELECT * FROM apps ORDER BY rating DESC LIMIT ${limit}
      `;
    }

    return NextResponse.json({ apps });
  } catch (error) {
    console.error('Apps error:', error);
    return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 });
  }
}
