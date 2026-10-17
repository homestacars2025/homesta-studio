/**
 * S6 · This or That  (story, 9:16 video, 8s @ 30fps)
 * Target: district. Two contrasting stays (auto: premium vs budget; staff can swap).
 * Brand-red stage, two arch windows (the Homesta mark) side by side, "Which one would you book in <District>?",
 * alternating spotlight + a finger tapping left/right over the clean POLL-sticker slot.
 * Typography rule: Playfair italic ONLY for place names (city / district / country).
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pointer } from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const S6_FRAMES = 240;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const rv = (f: number, s: number, d = 18) => interpolate(f, [s, s + d], [0, 1], { easing: ease, ...cl });

const AW = 452;
const AH = 600;
const GAPX = 40;
const AX = [(1080 - AW * 2 - GAPX) / 2, (1080 - AW * 2 - GAPX) / 2 + AW + GAPX];
const AY = 560;
const SLOT_Y = 1400;
const SLOT_H = 136;

const shortName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  t = t.split(/\s[–-]\s/)[0];
  if (t.length <= 24) return t;
  const w = t.split(/\s+/); let r = '';
  for (const x of w) { if ((r + ' ' + x).trim().length > 24) break; r = (r + ' ' + x).trim(); }
  return r.replace(/\s+(in|with|and|of|the|a|for)$/i, '');
};
const facts = (u: UnitProps) => {
  const s = u.specs ?? {};
  return [s.bedrooms ? `${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}` : null, s.guests ? `${s.guests} guests` : null, u.amenities?.includes('pool') ? 'Pool' : null]
    .filter(Boolean).join(' · ');
};

const Arch: React.FC<{ u: UnitProps; letter: 'A' | 'B'; x: number; enter: number; focus: number; f: number; t: ReturnType<typeof theme> }> = ({ u, letter, x, enter, focus, f, t }) => {
  const kb = 1.1 + 0.05 * Math.sin(f / 80 + (letter === 'A' ? 0 : 1.7));
  return (
    <div style={{ position: 'absolute', left: x, top: AY, width: AW, transform: `translateY(${(1 - enter) * 700}px) scale(${0.96 + 0.05 * focus})`, transformOrigin: '50% 60%', opacity: Math.min(1, enter * 1.4) }}>
      <div style={{
        position: 'relative', width: AW, height: AH, borderRadius: `${AW / 2}px ${AW / 2}px 30px 30px`, overflow: 'hidden', background: '#5a0b20',
        border: '8px solid #FFFFFF', boxSizing: 'border-box', boxShadow: `0 ${26 + 16 * focus}px ${50 + 20 * focus}px rgba(60,0,15,${0.3 + 0.15 * focus})`,
      }}>
        {u.photos[0]?.url ? <Img src={u.photos[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /> : null}
        <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(0,0,0,0.5) 100%)' }} />
        <AbsoluteFill style={{ background: `rgba(140,14,42,${0.5 * (1 - focus)})` }} />
        {u.price_from_usd ? (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22, display: 'flex', justifyContent: 'center' }}>
            <div style={{ height: 56, padding: '0 22px', borderRadius: 999, background: '#fff', color: t.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 30, fontWeight: 700 }}>${Math.round(u.price_from_usd)}</span>
              <span style={{ fontSize: 20, color: t.mute }}>/ night</span>
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ position: 'absolute', left: AW / 2 - 40, top: -40, width: 80, height: 80, borderRadius: 99, background: '#fff', color: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, boxShadow: '0 8px 20px rgba(60,0,15,0.3)' }}>{letter}</div>
      <div style={{ marginTop: 22, textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.1 }}>{shortName(u.name || u.title)}</div>
        <div style={{ marginTop: 8, fontSize: 24, fontWeight: 400, opacity: 0.85 }}>{facts(u)}</div>
      </div>
    </div>
  );
};

export const S6_ThisOrThat: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const [a, b] = (p.units ?? []).slice(0, 2);
  const place = p.district?.name ?? a?.district ?? '';

  const logo = rv(f, 0, 14);
  const q1 = rv(f, 4, 18);
  const q2 = rv(f, 10, 18);
  const q3 = rv(f, 16, 20);
  const inA = spring({ frame: f - 22, fps, config: { damping: 15, stiffness: 110 } });
  const inB = spring({ frame: f - 30, fps, config: { damping: 15, stiffness: 110 } });
  const seal = spring({ frame: f - 46, fps, config: { damping: 11, stiffness: 170 } });
  const focusA = interpolate(f, [72, 84, 110, 122, 150, 162], [1, 1, 1, 0, 0, 1], { easing: io, ...cl });
  const focusB = interpolate(f, [72, 84, 110, 122, 150, 162], [1, 0, 0, 1, 1, 1], { easing: io, ...cl });
  const prompt = rv(f, 60, 16);
  const handX = interpolate(f, [72, 86, 112, 126, 154, 168], [700, 330, 330, 720, 720, 520], { easing: io, ...cl });
  const tapPhase = ((f - 72) % 26) / 26;
  const press = f > 72 ? Math.sin(Math.min(1, tapPhase * 2) * Math.PI) : 0;
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  if (!a || !b) return <AbsoluteFill style={{ background: t.primary }} />;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: '#fff', opacity: out, background: t.primary }}>
      <Audio src={asset('sfx/s6-this-or-that.wav')} volume={0.8} />
      <AbsoluteFill style={{ background: 'radial-gradient(90% 55% at 50% 48%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 45%, rgba(0,0,0,0) 70%), radial-gradient(120% 70% at 50% 100%, rgba(80,0,20,0.35) 0%, rgba(80,0,20,0) 60%)' }} />

      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logo }}>
        <HorizontalLogo b={p.brand} height={38} logoReady={p.logoReady} light />
      </div>

      <div style={{ position: 'absolute', top: 236, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ overflow: 'hidden', height: 84 }}>
          <div style={{ fontSize: 70, fontWeight: 700, letterSpacing: -1.8, lineHeight: '84px', transform: `translateY(${(1 - q1) * 84}px)` }}>Which one would</div>
        </div>
        <div style={{ overflow: 'hidden', height: 84 }}>
          <div style={{ fontSize: 70, fontWeight: 700, letterSpacing: -1.8, lineHeight: '84px', transform: `translateY(${(1 - q2) * 84}px)` }}>you book in</div>
        </div>
        <div style={{ overflow: 'hidden', height: 112 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 92, lineHeight: '112px', letterSpacing: -1.5, transform: `translateY(${(1 - q3) * 112}px)` }}>{place}?</div>
        </div>
      </div>

      <Arch u={a} letter="A" x={AX[0]} enter={inA} focus={focusA} f={f} t={t} />
      <Arch u={b} letter="B" x={AX[1]} enter={inB} focus={focusB} f={f} t={t} />

      <div style={{ position: 'absolute', left: 540 - 52, top: AY + AH * 0.42, width: 104, height: 104, borderRadius: 99, background: t.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, transform: `scale(${seal})`, boxShadow: '0 10px 26px rgba(0,0,0,0.35)', border: '5px solid #fff', boxSizing: 'border-box' }}>
        OR
      </div>

      <div style={{ position: 'absolute', top: SLOT_Y - 52, left: 0, right: 0, textAlign: 'center', fontSize: 28, fontWeight: 700, letterSpacing: 5, textTransform: 'uppercase', opacity: prompt }}>
        Tap to vote
      </div>
      <div style={{ position: 'absolute', top: SLOT_Y, left: 150, width: 780, height: SLOT_H, borderRadius: 32, border: '3px dashed rgba(255,255,255,0.6)', opacity: prompt * 0.9 }} />
      <div style={{ position: 'absolute', left: handX, top: SLOT_Y + 48, opacity: prompt }}>
        <div style={{ position: 'absolute', left: -8, top: -8, width: 60 + tapPhase * 70, height: 60 + tapPhase * 70, marginLeft: -tapPhase * 35, marginTop: -tapPhase * 35, borderRadius: 99, border: '4px solid rgba(255,255,255,0.9)', opacity: f > 72 ? 1 - tapPhase : 0 }} />
        <div style={{ transform: `translate(${10 - press * 8}px, ${14 - press * 10}px) rotate(-12deg) scale(${1 - press * 0.08})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))' }}>
          <Pointer size={84} color="#14141A" fill="#FFFFFF" strokeWidth={1.6} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
