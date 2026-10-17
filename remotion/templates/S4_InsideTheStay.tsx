/**
 * S4 · Inside the Stay  (story, 9:16 video, 10s @ 30fps)
 * Target: unit. NEW LOOK — dark & cinematic:
 *  full-bleed photos with whip cuts (motion-blur slide), slow push-in, a frame counter,
 *  one big fact per shot (or the staff's own caption: params.captions[i]),
 *  end card on black: the Homesta arch draws itself, name, price, "Explore it now" + sticker slot.
 * Playfair italic only for the place name.
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Pointer } from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const S4_FRAMES = 300;
const INTRO = 10;          // frames before the first cut
const SHOT = 34;           // frames per photo
const WHIP = 8;            // transition frames
const END = 96;            // end card length
const MONO = '"JetBrains Mono", "SFMono-Regular", Menlo, monospace';
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const rv = (f: number, s: number, d = 14) => interpolate(f, [s, s + d], [0, 1], { easing: ease, ...cl });

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  t = t.split(/\s[–-]\s/)[0];
  t = t.replace(/\s+with\s+.*$/i, '');
  if (t.length <= 28) return t;
  const w = t.split(/\s+/); let r = '';
  for (const x of w) { if ((r + ' ' + x).trim().length > 28) break; r = (r + ' ' + x).trim(); }
  return r.replace(/\s+(in|with|and|of|the|a|for)$/i, '');
};

/** one fact per shot, from real data */
const factsFor = (u: UnitProps): { k: string; v: string }[] => {
  const s = u.specs ?? {};
  const out: { k: string; v: string }[] = [];
  if (s.guests) out.push({ k: 'Sleeps', v: `${s.guests} guests` });
  if (s.bedrooms) out.push({ k: 'Bedrooms', v: `${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}` });
  if (u.amenities?.includes('pool')) out.push({ k: 'Outside', v: 'Private pool' });
  if (s.size_sqm && Number(s.size_sqm) < 900) out.push({ k: 'Space', v: `${s.size_sqm} m²` });
  if (u.amenities?.includes('kitchen')) out.push({ k: 'Included', v: 'Full kitchen' });
  if (u.amenities?.includes('self_check_in')) out.push({ k: 'Arrival', v: 'Self check-in' });
  if (u.amenities?.includes('wifi')) out.push({ k: 'Included', v: 'Fast Wi-Fi' });
  if (u.amenities?.includes('air_conditioning')) out.push({ k: 'Included', v: 'Air conditioning' });
  if (u.pay_at_arrival) out.push({ k: 'Booking', v: 'Pay on arrival' });
  return out;
};

export const S4_InsideTheStay: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const u = p.unit!;
  const photos = u.photos.map((x) => x.url).slice(0, 6);
  const n = Math.max(1, photos.length);
  const captions = (p.params?.captions as string[] | undefined) ?? [];
  const facts = factsFor(u);
  const endStart = durationInFrames - END;
  const shotLen = (endStart - INTRO) / n;            // stretch shots to fill the time
  const idx = Math.min(n - 1, Math.max(0, Math.floor((f - INTRO) / shotLen)));
  const local = f - INTRO - idx * shotLen;           // frames into current shot
  const place = [u.district, u.city].filter(Boolean)[0] ?? '';

  const showEnd = interpolate(f, [endStart - 4, endStart + 10], [0, 1], cl);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  /* one photo layer (current + previous during the whip) */
  const layer = (i: number, x: number, blur: number) => {
    const lf = f - INTRO - i * shotLen;
    const zoom = 1.06 + 0.1 * Math.min(1, Math.max(0, lf / (shotLen + WHIP)));
    return (
      <AbsoluteFill key={i} style={{ transform: `translateX(${x}px)`, filter: blur ? `blur(${blur}px)` : undefined }}>
        <Img src={photos[i]} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
      </AbsoluteFill>
    );
  };
  const w = interpolate(local, [0, WHIP], [1, 0], { easing: Easing.bezier(0.5, 0, 0.2, 1), ...cl });  // 1 → 0 at cut
  const whipping = idx > 0 && local < WHIP;
  const cap = captions[idx] || facts[idx % Math.max(1, facts.length)]?.v || '';
  const capK = captions[idx] ? 'Inside' : facts[idx % Math.max(1, facts.length)]?.k || '';
  const capIn = rv(local, 4, 14);

  /* end card */
  const e = f - endStart;
  const draw = interpolate(e, [2, 24], [0, 1], { easing: Easing.bezier(0.65, 0, 0.35, 1), ...cl });
  const nameIn = rv(e, 14, 16);
  const priceIn = spring({ frame: e - 26, fps, config: { damping: 13, stiffness: 150 } });
  const cta = rv(e, 36, 14);
  const tap = ((e - 36) % 30) / 30;
  const press = e > 36 ? Math.sin(Math.min(1, tap * 2) * Math.PI) : 0;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: '#fff', background: '#0B0B0D', opacity: out }}>
      <Audio src={asset('sfx/s4-inside.wav')} volume={0.85} />

      {/* ── shots ── */}
      {f < endStart + 12 && photos.length > 0 && (
        <AbsoluteFill style={{ opacity: f < INTRO ? rv(f, 0, INTRO) : 1 }}>
          {whipping && layer(idx - 1, -1080 * (1 - w), 26 * (1 - w))}
          {layer(idx, whipping ? 1080 * w : 0, whipping ? 26 * w : 0)}
          {/* cinematic grade */}
          <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.78) 100%)' }} />
          <AbsoluteFill style={{ boxShadow: 'inset 0 0 220px rgba(0,0,0,0.55)' }} />

          {/* masthead */}
          <div style={{ position: 'absolute', top: 170, left: 64, right: 64, display: 'flex', alignItems: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: 'uppercase' }}>Inside the stay</div>
            <div style={{ flex: 1 }} />
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3 }}>
              <span style={{ fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
              <span style={{ opacity: 0.6 }}> / {String(n).padStart(2, '0')}</span>
            </div>
          </div>
          {/* progress */}
          <div style={{ position: 'absolute', top: 222, left: 64, right: 64, display: 'flex', gap: 8 }}>
            {photos.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.28)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#fff', width: `${(i < idx ? 1 : i === idx ? Math.min(1, local / shotLen) : 0) * 100}%` }} />
              </div>
            ))}
          </div>

          {/* fact of this shot */}
          <div style={{ position: 'absolute', left: 64, right: 64, top: 1150 }}>
            <div style={{ display: 'inline-block', marginBottom: 10, padding: '8px 14px 7px', background: t.primary, fontFamily: MONO, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#fff', opacity: capIn, transform: `translateX(${(1 - capIn) * -30}px)` }}>{capK}</div>
            <div style={{ overflow: 'hidden', height: 112 }}>
              <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -3, lineHeight: '112px', transform: `translateY(${(1 - capIn) * 112}px)` }}>{cap}</div>
            </div>
          </div>
          {/* stay line */}
          <div style={{ position: 'absolute', left: 64, right: 64, top: 1352, display: 'flex', alignItems: 'baseline', gap: 14, opacity: rv(f, INTRO, 16) }}>
            <span style={{ fontSize: 32, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 640 }}>{niceName(u.name || u.title)}</span>
            {place ? <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 38, color: '#fff', opacity: 0.9 }}>{place}</span> : null}
          </div>
        </AbsoluteFill>
      )}

      {/* ── end card ── */}
      <AbsoluteFill style={{ opacity: showEnd, background: '#0B0B0D' }}>
        <AbsoluteFill style={{ opacity: 0.35 }}>
          {photos[0] ? <Img src={photos[0]} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px)', transform: 'scale(1.2)' }} /> : null}
        </AbsoluteFill>
        <AbsoluteFill style={{ background: 'rgba(11,11,13,0.55)' }} />
        <div style={{ position: 'absolute', top: 360, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <svg width={210} height={224} viewBox="307 292 466 496">
            <path d="M341.5 752 V525 A198 198 0 0 1 737.5 525 V752" fill="none" stroke={t.primary} strokeWidth={69.5} strokeLinecap="round" strokeDasharray={1100} strokeDashoffset={1100 * (1 - draw)} />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 650, left: 70, right: 70, textAlign: 'center', opacity: nameIn, transform: `translateY(${(1 - nameIn) * 24}px)` }}>
          <div style={{ fontSize: 70, fontWeight: 800, letterSpacing: -2.4, lineHeight: 1.05 }}>{niceName(u.name || u.title)}</div>
          {place ? <div style={{ marginTop: 14, fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 56 }}>{place}</div> : null}
        </div>
        {u.price_from_usd ? (
          <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, transform: `scale(${0.7 + 0.3 * priceIn})`, opacity: Math.min(1, priceIn * 1.4) }}>
              <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.7 }}>From</span>
              <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: -2 }}>${Math.round(u.price_from_usd)}</span>
              <span style={{ fontSize: 28, opacity: 0.7 }}>/ night</span>
            </div>
          </div>
        ) : null}
        <div style={{ position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, opacity: cta }}>
          {facts.slice(0, 3).map((x) => (
            <div key={x.k} style={{ height: 58, padding: '0 22px', borderRadius: 999, border: '2px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', fontSize: 26, fontWeight: 500 }}>{x.v}</div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 1372, left: 0, right: 0, textAlign: 'center', fontSize: 40, fontWeight: 700, opacity: cta }}>Explore it now</div>
        <div style={{ position: 'absolute', top: 1440, left: 290, width: 500, height: 104, borderRadius: 999, border: '3px dashed rgba(255,255,255,0.55)', opacity: cta }} />
        <div style={{ position: 'absolute', left: 700, top: 1490, opacity: cta }}>
          <div style={{ position: 'absolute', left: -6, top: -6, width: 64 + tap * 70, height: 64 + tap * 70, marginLeft: -tap * 35, marginTop: -tap * 35, borderRadius: 999, border: '4px solid rgba(255,255,255,0.9)', opacity: e > 36 ? 1 - tap : 0 }} />
          <div style={{ transform: `translate(${10 - press * 8}px, ${14 - press * 10}px) rotate(-12deg) scale(${1 - press * 0.08})`, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))' }}>
            <Pointer size={84} color="#14141A" fill="#FFFFFF" strokeWidth={1.6} />
          </div>
        </div>
        <div style={{ position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: cta }}>
          <HorizontalLogo b={p.brand} height={36} logoReady={p.logoReady} light redArch />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
