@/home/fabio/NATAN_LOC/CLAUDE_ECOSYSTEM_CORE.md

# YURI-BIAGINI — Sito Artista (Oracode OS3)

> Organo vetrina artista. Immersive 3D experience per Yuri Biagini.
> Stack: Next.js 15 (App Router) + Three.js + GSAP + Sanity v3 + next-intl
> URL: yuri-biagini.florenceegi.com | Path: /home/fabio/YURI-BIAGINI
> Branch: feat/yuri-biagini-site | Template: Immersive 3D (Tier 2)

---

## Ruolo nell'Organismo

```
Organo vetrina artista — primo della serie "Artisti FlorenceEGI".
Consuma API pubbliche di EGI per opere e profilo artista.
Le opere linkano a art.florenceegi.com/egis/{id} per acquisto/dettaglio blockchain.
Pattern riusabile per tutti i futuri siti artisti dell'ecosistema.

API EGI consumate:
  GET /api/public/artists/{id}           → profilo artista
  GET /api/public/artists/{id}/artworks  → opere paginate
  GET /api/public/collections/{id}       → collezione con opere
```

---

## Stack

```
Framework  → Next.js 15 (App Router, SSG, ISR, Server Components)
React      → React 19
3D         → Three.js + @react-three/fiber + @react-three/drei
Animazioni → GSAP 3 (free: core + ScrollTrigger + Flip) + Splitting.js + Lenis
CMS        → Sanity v3 (bio, exhibitions, press — NON opere, quelle da EGI API)
i18n       → next-intl v3 — 6 lingue: IT EN FR DE ES ZH
Styling    → Tailwind CSS v4
Form       → React Hook Form + Zod + Resend (email)
Rate limit → @upstash/ratelimit + Redis
Analytics  → Vercel Analytics + FEAnalytics ecosistema
Deploy     → PM2 cluster mode su EC2 (port 3010)
```

---

## Regole Specifiche

| # | Regola | Enforcement |
|---|--------|-------------|
| P0-0 | **No Alpine/Livewire** | Solo React + Vanilla TS |
| P0-2 | **i18n atomic** | Nessun testo hardcoded — tutto in messages/ JSON o Sanity localeString |
| P0-9 | **6 lingue** | IT EN FR DE ES ZH — SEMPRE tutte e sei |
| R1 | **Max 500 righe/file** | TypeScript/TSX inclusi |
| R2 | **Three.js lazy** | `next/dynamic` con `ssr: false` — mai SSR per Canvas |
| R3 | **GSAP cleanup** | `kill()` su unmount — zero memory leak |
| R4 | **Reduced motion** | `prefers-reduced-motion` → GSAP duration=0, Three.js fallback statico, Lenis off |
| R5 | **WCAG 2.1 AA+** | Skip-to-content, focus-visible, aria-labels, contrast 4.5:1, keyboard nav |
| R6 | **Opere da EGI** | MAI duplicare dati opere — fetch da API EGI, link a art.florenceegi.com |

---

## Architettura Dati

```
Sanity CMS (artista gestisce):
  artistProfile (singleton) → bio, timeline, portrait, social, CV
  exhibition                → mostre upcoming/past con foto e press release
  pressItem                 → rassegna stampa con link e PDF
  series                    → collezioni/serie con testo curatoriale

EGI API (SSOT opere — read-only):
  /api/public/artists/{id}/artworks → opere paginate con immagini S3
  Link acquisto: art.florenceegi.com/egis/{id}
```

---

## File Critici

```
app/[locale]/layout.tsx          → Root layout con providers (Lenis, Cursor, i18n)
app/[locale]/page.tsx            → Home con HeroScene Three.js
components/three/HeroScene.tsx   → Scena 3D particelle GLSL
components/gallery/WorksGallery.tsx → Galleria masonry con filtri
components/scroll/ScrollStoryEngine.tsx → GSAP ScrollTrigger wrapper
lib/egi/client.ts                → EGI API client
lib/sanity/client.ts             → Sanity client + GROQ queries
lib/hooks/useReducedMotion.ts    → Hook accessibilita
messages/*.json                  → Traduzioni UI 6 lingue
```

---

## Checklist Pre-Risposta

```
1. Ho TUTTE le info necessarie?           NO → CHIEDI (P0-1)
2. Testo hardcoded?                       SI → messages/*.json (P0-2)
3. Tutte 6 lingue?                        NO → NON PROCEDERE (P0-9)
4. Three.js con ssr:false?                NO → BLOCCO (R2)
5. GSAP kill() su unmount?                NO → BLOCCO (R3)
6. prefers-reduced-motion gestito?        NO → BLOCCO (R4)
7. WCAG: aria, focus, contrast?           NO → BLOCCO (R5)
8. Opere da EGI API (non duplicate)?      NO → BLOCCO (R6)
9. File > 500 righe?                      SI → SPLIT (R1)
```

---

## SEO Strategy

```
Traditional:
  - JSON-LD schema.org: VisualArtwork, Person, Exhibition, CollectionPage
  - Open Graph + Twitter Cards per ogni opera
  - sitemap.xml dinamico (ISR paths)
  - robots.txt ottimizzato
  - hreflang per 6 lingue
  - Semantic HTML5 (article, figure, figcaption, nav, main)

AI SEO:
  - llms.txt (istruzioni per LLM crawlers)
  - Structured data ricco (schema.org completo)
  - Content quality: testi curatoriali in Sanity, non generici
```

---

*M-045 — FlorenceEGI Organismo Software — YURI-BIAGINI v1.0.0 (2026-04-10)*
