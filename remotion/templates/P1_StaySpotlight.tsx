/**
 * P1 · Stay Spotlight  (Instagram carousel, 5 slides, 4:5 1080×1350 PNG)
 * Target: district. Data: district + 3 stays (3 photos each) + brand.
 *  1 cover · 2–4 one stay per slide · 5 closing (app + site)
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { Bath, BedDouble, DoorOpen, Users } from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, pickAmenities, theme } from '../shared/brand';
import { BrandBackground } from '../shared/background';
import { AppIcon } from '../shared/device';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';

export const P1_SLIDES = 5;
const W = 1080;
const M = 48;

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  // DB names are cut at 50 chars — drop a half word at the end
  if (t.length >= 50) t = t.replace(/\s+\S*$/, '');
  return t;
};

const Photo: React.FC<{ src?: string; w: number; h: number; r: string; style?: React.CSSProperties }> = ({ src, w, h, r, style }) => (
  <div style={{ position: 'absolute', width: w, height: h, borderRadius: r, overflow: 'hidden', background: '#EEE', boxShadow: '0 22px 50px rgba(14,14,16,0.16)', ...style }}>
    {src ? <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
  </div>
);

/* ── 1 · cover ── */
const Cover: React.FC<{ p: StudioProps }> = ({ p }) => {
  const t = theme(p.brand);
  const name = p.district?.name ?? '';
  const covers = (p.units ?? []).map((u) => u.photos[0]?.url);
  const size = name.length > 11 ? 150 : name.length > 8 ? 168 : 186;
  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink }}>
      <BrandBackground aspect="4x5" />
      <div style={{ position: 'absolute', top: 66, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <HorizontalLogo b={p.brand} height={38} logoReady={p.logoReady} />
      </div>
      <div style={{ position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: t.mute }}>Stay spotlight</div>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: size, lineHeight: 1.12, letterSpacing: -2, marginTop: 6 }}>{name}</div>
        <div style={{ fontSize: 30, fontWeight: 500, color: t.ink, marginTop: 18 }}>
          {covers.length} handpicked stays <span style={{ color: t.primary }}>·</span> {p.district?.city}
        </div>
      </div>
      {/* arch collage */}
      <Photo src={covers[1]} w={300} h={450} r="150px 150px 34px 34px" style={{ left: 70, top: 650, transform: 'rotate(-5deg)', border: '8px solid #fff' }} />
      <Photo src={covers[2]} w={300} h={450} r="150px 150px 34px 34px" style={{ left: 710, top: 650, transform: 'rotate(5deg)', border: '8px solid #fff' }} />
      <Photo src={covers[0]} w={380} h={580} r="190px 190px 38px 38px" style={{ left: 350, top: 560, border: '10px solid #fff', boxShadow: '0 34px 70px rgba(14,14,16,0.25)' }} />
      <div style={{ position: 'absolute', top: 1196, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ height: 84, padding: '0 14px 0 38px', borderRadius: 999, background: t.ink, color: '#fff', display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, fontWeight: 600 }}>
          Swipe to explore
          <div style={{ width: 58, height: 58, borderRadius: 99, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ── 2–4 · one stay ── */
const StaySlide: React.FC<{ p: StudioProps; u: UnitProps; i: number; n: number }> = ({ p, u, i, n }) => {
  const t = theme(p.brand);
  const ph = u.photos.map((x) => x.url);
  const TOP = 132;
  const H = 700;
  const HERO = 600;
  const GAP = 16;
  const sideW = W - M * 2 - HERO - GAP;
  const sideH = (H - GAP) / 2;
  const s = u.specs ?? {};
  const specs = [
    s.guests ? { icon: Users, n: s.guests, l: s.guests === 1 ? 'Guest' : 'Guests' } : null,
    s.bedrooms ? { icon: DoorOpen, n: s.bedrooms, l: s.bedrooms === 1 ? 'Bedroom' : 'Bedrooms' } : null,
    s.beds ? { icon: BedDouble, n: s.beds, l: s.beds === 1 ? 'Bed' : 'Beds' } : null,
    s.baths ? { icon: Bath, n: s.baths, l: Number(s.baths) === 1 ? 'Bath' : 'Baths' } : null,
  ].filter(Boolean) as { icon: React.FC<any>; n: number | string; l: string }[];
  const amen = pickAmenities(u.amenities, 6 - specs.length);
  const name = niceName(u.name || u.title);
  const twoLines = name.length > 26;
  const nameSize = twoLines ? 48 : name.length > 18 ? 60 : 70;
  const typeLine = [s.bedrooms ? `${s.bedrooms}-Bedroom` : null, u.type].filter(Boolean).join(' ');
  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink }}>
      <BrandBackground aspect="4x5" />
      <div style={{ position: 'absolute', top: 54, left: M, right: M, display: 'flex', alignItems: 'center' }}>
        <HorizontalLogo b={p.brand} height={30} logoReady={p.logoReady} />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 2 }}>
          <span style={{ color: t.primary }}>{String(i).padStart(2, '0')}</span>
          <span style={{ color: t.mute }}> / {String(n).padStart(2, '0')}</span>
        </div>
      </div>

      <Photo src={ph[0]} w={HERO} h={H} r={`${HERO / 2}px ${HERO / 2}px 36px 36px`} style={{ left: M, top: TOP }} />
      <Photo src={ph[1] ?? ph[0]} w={sideW} h={sideH} r="36px" style={{ left: M + HERO + GAP, top: TOP }} />
      <Photo src={ph[2] ?? ph[1] ?? ph[0]} w={sideW} h={sideH} r="36px" style={{ left: M + HERO + GAP, top: TOP + sideH + GAP }} />
      <div style={{
        position: 'absolute', left: M + 26, top: TOP + H - 80, height: 54, padding: '0 24px', borderRadius: 999, background: 'rgba(255,255,255,0.95)',
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 24, fontWeight: 600, boxShadow: '0 8px 22px rgba(14,14,16,0.15)',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: 99, background: t.primary }} />
        {u.district ?? p.district?.name}
      </div>

      <div style={{ position: 'absolute', top: TOP + H + (twoLines ? 18 : 30), left: M + 20, right: M + 20, textAlign: 'center' }}>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: nameSize, lineHeight: 1.1, letterSpacing: -1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{name}</div>
        <div style={{ marginTop: twoLines ? 4 : 8, fontSize: 22, fontWeight: 500, letterSpacing: 5, textTransform: 'uppercase', color: t.mute }}>{typeLine}</div>
      </div>

      <div style={{ position: 'absolute', top: 1010, left: M, right: M, display: 'flex', justifyContent: 'center', gap: 12 }}>
        {specs.map((x, k) => {
          const I = x.icon;
          return (
            <div key={'s' + k} style={tile(t)}>
              <I size={32} color={t.primary} strokeWidth={1.8} />
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{x.n}</div>
              <div style={{ fontSize: 15, fontWeight: 500, color: t.mute }}>{x.l}</div>
            </div>
          );
        })}
        {amen.map((a) => {
          const I = a.icon;
          return (
            <div key={a.key} style={tile(t)}>
              <I size={32} color={t.primary} strokeWidth={1.8} />
              <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1, color: t.primary }}>✓</div>
              <div style={{ fontSize: a.label.length > 9 ? 12 : 15, fontWeight: 500, color: t.mute }}>{a.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{
        position: 'absolute', top: 1170, left: M + 20, right: M + 20, height: 96, borderRadius: 999, background: t.ink, color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 12px 0 38px', boxShadow: '0 18px 40px rgba(14,14,16,0.25)',
      }}>
        {u.price_from_usd ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>From</span>
            <span style={{ fontSize: 42, fontWeight: 700 }}>${Math.round(u.price_from_usd)}</span>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>/ night</span>
          </div>
        ) : <span style={{ fontSize: 30, fontWeight: 600 }}>Book your stay</span>}
        <div style={{ flex: 1 }} />
        <div style={{ height: 72, padding: '0 28px', borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', gap: 10, fontSize: 28, fontWeight: 600 }}>
          Book now
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const tile = (t: ReturnType<typeof theme>): React.CSSProperties => ({
  width: 140, height: 124, borderRadius: 28, background: '#FFFFFF', border: `2px solid ${t.rule}`,
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
  boxShadow: '0 8px 22px rgba(14,14,16,0.06)',
});

/* ── 5 · closing ── */
const Closing: React.FC<{ p: StudioProps }> = ({ p }) => {
  const t = theme(p.brand);
  const name = p.district?.name ?? '';
  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: '#fff' }}>
      <BrandBackground aspect="4x5" tone="brand" opacity={0} primary={t.primary} deep={p.brand.colors.red_ink ?? '#B8173D'} />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <HorizontalLogo b={p.brand} height={38} logoReady={p.logoReady} light />
      </div>
      <div style={{ position: 'absolute', top: 270, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>More stays in</div>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: name.length > 9 ? 150 : 176, lineHeight: 1.15, letterSpacing: -2 }}>{name}</div>
        <div style={{ display: 'inline-flex', marginTop: 34, height: 84, padding: '0 40px', borderRadius: 999, background: '#fff', color: t.ink, alignItems: 'center', fontSize: 32, fontWeight: 600, boxShadow: '0 18px 40px rgba(60,0,15,0.3)' }}>
          {t.site}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
        <AppIcon size={150} primary={t.primary} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 30, fontWeight: 600 }}>Download the Homesta app</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <AppStoreBadge height={62} />
            <GooglePlayBadge height={62} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const P1_StaySpotlight: React.FC<StudioProps & { slide?: number }> = ({ slide = 1, ...p }) => {
  const units = (p.units ?? []).slice(0, 3);
  if (slide === 1) return <Cover p={{ ...p, units }} />;
  if (slide >= 2 && slide <= 1 + units.length) return <StaySlide p={p} u={units[slide - 2]} i={slide - 1} n={units.length} />;
  return <Closing p={p} />;
};
