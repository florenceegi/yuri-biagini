/**
 * @package YURI-BIAGINI — Animation Switcher API
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Sets animation cookie from query param — used by switcher component
 */

import { NextRequest, NextResponse } from 'next/server';

const VALID = new Set(['minimal', 'cinematic', 'energetic', 'editorial', 'fluid', 'none']);

export async function GET(req: NextRequest) {
  const a = req.nextUrl.searchParams.get('a');
  if (!a || !VALID.has(a)) {
    return NextResponse.json({ error: 'Invalid animation' }, { status: 400 });
  }

  const redirect = req.nextUrl.searchParams.get('redirect') || '/';
  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set('animation', a, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  return res;
}
