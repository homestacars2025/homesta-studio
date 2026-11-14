/**
 * P2 · Photo Tour  (Instagram carousel, 4:5, up to 8 slides)
 * Target: unit. NEW LOOK — editorial / gallery on linen paper:
 *  1  cover   — tall framed photo, overlapping title card, price, "Swipe for the tour"
 *  2…n tour   — one photo per slide, big index numeral, alternating layout, film-strip progress
 *  last end   — "Like what you see?", specs with the official icons, price, booking line, site
 * Slides = photos + 1 (cover uses photo 1). Playfair italic only for the place name.
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { ArrowRight } from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { BrandIcon } from '../shared/icons';

export const P2_MAX_SLIDES = 8;
const MONO = '"JetBrains Mono", "SFMono-Regular", Menlo, monospace';
const LINEN = '#F2EEE6';
const M = 64; // page margin

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  t = t.split(/\s[–|-]\s|\s\|\s/)[0];
  return t.length > 52 ? t.slice(0, 51).replace(/\s+\S*$/, '') : t;
};
const pad2 = (n: number) => String(n).padStart(2, '0');

type T = ReturnType<typeof theme>;

/** stay-level facts for the tour captions (no room claims — photos have no room tags) */
const factsFor = (u: UnitProps): string[] => {
  const s = u.specs ?? {};
  const a = u.amenities ?? [];
  const out: string[] = [];
  if (s.guests) out.push(`Sleeps ${s.guests} guests`);
  if (s.bedrooms) out.push(`${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}${s.baths ? ` · ${s.baths} bath${Number(s.baths) > 1 ? 's' : ''}` : ''}`);
  if (a.includes('pool')) out.push('Private pool');
  if (a.includes('self_check_in')) out.push('Self check-in');
  if (a.includes('wifi')) out.push('Fast Wi-Fi');
  if (a.includes('air_conditioning')) out.push('Air conditioning');
  if (u.pay_at_arrival) out.push('Pay on arrival');
  if (a.includes('parking')) out.push('Free parking');
  if (a.includes('elevator')) out.push('Elevator building');
  return out;
};

const TopBar: React.FC<{ p: StudioProps; label: string; dark?: boolean }> = ({ p, label, dark }) => (
  <div style={{ position: 'absolute', top: 56, left: M, right: M, display: 'flex', alignItems: 'center' }}>
    <HorizontalLogo b={p.brand} height={34} logoReady={p.logoReady} light={dark} redArch />
    <div style={{ flex: 1 }} />
    <div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: 4, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,0.8)' : '#8C8881' }}>{label}</div>
  </div>
);

/** film strip: one tick per slide, the current one long + red */
const Strip: React.FC<{ n: number; i: number; t: T; bottom?: number }> = ({ n, i, t, bottom = 56 }) => (
  <div style={{ position: 'absolute', bottom, left: M, display: 'flex', gap: 8, alignItems: 'center' }}>
    {Array.from({ length: n }, (_, k) => (
      <div key={k} style={{ width: k === i ? 46 : 14, height: 6, borderRadius: 6, background: k === i ? t.primary : 'rgba(14,14,16,0.18)' }} />
    ))}
  </div>
);

const Swipe: React.FC<{ t: T; text?: string }> = ({ t, text = 'Swipe' }) => (
  <div style={{ position: 'absolute', bottom: 44, right: M, display: 'flex', alignItems: 'center', gap: 12, fontFamily: MONO, fontSize: 21, letterSpacing: 4, textTransform: 'uppercase', color: t.ink }}>
    {text}
    <div style={{ width: 52, height: 52, borderRadius: 999, background: t.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ArrowRight size={26} color="#fff" strokeWidth={2.2} />
    </div>
  </div>
);

const Photo: React.FC<{ src?: string; style: React.CSSProperties; radius?: number }> = ({ src, style, radius = 28 }) => (
  <div style={{ position: 'absolute', overflow: 'hidden', borderRadius: radius, background: '#DDD8CE', boxShadow: '0 30px 60px -30px rgba(14,14,16,0.45)', ...style }}>
    {src ? <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
  </div>
);

/* ── 1 · cover ── */
const Cover: React.FC<{ p: StudioProps; u: UnitProps; t: T; n: number }> = ({ p, u, t, n }) => {
  const place = u.district || u.city || '';
  return (
    <AbsoluteFill style={{ background: LINEN }}>
      <TopBar p={p} label={`Photo tour · ${pad2(n - 1)} photos`} />
      <Photo src={u.photos[0]?.url} style={{ left: M, right: M, top: 132, height: 830 }} />
      <div style={{ position: 'absolute', left: M + 36, top: 862, width: 760, background: '#fff', borderRadius: 26, padding: '34px 40px 36px', boxShadow: '0 24px 50px -20px rgba(14,14,16,0.35)' }}>
        <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: t.primary }}>{u.type || 'Stay'}</div>
        <div style={{ marginTop: 10, fontSize: 50, fontWeight: 700, letterSpacing: -1.6, lineHeight: 1.06, color: t.ink, maxHeight: 108, overflow: 'hidden' }}>{niceName(u.name || u.title)}</div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 18 }}>
          {place ? <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 40, color: t.ink }}>{place}</span> : null}
          <div style={{ flex: 1 }} />
          {u.price_from_usd ? (
            <span style={{ fontSize: 24, color: t.mute }}>
              from <b style={{ fontSize: 36, color: t.ink }}>${Math.round(u.price_from_usd)}</b> / night
            </span>
          ) : null}
        </div>
      </div>
      <Strip n={n} i={0} t={t} />
      <Swipe t={t} text="Take the tour" />
    </AbsoluteFill>
  );
};

/* ── 2…n · tour ── */
const Tour: React.FC<{ p: StudioProps; u: UnitProps; t: T; i: number; n: number; caption?: string }> = ({ p, u, t, i, n, caption }) => {
  const src = u.photos[i - 1 + 1]?.url ?? u.photos[0]?.url; // slide i (0-based) shows photo i
  const flip = i % 2 === 0; // alternate: numeral left / right
  const total = n - 2; // tour photos incl. cover photo = n - 1
  return (
    <AbsoluteFill style={{ background: LINEN }}>
      <TopBar p={p} label={`${pad2(i + 1)} / ${pad2(total + 1)}`} />
      <Photo src={src} style={{ left: M, right: M, top: 132, height: 930 }} />
      <div style={{ position: 'absolute', top: 1088, left: M, right: M, display: 'flex', alignItems: 'flex-end', flexDirection: flip ? 'row-reverse' : 'row', gap: 26 }}>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -6, lineHeight: 0.8, color: t.ink }}>{pad2(i + 1)}</div>
        <div style={{ paddingBottom: 6, textAlign: flip ? 'right' : 'left', flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 4, textTransform: 'uppercase', color: t.primary }}>{caption ? 'Inside' : 'Good to know'}</div>
          <div style={{ marginTop: 6, fontSize: 40, fontWeight: 700, letterSpacing: -1, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {caption || factsFor(u)[(i - 1) % Math.max(1, factsFor(u).length)] || niceName(u.name || u.title)}
          </div>
        </div>
      </div>
      <Strip n={n} i={i} t={t} bottom={44} />
      <div style={{ position: 'absolute', bottom: 30, right: M, width: 52, height: 52, borderRadius: 999, background: t.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ArrowRight size={26} color="#fff" strokeWidth={2.2} />
      </div>
    </AbsoluteFill>
  );
};

/* ── last · details ── */
const End: React.FC<{ p: StudioProps; u: UnitProps; t: T; n: number }> = ({ p, u, t, n }) => {
  const s = u.specs ?? {};
  const place = u.district || u.city || '';
  const specs = [
    s.guests ? { k: 'guests', v: `${s.guests}`, l: 'Guests' } : null,
    s.bedrooms ? { k: 'bedrooms', v: `${s.bedrooms}`, l: Number(s.bedrooms) > 1 ? 'Bedrooms' : 'Bedroom' } : null,
    s.beds ? { k: 'beds', v: `${s.beds}`, l: Number(s.beds) > 1 ? 'Beds' : 'Bed' } : null,
    s.baths ? { k: 'bathrooms', v: `${s.baths}`, l: Number(s.baths) > 1 ? 'Baths' : 'Bath' } : null,
  ].filter(Boolean) as { k: string; v: string; l: string }[];
  const thumbs = u.photos.slice(1, 4);
  const site = t.site;
  return (
    <AbsoluteFill style={{ background: t.ink, color: '#fff' }}>
      <TopBar p={p} label="Your stay" dark />
      <div style={{ position: 'absolute', top: 150, left: M, right: M, display: 'flex', gap: 14 }}>
        {thumbs.map((x, k) => (
          <div key={k} style={{ flex: 1, height: 250, borderRadius: 22, overflow: 'hidden', background: '#222' }}>
            <Img src={x.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 452, left: M, right: M }}>
        <div style={{ fontSize: 74, fontWeight: 800, letterSpacing: -2.6, lineHeight: 1 }}>Like what you see?</div>
        <div style={{ marginTop: 22, fontSize: 34, fontWeight: 500, color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {niceName(u.name || u.title)}
          {place ? <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, color: '#fff' }}>{`  ·  ${place}`}</span> : null}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 690, left: M, right: M, display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, specs.length)}, 1fr)`, gap: 14 }}>
        {specs.map((x) => (
          <div key={x.k} style={{ height: 176, borderRadius: 24, background: '#fff', color: t.ink, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <BrandIcon b={p.brand} name={x.k} size={58} color={t.primary} />
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>{x.v}</div>
            <div style={{ fontSize: 20, color: t.mute }}>{x.l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 920, left: M, right: M, height: 150, borderRadius: 28, background: t.primary, display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div>
          <div style={{ fontSize: 22, opacity: 0.85 }}>From</div>
          <div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -1.6, lineHeight: 1 }}>
            ${Math.round(u.price_from_usd ?? 0)}<span style={{ fontSize: 26, fontWeight: 500, opacity: 0.85 }}> / night</span>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ height: 76, padding: '0 34px', borderRadius: 999, background: '#fff', color: t.ink, display: 'flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 700 }}>
          Book now <ArrowRight size={28} color={t.primary} strokeWidth={2.4} />
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1110, left: M, right: M, fontSize: 24, color: 'rgba(255,255,255,0.6)' }}>
        {u.pay_at_arrival ? 'Pay on arrival · ' : ''}Book in seconds on the Homesta app or website
      </div>
      <div style={{ position: 'absolute', bottom: 64, left: 0, right: 0, textAlign: 'center', fontSize: 40, letterSpacing: -0.5 }}>
        <span style={{ fontWeight: 700 }}>{site.replace(/\.com$/, '')}</span>
        <span style={{ fontWeight: 300 }}>.com</span>
      </div>
      <div style={{ position: 'absolute', bottom: 150, left: M, display: 'flex', gap: 8 }}>
        {Array.from({ length: n }, (_, k) => (
          <div key={k} style={{ width: k === n - 1 ? 46 : 14, height: 6, borderRadius: 6, background: k === n - 1 ? t.primary : 'rgba(255,255,255,0.25)' }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** number of slides for this stay (cover + photos 2… + end), capped */
export const p2SlideCount = (u?: UnitProps | null) => Math.max(2, Math.min(P2_MAX_SLIDES, (u?.photos?.length ?? 1) + 1));

export const P2_PhotoTour: React.FC<StudioProps & { slide?: number }> = ({ slide = 1, ...p }) => {
  const t = theme(p.brand);
  const u = p.unit;
  if (!u) return <AbsoluteFill style={{ background: LINEN }} />;
  const n = p2SlideCount(u);
  const captions = (p.params?.captions as string[] | undefined) ?? [];
  const s = Math.min(slide, n);
  const font: React.CSSProperties = { fontFamily: t.sans, color: t.ink };
  if (s === 1) return <AbsoluteFill style={font}><Cover p={p} u={u} t={t} n={n} /></AbsoluteFill>;
  if (s === n) return <AbsoluteFill style={font}><End p={p} u={u} t={t} n={n} /></AbsoluteFill>;
  return <AbsoluteFill style={font}><Tour p={p} u={u} t={t} i={s - 1} n={n} caption={captions[s - 1]} /></AbsoluteFill>;
};
