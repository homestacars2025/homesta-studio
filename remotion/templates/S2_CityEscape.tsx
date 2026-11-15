/**
 * S2 · City Escape v3  (story, 9:16 video, 12s @ 30fps) — "get the app" motivation story
 * Target: city. Data: city name + image(s) + 3–6 units (photos, name, type, specs, price, amenities) + brand.
 * The phone replays the REAL Homesta app (rebuilt 1:1 from app screenshots, Rubik UI font, the app's
 * own 3D icons): results list → tap a stay → gallery swipe → scroll to "What this place offers" →
 * tap "Reserve" → "Booked!". Headline rolls (Explore → Find → Book your stay in <City>).
 * Playfair italic only for the city name.
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArrowUpDown, Bath, Bed, BedDouble, Check, ChevronLeft, ChevronRight, Heart, MapPin, Pointer, Share, SlidersHorizontal, Users } from 'lucide-react';
import { asset } from '../shared/assets';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { BrandBackground } from '../shared/background';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';
import { AppIcon, PHONE_BEZEL, PHONE_FRAME, PhoneMockup, phoneScreen } from '../shared/device';

export const S2_FRAMES = 360; // 12s

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const reveal = (f: number, start: number, dur = 20) => interpolate(f, [start, start + dur], [0, 1], { easing: easeOut, ...cl });

/* ── phone geometry (screen keeps the iPhone 430×932 ratio of the real screenshots) ── */
const PH_W = 530;
const SCR_W = phoneScreen(PH_W, 0).w;
const REF_W = 1188; // screenshot reference width (all app measurements below are in these units)
const K = SCR_W / REF_W;
const d = (v: number) => v * K;
const SCR_H = Math.round(d(2576));
const PH_H = SCR_H + (PHONE_FRAME + PHONE_BEZEL) * 2;
const PH_X = (1080 - PH_W) / 2;
const PH_Y = 455;
const IN = PHONE_FRAME + PHONE_BEZEL; // screen offset inside the phone

/* ── app tokens ── */
const APP_FONT = '"Rubik", "Geist Sans", sans-serif';
const INK = '#222222';
const GRAY = '#717171';
const LINE = '#E8E8E8';
const CARD_TOP = 580;
const CARD_STEP = 1235;
const HERO_H = 1090;
const BAR_TOP = 2282;
const DETAIL_SCROLL = 1270;

/* ── story beats ── */
const SCROLL_A = 46;
const SCROLL_B = 116;
const TAP1 = 128; // tap the stay card
const PUSH = 134; // detail screen slides in
const SWIPE = [156, 180]; // gallery swipes
const DSCROLL = [198, 236]; // scroll down to the amenities
const TAP2 = 262; // tap "Reserve"
const SHEET = 268; // "Booked!" sheet
const CHECK = 278;
const BADGE = 288; // notification badge on the app icon

const niceName = (s: string) => {
  const t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  return t.length > 44 ? t.slice(0, 43).trimEnd() + '…' : t;
};
const money = (v?: number | null) => (v ? `$${v.toFixed(2)}` : '');
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const specLine = (u: UnitProps) => {
  const s = u.specs ?? {};
  return [s.bedrooms ? plural(Number(s.bedrooms), 'bedroom') : '', s.beds ? plural(Number(s.beds), 'bed') : '', s.baths ? plural(Number(s.baths), 'bathroom') : '']
    .filter(Boolean).join(' • ');
};

/* the app's own 3D amenity icons, in the app's order */
const AMENITIES: [string, string][] = [
  ['wifi', 'Wi-Fi'], ['kitchen', 'Kitchen'], ['air_conditioning', 'Air conditioning'], ['tv', 'TV'],
  ['washing_machine', 'Washing machine'], ['dishwasher', 'Dishwasher'], ['hair_dryer', 'Hair dryer'], ['iron', 'Iron'],
  ['extra_bed', 'Extra bed'], ['hot_water', 'Hot water'], ['parking', 'Parking'], ['pool', 'Pool'], ['self_check_in', 'Self check-in'],
];
const icon3d = (b: StudioProps['brand'], key: string) => b?.icons?.[key] ?? asset(`app/${key}.png`);

const Ico: React.FC<{ src: string; size: number; style?: React.CSSProperties }> = ({ src, size, style }) => (
  <Img src={src} style={{ width: size, height: size, objectFit: 'contain', mixBlendMode: 'multiply', ...style }} />
);
const Circle: React.FC<{ x: number; y: number; r: number; bg: string; children: React.ReactNode; shadow?: boolean }> = ({ x, y, r, bg, children, shadow }) => (
  <div style={{ position: 'absolute', left: d(x - r), top: d(y - r), width: d(r * 2), height: d(r * 2), borderRadius: 999, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadow ? '0 2px 8px rgba(0,0,0,0.12)' : undefined }}>
    {children}
  </div>
);

/** Result card — exactly the app's list card. */
const ResultCard: React.FC<{ u: UnitProps; b: StudioProps['brand']; press: number }> = ({ u, b, press }) => {
  const W = 1077;
  const pay = u.pay_at_arrival;
  return (
    <div style={{ position: 'relative', width: d(W), height: d(1145), borderRadius: d(50), background: '#fff', boxShadow: '0 2px 14px rgba(0,0,0,0.05)', transform: `scale(${1 - 0.03 * press})` }}>
      <div style={{ position: 'absolute', left: d(22), top: d(20), width: d(W - 44), height: d(777), borderRadius: d(48), overflow: 'hidden', background: '#EEE' }}>
        <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: d(30), left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: d(12) }}>
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: d(20), height: d(20), borderRadius: 99, background: '#fff', opacity: i === 0 ? 1 : 0.6 }} />)}
        </div>
      </div>
      <Circle x={980} y={95} r={46} bg="rgba(255,255,255,0.92)"><Heart size={d(44)} color={INK} strokeWidth={2} /></Circle>
      <div style={{ position: 'absolute', left: d(45), right: d(45), top: d(832), fontSize: d(40), color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name || u.title}</div>
      <div style={{ position: 'absolute', left: d(45), top: d(902), fontSize: d(37), color: GRAY }}>{u.city}</div>
      <div style={{ position: 'absolute', left: d(45), top: d(963), fontSize: d(37), color: GRAY }}>{specLine(u)}</div>
      <div style={{ position: 'absolute', left: d(45), top: d(1036), fontSize: d(44), color: INK }}>
        <span style={{ fontWeight: 500 }}>{money(u.price_from_usd)}</span> night
      </div>
      {pay != null && (
        <div style={{ position: 'absolute', right: d(45), top: d(1025), height: d(75), padding: `0 ${d(30)}px 0 ${d(24)}px`, borderRadius: 999, background: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: d(14), fontSize: d(36), fontWeight: 500, color: pay ? '#C99200' : '#1F9D55' }}>
          <Ico src={asset(pay ? 'app/tag-arrival.png' : 'app/tag-paid.png')} size={d(48)} />
          {pay ? 'Pay on arrival' : 'Paid in full'}
        </div>
      )}
    </div>
  );
};

const Prop: React.FC<{ src: string; x: number; y: number; w: number; rot: number; style?: React.CSSProperties }> = ({ src, x, y, w, rot, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, ...style }}>
    <Img src={asset(src)} style={{ width: '100%', transform: `rotate(${rot}deg)` }} />
  </div>
);

/** Tilted framed photo; `next` cross-fades in when given (follows the stay in focus). */
const SidePhoto: React.FC<{ src?: string; next?: string; mix?: number; x: number; y: number; w: number; h: number; rot: number; p: number; from: number; float: number }> = ({ src, next, mix = 0, x, y, w, h, rot, p, from, float }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, padding: 12, background: '#fff', borderRadius: 34,
    boxShadow: '0 30px 60px rgba(14,14,16,0.18)',
    transform: `translateX(${(1 - p) * from}px) translateY(${float}px) rotate(${rot * p + (1 - p) * rot * 2.2}deg) scale(${0.85 + 0.15 * p})`, opacity: p,
  }}>
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', background: '#ddd' }}>
      {src ? <Img src={src} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      {next && mix > 0 ? <Img src={next} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: mix }} /> : null}
    </div>
  </div>
);

/** The rolling first line of the headline. */
const PHRASES: [number, string][] = [
  [0, 'Explore stays in'],
  [PUSH, 'Find your stay in'],
  [SHEET, 'Book your stay in'],
];

export const S2_CityEscape: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const city = p.city?.name ?? p.units?.[0]?.city ?? '';
  const units = (p.units ?? []).slice(0, 6);
  const n = units.length;
  const D = Math.min(2, Math.max(0, n - 1)); // the stay we open
  const pick = units[D];
  const imgs = ((p.city as any)?.images as string[] | undefined) ?? [];
  const leftImg = imgs[0] ?? p.city?.image ?? units[0]?.photos[0]?.url;

  /* ── intro ── */
  const eyebrow = reveal(f, 2, 16);
  const title = reveal(f, 6, 22);
  const phoneIn = spring({ frame: f - 8, fps, config: { damping: 18, stiffness: 90, mass: 1 } });
  const leftIn = spring({ frame: f - 20, fps, config: { damping: 14, stiffness: 90 } });
  const rightIn = spring({ frame: f - 26, fps, config: { damping: 14, stiffness: 90 } });
  const pinDrop = spring({ frame: f - 34, fps, config: { damping: 9, stiffness: 160 } });
  const path = reveal(f, 30, 50);
  const planeIn = spring({ frame: f - 30, fps, config: { damping: 16, stiffness: 70 } });
  const magIn = spring({ frame: f - 40, fps, config: { damping: 11, stiffness: 120 } });
  const clipIn = spring({ frame: f - 48, fps, config: { damping: 12, stiffness: 140 } });
  const ctaIn = spring({ frame: f - 56, fps, config: { damping: 14, stiffness: 120 } });
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  /* ── list scroll → card D ── */
  const su = interpolate(f, [SCROLL_A, SCROLL_B], [0, D], { easing: easeInOut, ...cl });
  const scroll = su * CARD_STEP;
  const press1 = interpolate(f, [TAP1 - 3, TAP1, TAP1 + 5], [0, 1, 0], cl);

  /* ── screens ── */
  const push = spring({ frame: f - PUSH, fps, config: { damping: 22, stiffness: 140 } });
  const sheet = spring({ frame: f - SHEET, fps, config: { damping: 20, stiffness: 130 } });
  const check = spring({ frame: f - CHECK, fps, config: { damping: 10, stiffness: 170 } });
  const gal = (pick?.photos ?? []).slice(0, 3);
  const gi = interpolate(f, [SWIPE[0], SWIPE[0] + 14, SWIPE[1], SWIPE[1] + 14], [0, 1, 1, 2], { easing: easeInOut, ...cl });
  const gx = Math.min(gi, Math.max(0, gal.length - 1));
  const ds = interpolate(f, DSCROLL, [0, DETAIL_SCROLL], { easing: easeInOut, ...cl });
  const navOn = interpolate(ds, [620, 820], [0, 1], cl);
  const toastIn = spring({ frame: f - PUSH - 22, fps, config: { damping: 15, stiffness: 140 } });
  const press2 = interpolate(f, [TAP2 - 3, TAP2, TAP2 + 5], [0, 1, 0], cl);
  const lightBar = f >= PUSH + 4 && f < SHEET + 4 && navOn < 0.5;

  /* ── finger (global coords; app points in screenshot units) ── */
  const G = (x: number, y: number): [number, number] => [PH_X + IN + d(x), PH_Y + IN + d(y)];
  const keys: [number, [number, number]][] = [
    [100, [760, 1400]], [TAP1 - 4, G(560, CARD_TOP + 420)], [TAP1 + 8, G(560, CARD_TOP + 420)],
    [SWIPE[0] - 2, G(930, 620)], [SWIPE[0] + 14, G(420, 640)], [SWIPE[1] - 2, G(930, 620)], [SWIPE[1] + 14, G(420, 640)],
    [DSCROLL[0] - 2, G(760, 1950)], [DSCROLL[1], G(760, 950)], [DSCROLL[1] + 6, G(760, 950)], [TAP2 - 6, G(990, 2400)],
  ];
  const fx = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1][0]), { easing: easeInOut, ...cl });
  const fy = interpolate(f, keys.map((k) => k[0]), keys.map((k) => k[1][1]), { easing: easeInOut, ...cl });
  const fingerOn = interpolate(f, [100, 110, TAP2 + 10, TAP2 + 22], [0, 1, 1, 0], cl);
  const ring = (at: number) => {
    const k = (f - at) / 16;
    return k >= 0 && k <= 1 ? k : -1;
  };
  const r1 = ring(TAP1);
  const r2 = ring(TAP2);
  const inDrag = (from: number, to: number) => interpolate(f, [from - 2, from, to, to + 3], [0, 1, 1, 0], cl);
  const drag = Math.max(inDrag(SWIPE[0], SWIPE[0] + 14), inDrag(SWIPE[1], SWIPE[1] + 14), inDrag(DSCROLL[0], DSCROLL[1]));
  const press = Math.max(press1, press2, drag * 0.8);

  /* ── headline roll ── */
  let pi = 0;
  for (let i = 0; i < PHRASES.length; i++) if (f >= PHRASES[i][0]) pi = i;
  const roll = pi === 0 ? 1 : interpolate(f, [PHRASES[pi][0], PHRASES[pi][0] + 14], [0, 1], { easing: easeOut, ...cl });
  const prevPhrase = PHRASES[Math.max(0, pi - 1)][1];

  /* ── side photo follows the focus ── */
  const fl = Math.floor(su);
  const rightA = units[Math.min(n - 1, fl)]?.photos[0]?.url ?? leftImg;
  const rightB = units[Math.min(n - 1, fl + 1)]?.photos[0]?.url;
  const rightMix = su - fl;

  /* ── app icon life ── */
  const badge = spring({ frame: f - BADGE, fps, config: { damping: 9, stiffness: 200 } });
  const bounceT = f > BADGE ? (f - BADGE) % 45 : 99;
  const iconBounce = bounceT < 18 ? Math.sin((bounceT / 18) * Math.PI) : 0;
  const iconScale = (0.6 + 0.4 * ctaIn) * (1 + 0.08 * iconBounce);
  const iconLift = -14 * iconBounce + Math.sin(f / 14) * 2;
  const shine = (f - 280) % 60;

  const titleSize = city.length > 10 ? 132 : city.length > 7 ? 150 : 168;
  const s = pick?.specs ?? {};

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink, opacity: out }}>
      <Audio src={asset('sfx/s2-city-escape.wav')} volume={0.8} />
      <BrandBackground opacity={0} />

      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path
          d="M 60 1520 C 10 1240, 120 1020, 230 900 M 850 860 C 980 760, 1060 600, 980 470"
          fill="none" stroke={t.primary} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round"
          strokeDasharray="18 22" strokeDashoffset={-f * 1.2}
          style={{ clipPath: `inset(0 0 ${100 - path * 100}% 0)` }}
        />
      </svg>

      {/* logo */}
      <div style={{ position: 'absolute', top: 112, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * -12}px)` }}>
        <HorizontalLogo b={p.brand} height={40} logoReady={p.logoReady} />
      </div>

      {/* headline: first line rolls with the story, the city stays */}
      <div style={{ position: 'absolute', top: 218, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ position: 'relative', height: 40, overflow: 'hidden', opacity: eyebrow }}>
          {pi > 0 && (
            <div style={{ position: 'absolute', left: 0, right: 0, fontSize: 30, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: t.mute, lineHeight: '40px', transform: `translateY(${-roll * 40}px)` }}>
              {prevPhrase}
            </div>
          )}
          <div style={{ position: 'absolute', left: 0, right: 0, fontSize: 30, fontWeight: 600, letterSpacing: 9, textTransform: 'uppercase', color: pi === 0 ? t.mute : t.primary, lineHeight: '40px', transform: `translateY(${(1 - roll) * 40 + (pi === 0 ? (1 - eyebrow) * 16 : 0)}px)` }}>
            {PHRASES[pi][1]}
          </div>
        </div>
        <div style={{ overflow: 'hidden', height: 190, paddingTop: 4 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: titleSize, lineHeight: '180px', letterSpacing: -2, transform: `translateY(${(1 - title) * 190}px) scale(${1 + 0.04 * interpolate(f, [SHEET, SHEET + 10, SHEET + 24], [0, 1, 0], cl)})` }}>
            {city}
          </div>
        </div>
      </div>

      {/* side photos */}
      <SidePhoto src={leftImg} x={14} y={700} w={330} h={420} rot={-9} p={leftIn} from={-260} float={Math.sin(f / 26) * 6} />
      <SidePhoto src={rightA} next={rightB} mix={rightMix} x={740} y={1000} w={330} h={400} rot={8} p={rightIn} from={260} float={Math.sin(f / 22 + 1) * 6} />

      {/* 3D props */}
      <Prop src="brand/3d/pin.png" x={36} y={560} w={150} rot={-10 + Math.sin(f / 18) * 2}
        style={{ transform: `translateY(${(1 - pinDrop) * -160 + Math.sin(f / 16) * 6}px) scale(${0.6 + 0.4 * pinDrop})`, opacity: Math.min(1, pinDrop * 2) }} />
      <Prop src="brand/3d/plane.png" x={760} y={400} w={250} rot={-4}
        style={{ transform: `translate(${(1 - planeIn) * 420 + Math.sin(f / 30) * 10}px, ${(1 - planeIn) * -260 + Math.sin(f / 20) * 8}px) rotate(${(1 - planeIn) * 14}deg)`, opacity: planeIn }} />
      <Prop src="brand/3d/magnifier.png" x={808} y={880} w={230} rot={0}
        style={{ transform: `scale(${0.5 + 0.5 * magIn}) rotate(${(1 - magIn) * 40 + Math.sin(f / 22) * 3}deg)`, opacity: Math.min(1, magIn * 1.6) }} />
      <Prop src="brand/3d/paperclip.png" x={930} y={1280} w={110} rot={18}
        style={{ transform: `rotate(${18 + (1 - clipIn) * 30}deg) scale(${0.6 + 0.4 * clipIn})`, opacity: clipIn }} />

      {/* phone — the real Homesta app */}
      <PhoneMockup w={PH_W} h={PH_H} ink={lightBar ? '#FFFFFF' : '#0E0E10'} screenBg="#FFFFFF" barBg="transparent"
        style={{ left: PH_X, top: PH_Y, transform: `translateY(${(1 - phoneIn) * 900}px) rotate(${(1 - phoneIn) * 6}deg)` }}>
        <div style={{ position: 'absolute', inset: 0, fontFamily: APP_FONT, color: INK }}>

          {/* ── 1. results list ── */}
          <div style={{ position: 'absolute', inset: 0, background: '#F7F7F7', transform: `translateX(${-push * SCR_W * 0.28}px)` }}>
            <div style={{ position: 'absolute', left: d(55), top: 0, transform: `translateY(${-d(scroll)}px)` }}>
              {units.map((x, i) => {
                const e = spring({ frame: f - 30 - i * 5, fps, config: { damping: 18, stiffness: 120 } });
                return (
                  <div key={x.id} style={{ position: 'absolute', left: 0, top: d(CARD_TOP + i * CARD_STEP), transform: `translateY(${(1 - e) * 120}px)`, opacity: e }}>
                    <ResultCard u={x} b={p.brand} press={i === D ? press1 : 0} />
                  </div>
                );
              })}
            </div>
            {/* header: back · search · categories */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: d(542), background: '#fff', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
              <Circle x={108} y={277} r={52} bg="#F4F4F4"><ChevronLeft size={d(54)} color={INK} strokeWidth={2.2} /></Circle>
              <div style={{ position: 'absolute', left: d(196), top: d(208), width: d(934), height: d(136), borderRadius: 999, border: `${d(3)}px solid #E9E9E9`, background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
                <Ico src={asset('app/search.png')} size={d(58)} style={{ marginLeft: d(50) }} />
                <div style={{ marginLeft: d(26), lineHeight: 1.25 }}>
                  <div style={{ fontSize: d(38), fontWeight: 500, color: INK }}>{city}</div>
                  <div style={{ fontSize: d(32), color: GRAY }}>Any dates • 1 guest</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ width: d(2), height: d(70), background: '#E3E3E3' }} />
                <ArrowUpDown size={d(50)} color={INK} strokeWidth={2.2} style={{ marginLeft: d(36) }} />
                <SlidersHorizontal size={d(50)} color={INK} strokeWidth={2.2} style={{ marginLeft: d(38), marginRight: d(36), transform: 'rotate(90deg)' }} />
              </div>
              <div style={{ position: 'absolute', left: d(55), top: d(390), display: 'flex', gap: d(26), whiteSpace: 'nowrap' }}>
                <div style={{ height: d(118), padding: `0 ${d(46)}px`, borderRadius: 999, border: `${d(5)}px solid ${t.primary}`, display: 'flex', alignItems: 'center', fontSize: d(38) }}>All</div>
                {[['chip-apartment', 'Apartment'], ['chip-aparthotels', 'Aparthotels'], ['chip-hotels', 'Hotels']].map(([k, l]) => (
                  <div key={k} style={{ height: d(112), marginTop: d(3), padding: `0 ${d(36)}px 0 ${d(32)}px`, borderRadius: 999, border: `${d(2.5)}px solid #E6E6E6`, display: 'flex', alignItems: 'center', gap: d(20), fontSize: d(38) }}>
                    <Ico src={asset(`app/${k}.png`)} size={d(58)} />{l}
                  </div>
                ))}
              </div>
            </div>
            <AbsoluteFill style={{ background: '#0E0E10', opacity: push * 0.25 }} />
          </div>

          {/* ── 2. stay details ── */}
          {pick && f >= PUSH - 1 && (
            <div style={{ position: 'absolute', inset: 0, background: '#fff', transform: `translateX(${(1 - push) * SCR_W}px)`, boxShadow: '-20px 0 40px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: SCR_W, transform: `translateY(${-d(ds)}px)` }}>
                {/* gallery */}
                <div style={{ position: 'relative', width: SCR_W, height: d(HERO_H + 40), overflow: 'hidden', background: '#DDD' }}>
                  <div style={{ display: 'flex', width: SCR_W * Math.max(1, gal.length), height: '100%', transform: `translateX(${-gx * SCR_W}px)` }}>
                    {gal.map((g, i) => (
                      <Img key={i} src={g.url} style={{ width: SCR_W, height: '100%', objectFit: 'cover', flexShrink: 0, transform: `scale(${1.03 + 0.03 * Math.sin((f + i * 20) / 40)})` }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', left: d(990), top: d(992), height: d(66), padding: `0 ${d(26)}px`, borderRadius: 999, background: 'rgba(30,30,30,0.55)', color: '#fff', fontSize: d(34), display: 'flex', alignItems: 'center', transform: 'translateX(-30%)' }}>
                    {Math.round(gx) + 1} / {pick.photo_count ?? gal.length}
                  </div>
                </div>
                {/* sheet */}
                <div style={{ position: 'relative', marginTop: d(-38), borderRadius: `${d(70)}px ${d(70)}px 0 0`, background: '#fff', padding: `${d(68)}px ${d(56)}px 0` }}>
                  <div style={{ display: 'flex', gap: d(18) }}>
                    {[pick.type].filter(Boolean).map((c) => (
                      <div key={c} style={{ height: d(68), padding: `0 ${d(32)}px`, borderRadius: 999, border: `${d(2.5)}px solid #E2E2E2`, display: 'flex', alignItems: 'center', fontSize: d(34), color: '#333' }}>{c}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: d(30), fontSize: d(62), lineHeight: 1.26, color: '#1A1A1A', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{pick.name || pick.title}</div>
                  <div style={{ marginTop: d(34), display: 'flex', alignItems: 'center', gap: d(16), fontSize: d(40), color: GRAY }}>
                    <MapPin size={d(42)} color={GRAY} strokeWidth={1.8} />{pick.city}
                  </div>
                  <div style={{ marginTop: d(66), display: 'grid', gridTemplateColumns: `${d(539)}px 1fr`, rowGap: d(48), fontSize: d(42), color: '#333' }}>
                    {[
                      s.guests ? [<Users key="g" size={d(48)} color="#8A8A8A" strokeWidth={1.7} />, plural(Number(s.guests), 'guest')] : null,
                      s.bedrooms ? [<BedDouble key="b" size={d(48)} color="#8A8A8A" strokeWidth={1.7} />, plural(Number(s.bedrooms), 'bedroom')] : null,
                      s.beds ? [<Bed key="d" size={d(48)} color="#8A8A8A" strokeWidth={1.7} />, plural(Number(s.beds), 'bed')] : null,
                      s.baths ? [<Bath key="t" size={d(48)} color="#8A8A8A" strokeWidth={1.7} />, plural(Number(s.baths), 'bathroom')] : null,
                    ].filter(Boolean).map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: d(26) }}>{c![0]}{c![1]}</div>
                    ))}
                  </div>
                  <div style={{ marginTop: d(70), height: d(2), background: LINE }} />
                  <div style={{ marginTop: d(64), display: 'flex', alignItems: 'center', gap: d(34) }}>
                    <Img src={asset('app/host.png')} style={{ width: d(138), height: d(138), borderRadius: 999 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: d(42), color: INK }}>Contact the host</div>
                      <div style={{ marginTop: d(10), fontSize: d(33), color: GRAY }}>Ask about anything before you book</div>
                    </div>
                    <div style={{ width: d(88), height: d(88), borderRadius: 999, background: '#FDE9ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ChevronRight size={d(44)} color={t.primary} strokeWidth={2.4} />
                    </div>
                  </div>
                  <div style={{ marginTop: d(70), height: d(2), background: LINE }} />
                  <div style={{ marginTop: d(80), display: 'flex', alignItems: 'center', gap: d(26), fontSize: d(48), color: INK }}>
                    <Ico src={asset('app/offers.png')} size={d(66)} />What this place offers
                  </div>
                  <div style={{ marginTop: d(46), display: 'grid', gridTemplateColumns: `${d(539)}px 1fr` }}>
                    {AMENITIES.filter(([k]) => pick.amenities?.includes(k)).slice(0, 12).map(([k, l]) => (
                      <div key={k} style={{ height: d(127), display: 'flex', alignItems: 'center', gap: d(30), fontSize: d(42), color: '#444' }}>
                        <div style={{ width: d(80), display: 'flex', justifyContent: 'center' }}><Ico src={icon3d(p.brand, k)} size={d(78)} /></div>{l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* floating buttons on the photo → white top bar after scrolling */}
              <div style={{ opacity: 1 - navOn }}>
                <Circle x={99} y={235} r={55} bg="#fff"><ChevronLeft size={d(52)} color={INK} strokeWidth={2.2} /></Circle>
                <Circle x={955} y={235} r={55} bg="#fff"><Share size={d(44)} color={INK} strokeWidth={2} /></Circle>
                <Circle x={1088} y={235} r={55} bg="#fff"><Heart size={d(46)} color={INK} strokeWidth={2} /></Circle>
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: d(305), background: '#fff', borderBottom: `${d(2)}px solid ${LINE}`, opacity: navOn }}>
                <ChevronLeft size={d(52)} color={INK} strokeWidth={2.2} style={{ position: 'absolute', left: d(73), top: d(209) }} />
                <div style={{ position: 'absolute', left: d(190), right: d(300), top: d(208), fontSize: d(40), color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pick.name || pick.title}</div>
                <Share size={d(44)} color={INK} strokeWidth={2} style={{ position: 'absolute', left: d(933), top: d(212) }} />
                <Heart size={d(46)} color={INK} strokeWidth={2} style={{ position: 'absolute', left: d(1065), top: d(212) }} />
              </div>

              {/* pay-on-arrival toast */}
              {pick.pay_at_arrival && (
                <div style={{ position: 'absolute', left: d(218), top: d(2115), width: d(754), height: d(130), borderRadius: 999, background: '#fff', boxShadow: '0 8px 26px rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', gap: d(30), padding: `0 ${d(40)}px`, fontSize: d(39), lineHeight: 1.3, color: INK, opacity: toastIn, transform: `translateY(${(1 - toastIn) * 40}px) scale(${0.9 + 0.1 * toastIn})` }}>
                  <Ico src={asset('app/tag-arrival.png')} size={d(72)} />
                  <span>Book now, pay when you arrive</span>
                </div>
              )}

              {/* reserve bar */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: d(BAR_TOP), bottom: 0, background: '#fff', borderTop: `${d(2)}px solid ${LINE}` }}>
                <div style={{ position: 'absolute', left: d(56), top: d(58), fontSize: d(50), color: INK }}>
                  <span style={{ fontWeight: 500 }}>{money(pick.price_from_usd)}</span><span style={{ fontSize: d(42), color: GRAY }}> / night</span>
                </div>
                {pick.min_nights ? <div style={{ position: 'absolute', left: d(56), top: d(128), fontSize: d(33), color: GRAY }}>Min {plural(pick.min_nights, 'night')}</div> : null}
                <div style={{ position: 'absolute', left: d(855), top: d(36), width: d(277), height: d(152), borderRadius: d(44), background: t.primary, color: '#fff', fontSize: d(42), display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.06 * press2})` }}>
                  Reserve
                </div>
              </div>
            </div>
          )}

          {/* ── 3. booked ── */}
          {pick && f >= SHEET - 1 && (
            <div style={{ position: 'absolute', inset: 0, background: '#fff', transform: `translateY(${(1 - sheet) * SCR_H}px)`, borderRadius: '36px 36px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 210 }}>
              {Array.from({ length: 18 }, (_, i) => {
                const k = Math.max(0, f - CHECK) / 30;
                const a = (i / 18) * Math.PI * 2;
                const r = 40 + k * (150 + (i % 3) * 40);
                return (
                  <div key={i} style={{ position: 'absolute', left: SCR_W / 2 + Math.cos(a) * r - 5, top: 290 + Math.sin(a) * r * 0.9 + k * k * 60, width: 10, height: i % 2 ? 10 : 16, borderRadius: 3, background: [t.primary, '#F5B83D', '#0E0E10'][i % 3], opacity: f > CHECK ? Math.max(0, 1 - k * 0.9) : 0, transform: `rotate(${a * 57 + k * 200}deg)` }} />
                );
              })}
              <div style={{ width: 150, height: 150, borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`, boxShadow: `0 20px 40px -12px ${t.primary}` }}>
                <Check size={80} color="#fff" strokeWidth={3.2} />
              </div>
              <div style={{ marginTop: 38, fontSize: 48, fontWeight: 500, letterSpacing: -0.6, opacity: reveal(f, CHECK + 4, 14) }}>Booked!</div>
              <div style={{ marginTop: 6, fontSize: 24, color: GRAY, opacity: reveal(f, CHECK + 8, 14) }}>
                See you in <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 30, color: INK }}>{city}</span>
              </div>
              <div style={{ marginTop: 40, width: SCR_W - 56, display: 'flex', alignItems: 'center', gap: 16, padding: 14, borderRadius: 22, background: '#fff', boxShadow: '0 2px 14px rgba(0,0,0,0.07)', opacity: reveal(f, CHECK + 12, 16), transform: `translateY(${(1 - reveal(f, CHECK + 12, 16)) * 20}px)` }}>
                <Img src={pick.photos[0]?.url} style={{ width: 86, height: 86, borderRadius: 16, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 19, lineHeight: 1.25, height: 48, overflow: 'hidden' }}>{pick.name || pick.title}</div>
                  <div style={{ fontSize: 16, color: GRAY, marginTop: 4 }}>{pick.city} · {money(pick.price_from_usd)} night</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </PhoneMockup>

      {/* finger */}
      <div style={{ position: 'absolute', left: fx, top: fy, opacity: fingerOn, pointerEvents: 'none' }}>
        {[r1, r2].map((r, i) =>
          r >= 0 ? (
            <div key={i} style={{ position: 'absolute', left: -8 - r * 40, top: -8 - r * 40, width: 60 + r * 80, height: 60 + r * 80, borderRadius: 999, border: `4px solid ${t.primary}`, opacity: 1 - r }} />
          ) : null,
        )}
        <div style={{ transform: `translate(${10 - press * 8}px, ${14 - press * 10}px) rotate(-12deg) scale(${1 - press * 0.1})`, filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.35))' }}>
          <Pointer size={92} color="#14141A" fill="#FFFFFF" strokeWidth={1.6} />
        </div>
      </div>

      {/* app row */}
      <div style={{
        position: 'absolute', top: PH_Y + PH_H + 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22,
        transform: `translateY(${(1 - ctaIn) * 50}px)`, opacity: Math.min(1, ctaIn * 1.3),
      }}>
        <div style={{ position: 'relative', transform: `translateY(${iconLift}px) scale(${iconScale}) rotate(${Math.sin(f / 9) * 2 * iconBounce}deg)` }}>
          <AppIcon size={156} primary={t.primary} />
          <div style={{ position: 'absolute', top: -10, right: -10, minWidth: 48, height: 48, padding: '0 12px', borderRadius: 999, background: t.primary, color: '#fff', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, transform: `scale(${badge})`, boxShadow: '0 6px 14px rgba(0,0,0,0.2)' }}>
            1
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: t.ink, letterSpacing: -0.3 }}>
            Download the <span style={{ color: t.primary }}>Homesta</span> app
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: 12, overflow: 'hidden', borderRadius: 12 }}>
            <AppStoreBadge height={62} />
            <GooglePlayBadge height={62} />
            {f > 280 && (
              <div style={{ position: 'absolute', top: -20, bottom: -20, width: 70, left: -100 + (shine / 22) * 560, background: 'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)', transform: 'skewX(-18deg)', opacity: shine < 22 ? 1 : 0 }} />
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
