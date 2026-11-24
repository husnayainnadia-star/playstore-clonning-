import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    // Check email already used
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const result = await sql`
      INSERT INTO users (name, email, password, play_points)
      VALUES (${name}, ${email}, ${hashed}, 100)
      RETURNING id, name, email, play_points
    `;
    const user = result[0];

    const token = signToken({ userId: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, play_points: user.play_points } });
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return res;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
