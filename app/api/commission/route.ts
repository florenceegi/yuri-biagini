/**
 * @package CREATOR-STAGING — Commission API
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Commission form API endpoint — creator requests a custom artwork via Resend email
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const commissionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  description: z.string().min(1).max(10000),
  budget: z.string().max(200).optional(),
  timeline: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = commissionSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.COMMISSION_EMAIL_TO || process.env.CONTACT_EMAIL_TO || 'info@florenceegi.com';

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured — commission email not sent');
      return NextResponse.json({ success: true });
    }

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      '',
      `Description:\n${data.description}`,
    ];
    if (data.budget) lines.push(`\nBudget: ${data.budget}`);
    if (data.timeline) lines.push(`Timeline: ${data.timeline}`);

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${process.env.NEXT_PUBLIC_SITE_NAME || 'Artist'} Website <noreply@florenceegi.com>`,
        to: [to],
        reply_to: data.email,
        subject: `[Commission] ${data.name}`,
        text: lines.join('\n'),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend API error:', err);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: err.issues },
        { status: 422 },
      );
    }
    console.error('Commission API error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
