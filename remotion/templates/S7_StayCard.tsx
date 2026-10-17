/**
 * S7 · Stay Card  (story, 9:16 image)
 * Target: unit. Data: 4 photos (hero + 3), name, type, district, specs, top amenities, price, link.
 * Layout keeps all key content inside the Instagram / TikTok story safe area (y 250 → 1580).
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { Bath, BedDouble, DoorOpen, Users } from 'lucide-react';
import type { StudioProps } from '../shared/types';
import { HorizontalLogo, pickAmenities, theme } from '../shared/brand';
import { BrandBackground } from '../shared/background';

const M = 48;          // side margin
const GAP = 18;        // gap between photos
const TOP = 232;       // mosaic top
const H = 968;         // mosaic height
const HERO_W = 600;

const Photo: React.FC<{ src?: string; w: number; h: number; radius: string; style?: React.CSSProperties }> = ({ src, w, h, radius, style }) => (
  <div style={{ position: 'absolute', width: w, height: h, borderRadius: radius, overflow: 'hidden', background: '#EEE', boxShadow: '0 24px 60px rgba(60,0,15,0.35)', border: '4px solid rgba(255,255,255,0.9)', ...style }}>
    {src ? <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
  </div>
);

export const S7_StayCard: React.FC<StudioProps> = (p) => {
  const t = theme(p.brand);
  const u = p.unit!;
  const ph = u.photos.map((x) => x.url);
  const sideW = 1080 - M * 2 - HERO_W - GAP;
  const sideH = (H - GAP * 2) / 3;

  const s = u.specs ?? {};
  const specs = [
    s.guests ? { icon: Users, n: s.guests, l: s.guests === 1 ? 'Guest' : 'Guests' } : null,
    s.bedrooms ? { icon: DoorOpen, n: s.bedrooms, l: s.bedrooms === 1 ? 'Bedroom' : 'Bedrooms' } : null,
    s.beds ? { icon: BedDouble, n: s.beds, l: s.beds === 1 ? 'Bed' : 'Beds' } : null,
    s.baths ? { icon: Bath, n: s.baths, l: Number(s.baths) === 1 ? 'Bath' : 'Baths' } : null,
  ].filter(Boolean) as { icon: React.FC<any>; n: number | string; l: string }[];
  const amen = pickAmenities(u.amenities, 6 - specs.length);

  const name = u.name || u.title;
  const nameSize = name.length > 22 ? 64 : name.length > 16 ? 74 : 86;
  const typeLine = [s.bedrooms ? `${s.bedrooms}-Bedroom` : null, u.type].filter(Boolean).join(' ');
  const price = u.price_from_usd ? `$${Math.round(u.price_from_usd)}` : null;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: '#FFFFFF' }}>
      <BrandBackground tone="brand" opacity={0} primary={t.primary} deep={p.brand.colors.red_ink ? mix(t.primary, p.brand.colors.red_ink) : undefined} />

      {/* logo */}
      <div style={{ position: 'absolute', top: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <HorizontalLogo b={p.brand} height={54} logoReady={p.logoReady} light />
      </div>

      {/* mosaic: arch-topped hero + two side photos */}
      <Photo src={ph[0]} w={HERO_W} h={H} radius={`${HERO_W / 2}px ${HERO_W / 2}px 40px 40px`} style={{ left: M, top: TOP }} />
      <Photo src={ph[1] ?? ph[0]} w={sideW} h={sideH} radius="40px 40px 40px 40px" style={{ left: M + HERO_W + GAP, top: TOP }} />
      <Photo src={ph[2] ?? ph[1] ?? ph[0]} w={sideW} h={sideH} radius="40px" style={{ left: M + HERO_W + GAP, top: TOP + sideH + GAP }} />
      <Photo src={ph[3] ?? ph[2] ?? ph[0]} w={sideW} h={sideH} radius="40px" style={{ left: M + HERO_W + GAP, top: TOP + (sideH + GAP) * 2 }} />

      {/* district tag on the hero */}
      <div style={{
        position: 'absolute', left: M + 28, top: TOP + H - 84, height: 58, padding: '0 26px', borderRadius: 999,
        background: 'rgba(255,255,255,0.94)', color: t.ink, display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 600,
        boxShadow: '0 8px 22px rgba(14,14,16,0.15)',
      }}>
        <span style={{ width: 12, height: 12, borderRadius: 99, background: t.primary }} />
        {u.district}{u.city ? <span style={{ color: t.mute, fontWeight: 500 }}>· {u.city}</span> : null}
      </div>

      {/* name + type */}
      <div style={{ position: 'absolute', top: TOP + H + 34, left: M, right: M, textAlign: 'center' }}>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: nameSize, lineHeight: 1.08, letterSpacing: -1 }}>
          {name}
        </div>
        <div style={{ marginTop: 10, fontSize: 26, fontWeight: 500, letterSpacing: 6, textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>
          {typeLine}
        </div>
      </div>

      {/* specs + amenities row */}
      <div style={{ position: 'absolute', top: 1404, left: M, right: M, display: 'flex', justifyContent: 'center', gap: 14 }}>
        {specs.map((x, i) => {
          const I = x.icon;
          return (
            <div key={'s' + i} style={tile(t)}>
              <I size={38} color={t.primary} strokeWidth={1.8} />
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: t.ink }}>{x.n}</div>
              <div style={{ fontSize: 19, fontWeight: 500, color: t.mute }}>{x.l}</div>
            </div>
          );
        })}
        {amen.map((a) => {
          const I = a.icon;
          return (
            <div key={a.key} style={tile(t)}>
              <I size={38} color={t.primary} strokeWidth={1.8} />
              <div style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: t.primary }}>✓</div>
              <div style={{ fontSize: a.label.length > 9 ? 14 : 17, fontWeight: 500, color: t.mute }}>{a.label}</div>
            </div>
          );
        })}
      </div>

      {/* price + link bar */}
      <div style={{
        position: 'absolute', top: 1580, left: M + 20, right: M + 20, height: 104, borderRadius: 999, background: t.ink, color: '#fff',
        display: 'flex', alignItems: 'center', padding: '0 14px 0 40px', boxShadow: '0 18px 44px rgba(60,0,15,0.4)',
      }}>
        {price ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>From</span>
            <span style={{ fontSize: 46, fontWeight: 700 }}>{price}</span>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>/ night</span>
          </div>
        ) : <span style={{ fontSize: 34, fontWeight: 600 }}>Book your stay</span>}
        <div style={{ flex: 1 }} />
        <div style={{ height: 76, padding: '0 30px', borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', gap: 12, fontSize: 30, fontWeight: 600 }}>
          Book now
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>

      {/* site */}
      <div style={{ position: 'absolute', top: 1716, left: 0, right: 0, textAlign: 'center', fontSize: 30, fontWeight: 500, letterSpacing: 1, color: 'rgba(255,255,255,0.75)' }}>
        <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{t.site.replace(/\.com$/, '')}</span>.com
      </div>
    </AbsoluteFill>
  );
};

const tile = (t: ReturnType<typeof theme>): React.CSSProperties => ({
  width: 148, height: 138, borderRadius: 30, background: '#FFFFFF', border: '2px solid rgba(255,255,255,0.6)',
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
  boxShadow: '0 12px 28px rgba(60,0,15,0.25)',
});

/** deep shade between primary and red_ink */
const mix = (a: string, b: string) => {
  const x = parseInt(a.slice(1), 16), y = parseInt(b.slice(1), 16);
  const c = (s: number) => Math.round((((x >> s) & 255) + ((y >> s) & 255)) / 2);
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
};
