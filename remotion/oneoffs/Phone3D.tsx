/**
 * Cinematic iPhone (Pro, flat titanium sides) in real CSS 3D: an extruded metal body built from
 * stacked layers, side buttons, glass + metal reflections. Turn with `ry` (deg): + shows the left side.
 */
import React from 'react';
import { Img } from 'remotion';

const METAL = (k: number) =>
  `linear-gradient(180deg, rgba(255,255,255,${0.0}) 0%, rgba(255,255,255,${0.75 * k}) 9%, rgba(255,255,255,0) 17%, rgba(255,255,255,0) 44%, rgba(255,255,255,${0.55 * k}) 52%, rgba(255,255,255,0) 60%, rgba(0,0,0,0.10) 80%, rgba(255,255,255,${0.6 * k}) 92%, rgba(255,255,255,0) 100%),` +
  ' linear-gradient(90deg, #6F7278 0%, #C9CBD0 18%, #9A9CA2 40%, #E4E5E8 62%, #8C8F95 82%, #5F6268 100%)';

export const Phone3D: React.FC<{
  w: number; screen: string; ry?: number; rx?: number; rz?: number; statusInk?: string; statusBg?: string;
}> = ({ w, screen, ry = 24, rx = 4, rz = 0, statusInk = '#0E0E10', statusBg = '#FFFFFF' }) => {
  const h = Math.round(w * 2.09);
  const R = w * 0.18;
  const D = Math.round(w * 0.085); // body thickness
  const L = 22; // layers
  const rim = Math.max(3, w * 0.011);
  const bez = w * 0.022;
  const inset = rim + bez;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  const btn = (side: 'l' | 'r', top: number, len: number) => (
    <div key={side + top} style={{
      position: 'absolute', top: h * top, height: h * len, width: D * 0.62,
      left: side === 'l' ? -D * 0.31 - 1.5 : w - D * 0.31 + 1.5,
      transform: `translateZ(${-D / 2}px) rotateY(90deg)`, borderRadius: 4,
      background: 'linear-gradient(180deg, #F3F4F6, #8E9197 40%, #D9DADD 70%, #7A7D83)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)',
    }} />
  );
  return (
    <div style={{ position: 'relative', width: w, height: h, transformStyle: 'preserve-3d', transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
      {/* extruded titanium body */}
      {Array.from({ length: L }, (_, i) => {
        const z = -((i + 1) / L) * D;
        const mid = 1 - Math.abs(i / (L - 1) - 0.5) * 2; // brighter in the middle of the band
        return (
          <div key={i} style={{
            position: 'absolute', inset: 0, borderRadius: R, transform: `translateZ(${z}px)`,
            background: METAL(0.5 + 0.5 * mid), filter: `brightness(${0.78 + 0.32 * mid})`,
          }} />
        );
      })}
      {/* side buttons: action + volume (left), side + camera control (right) */}
      {btn('l', 0.17, 0.045)}{btn('l', 0.25, 0.075)}{btn('l', 0.34, 0.075)}
      {btn('r', 0.26, 0.11)}{btn('r', 0.6, 0.06)}
      {/* front: polished rim → black glass → screen */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: R, transform: 'translateZ(0.5px)', background: 'linear-gradient(135deg, #F4F5F7, #A3A6AC 30%, #EDEEF0 55%, #8B8E94 80%, #D7D8DB)', padding: rim, boxShadow: 'inset 0 0 0 0.75px rgba(255,255,255,0.9)' }}>
        <div style={{ width: '100%', height: '100%', borderRadius: R - rim, background: '#050506', padding: bez }}>
          <div style={{ position: 'relative', width: sw, height: sh, borderRadius: R - inset, overflow: 'hidden', background: statusBg }}>
            <Img src={screen} style={{ position: 'absolute', left: 0, top: 0, width: sw, height: sh, objectFit: 'cover', objectPosition: 'top' }} />
            {/* clean status bar over the screenshot's own */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: sh * 0.052, background: statusBg }} />
            <div style={{ position: 'absolute', top: sh * 0.019, left: sw * 0.12, fontSize: sw * 0.042, fontWeight: 600, color: statusInk, fontFamily: '"Geist Sans", sans-serif', letterSpacing: -0.2 }}>9:41</div>
            <div style={{ position: 'absolute', top: sh * 0.022, right: sw * 0.09, display: 'flex', gap: sw * 0.014, alignItems: 'center' }}>
              <svg width={sw * 0.04} height={sw * 0.026} viewBox="0 0 20 13">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5.2} y={9 - i * 3} width="3.6" height={4 + i * 3} rx="1" fill={statusInk} />)}</svg>
              <svg width={sw * 0.036} height={sw * 0.026} viewBox="0 0 24 17" fill="none" stroke={statusInk} strokeWidth="2.6" strokeLinecap="round"><path d="M2 6.5a15 15 0 0 1 20 0" /><path d="M5.5 10a10 10 0 0 1 13 0" /><circle cx="12" cy="14" r="1.6" fill={statusInk} stroke="none" /></svg>
              <div style={{ width: sw * 0.055, height: sw * 0.026, borderRadius: 4, border: `1.4px solid ${statusInk}`, padding: 1.2 }}><div style={{ width: '85%', height: '100%', background: statusInk, borderRadius: 1.5 }} /></div>
            </div>
            <div style={{ position: 'absolute', top: sh * 0.014, left: sw / 2 - sw * 0.15, width: sw * 0.3, height: sh * 0.04, borderRadius: 999, background: '#050506' }} />
            <div style={{ position: 'absolute', bottom: sh * 0.008, left: sw / 2 - sw * 0.17, width: sw * 0.34, height: Math.max(4, sh * 0.006), borderRadius: 9, background: '#111', opacity: 0.85 }} />
            {/* glass reflections */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(112deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.10) 22%, rgba(255,255,255,0) 34%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.10) 86%, rgba(255,255,255,0) 100%)' }} />
            <div style={{ position: 'absolute', top: '-20%', bottom: '-20%', left: '58%', width: '7%', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))', transform: 'rotate(16deg)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
