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
const PH_Y = 470;
const B_SLOTS: [number, number][] = [[64, 650], [646, 800], [76, 990], [652, 1170]];
const SCR_X = PH_X + 19;
const SCR_Y = PH_Y + 19;
const B_PINS: [number, number][] = [[284, 300], [356, 398], [478, 505], [404, 648]].map(([x, y]) => [SCR_X + x, SCR_Y + y]) as [number, number][];
/** app-map labels inside the phone (screen px) */
const APP_LABELS: { n: string; x: number; y: number; water?: boolean }[] = [
  { n: 'Bosphorus', x: 470, y: 250, water: true }, { n: 'Golden Horn', x: 196, y: 470, water: true }, { n: 'Sea of Marmara', x: 250, y: 720, water: true },
  { n: 'Şişli', x: 290, y: 238 }, { n: 'Beşiktaş', x: 372, y: 330 }, { n: 'Beyoğlu', x: 252, y: 405 }, { n: 'Fatih', x: 120, y: 560 },
  { n: 'Üsküdar', x: 560, y: 470 }, { n: 'Kadıköy', x: 520, y: 640 }, { n: 'Kağıthane', x: 236, y: 170 },
];

/** blue-sky scenery behind the phone, one per city (public/places/) */
const SCENE: Record<string, string> = { istanbul: 'places/istanbul-sky.jpg' };

const PhoneLayout: React.FC<{ p: StudioProps; t: ReturnType<typeof theme>; city: string; units: UnitProps[] }> = ({ p, t, city, units }) => {
  const scr = phoneScreen(PH_W, PH_H);
  const key = slug(city);
  const wide = key === 'istanbul' ? 'maps/istanbul-app.jpg' : CITY_MAPS[key]?.image;
  return (
    <AbsoluteFill style={{ background: '#2F6FBF', fontFamily: t.sans, color: '#fff' }}>
      {/* sky + city scenery (per city), else the brand sky gradient */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, #2C689D 0%, #3577AC 22%, #3B87BA 46%, #4499CA 68%, #62ABD6 88%, #7DBADF 100%)' }} />
      {SCENE[key] ? <Img src={asset(SCENE[key])} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      <AbsoluteFill style={{ background: 'radial-gradient(70% 40% at 50% 100%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 70%), radial-gradient(60% 30% at 80% 8%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 70%)' }} />
      <div style={{ position: 'absolute', top: 74, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textShadow: '0 2px 16px rgba(0,20,50,0.35)' }}>
        <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: 7, textTransform: 'uppercase', opacity: 0.88 }}>Find your stay on the map</div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 132, letterSpacing: -3, lineHeight: 0.95 }}>{city}</span>
          <Img src={asset('brand/3d/map-pin.png')} style={{ width: 118, marginTop: 6, filter: 'drop-shadow(0 10px 14px rgba(0,30,80,0.3))' }} />
        </div>
        <div style={{ marginTop: 18, fontSize: 25, fontWeight: 300, letterSpacing: 0.2, opacity: 0.95 }}>Browse every neighbourhood in the Homesta app</div>
        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 12, textShadow: 'none' }}>
          <AppIcon size={96} primary={t.primary} />
          <div style={{ width: 1, height: 56, background: 'rgba(255,255,255,0.4)', margin: '0 8px' }} />
          <AppStoreBadge height={56} />
          <GooglePlayBadge height={56} />
        </div>
      </div>
      <PhoneMockup w={PH_W} h={PH_H} style={{ left: PH_X, top: PH_Y }} screenBg="#F1F3F4">
        {wide ? <Img src={asset(wide)} style={{ position: 'absolute', left: 0, top: 0, width: scr.w, height: (scr.w * 880) / 662, objectFit: 'cover' }} /> : null}
        {key === 'istanbul' && APP_LABELS.map((l) => (
          <div key={l.n} style={{ position: 'absolute', left: l.x - 110, top: l.y - 12, width: 220, textAlign: 'center', fontSize: l.water ? 17 : 15, fontWeight: l.water ? 500 : 600, letterSpacing: l.water ? 0.4 : 1.2, textTransform: l.water ? 'none' : 'uppercase', color: l.water ? '#4F86B8' : '#7A7F86', textShadow: l.water ? 'none' : '0 0 4px #F4F3F0, 0 0 4px #F4F3F0' }}>{l.n}</div>
        ))}
        {/* you-are-here dot */}
        <div style={{ position: 'absolute', left: 318 - 30, top: 352 - 30, width: 60, height: 60, borderRadius: 999, background: 'rgba(52,120,246,0.16)' }} />
        <div style={{ position: 'absolute', left: 318 - 11, top: 352 - 11, width: 22, height: 22, borderRadius: 999, background: '#3478F6', border: '4px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }} />
        {/* price markers for more stays */}
        {units.slice(4, 6).map((u, i) => (
          <div key={u.id} style={{ position: 'absolute', left: [96, 548][i], top: [330, 560][i], height: 40, padding: '0 14px', borderRadius: 999, background: '#fff', boxShadow: '0 4px 12px rgba(20,40,70,0.22)', display: 'flex', alignItems: 'center', fontSize: 19, fontWeight: 600, color: t.ink }}>
            ${Math.round(u.price_from_usd ?? 0)}
          </div>
        ))}
        {/* app search bar */}
        <div style={{ position: 'absolute', top: 90, left: 22, right: 22, height: 58, borderRadius: 999, background: '#fff', boxShadow: '0 6px 18px rgba(20,40,70,0.16)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 8px 0 20px', fontSize: 19, color: '#6B6F76' }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth={2.4} strokeLinecap="round"><circle cx={11} cy={11} r={7} /><path d="M20 20l-4-4" /></svg>
          <span><span style={{ color: t.ink, fontWeight: 600 }}>{city}</span> · Any week · 2 guests</span>
          <div style={{ flex: 1 }} />
          <div style={{ width: 42, height: 42, borderRadius: 999, border: '1.5px solid #E3E3E3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth={2.2} strokeLinecap="round"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" /><circle cx={16} cy={7} r={2} /><circle cx={10} cy={17} r={2} /></svg>
          </div>
        </div>
      </PhoneMockup>
      {units.slice(0, 4).map((u, i) => <Pin key={`p${u.id}`} x={B_PINS[i][0]} y={B_PINS[i][1]} t={t} b={p.brand} />)}
      {units.slice(0, 4).map((u, i) => <Card key={u.id} u={u} x={B_SLOTS[i][0]} y={B_SLOTS[i][1]} t={t} city={city} k={0.78} />)}
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
