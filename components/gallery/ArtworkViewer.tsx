/**
 * @package CREATOR-STAGING — ArtworkViewer
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.1.0 (FlorenceEGI — CREATOR-STAGING)
 * @date 2026-04-14
 * @purpose Fullscreen artwork viewer modal with zoom/pan/drag — ported from EGI egi-prism-3d viewer
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { EgiArtwork } from '@/lib/egi/client';

interface Props {
  artwork: EgiArtwork | null;
  onClose: () => void;
}

export function ArtworkViewer({ artwork, onClose }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [closing, setClosing] = useState(false);
  const [open, setOpen] = useState(false);

  /* Zoom/pan state */
  const pvRef = useRef({
    scale: 1, tx: 0, ty: 0,
    isDragging: false,
    startX: 0, startY: 0, startTx: 0, startTy: 0,
    touchDist: 0, touchCx: 0, touchCy: 0,
  });
  const overlayRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  /* ── Transform helpers ── */
  const applyTransform = useCallback((smooth: boolean) => {
    const w = wrapperRef.current;
    const pv = pvRef.current;
    if (!w) return;
    if (smooth) w.style.transition = 'transform 0.35s cubic-bezier(0.16,1,0.3,1)';
    else w.style.transition = 'none';
    w.style.transform = `translate(${pv.tx}px,${pv.ty}px) scale(${pv.scale})`;
    if (badgeRef.current) badgeRef.current.textContent = `${Math.round(pv.scale * 100)}%`;
    const area = areaRef.current;
    if (area) {
      area.style.cursor = pv.scale > 1 ? (pv.isDragging ? 'grabbing' : 'grab') : 'zoom-in';
    }
  }, []);

  const clampOffset = useCallback(() => {
    const pv = pvRef.current;
    if (pv.scale <= 1) { pv.tx = 0; pv.ty = 0; return; }
    const area = areaRef.current;
    const img = imgRef.current;
    if (!area || !img) return;
    const ar = area.getBoundingClientRect();
    const iw = img.naturalWidth || ar.width;
    const ih = img.naturalHeight || ar.height;
    const ratio = Math.min(ar.width / iw, ar.height / ih);
    const rw = iw * ratio * pv.scale;
    const rh = ih * ratio * pv.scale;
    const maxTx = Math.max(0, (rw - ar.width) / 2);
    const maxTy = Math.max(0, (rh - ar.height) / 2);
    pv.tx = Math.max(-maxTx, Math.min(maxTx, pv.tx));
    pv.ty = Math.max(-maxTy, Math.min(maxTy, pv.ty));
  }, []);

  const zoomAt = useCallback((factor: number, cx?: number, cy?: number) => {
    const pv = pvRef.current;
    const area = areaRef.current;
    if (!area) return;
    const ar = area.getBoundingClientRect();
    const ox = cx !== undefined ? cx - ar.left - ar.width / 2 : 0;
    const oy = cy !== undefined ? cy - ar.top - ar.height / 2 : 0;
    const ns = Math.min(Math.max(pv.scale * factor, 1), 6);
    if (ns === pv.scale) return;
    const r = ns / pv.scale;
    pv.tx = ox + (pv.tx - ox) * r;
    pv.ty = oy + (pv.ty - oy) * r;
    pv.scale = ns;
    clampOffset();
    applyTransform(false);
  }, [clampOffset, applyTransform]);

  const resetZoom = useCallback(() => {
    const pv = pvRef.current;
    pv.scale = 1; pv.tx = 0; pv.ty = 0;
    applyTransform(true);
  }, [applyTransform]);

  /* ── Lock body scroll + block ALL wheel on overlay (native, non-passive) ── */
  useEffect(() => {
    if (!artwork) return;
    const prevOverflow = document.body.style.overflow;
    const prevHeight = document.body.style.height;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.documentElement.style.overflow = 'hidden';

    const overlay = overlayRef.current;
    const blockWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    if (overlay) {
      overlay.addEventListener('wheel', blockWheel, { passive: false });
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.height = prevHeight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      if (overlay) {
        overlay.removeEventListener('wheel', blockWheel);
      }
    };
  }, [artwork]);

  /* ── Open/close animation ── */
  useEffect(() => {
    if (!artwork) return;
    setLoaded(false);
    setClosing(false);
    pvRef.current = { scale: 1, tx: 0, ty: 0, isDragging: false, startX: 0, startY: 0, startTx: 0, startTy: 0, touchDist: 0, touchCx: 0, touchCy: 0 };
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    return () => setOpen(false);
  }, [artwork]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setOpen(false);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  }, [onClose]);

  /* ── Keyboard ── */
  useEffect(() => {
    if (!artwork) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      else if (e.key === '+' || e.key === '=') { zoomAt(1.4); applyTransform(true); }
      else if (e.key === '-') { zoomAt(1 / 1.4); applyTransform(true); }
      else if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [artwork, handleClose, zoomAt, applyTransform, resetZoom]);

  /* ── Mouse/touch events on image area (zoom wheel + drag) ── */
  useEffect(() => {
    const area = areaRef.current;
    if (!area || !artwork) return;
    const pv = pvRef.current;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
    };
    const onMouseDown = (e: MouseEvent) => {
      if (pv.scale <= 1 || e.button !== 0) return;
      e.preventDefault();
      pv.isDragging = true;
      pv.startX = e.clientX; pv.startY = e.clientY;
      pv.startTx = pv.tx; pv.startTy = pv.ty;
      area.style.cursor = 'grabbing';
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!pv.isDragging) return;
      pv.tx = pv.startTx + (e.clientX - pv.startX);
      pv.ty = pv.startTy + (e.clientY - pv.startY);
      clampOffset();
      applyTransform(false);
    };
    const onMouseUp = () => {
      if (!pv.isDragging) return;
      pv.isDragging = false;
      if (area) area.style.cursor = pv.scale > 1 ? 'grab' : 'zoom-in';
    };
    const onDblClick = (e: MouseEvent) => {
      if (pv.scale > 1) resetZoom();
      else { zoomAt(2.5, e.clientX, e.clientY); applyTransform(true); }
    };

    let tLast: Touch[] = [];
    const onTouchStart = (e: TouchEvent) => {
      tLast = Array.from(e.touches);
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pv.touchDist = Math.hypot(dx, dy);
        pv.touchCx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        pv.touchCy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
      e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const nd = Math.hypot(dx, dy);
        zoomAt(nd / pv.touchDist, pv.touchCx, pv.touchCy);
        pv.touchDist = nd;
      } else if (e.touches.length === 1 && pv.scale > 1) {
        pv.tx += e.touches[0].clientX - tLast[0].clientX;
        pv.ty += e.touches[0].clientY - tLast[0].clientY;
        clampOffset();
        applyTransform(false);
        tLast = Array.from(e.touches);
      }
    };

    area.addEventListener('wheel', onWheel, { passive: false });
    area.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    area.addEventListener('dblclick', onDblClick);
    area.addEventListener('touchstart', onTouchStart, { passive: false });
    area.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      area.removeEventListener('wheel', onWheel);
      area.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      area.removeEventListener('dblclick', onDblClick);
      area.removeEventListener('touchstart', onTouchStart);
      area.removeEventListener('touchmove', onTouchMove);
    };
  }, [artwork, zoomAt, clampOffset, applyTransform, resetZoom]);

  if (!artwork) return null;

  const imageUrl = artwork.original_image_url || artwork.large_image_url || artwork.medium_image_url || artwork.main_image_url || '';

  return createPortal(
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        boxSizing: 'border-box',
        overscrollBehavior: 'none',
        touchAction: 'none',
        background: open && !closing ? 'rgba(3,3,12,0.91)' : 'rgba(3,3,12,0)',
        backdropFilter: open && !closing ? 'blur(14px)' : 'none',
        transition: 'background 0.35s ease, backdrop-filter 0.35s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-full flex overflow-hidden"
        style={{
          maxWidth: 1160,
          height: 'min(86vh, 780px)',
          background: 'linear-gradient(148deg, #141428 0%, #0a0a1c 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 22,
          boxShadow: '0 48px 128px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,165,0,0.05), inset 0 1px 0 rgba(255,255,255,0.055)',
          opacity: open && !closing ? 1 : 0,
          transform: open && !closing ? 'scale(1) translateY(0)' : closing ? 'scale(0.96) translateY(10px)' : 'scale(0.93) translateY(22px)',
          transition: closing
            ? 'opacity 0.28s ease, transform 0.28s ease'
            : 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* LEFT: Image zoom area */}
        <div
          ref={areaRef}
          className="flex-1 min-w-0 relative overflow-hidden select-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 40%, #0e0e28 0%, #050510 100%)',
            cursor: 'zoom-in',
          }}
        >
          {/* Top controls */}
          <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center gap-1.5 pointer-events-none">
            <button onClick={() => { zoomAt(1.4); applyTransform(true); }} className="pv-ctrl-btn pointer-events-auto" title="Zoom in (+)">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><line x1="4.5" y1="5.5" x2="6.5" y2="5.5"/><line x1="5.5" y1="4.5" x2="5.5" y2="6.5"/><line x1="9" y1="9" x2="12" y2="12"/>
              </svg>
            </button>
            <button onClick={() => { zoomAt(1/1.4); applyTransform(true); }} className="pv-ctrl-btn pointer-events-auto" title="Zoom out (-)">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/><line x1="4" y1="5.5" x2="7" y2="5.5"/><line x1="9" y1="9" x2="12" y2="12"/>
              </svg>
            </button>
            <button onClick={resetZoom} className="pv-ctrl-btn pointer-events-auto" title="Fit (0)">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4.5V2a1 1 0 011-1h2.5M8.5 1H11a1 1 0 011 1v2.5M12 8.5V11a1 1 0 01-1 1H8.5M4.5 12H2a1 1 0 01-1-1V8.5"/>
              </svg>
            </button>
            <span
              ref={badgeRef}
              className="pointer-events-auto"
              style={{
                background: 'rgba(8,8,22,0.72)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                padding: '0 9px',
                height: 32,
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.72rem',
                color: 'rgba(255,255,255,0.45)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.06em',
                minWidth: 44,
                justifyContent: 'center',
              }}
            >
              100%
            </span>
            <div className="flex-1" />
            <button onClick={handleClose} className="pv-ctrl-btn pv-close-btn pointer-events-auto" title="Close (ESC)">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="1" y1="1" x2="10" y2="10"/><line x1="10" y1="1" x2="1" y2="10"/>
              </svg>
            </button>
          </div>

          {/* Image wrapper — receives CSS transform */}
          <div
            ref={wrapperRef}
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt={artwork.title || ''}
              draggable={false}
              onLoad={() => setLoaded(true)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.45s ease',
                pointerEvents: 'none',
                filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.7))',
                borderRadius: 3,
              }}
            />
          </div>

          {/* Loader */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center gap-2.5 pointer-events-none" style={{ color: 'rgba(255,255,255,0.22)', fontSize: '0.8rem', letterSpacing: '0.08em' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="animate-spin">
                <circle cx="11" cy="11" r="9" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
                <path d="M11 2a9 9 0 019 9" stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* RIGHT: Info panel */}
        <div
          className="flex flex-col"
          style={{
            width: 310,
            minWidth: 250,
            maxWidth: 330,
            borderLeft: '1px solid rgba(255,255,255,0.065)',
            background: 'rgba(10,10,22,0.5)',
          }}
        >
          <div className="flex-1 overflow-y-auto p-5 text-white" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
            {/* Title */}
            <h4 className="m-0 mb-1.5 text-lg font-bold" style={{ color: '#ffaa00', letterSpacing: '0.5px' }}>
              {artwork.title}
            </h4>
            {/* Collection + Year */}
            <div className="flex gap-4 flex-wrap text-xs mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {artwork.collection?.name && <span>{artwork.collection.name}</span>}
              {artwork.year && <span>{artwork.year}</span>}
            </div>
            {/* Description */}
            {artwork.description && (
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {artwork.description}
              </p>
            )}
            {/* Creator */}
            {artwork.creator?.display_name && (
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Artist
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {artwork.creator.display_name}
                </span>
              </div>
            )}
            {/* View on EGI link */}
            {artwork.url && (
              <a
                href={artwork.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 text-xs uppercase tracking-widest rounded border transition-colors"
                style={{
                  borderColor: 'rgba(255,170,0,0.3)',
                  color: '#ffcc55',
                }}
              >
                View on FlorenceEGI →
              </a>
            )}
          </div>
          <div className="px-4 py-2.5 text-center flex-shrink-0 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.055)', color: 'rgba(255,255,255,0.18)', lineHeight: 1.5 }}>
            Scroll · Drag · Double click · + / − · ESC
          </div>
        </div>
      </div>

      {/* Shared button styles */}
      <style>{`
        .pv-ctrl-btn {
          width: 32px; height: 32px; border-radius: 9px;
          background: rgba(8,8,22,0.72); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.65); font-size: 14px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.12s;
          flex-shrink: 0; outline: none;
        }
        .pv-ctrl-btn:hover {
          background: rgba(255,165,0,0.14); border-color: rgba(255,165,0,0.38);
          color: #ffcc55; transform: scale(1.08);
        }
        .pv-ctrl-btn:active { transform: scale(0.94); }
        .pv-close-btn:hover {
          background: rgba(255,60,60,0.18) !important; border-color: rgba(255,80,80,0.4) !important;
          color: #ff8888 !important;
        }
        @media (max-width: 768px) {
          .pv-ctrl-btn { width: 36px; height: 36px; }
        }
      `}</style>
    </div>,
    document.body
  );
}
