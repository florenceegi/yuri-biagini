/**
 * @package CREATOR-STAGING — Site Commission API
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.2.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-20
 * @purpose Artist commissions personal site to FlorenceEGI WebAgency via AWS SES — includes modular section + feature addons with server-recomputed quote (MiCA-safe, EUR).
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { rateLimit } from '@/lib/rate-limit';
import {
  SECTIONS,
  FEATURES,
  TIERS,
  computeQuote,
  getTier,
  type SectionId,
  type FeatureId,
  type TierId,
} from '@/lib/site-catalog';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'eu-north-1',
});

const tierSchema = z.enum(['creator', 'studio', 'maestro']);

const sectionEnum = z.enum(SECTIONS.map((s) => s.id) as [SectionId, ...SectionId[]]);
const featureEnum = z.enum(FEATURES.map((f) => f.id) as [FeatureId, ...FeatureId[]]);

const siteCommissionSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  phone: z.string().max(50).optional(),
  tier: tierSchema,
  template: z.string().max(50).optional(),
  animation: z.string().max(50).optional(),
  scene: z.string().max(50).optional(),
  subdomain_wish: z.string().max(60).optional(),
  timeline: z.string().max(200).optional(),
  message: z.string().max(10000).optional(),
  sections: z.array(sectionEnum).max(20).optional().default([]),
  features: z.array(featureEnum).max(20).optional().default([]),
  gdpr_consent: z.literal(true),
});

const RATE_LIMIT = 3;
const RATE_WINDOW = 300_000;

function fmt(eur: number): string {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!rateLimit(`site-commission:${ip}`, RATE_LIMIT, RATE_WINDOW)) {
    return NextResponse.json({ success: false, error: 'rate_limit' }, { status: 429 });
  }

  try {
    const body = await request.json();
    const data = siteCommissionSchema.parse(body);

    const tier = getTier(data.tier as TierId);
    const quote = computeQuote(data.tier as TierId, data.sections as SectionId[], data.features as FeatureId[]);

    const to = process.env.WEBAGENCY_EMAIL_TO || process.env.COMMISSION_EMAIL_TO || 'fabio@florenceegi.com';
    const from = process.env.MAIL_FROM_ADDRESS || 'noreply@florenceegi.com';
    const fromName = process.env.MAIL_FROM_NAME || 'FlorenceEGI WebAgency';

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
    ];
    if (data.phone) lines.push(`Phone: ${data.phone}`);
    lines.push('', `Tier: ${data.tier.toUpperCase()} — setup ${fmt(tier.setup)} · monthly ${fmt(tier.monthly)}`);
    if (data.template) lines.push(`Template: ${data.template}`);
    if (data.animation) lines.push(`Animation: ${data.animation}`);
    if (data.scene) lines.push(`Scene: ${data.scene}`);
    if (data.subdomain_wish) lines.push(`Subdomain wish: ${data.subdomain_wish}`);
    if (data.timeline) lines.push(`Timeline: ${data.timeline}`);

    if (quote.addon_sections.length > 0) {
      lines.push('', 'Addon sections:');
      for (const id of quote.addon_sections) {
        const s = SECTIONS.find((x) => x.id === id);
        if (!s) continue;
        lines.push(`  - ${id}: +${fmt(s.price_setup)}${s.price_monthly > 0 ? ` +${fmt(s.price_monthly)}/mo` : ''}`);
      }
    }
    if (quote.addon_features.length > 0) {
      lines.push('', 'Addon features:');
      for (const id of quote.addon_features) {
        const f = FEATURES.find((x) => x.id === id);
        if (!f) continue;
        lines.push(`  - ${id}: +${fmt(f.price_setup)}${f.price_monthly > 0 ? ` +${fmt(f.price_monthly)}/mo` : ''}`);
      }
    }

    lines.push('', `TOTAL SETUP: ${fmt(quote.setup)}`, `TOTAL MONTHLY: ${fmt(quote.monthly)}`);
    if (data.message) lines.push('', `Message:\n${data.message}`);

    const subject = `[Site ${data.tier.toUpperCase()}] ${data.name} — ${fmt(quote.setup)} + ${fmt(quote.monthly)}/mo`;

    try {
      await sesClient.send(
        new SendEmailCommand({
          Source: `${fromName} <${from}>`,
          Destination: { ToAddresses: [to] },
          ReplyToAddresses: [data.email],
          Message: {
            Subject: { Data: subject, Charset: 'UTF-8' },
            Body: { Text: { Data: lines.join('\n'), Charset: 'UTF-8' } },
          },
        }),
      );
    } catch (sesErr) {
      console.error('SES SendEmail error:', sesErr);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true, quote });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: err.issues },
        { status: 422 },
      );
    }
    console.error('Site commission API error:', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    tiers: TIERS,
    sections: SECTIONS,
    features: FEATURES,
  });
}
