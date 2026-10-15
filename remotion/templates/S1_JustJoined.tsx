/**
 * S1 · Just Joined  (story, 9:16 video, 8s @ 30fps, with SFX)
 * Target: unit. Celebration reveal:
 *  0.0s  3D red arch (the Homesta mark as a doorway) springs in
 *  0.9s  its two doors swing open → the new stay's photo glows inside
 *  1.5s  3D party poppers fire, confetti bursts
 *  2.0s  camera pushes through the arch → photo fills the screen
 *  3.1s  "New on Homesta" + stay name + place, specs, price, site
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bath, BedDouble, Users } from 'lucide-react';
import type { StudioProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const S1_FRAMES = 240;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.7, 0, 0.3, 1);
const rv = (f: number, s: number, d = 18) => interpolate(f, [s, s + d], [0, 1], { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  if (t.length >= 50) t = t.replace(/\s+\S*$/, '');
  return t.split(/\s[–-]\s/)[0];
};

/* arch geometry (doorway) */
const AW = 520;           // inner width
const AH = 720;           // inner height
const FR = 46;            // frame thickness
const CX = 540;
const CY = 900;           // centre of the doorway

/* ── confetti (deterministic) ── */
const COLORS = ['#E52851', '#FFFFFF', '#F5C451', '#8C0E2A', '#FF8FA8'];
const rand = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const PIECES = Array.from({ length: 110 }, (_, i) => ({
  side: i % 2 ? 1 : -1,
  a: (-52 - rand(i) * 36) * (Math.PI / 180),        // launch angle: up and towards the centre
  v: 40 + rand(i + 9) * 34,
  rot: rand(i + 3) * 720 - 360,
  w: 12 + rand(i + 5) * 14, h: 6 + rand(i + 7) * 10,
  c: COLORS[i % COLORS.length],
  round: rand(i + 11) > 0.7,
}));
const Confetti: React.FC<{ f: number; start: number }> = ({ f, start }) => {
  const t = (f - start) / 30;
  if (t <= 0) return null;
  return (
    <>
      {PIECES.map((p, i) => {
        const x0 = p.side < 0 ? 250 : 830, y0 = 1250;
        const vx = Math.cos(p.a) * p.v * -p.side * 26, vy = Math.sin(p.a) * p.v * 26;
        const drag = 1 - Math.exp(-t * 1.6);
        const x = x0 + (vx / 1.6) * drag + Math.sin(t * 3 + i) * 30 * t;
        const y = y0 + (vy / 1.6) * drag + 260 * t * t;
        if (y > 2000) return null;
        return (
          <div key={i} style={{
            position: 'absolute', left: x, top: y, width: p.w, height: p.round ? p.w : p.h, borderRadius: p.round ? 99 : 2,
            background: p.c, transform: `rotate(${p.rot * t}deg) rotateX(${t * 400 + i * 20}deg)`, opacity: Math.min(1, 3 - t * 0.5),
            boxShadow: p.c === '#FFFFFF' ? '0 0 0 1px rgba(14,14,16,0.06)' : undefined,
          }} />
        );
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
  const name = niceName(u.name || u.title);
  const place = [u.district, u.city].filter(Boolean).join(', ');

  /* timeline */
  const archIn = spring({ frame: f - 2, fps, config: { damping: 11, stiffness: 120, mass: 0.9 } });
  const doors = interpolate(f, [26, 52], [0, 1], { easing: io, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glow = interpolate(f, [30, 50, 70], [0, 1, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const popL = spring({ frame: f - 38, fps, config: { damping: 9, stiffness: 180 } });
  const popR = spring({ frame: f - 40, fps, config: { damping: 9, stiffness: 180 } });
  const push = interpolate(f, [60, 92], [0, 1], { easing: io, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const pushScale = 1 + push * 3.4;                           // arch grows past the screen
  const full = interpolate(f, [84, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const kb = 1.12 - 0.1 * interpolate(f, [90, durationInFrames], [0, 1], { extrapolateLeft: 'clamp' });
  const pill = spring({ frame: f - 94, fps, config: { damping: 12, stiffness: 160 } });
  const title = rv(f, 100, 22);
  const loc = rv(f, 112, 16);
  const chips = (k: number) => spring({ frame: f - 124 - k * 4, fps, config: { damping: 13, stiffness: 170 } });
  const price = spring({ frame: f - 166, fps, config: { damping: 12, stiffness: 150 } });
  const site = rv(f, 178, 16);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  const doorStyle = (side: 'l' | 'r'): React.CSSProperties => ({
    position: 'absolute', top: 0, bottom: 0, width: AW / 2, [side === 'l' ? 'left' : 'right']: 0,
    transformOrigin: side === 'l' ? 'left center' : 'right center',
    transform: `rotateY(${(side === 'l' ? -1 : 1) * doors * 108}deg)`,
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F1EC 100%)',
    boxShadow: `inset ${side === 'l' ? -6 : 6}px 0 12px rgba(14,14,16,0.08)`,
    backfaceVisibility: 'hidden',
  });

  const specs = [
    s.guests ? { I: Users, v: `${s.guests} guests` } : null,
    s.bedrooms ? { I: BedDouble, v: `${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}` } : null,
    s.baths ? { I: Bath, v: `${s.baths} bath${Number(s.baths) > 1 ? 's' : ''}` } : null,
  ].filter(Boolean) as { I: React.FC<any>; v: string }[];

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, opacity: out, background: '#FAFAF7', overflow: 'hidden' }}>
      <Audio src={asset('sfx/s1-just-joined.wav')} volume={0.9} />

      {/* soft stage */}
      <AbsoluteFill style={{ background: 'radial-gradient(70% 45% at 50% 46%, #FFFFFF 0%, #F6F1EA 60%, #EDE6DC 100%)' }} />

      {/* full-bleed photo after the push-through */}
      <AbsoluteFill style={{ opacity: full }}>
        {photo ? <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /> : null}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25) 62%, rgba(0,0,0,0.78) 100%)' }} />
      </AbsoluteFill>

      {/* the doorway */}
      {full < 1 && (
        <div style={{
          position: 'absolute', left: CX - AW / 2 - FR, top: CY - AH / 2 - FR, width: AW + FR * 2, height: AH + FR,
          transform: `translateY(${(1 - archIn) * 500}px) scale(${(0.6 + 0.4 * archIn) * pushScale})`, transformOrigin: `50% ${(AH / 2 + FR) / (AH + FR) * 100}%`,
        }}>
          {/* ground shadow */}
          <div style={{ position: 'absolute', left: -40, right: -40, bottom: -34, height: 60, borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(14,14,16,0.28), rgba(14,14,16,0))', opacity: 1 - push }} />
          {/* 3D red frame (clay) */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: `${AW / 2 + FR}px ${AW / 2 + FR}px 18px 18px`,
            background: `linear-gradient(135deg, #FF6B88 0%, ${t.primary} 32%, #C21C43 70%, #8C0E2A 100%)`,
            boxShadow: '0 40px 80px rgba(140,14,42,0.35), inset 0 6px 10px rgba(255,255,255,0.45), inset 0 -10px 18px rgba(80,0,20,0.35)',
          }} />
          {/* inner reveal (photo + light) */}
          <div style={{
            position: 'absolute', left: FR, top: FR, width: AW, height: AH, borderRadius: `${AW / 2}px ${AW / 2}px 0 0`, overflow: 'hidden',
            background: '#FFF6E8', boxShadow: 'inset 0 10px 24px rgba(80,0,20,0.45)', perspective: 1400,
          }}>
            {photo ? <Img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.25 - 0.1 * doors})` }} /> : null}
            <AbsoluteFill style={{ background: `radial-gradient(60% 50% at 50% 55%, rgba(255,240,200,${0.75 * glow}), rgba(255,240,200,0) 70%)` }} />
            {/* doors */}
            <div style={doorStyle('l')}>
              <div style={{ position: 'absolute', inset: '70px 34px 60px 40px', borderRadius: '120px 30px 10px 10px', border: '3px solid rgba(14,14,16,0.06)' }} />
              <div style={{ position: 'absolute', right: 26, top: '55%', width: 14, height: 54, borderRadius: 8, background: 'linear-gradient(180deg,#F5D27A,#C9963A)' }} />
            </div>
            <div style={doorStyle('r')}>
              <div style={{ position: 'absolute', inset: '70px 40px 60px 34px', borderRadius: '30px 120px 10px 10px', border: '3px solid rgba(14,14,16,0.06)' }} />
              <div style={{ position: 'absolute', left: 26, top: '55%', width: 14, height: 54, borderRadius: 8, background: 'linear-gradient(180deg,#F5D27A,#C9963A)' }} />
            </div>
          </div>
          {/* gloss on the frame */}
          <div style={{ position: 'absolute', left: 14, top: 14, width: AW / 2, height: AH / 2, borderRadius: `${AW / 2}px 0 0 0`, borderTop: '6px solid rgba(255,255,255,0.55)', borderLeft: '6px solid rgba(255,255,255,0.35)', filter: 'blur(1px)' }} />
        </div>
      )}

      {/* logo above the doorway (intro) */}
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: rv(f, 4, 14) * (1 - push) }}>
        <HorizontalLogo b={p.brand} height={46} logoReady={p.logoReady} />
      </div>

      {/* party poppers */}
      {[{ x: -10, s: popL, flip: false }, { x: 650, s: popR, flip: true }].map((q, i) => (
        <div key={i} style={{
          position: 'absolute', left: q.x, top: 1180, width: 440, opacity: Math.min(1, q.s * 2) * (1 - push),
          transform: `${q.flip ? 'scaleX(-1)' : ''} translateY(${(1 - q.s) * 240}px) rotate(${-8 + (1 - q.s) * -30}deg)`,
          filter: 'drop-shadow(0 20px 22px rgba(14,14,16,0.22))',
        }}>
          <Img src={asset('brand/3d/party-popper.png')} style={{ width: '100%' }} />
        </div>
      ))}
      <Confetti f={f} start={44} />

      {/* ── final card text ── */}
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: full }}>
        <HorizontalLogo b={p.brand} height={44} logoReady={p.logoReady} light redArch />
      </div>
      <div style={{ position: 'absolute', top: 1050, left: 70, right: 70, color: '#fff', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 60, padding: '0 26px', borderRadius: 999, background: t.primary, fontSize: 25, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', transform: `scale(${0.6 + 0.4 * pill})`, opacity: Math.min(1, pill * 1.5), boxShadow: '0 12px 30px rgba(229,40,81,0.45)' }}>
          🎉 New on Homesta
        </div>
        <div style={{ overflow: 'hidden', marginTop: 18, paddingBottom: 8 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: name.length > 18 ? 92 : 112, lineHeight: 1.05, letterSpacing: -1.5, transform: `translateY(${(1 - title) * 140}px)`, textShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
            {name}
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 34, fontWeight: 500, opacity: loc, transform: `translateY(${(1 - loc) * 14}px)` }}>{place}</div>
        <div style={{ marginTop: 30, display: 'flex', justifyContent: 'center', gap: 14 }}>
          {specs.map((x, k) => {
            const c = chips(k);
            return (
              <div key={k} style={{ height: 64, padding: '0 22px', borderRadius: 999, background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 600, transform: `translateY(${(1 - c) * 30}px) scale(${0.8 + 0.2 * c})`, opacity: Math.min(1, c * 1.5) }}>
                <x.I size={26} color="#fff" />{x.v}
              </div>
            );
          })}
        </div>
      </div>
      {u.price_from_usd ? (
        <div style={{ position: 'absolute', top: 1420, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ height: 96, padding: '0 14px 0 40px', borderRadius: 999, background: '#fff', color: t.ink, display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${0.7 + 0.3 * price})`, opacity: Math.min(1, price * 1.4), boxShadow: '0 18px 40px rgba(0,0,0,0.3)' }}>
            <span style={{ fontSize: 24, color: t.mute }}>From</span>
            <span style={{ fontSize: 46, fontWeight: 700 }}>${Math.round(u.price_from_usd)}</span>
            <span style={{ fontSize: 24, color: t.mute, marginRight: 8 }}>/ night</span>
            <div style={{ height: 70, padding: '0 30px', borderRadius: 999, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600 }}>Book now</div>
          </div>
        </div>
      ) : null}
      <div style={{ position: 'absolute', top: 1548, left: 0, right: 0, textAlign: 'center', fontSize: 38, color: '#fff', opacity: site, textShadow: '0 2px 14px rgba(0,0,0,0.35)' }}>
        <span style={{ fontWeight: 700 }}>{t.site.replace(/\.com$/, '')}</span><span style={{ fontWeight: 300 }}>.com</span>
      </div>
    </AbsoluteFill>
  );
};
