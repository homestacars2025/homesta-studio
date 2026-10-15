/**
 * S1 · Just Joined  (story, 9:16 video, 9s @ 30fps, with SFX)
 * Target: unit.
 *  0.0s  the Homesta mark itself becomes a 3D red gateway with two white doors
 *  0.5s  "A new stay just joined" under the gateway, fireworks + party poppers + confetti
 *  2.3s  the doors swing open, warm light
 *  3.1s  camera pushes through → blurred cover photo fills the screen
 *  4.2s  the stay card exactly like on homestastay.com (photo, ♡, PAY ON ARRIVAL, title, place, specs)
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Heart, Pointer } from 'lucide-react';
import type { StudioProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const S1_FRAMES = 270;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.7, 0, 0.3, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const rv = (f: number, s: number, d = 18) => interpolate(f, [s, s + d], [0, 1], { easing: ease, ...cl });
const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  if (t.length >= 50) t = t.replace(/\s+\S*$/, '');
  return t;
};

/* ── gateway = the brand mark (viewBox 307 292 466 496, stroke 69.5) ── */
const S = 1.45;
const GX = 540 - 233 * S;          // screen x of viewBox x=307
const GY = 860 - 248 * S;          // screen y of viewBox y=292
const sx = (v: number) => GX + (v - 307) * S;
const sy = (v: number) => GY + (v - 292) * S;
const R_IN = 163.25;               // inner radius (198 - 69.5/2)
const IN_L = sx(376.25), IN_T = sy(525 - R_IN), IN_W = 2 * R_IN * S, IN_H = (752 - (525 - R_IN)) * S;
const ORIGIN = { x: IN_L + IN_W / 2, y: IN_T + IN_H * 0.55 };
const PATH = 'M341.5 752 V525 A198 198 0 0 1 737.5 525 V752';

/* ── fireworks ── */
const BURSTS = [
  { x: 250, y: 360, t: 36, c: '#E52851' },
  { x: 840, y: 300, t: 45, c: '#F5C451' },
  { x: 560, y: 190, t: 56, c: '#FF8FA8' },
  { x: 880, y: 620, t: 64, c: '#FFFFFF' },
  { x: 190, y: 640, t: 70, c: '#F5C451' },
];
const Fireworks: React.FC<{ f: number; fade: number }> = ({ f, fade }) => (
  <>
    {BURSTS.map((b, bi) => {
      const t = (f - b.t) / 30;
      if (t <= 0 || t > 1.6) return null;
      const n = 34;
      const r = 230 * (1 - Math.exp(-t * 3.2));
      const op = Math.max(0, 1 - t / 1.6) * fade;
      return (
        <svg key={bi} width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {/* flash */}
          {t < 0.25 && <circle cx={b.x} cy={b.y} r={60 * (1 - t * 4)} fill="#fff" opacity={0.7 * (1 - t * 4)} />}
          {Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 + rand(bi * 50 + i) * 0.2;
            const rr = r * (0.85 + rand(i + bi) * 0.3);
            const x = b.x + Math.cos(a) * rr, y = b.y + Math.sin(a) * rr + 90 * t * t;
            const tx = b.x + Math.cos(a) * rr * 0.72, ty = b.y + Math.sin(a) * rr * 0.72 + 70 * t * t;
            const col = i % 3 === 0 ? '#FFFFFF' : b.c;
            return (
              <g key={i} opacity={op}>
                <line x1={tx} y1={ty} x2={x} y2={y} stroke={col} strokeWidth={3.2} strokeLinecap="round" opacity={0.55} />
                <circle cx={x} cy={y} r={4.5} fill={col} />
              </g>
            );
          })}
        </svg>
      );
    })}
  </>
);

/* ── confetti from the poppers ── */
const COLORS = ['#E52851', '#FFFFFF', '#F5C451', '#8C0E2A', '#FF8FA8'];
const PIECES = Array.from({ length: 90 }, (_, i) => ({
  side: i % 2 ? 1 : -1, a: (-52 - rand(i) * 36) * (Math.PI / 180), v: 38 + rand(i + 9) * 32,
  rot: rand(i + 3) * 720 - 360, w: 12 + rand(i + 5) * 14, h: 6 + rand(i + 7) * 10, c: COLORS[i % COLORS.length], round: rand(i + 11) > 0.7,
}));
const Confetti: React.FC<{ f: number; start: number; fade: number }> = ({ f, start, fade }) => {
  const t = (f - start) / 30;
  if (t <= 0) return null;
  return (
    <>
      {PIECES.map((p, i) => {
        const x0 = p.side < 0 ? 200 : 880, y0 = 1470;
        const vx = Math.cos(p.a) * p.v * -p.side * 26, vy = Math.sin(p.a) * p.v * 26;
        const drag = 1 - Math.exp(-t * 1.6);
        const x = x0 + (vx / 1.6) * drag + Math.sin(t * 3 + i) * 30 * t;
        const y = y0 + (vy / 1.6) * drag + 260 * t * t;
        if (y > 2000) return null;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: p.w, height: p.round ? p.w : p.h, borderRadius: p.round ? 99 : 2, background: p.c, transform: `rotate(${p.rot * t}deg) rotateX(${t * 400 + i * 20}deg)`, opacity: Math.min(1, 3 - t * 0.5) * fade }} />;
      })}
    </>
  );
};

export const S1_JustJoined: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const u = p.unit!;
  const photo = u.photos[0]?.url;
  const s = u.specs ?? {};
  const title = niceName(u.title || u.name);
  const place = [u.district, u.city].filter(Boolean).join(', ');
  const specLine = [
    s.bedrooms ? `${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}` : null,
    s.beds ? `${s.beds} bed${Number(s.beds) > 1 ? 's' : ''}` : null,
    s.baths ? `${s.baths} bath${Number(s.baths) > 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(' · ');
  const badge = u.pay_at_arrival ? 'Pay on arrival' : u.deposit ? 'Book with deposit' : null;

  /* timeline */
  const gateIn = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 110, mass: 0.9 } });
  const words = rv(f, 16, 22);
  const words2 = rv(f, 24, 22);
  const popL = spring({ frame: f - 34, fps, config: { damping: 9, stiffness: 180 } });
  const popR = spring({ frame: f - 36, fps, config: { damping: 9, stiffness: 180 } });
  const doors = interpolate(f, [70, 96], [0, 1], { easing: io, ...cl });
  const glow = interpolate(f, [74, 94, 110], [0, 1, 0.7], cl);
  const push = interpolate(f, [94, 126], [0, 1], { easing: io, ...cl });
  const introFade = 1 - interpolate(f, [114, 126], [0, 1], cl);
  const bg = interpolate(f, [108, 124], [0, 1], cl);
  const textFade = 1 - interpolate(f, [92, 104], [0, 1], cl);
  const card = spring({ frame: f - 126, fps, config: { damping: 15, stiffness: 110, mass: 1 } });
  const cardTxt = (k: number) => rv(f, 140 + k * 6, 16);
  const end = rv(f, 168, 16);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const kb = 1.18 - 0.08 * interpolate(f, [116, durationInFrames], [0, 1], cl);

  const door = (side: 'l' | 'r'): React.CSSProperties => ({
    position: 'absolute', top: 0, bottom: 0, width: IN_W / 2, [side === 'l' ? 'left' : 'right']: 0,
    transformOrigin: side === 'l' ? 'left center' : 'right center',
    transform: `rotateY(${(side === 'l' ? -1 : 1) * doors * 106}deg)`,
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F3EFE9 100%)',
    boxShadow: `inset ${side === 'l' ? -5 : 5}px 0 10px rgba(14,14,16,0.08)`, backfaceVisibility: 'hidden',
  });

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, opacity: out, background: '#FAFAF7', overflow: 'hidden' }}>
      <Audio src={asset('sfx/s1-just-joined.wav')} volume={0.9} />
      <AbsoluteFill style={{ background: 'radial-gradient(70% 45% at 50% 44%, #FFFFFF 0%, #F6F1EA 60%, #EDE6DC 100%)' }} />

      {/* ── intro: gateway ── */}
      <AbsoluteFill style={{ transform: `scale(${1 + push * 3.6})`, transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px`, opacity: introFade > 0 ? 1 : 0 }}>
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - gateIn) * 520}px) scale(${0.6 + 0.4 * gateIn})`, transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }}>
          {/* ground shadow */}
          <div style={{ position: 'absolute', left: sx(307) - 20, top: sy(752) + 14, width: 466 * S + 40, height: 60, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(14,14,16,0.26), rgba(14,14,16,0))' }} />
          {/* inside the gate: photo + light + doors */}
          <div style={{ position: 'absolute', left: IN_L, top: IN_T, width: IN_W, height: IN_H, borderRadius: `${IN_W / 2}px ${IN_W / 2}px 0 0`, overflow: 'hidden', background: '#FFF6E8', perspective: 1400 }}>
            {photo ? <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.3 - 0.12 * doors})` }} /> : null}
            <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 50% 55%, rgba(255,240,200,${0.8 * glow}), rgba(255,240,200,0) 72%)` }} />
            <AbsoluteFill style={{ boxShadow: 'inset 0 14px 26px rgba(80,0,20,0.35)' }} />
            <div style={door('l')}>
              <div style={{ position: 'absolute', inset: '64px 28px 56px 34px', borderRadius: `${IN_W / 2}px 26px 8px 8px`, border: '3px solid rgba(14,14,16,0.06)' }} />
              <div style={{ position: 'absolute', right: 22, top: '56%', width: 13, height: 50, borderRadius: 8, background: 'linear-gradient(180deg,#F5D27A,#C9963A)' }} />
            </div>
            <div style={door('r')}>
              <div style={{ position: 'absolute', inset: '64px 34px 56px 28px', borderRadius: `26px ${IN_W / 2}px 8px 8px`, border: '3px solid rgba(14,14,16,0.06)' }} />
              <div style={{ position: 'absolute', left: 22, top: '56%', width: 13, height: 50, borderRadius: 8, background: 'linear-gradient(180deg,#F5D27A,#C9963A)' }} />
            </div>
          </div>
          {/* the mark as a 3D frame */}
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <defs>
              <linearGradient id="gate" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FF6B88" /><stop offset="0.35" stopColor={t.primary} /><stop offset="1" stopColor="#B5173C" />
              </linearGradient>
              <filter id="gs" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="26" stdDeviation="22" floodColor="#8C0E2A" floodOpacity="0.35" /></filter>
            </defs>
            <g transform={`translate(${GX} ${GY}) scale(${S}) translate(-307 -292)`}>
              <path d={PATH} fill="none" stroke="#7A0C25" strokeWidth={69.5} strokeLinecap="round" transform="translate(0 9)" filter="url(#gs)" />
              <path d={PATH} fill="none" stroke="url(#gate)" strokeWidth={69.5} strokeLinecap="round" />
              <path d="M352 700 V525 A187 187 0 0 1 600 352" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={9} strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </AbsoluteFill>

      {/* intro logo + words under the gate */}
      <div style={{ opacity: textFade }}>
        <div style={{ position: 'absolute', top: 160, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: rv(f, 4, 14) }}>
          <HorizontalLogo b={p.brand} height={44} logoReady={p.logoReady} />
        </div>
        <div style={{ position: 'absolute', top: sy(752) + 90, left: 0, right: 0, textAlign: 'center', color: t.ink }}>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 8, textTransform: 'uppercase', opacity: words, transform: `translateY(${(1 - words) * 20}px)` }}>A new stay</div>
          <div style={{ overflow: 'hidden', height: 150 }}>
            <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 128, lineHeight: '150px', color: t.primary, letterSpacing: -2, transform: `translateY(${(1 - words2) * 150}px)` }}>just joined</div>
          </div>
        </div>
      </div>
      <Fireworks f={f} fade={textFade} />
      {[{ x: -40, s: popL, flip: false }, { x: 680, s: popR, flip: true }].map((q, i) => (
        <div key={i} style={{ position: 'absolute', left: q.x, top: 1430, width: 440, opacity: Math.min(1, q.s * 2) * textFade, transform: `${q.flip ? 'scaleX(-1)' : ''} translateY(${(1 - q.s) * 260}px) rotate(${-8 + (1 - q.s) * -30}deg)`, filter: 'drop-shadow(0 20px 22px rgba(14,14,16,0.22))' }}>
          <Img src={asset('brand/3d/party-popper.png')} style={{ width: '100%' }} />
        </div>
      ))}
      <Confetti f={f} start={40} fade={textFade} />

      {/* ── after the push: blurred cover + site card ── */}
      <AbsoluteFill style={{ opacity: bg }}>
        {photo ? <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`, filter: 'blur(14px) saturate(1.05)' }} /> : null}
        <AbsoluteFill style={{ background: 'rgba(14,14,16,0.18)' }} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: bg, filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.3))' }}>
        <HorizontalLogo b={p.brand} height={44} logoReady={p.logoReady} light redArch />
      </div>
      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center', color: '#fff', opacity: bg, textShadow: '0 3px 16px rgba(0,0,0,0.35)' }}>
        <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: 6, textTransform: 'uppercase' }}>New on Homesta </span><span style={{ fontSize: 34 }}>🎉</span>
      </div>
      <div style={{
        position: 'absolute', left: 90, top: 400, width: 900, borderRadius: 44, background: '#FFFFFF', padding: '30px 30px 34px',
        boxShadow: '0 40px 90px rgba(0,0,0,0.35)', transform: `translateY(${(1 - card) * 900}px) scale(${0.92 + 0.08 * card})`, opacity: Math.min(1, card * 1.6),
      }}>
        <div style={{ position: 'relative', height: 560, borderRadius: 34, overflow: 'hidden', background: '#ddd' }}>
          {photo ? <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
          <div style={{ position: 'absolute', top: 26, right: 26, width: 84, height: 84, borderRadius: 99, background: 'rgba(250,248,244,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={40} color={t.ink} strokeWidth={2} />
          </div>
          {badge && (
            <div style={{ position: 'absolute', left: 24, bottom: 26, height: 64, padding: '0 30px', borderRadius: 999, background: 'rgba(255,255,255,0.96)', display: 'flex', alignItems: 'center', fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace', fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', color: t.primary }}>
              {badge}
            </div>
          )}
        </div>
        <div style={{ padding: '30px 6px 0' }}>
          <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.18, letterSpacing: -0.8, color: t.ink, opacity: cardTxt(0), transform: `translateY(${(1 - cardTxt(0)) * 16}px)` }}>{title}</div>
          <div style={{ marginTop: 14, fontFamily: '"JetBrains Mono", "SFMono-Regular", Menlo, monospace', fontSize: 30, letterSpacing: 4, textTransform: 'uppercase', color: '#8C8881', opacity: cardTxt(1) }}>{place}</div>
          <div style={{ marginTop: 10, fontSize: 34, fontWeight: 300, color: '#6E6A64', opacity: cardTxt(2) }}>{specLine}</div>
          {u.price_from_usd ? (
            <div style={{ marginTop: 16, fontSize: 34, color: t.ink, opacity: cardTxt(3) }}>
              <b style={{ fontWeight: 700 }}>${Math.round(u.price_from_usd)}</b> <span style={{ fontWeight: 300, color: '#6E6A64' }}>/ night</span>
            </div>
          ) : null}
        </div>
      </div>
      {/* "Explore it now" + tapping finger → the admin places the Instagram LINK sticker in the dashed slot */}
      <div style={{ position: 'absolute', top: 1352, left: 0, right: 0, textAlign: 'center', color: '#fff', opacity: end, textShadow: '0 3px 16px rgba(0,0,0,0.4)' }}>
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -0.5 }}>Explore it now</div>
      </div>
      <div style={{ position: 'absolute', top: 1420, left: 290, width: 500, height: 104, borderRadius: 999, border: '3px dashed rgba(255,255,255,0.7)', opacity: end * 0.9 }} />
      {(() => {
        const tap = (f % 36) / 36;                     // tap loop
        const press = Math.sin(Math.min(1, tap * 2) * Math.PI);
        return (
          <div style={{ position: 'absolute', left: 700, top: 1470, opacity: end }}>
            <div style={{ position: 'absolute', left: -6, top: -6, width: 64 + tap * 70, height: 64 + tap * 70, marginLeft: -tap * 35, marginTop: -tap * 35, borderRadius: 999, border: '4px solid rgba(255,255,255,0.9)', opacity: 1 - tap }} />
            <div style={{ transform: `translate(${10 - press * 8}px, ${14 - press * 10}px) rotate(-12deg) scale(${1 - press * 0.08})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))' }}>
              <Pointer size={84} color="#14141A" fill="#FFFFFF" strokeWidth={1.6} />
            </div>
          </div>
        );
      })()}
      <div style={{ position: 'absolute', top: 1575, left: 0, right: 0, textAlign: 'center', fontSize: 38, color: '#fff', opacity: end, textShadow: '0 2px 14px rgba(0,0,0,0.4)' }}>
        <span style={{ fontWeight: 700 }}>{t.site.replace(/\.com$/, '')}</span><span style={{ fontWeight: 300 }}>.com</span>
      </div>
    </AbsoluteFill>
  );
};
