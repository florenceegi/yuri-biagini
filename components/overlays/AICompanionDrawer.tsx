/**
 * @package CREATOR-STAGING — AICompanionDrawer (overlays/)
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-17
 * @purpose AI Companion drawer — "The Guide" right-side panel (mock UI, F3.1). Welcomes the visitor, offers suggested prompts, and echoes a mock guide response. Will be wired to the real artist RAG in M-061.
 */

'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';

// ───────────────────────── Types ─────────────────────────

export type DrawerLabels = {
  title: string;
  welcome: string;
  placeholder: string;
  send: string;
  close: string;
  mock_response: string;
  prompt_1: string;
  prompt_2: string;
  prompt_3: string;
  disclaimer: string;
  you: string;
  guide: string;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'guide';
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  labels: DrawerLabels;
  /**
   * Element that triggered the drawer open. Focus returns here on close.
   * Stored at the moment of opening by OverlayManager (via document.activeElement).
   */
  opener: HTMLElement | null;
};

// ───────────────────────── Focus trap helper ─────────────────────────

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  const nodes = root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
  return Array.from(nodes).filter(
    (el) => !el.hasAttribute('hidden') && el.offsetParent !== null
  );
}

// ───────────────────────── Component ─────────────────────────

export function AICompanionDrawer({ open, onClose, labels, opener }: Props) {
  const titleId = useId();
  const welcomeId = useId();
  const logId = useId();

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mql.matches);
    onChange();
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    }
    // Legacy Safari
    mql.addListener(onChange);
    return () => mql.removeListener(onChange);
  }, []);

  // Open/close lifecycle — mount, animate, focus
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Next frame → trigger CSS transition
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const transitionMs = prefersReducedMotion ? 0 : 320;
    const t = window.setTimeout(() => setMounted(false), transitionMs);
    return () => window.clearTimeout(t);
  }, [open, prefersReducedMotion]);

  // Body scroll lock while open
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Move focus into drawer when opened; restore to opener on close
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 60);
    return () => {
      window.clearTimeout(t);
      if (opener && typeof opener.focus === 'function') {
        try {
          opener.focus();
        } catch {
          /* noop */
        }
      }
    };
  }, [open, opener]);

  // Keep chat log scrolled to bottom when a new message arrives
  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Keyboard handler — Escape + Tab trap
  const onKeyDownCapture = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = getFocusable(drawerRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey) {
        if (active === first || !drawerRef.current?.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  const handleBackdropClick = useCallback(() => onClose(), [onClose]);

  const handleSubmit = useCallback(() => {
    const text = input.trim();
    if (text.length === 0 || submitting) return;

    // TODO (M-061): replace mock with real API call to the artist RAG endpoint.
    // Expected signature: POST /api/ai/guide { question: string } → { answer: string }
    const newId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `u-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setMessages((prev) => [...prev, { id: newId, role: 'user', text }]);
    setInput('');
    setSubmitting(true);

    window.setTimeout(() => {
      const replyId =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `g-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setMessages((prev) => [
        ...prev,
        { id: replyId, role: 'guide', text: labels.mock_response },
      ]);
      setSubmitting(false);
    }, 600);
  }, [input, submitting, labels.mock_response]);

  const onTextareaKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const onPromptClick = useCallback((prompt: string) => {
    setInput(prompt);
    window.setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const suggestedPrompts = useMemo(
    () => [labels.prompt_1, labels.prompt_2, labels.prompt_3],
    [labels.prompt_1, labels.prompt_2, labels.prompt_3]
  );

  if (!mounted) return null;

  const transitionStyle = prefersReducedMotion
    ? 'opacity 180ms ease-out'
    : 'transform 300ms ease-out, opacity 300ms ease-out';

  const drawerTransform = prefersReducedMotion
    ? 'none'
    : visible
      ? 'translateX(0)'
      : 'translateX(100%)';

  return (
    <div
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        pointerEvents: open ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        aria-hidden="true"
        className="absolute inset-0 bg-black/30"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 300ms ease-out',
        }}
      />
      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={welcomeId}
        onKeyDown={onKeyDownCapture}
        className="absolute top-0 right-0 h-full w-full sm:w-[420px] flex flex-col"
        style={{
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          borderLeft: '1px solid var(--border)',
          boxShadow: '-24px 0 48px rgba(0,0,0,0.25)',
          transform: drawerTransform,
          opacity: visible ? 1 : 0,
          transition: transitionStyle,
          willChange: 'transform, opacity',
        }}
      >
        {/* Header */}
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h2
            id={titleId}
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {labels.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors focus:outline-none focus:ring-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Chat log */}
        <div
          ref={logRef}
          id={logId}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
        >
          {/* Welcome bubble — always first */}
          <div
            id={welcomeId}
            className="rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[92%]"
            style={{
              background: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            <div
              className="text-[11px] uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              {labels.guide}
            </div>
            {labels.welcome}
          </div>

          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[92%] ${
                  isUser ? 'ml-auto' : ''
                }`}
                style={{
                  background: isUser ? 'var(--accent)' : 'var(--border)',
                  color: isUser ? '#fff' : 'var(--text-primary)',
                }}
              >
                <div
                  className="text-[11px] uppercase tracking-wider mb-1"
                  style={{
                    color: isUser
                      ? 'rgba(255,255,255,0.82)'
                      : 'var(--text-muted)',
                  }}
                >
                  {isUser ? labels.you : labels.guide}
                </div>
                {m.text}
              </div>
            );
          })}
        </div>

        {/* Suggested prompts */}
        <div
          className="px-5 pt-3 pb-2 flex flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {suggestedPrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onPromptClick(p)}
              className="text-[12px] px-3 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="px-5 pb-3">
          <div
            className="flex items-end gap-2 rounded-2xl p-2"
            style={{
              border: '1px solid var(--border)',
              background: 'var(--bg-elevated)',
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onTextareaKeyDown}
              placeholder={labels.placeholder}
              rows={2}
              aria-label={labels.placeholder}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed px-2 py-1.5 focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || input.trim().length === 0}
              aria-label={labels.send}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl transition-opacity focus:outline-none focus:ring-2 disabled:opacity-40"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22,2 15,22 11,13 2,9" />
              </svg>
            </button>
          </div>
          <p
            className="mt-2 text-[11px] leading-snug"
            style={{ color: 'var(--text-muted)' }}
          >
            {labels.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
