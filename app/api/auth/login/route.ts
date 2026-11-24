import { NextRequest, NextResponse } from 'next/server';
import { sql, initDB } from '@/lib/db';
import { comparePassword, signToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await initDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan password wajib diisi' }, { status: 400 });
    }

    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (result.length === 0) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const user = result[0];
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Email atau password salah' }, { status: 401 });
    }

    const token = signToken({ userId: user.id, email: user.email, name: user.name });

    const res = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, play_points: user.play_points },
    });
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
