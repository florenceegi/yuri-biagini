/**
 * @package YURI-BIAGINI — Scene Switcher API
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Sets 3D scene cookie from query param
 */

import { NextRequest, NextResponse } from 'next/server';

const VALID = new Set(['particles', 'morph-sphere', 'wave-grid', 'floating-gallery', 'ribbon-flow', 'crystal', 'noise-terrain', 'aurora', 'dot-sphere', 'smoke', 'none']);

export async function GET(req: NextRequest) {
  const s = req.nextUrl.searchParams.get('s');
  if (!s || !VALID.has(s)) {
    return NextResponse.json({ error: 'Invalid scene' }, { status: 400 });
  }

  const redirect = req.nextUrl.searchParams.get('redirect') || '/';
  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set('scene3d', s, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  return res;
}
