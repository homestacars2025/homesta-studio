/**
 * S6 · This or That  (story, 9:16 video, 8s @ 30fps)
 * Target: district. Two contrasting stays (auto: premium vs budget; staff can swap).
 * Editorial layout: typographic headline, two large photo panels, hairline rules, mono labels,
 * an "or" seal at the seam. A clean slot at the bottom is kept for the Instagram POLL sticker.
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const S6_FRAMES = 240;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const rv = (f: number, s: number, d = 18) => interpolate(f, [s, s + d], [0, 1], { easing: ease, ...cl });
const MONO = '"JetBrains Mono", "SFMono-Regular", Menlo, monospace';

const M = 56;
const PW = 1080 - M * 2;
const PH = 472;
const A_TOP = 452;
const GAP = 24;
const B_TOP = A_TOP + PH + GAP;

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  if (t.length >= 50) t = t.replace(/\s+\S*$/, '');
  t = t.split(/\s[–-]\s/)[0];
  if (t.length <= 30) return t;
  const w = t.split(/\s+/); let r = '';
  for (const x of w) { if ((r + ' ' + x).trim().length > 30) break; r = (r + ' ' + x).trim(); }
  return r.replace(/\s+(in|with|and|of|the|a|for)$/i, '');
};
/** one distinguishing line for each stay */
const hook = (u: UnitProps) => {
  const s = u.specs ?? {};
  const bits: string[] = [];
  if (u.amenities?.includes('pool')) bits.push('Private pool');
  if (s.bedrooms) bits.push(`${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}`);
  if (s.guests) bits.push(`${s.guests} guests`);
  if (bits.length < 3 && u.pay_at_arrival) bits.push('Pay on arrival');
  return bits.slice(0, 3).join('  ·  ');
};

const Panel: React.FC<{
  u: UnitProps; letter: 'A' | 'B'; top: number; enter: number; from: number; focus: number; f: number; t: ReturnType<typeof theme>;
}> = ({ u, letter, top, enter, from, focus, f, t }) => {
  const kb = 1.08 + 0.06 * Math.sin(f / 90 + (letter === 'A' ? 0 : 2));
  const dim = 0.32 * (1 - focus);
  return (
    <div style={{
      position: 'absolute', left: M, top, width: PW, height: PH, borderRadius: 26, overflow: 'hidden', background: '#ddd',
      transform: `translateX(${(1 - enter) * from}px) scale(${0.985 + 0.015 * focus})`, opacity: enter,
      boxShadow: `0 ${18 + focus * 14}px ${44 + focus * 26}px rgba(14,14,16,${0.12 + focus * 0.1})`,
    }}>
      {u.photos[0]?.url ? <Img src={u.photos[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} /> : null}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 48%, rgba(0,0,0,0.72) 100%)' }} />
      <AbsoluteFill style={{ background: `rgba(250,250,247,${dim})` }} />
      {/* top-left label */}
      <div style={{ position: 'absolute', top: 26, left: 28, display: 'flex', alignItems: 'center', gap: 14, color: '#fff' }}>
        <div style={{ width: 52, height: 52, borderRadius: 99, border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 30 }}>{letter}</div>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase' }}>Option {letter}</div>
      </div>
      {/* price tag top-right */}
      {u.price_from_usd ? (
        <div style={{ position: 'absolute', top: 26, right: 26, height: 52, padding: '0 20px', borderRadius: 999, background: '#fff', color: t.ink, display: 'flex', alignItems: 'baseline', gap: 6, paddingTop: 10, boxSizing: 'border-box' }}>
          <span style={{ fontSize: 26, fontWeight: 700 }}>${Math.round(u.price_from_usd)}</span>
          <span style={{ fontSize: 18, color: t.mute }}>/ night</span>
        </div>
      ) : null}
      {/* bottom caption */}
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 26, color: '#fff' }}>
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -0.6, lineHeight: 1.12 }}>{niceName(u.name || u.title)}</div>
        <div style={{ marginTop: 10, fontSize: 22, fontWeight: 400, opacity: 0.9 }}>{hook(u)}</div>
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
  const h1 = rv(f, 4, 20);
  const h2 = rv(f, 10, 20);
  const meta = rv(f, 18, 16);
  const inA = interpolate(f, [16, 40], [0, 1], { easing: ease, ...cl });
  const inB = interpolate(f, [24, 48], [0, 1], { easing: ease, ...cl });
  const seal = spring({ frame: f - 46, fps, config: { damping: 12, stiffness: 160 } });
  // spotlight: A → B → both
  const focusA = interpolate(f, [70, 84, 108, 122, 150, 162], [1, 1, 1, 0, 0, 1], { easing: io, ...cl });
  const focusB = interpolate(f, [70, 84, 108, 122, 150, 162], [1, 0, 0, 1, 1, 1], { easing: io, ...cl });
  const vote = rv(f, 160, 18);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const rule = interpolate(f, [8, 36], [0, 1], { easing: io, ...cl });

  if (!a || !b) return <AbsoluteFill style={{ background: '#FAFAF7' }} />;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink, background: '#FAFAF7', opacity: out }}>
      <Audio src={asset('sfx/s6-this-or-that.wav')} volume={0.8} />

      {/* masthead */}
      <div style={{ position: 'absolute', top: 150, left: M, right: M, display: 'flex', alignItems: 'center', opacity: logo }}>
        <HorizontalLogo b={p.brand} height={34} logoReady={p.logoReady} />
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: t.mute }}>{place}</div>
      </div>
      <div style={{ position: 'absolute', top: 214, left: M, height: 2, width: PW * rule, background: t.ink }} />

      {/* headline */}
      <div style={{ position: 'absolute', top: 240, left: M, right: M, display: 'flex', alignItems: 'baseline', gap: 22, overflow: 'hidden', height: 150 }}>
        <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 128, lineHeight: '150px', letterSpacing: -3, transform: `translateY(${(1 - h1) * 150}px)`, display: 'inline-block' }}>This</span>
        <span style={{ fontSize: 44, fontWeight: 400, color: t.mute, transform: `translateY(${(1 - h2) * 150}px)`, display: 'inline-block' }}>or</span>
        <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 128, lineHeight: '150px', letterSpacing: -3, color: t.primary, transform: `translateY(${(1 - h2) * 150}px)`, display: 'inline-block' }}>that?</span>
      </div>
      <div style={{ position: 'absolute', top: 394, left: M, right: M, display: 'flex', justifyContent: 'space-between', fontSize: 24, color: t.mute, opacity: meta }}>
        <span>Two stays in {place}. One weekend.</span>
      </div>

      <Panel u={a} letter="A" top={A_TOP} enter={inA} from={-1100} focus={focusA} f={f} t={t} />
      <Panel u={b} letter="B" top={B_TOP} enter={inB} from={1100} focus={focusB} f={f} t={t} />

      {/* "or" seal at the seam */}
      <div style={{
        position: 'absolute', left: 540 - 58, top: A_TOP + PH + GAP / 2 - 58, width: 116, height: 116, borderRadius: 99, background: '#FAFAF7',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${seal}) rotate(${(1 - seal) * -40}deg)`,
        boxShadow: '0 10px 30px rgba(14,14,16,0.18)',
      }}>
        <div style={{ width: 92, height: 92, borderRadius: 99, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 44, paddingBottom: 6, boxSizing: 'border-box' }}>or</div>
      </div>

      {/* poll prompt — the IG poll sticker goes right below, in the empty band 1430–1560 */}
      <div style={{ position: 'absolute', top: B_TOP + PH + 28, left: M, right: M, display: 'flex', alignItems: 'center', gap: 18, opacity: vote }}>
        <div style={{ flex: 1, height: 2, background: t.rule }} />
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: t.ink }}>Cast your vote</div>
        <div style={{ flex: 1, height: 2, background: t.rule }} />
      </div>
    </AbsoluteFill>
  );
};
