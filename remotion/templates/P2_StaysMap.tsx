/**
 * P2 · Stays Map  (Instagram post, 4:5, single image)
 * Target: city. A calm, Apple-Maps-like city map (prepared once per city in public/maps/)
 * with 4–6 floating stay cards (photo, name, area, from-price) and Homesta pins.
 * Card positions are designed slots — the map is decorative, not a precise location.
 * Playfair italic only for the city / district names.
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';
import { AppIcon, PhoneMockup, phoneScreen } from '../shared/device';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';

const WATER = '#AACDEC';
const MONO = '"JetBrains Mono", "SFMono-Regular", Menlo, monospace';

/** Cities with a prepared base map: image + label anchors (px on the 1080×1350 poster). */
export const CITY_MAPS: Record<string, { image: string; labels: [string, number, number][] }> = {
  istanbul: {
    image: 'maps/istanbul.jpg',
    labels: [
      ['Beşiktaş', 690, 372], ['Şişli', 430, 470], ['Beyoğlu', 300, 640], ['Üsküdar', 850, 760],
      ['Fatih', 205, 930], ['Kadıköy', 820, 1180], ['Kağıthane', 330, 290],
    ],
  },
};
const slug = (s: string) =>
  s.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  t = t.split(/\s[–-]\s|\s\|\s/)[0];
  return t.length > 40 ? t.slice(0, 39).replace(/\s+\S*$/, '') + '…' : t;
};

/** designed card slots (top-left), staggered left / right */
const SLOTS: [number, number][] = [
  [48, 392], [572, 500], [84, 676], [548, 800], [40, 960], [586, 1078],
];
/** pins: where the little Homesta markers sit (near each card, over land) */
const PINS: [number, number][] = [
  [548, 478], [1012, 492], [56, 668], [1034, 794], [304, 948], [538, 1060],
];

const CARD_W = 452;
const CARD_H = 146;

const Pin: React.FC<{ x: number; y: number; t: ReturnType<typeof theme>; b: StudioProps['brand']; big?: boolean }> = ({ x, y, t, b, big }) => {
  const s = big ? 76 : 58;
  const svg = b.icon_svg ?? { path: 'M341.5 752 V525 A198 198 0 0 1 737.5 525 V752', viewbox: '307 292 466 496', stroke: 69.5 };
  return (
    <div style={{ position: 'absolute', left: x - s / 2, top: y - s - 12, width: s, height: s + 14, filter: 'drop-shadow(0 10px 14px rgba(20,40,70,0.25))' }}>
      <div style={{ width: s, height: s, borderRadius: s * 0.32, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox={svg.viewbox} width={s * 0.5} height={s * 0.5}>
          <path d={svg.path} fill="none" stroke={t.primary} strokeWidth={svg.stroke} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: 'absolute', left: s / 2 - 9, top: s - 6, width: 18, height: 18, background: '#fff', transform: 'rotate(45deg)', borderRadius: 3 }} />
    </div>
  );
};

const Card: React.FC<{ u: UnitProps; x: number; y: number; t: ReturnType<typeof theme>; city: string; k?: number }> = ({ u, x, y, t, city, k = 1 }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: CARD_W, height: CARD_H, borderRadius: 34, background: '#fff', transform: `scale(${k})`, transformOrigin: '0 0',
    boxShadow: '0 22px 44px -14px rgba(20,40,70,0.32), 0 2px 6px rgba(20,40,70,0.08)', display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px 0 14px',
  }}>
    <div style={{ width: 118, height: 118, borderRadius: 26, overflow: 'hidden', flexShrink: 0, background: '#E8ECEF' }}>
      <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
    <div style={{ minWidth: 0, flex: 1 }}>
      <div style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.18, letterSpacing: -0.3, color: t.ink, maxHeight: 60, overflow: 'hidden' }}>{niceName(u.name || u.title)}</div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 20, color: '#6B6F76' }}>
        <svg width={16} height={20} viewBox="0 0 16 20"><path d="M8 19s6.5-6.1 6.5-11A6.5 6.5 0 0 0 1.5 8c0 4.9 6.5 11 6.5 11z" fill="none" stroke="#6B6F76" strokeWidth={1.8} /><circle cx={8} cy={8} r={2.3} fill="#6B6F76" /></svg>
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>{u.district || city}</span>
        <div style={{ flex: 1 }} />
        {u.price_from_usd ? (
          <span style={{ color: t.ink, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 24, fontWeight: 600 }}>${Math.round(u.price_from_usd)}</span>
            <span style={{ fontSize: 17, color: '#8C8F96' }}> /night</span>
          </span>
        ) : null}
      </div>
    </div>
  </div>
);

/* ── layout B: big phone with the zoomed-out map over a blue-sky city photo ── */
const PH_W = 700;
const PH_H = 1440;
const PH_X = (1080 - PH_W) / 2;
const PH_Y = 452;
const B_SLOTS: [number, number][] = [[46, 540], [560, 790], [60, 990]];
const B_PINS: [number, number][] = [[660, 680], [430, 930], [830, 1090]];
const SKY: Record<string, string> = { istanbul: 'places/beyoglu.jpg' };

const PhoneLayout: React.FC<{ p: StudioProps; t: ReturnType<typeof theme>; city: string; units: UnitProps[] }> = ({ p, t, city, units }) => {
  const scr = phoneScreen(PH_W, PH_H);
  const key = slug(city);
  const sky = SKY[key];
  const wide = key === 'istanbul' ? 'maps/istanbul-wide.jpg' : CITY_MAPS[key]?.image;
  return (
    <AbsoluteFill style={{ background: '#2F6FBF', fontFamily: t.sans, color: '#fff' }}>
      {sky ? <Img src={asset(sky)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,40,90,0.28) 0%, rgba(10,40,90,0) 34%)' }} />
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', textShadow: '0 2px 18px rgba(0,30,80,0.35)' }}>
        <div style={{ fontSize: 50, fontWeight: 500, letterSpacing: -1.4, lineHeight: 1.05 }}>Find your stay on the map in</div>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 112, letterSpacing: -2, lineHeight: 1.1 }}>{city}</div>
        <div style={{ marginTop: 4, fontSize: 26, fontWeight: 400, opacity: 0.95 }}>Browse every area in the Homesta app</div>
      </div>
      <PhoneMockup w={PH_W} h={PH_H} style={{ left: PH_X, top: PH_Y }} screenBg="#F1F3F4">
        {wide ? <Img src={asset(wide)} style={{ position: 'absolute', left: 0, top: -300, width: scr.w, height: scr.w * 2, objectFit: 'cover' }} /> : null}
      </PhoneMockup>
      {units.slice(0, 3).map((u, i) => <Pin key={`p${u.id}`} x={B_PINS[i][0]} y={B_PINS[i][1]} t={t} b={p.brand} />)}
      {units.slice(0, 3).map((u, i) => <Card key={u.id} u={u} x={B_SLOTS[i][0]} y={B_SLOTS[i][1]} t={t} city={city} k={1} />)}
      <Img src={asset('brand/3d/map-pin.png')} style={{ position: 'absolute', top: 720, left: 900, width: 150, transform: 'rotate(8deg)', filter: 'drop-shadow(0 14px 18px rgba(20,40,70,0.25))' }} />
      {/* app card */}
      <div style={{ position: 'absolute', left: 150, right: 150, bottom: 40, height: 150, borderRadius: 36, background: '#fff', boxShadow: '0 24px 50px -16px rgba(20,40,70,0.4)', display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px', color: t.ink }}>
        <AppIcon size={104} primary={t.primary} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: -0.2 }}>
            Get the app · <span style={{ fontWeight: 600 }}>homestastay</span><span style={{ fontWeight: 300 }}>.com</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <AppStoreBadge height={52} />
            <GooglePlayBadge height={52} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const P2_StaysMap: React.FC<StudioProps> = (p) => {
  const t = theme(p.brand);
  const city = p.city?.name ?? p.units?.[0]?.city ?? '';
  const map = CITY_MAPS[slug(city)];
  const units = (p.units ?? []).slice(0, 6);
  const minPrice = Math.min(...units.map((u) => u.price_from_usd ?? Infinity));
  if ((p.params?.layout as string) === 'phone') return <PhoneLayout p={p} t={t} city={city} units={units} />;

  return (
    <AbsoluteFill style={{ background: WATER, fontFamily: t.sans, color: t.ink }}>
      {map ? <Img src={asset(map.image)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      {map?.labels.filter(([, , y]) => y > 340).map(([n, x, y]) => (
        <div key={n} style={{ position: 'absolute', left: x - 120, top: y - 14, width: 240, textAlign: 'center', fontFamily: MONO, fontSize: 18, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(70,82,96,0.55)' }}>{n}</div>
      ))}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${WATER} 0%, rgba(170,205,236,0.92) 18%, rgba(170,205,236,0) 32%)` }} />

      <div style={{ position: 'absolute', top: 56, left: 60 }}>
        <HorizontalLogo b={p.brand} height={34} logoReady={p.logoReady} redArch />
      </div>
      <div style={{ position: 'absolute', top: 124, left: 60, right: 260 }}>
        <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>Where to stay in</div>
        <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 104, letterSpacing: -2, lineHeight: 1.06 }}>{city}</div>
      </div>
      <Img src={asset('brand/3d/map-pin.png')} style={{ position: 'absolute', top: 70, right: 36, width: 250, filter: 'drop-shadow(0 18px 24px rgba(20,40,70,0.18))' }} />

      {units.map((u, i) => <Pin key={`p${u.id}`} x={PINS[i][0]} y={PINS[i][1]} t={t} b={p.brand} />)}
      {units.map((u, i) => <Card key={u.id} u={u} x={SLOTS[i][0]} y={SLOTS[i][1] - 6} t={t} city={city} />)}

      <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, textAlign: 'center', fontSize: 34, letterSpacing: -0.4, color: t.ink }}>
        <span style={{ fontWeight: 500 }}>{t.site.replace(/\.com$/, '')}</span>
        <span style={{ fontWeight: 300 }}>.com</span>
      </div>
    </AbsoluteFill>
  );
};
