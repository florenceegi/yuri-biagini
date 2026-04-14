/**
 * @package YURI-BIAGINI — HeroScrollytelling (Template 04)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — YURI-BIAGINI)
 * @date 2026-04-13
 * @purpose Enormous typography hero that shrinks on scroll — template 04 Scrollytelling
 */

type Props = {
  artistName: string;
  birthYear: string;
};

export function HeroScrollytelling({ artistName, birthYear }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <section aria-label="Hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <h1
        className="text-[18vw] md:text-[18vw] font-light leading-[0.85] text-center text-[var(--text-primary)] tracking-[-0.02em]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {artistName}
      </h1>
      <p className="mt-6 text-lg md:text-xl text-[var(--accent)] tracking-[0.2em]"
         style={{ fontFamily: 'var(--font-serif)' }}>
        {birthYear} — {currentYear}
      </p>
    </section>
  );
}
