/**
 * @package YURI-BIAGINI — Variant Switcher API
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Sets variant cookie from query param — used by VariantSwitcher component
 */

import { NextRequest, NextResponse } from 'next/server';

const VALID = new Set(['01', '02', '03', '04', '05', '06']);

export async function GET(req: NextRequest) {
  const v = req.nextUrl.searchParams.get('v');
  if (!v || !VALID.has(v)) {
    return NextResponse.json({ error: 'Invalid variant' }, { status: 400 });
  }

  const redirect = req.nextUrl.searchParams.get('redirect') || '/';
  const res = NextResponse.redirect(new URL(redirect, req.url));
  res.cookies.set('variant', v, { path: '/', maxAge: 60 * 60 * 24 * 30 });
  return res;
}
