/**
 * S2 · City Escape v2  (story, 9:16 video, 12s @ 30fps) — "get the app" motivation story
 * Target: city. Data: city name + image(s) + 3–6 units (photos, name, type, specs, price) + brand.
 * The phone plays a real mini app journey: browse stays → tap one → photo gallery & details →
 * tap "Book now" → "Booked!". The headline rolls with it (Explore → Find → Book your stay in <City>),
 * the side photo follows the stay in focus, and the app icon bounces with a notification badge.
 * Playfair italic only for the city name.
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArrowLeft, Bath, BedDouble, Bookmark, Check, Heart, MapPin, Pointer, Search, SlidersHorizontal, Snowflake, Users, Utensils, Wifi } from 'lucide-react';
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

/* ── phone geometry ── */
const PH_W = 560;
const PH_H = 1080;
const PH_X = (1080 - PH_W) / 2;
const PH_Y = 470;
const SCR = phoneScreen(PH_W, PH_H);
const SCR_W = SCR.w;
const SCR_H = SCR.h;
const IN = PHONE_FRAME + PHONE_BEZEL; // screen offset inside the phone

/* ── list cards ── */
const PAD = 22;
const CARD_W = SCR_W - PAD * 2;
const IMG_H = 280;
const CARD_H = IMG_H + 132;
const CARD_GAP = 22;
const LIST_TOP = 318;

/* ── story beats ── */
const SCROLL_A = 46;
const SCROLL_B = 116;
const TAP1 = 128; // tap the stay card
const PUSH = 134; // detail screen slides in
const SWIPE = [176, 206]; // gallery swipes
const TAP2 = 238; // tap "Book now"
const SHEET = 244; // "Booked!" sheet
const CHECK = 254;
const BADGE = 264; // notification badge on the app icon

const niceName = (s: string) => {
  const t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  return t.length > 44 ? t.slice(0, 43).trimEnd() + '…' : t;
};
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 5 };

const UnitCard: React.FC<{ u: UnitProps; t: ReturnType<typeof theme>; saved: boolean; press: number }> = ({ u, t, saved, press }) => {
  const s = u.specs ?? {};
  return (
    <div style={{ width: CARD_W, height: CARD_H, borderRadius: 30, background: '#FFFFFF', border: '1.5px solid #EFEEEA', boxShadow: '0 12px 30px rgba(14,14,16,0.07)', overflow: 'hidden', transform: `scale(${1 - 0.03 * press})` }}>
      <div style={{ position: 'relative', width: CARD_W, height: IMG_H }}>
        <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 14, left: 14, height: 38, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', fontSize: 20, fontWeight: 600, color: t.ink }}>
          {u.type}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, width: 46, height: 46, borderRadius: 999, background: saved ? t.primary : 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bookmark size={22} color={saved ? '#fff' : t.ink} fill={saved ? '#fff' : 'none'} strokeWidth={2} />
        </div>
      </div>
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.2, color: t.ink, height: 56, overflow: 'hidden' }}>{niceName(u.name || u.title)}</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, fontSize: 20, color: t.mute }}>
          {s.guests ? <span style={row}><Users size={18} color={t.primary} />{s.guests}</span> : null}
          {s.bedrooms ? <span style={row}><BedDouble size={18} color={t.primary} />{s.bedrooms}</span> : null}
          {s.baths ? <span style={row}><Bath size={18} color={t.primary} />{s.baths}</span> : null}
          <div style={{ flex: 1 }} />
          {u.price_from_usd ? (
            <span style={{ color: t.ink }}>
              <b style={{ fontSize: 22 }}>${Math.round(u.price_from_usd)}</b> / night
            </span>
          ) : null}
        </div>
      </div>
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
  const scroll = su * (CARD_H + CARD_GAP);
  const press1 = interpolate(f, [TAP1 - 3, TAP1, TAP1 + 5], [0, 1, 0], cl);

  /* ── screens ── */
  const push = spring({ frame: f - PUSH, fps, config: { damping: 22, stiffness: 140 } });
  const sheet = spring({ frame: f - SHEET, fps, config: { damping: 20, stiffness: 130 } });
  const check = spring({ frame: f - CHECK, fps, config: { damping: 10, stiffness: 170 } });
  const gal = (pick?.photos ?? []).slice(0, 3);
  const gi = interpolate(f, [SWIPE[0], SWIPE[0] + 14, SWIPE[1], SWIPE[1] + 14], [0, 1, 1, 2], { easing: easeInOut, ...cl });
  const gx = Math.min(gi, Math.max(0, gal.length - 1));
  const press2 = interpolate(f, [TAP2 - 3, TAP2, TAP2 + 5], [0, 1, 0], cl);

  /* ── finger (global coords) ── */
  const cardY = PH_Y + IN + LIST_TOP + CARD_H / 2 - 30;
  const btnX = PH_X + IN + SCR_W - 150;
  const btnY = PH_Y + IN + SCR_H - 108;
  const fx = interpolate(f, [100, TAP1 - 4, TAP1 + 30, TAP2 - 6], [720, 520, 520, btnX], { easing: easeInOut, ...cl });
  const fy = interpolate(f, [100, TAP1 - 4, TAP1 + 30, TAP2 - 6], [1300, cardY, cardY + 220, btnY], { easing: easeInOut, ...cl });
  const fingerOn = interpolate(f, [100, 110, TAP2 + 10, TAP2 + 22], [0, 1, 1, 0], cl);
  const ring = (at: number) => {
    const k = (f - at) / 16;
    return k >= 0 && k <= 1 ? k : -1;
  };
  const r1 = ring(TAP1);
  const r2 = ring(TAP2);
  const press = Math.max(press1, press2);

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

      {/* phone */}
      <PhoneMockup w={PH_W} h={PH_H} ink={t.ink} screenBg="#FFFFFF"
        style={{ left: PH_X, top: PH_Y, transform: `translateY(${(1 - phoneIn) * 900}px) rotate(${(1 - phoneIn) * 6}deg)` }}>

        {/* ── 1. home / list ── */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-push * SCR_W * 0.28}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: SCR_W, transform: `translateY(${-scroll}px)` }}>
            <div style={{ position: 'absolute', top: 96, left: PAD, right: PAD, display: 'flex', alignItems: 'center' }}>
              <HorizontalLogo b={p.brand} height={30} logoReady={p.logoReady} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 52, height: 52, borderRadius: 999, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
                {city.slice(0, 1)}
              </div>
            </div>
            <div style={{ position: 'absolute', top: 172, left: PAD, right: PAD, height: 64, borderRadius: 999, background: '#F4F4F2', display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px 0 22px', fontSize: 20, color: t.mute }}>
              <Search size={22} color={t.ink} />
              Stays in <b style={{ color: t.ink, fontWeight: 600 }}>{city}</b>
              <div style={{ flex: 1 }} />
              <div style={{ width: 46, height: 46, borderRadius: 999, background: t.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SlidersHorizontal size={20} color="#fff" />
              </div>
            </div>
            <div style={{ position: 'absolute', top: 262, left: PAD, right: PAD, display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>Top stays</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 20, color: t.mute }}>{n} stays</span>
            </div>
            {units.map((x, i) => {
              const e = spring({ frame: f - 30 - i * 5, fps, config: { damping: 18, stiffness: 120 } });
              return (
                <div key={x.id} style={{ position: 'absolute', left: PAD, top: LIST_TOP + i * (CARD_H + CARD_GAP), transform: `translateY(${(1 - e) * 120}px)`, opacity: e }}>
                  <UnitCard u={x} t={t} saved={i < Math.floor(su + 0.2)} press={i === D ? press1 : 0} />
                </div>
              );
            })}
          </div>
          <AbsoluteFill style={{ background: '#0E0E10', opacity: push * 0.25 }} />
        </div>

        {/* ── 2. stay details ── */}
        {pick && f >= PUSH - 1 && (
          <div style={{ position: 'absolute', inset: 0, background: '#fff', transform: `translateX(${(1 - push) * SCR_W}px)`, boxShadow: '-20px 0 40px rgba(0,0,0,0.12)' }}>
            {/* gallery */}
            <div style={{ position: 'absolute', top: 78, left: 0, width: SCR_W, height: 540, overflow: 'hidden' }}>
              <div style={{ display: 'flex', width: SCR_W * Math.max(1, gal.length), height: '100%', transform: `translateX(${-gx * SCR_W}px)` }}>
                {gal.map((g, i) => (
                  <Img key={i} src={g.url} style={{ width: SCR_W, height: '100%', objectFit: 'cover', flexShrink: 0, transform: `scale(${1.04 + 0.04 * Math.sin((f + i * 20) / 40)})` }} />
                ))}
              </div>
              <div style={{ position: 'absolute', top: 18, left: 18, width: 52, height: 52, borderRadius: 999, background: 'rgba(255,255,255,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={24} color={t.ink} />
              </div>
              <div style={{ position: 'absolute', top: 18, right: 18, width: 52, height: 52, borderRadius: 999, background: 'rgba(255,255,255,0.94)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={24} color={f > 160 ? t.primary : t.ink} fill={f > 160 ? t.primary : 'none'} style={{ transform: `scale(${1 + 0.3 * interpolate(f, [160, 166, 174], [0, 1, 0], cl)})` }} />
              </div>
              <div style={{ position: 'absolute', bottom: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8 }}>
                {gal.map((_, i) => (
                  <div key={i} style={{ width: Math.abs(gx - i) < 0.5 ? 26 : 9, height: 9, borderRadius: 9, background: '#fff', opacity: Math.abs(gx - i) < 0.5 ? 1 : 0.6 }} />
                ))}
              </div>
            </div>
            {/* sheet */}
            <div style={{ position: 'absolute', top: 586, left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '32px 32px 0 0', padding: '28px 26px 0' }}>
              <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.18, letterSpacing: -0.4, height: 68, overflow: 'hidden' }}>{niceName(pick.name || pick.title)}</div>
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 19, color: t.mute }}>
                <MapPin size={18} color={t.primary} />
                {[pick.district, pick.city].filter(Boolean).join(', ')}
              </div>
              <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                {[
                  s.guests ? { i: <Users size={18} color={t.primary} />, l: `${s.guests} guests` } : null,
                  s.bedrooms ? { i: <BedDouble size={18} color={t.primary} />, l: `${s.bedrooms} bedroom${Number(s.bedrooms) > 1 ? 's' : ''}` } : null,
                  s.baths ? { i: <Bath size={18} color={t.primary} />, l: `${s.baths} bath${Number(s.baths) > 1 ? 's' : ''}` } : null,
                ].filter(Boolean).map((c, i) => {
                  const e = spring({ frame: f - PUSH - 10 - i * 4, fps, config: { damping: 16, stiffness: 160 } });
                  return (
                    <div key={i} style={{ height: 46, padding: '0 14px', borderRadius: 999, border: '1.5px solid #EFEEEA', display: 'flex', alignItems: 'center', gap: 7, fontSize: 18, fontWeight: 500, transform: `translateY(${(1 - e) * 20}px)`, opacity: e }}>
                      {c!.i}{c!.l}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 18, display: 'flex', gap: 22, fontSize: 18, color: t.mute }}>
                {pick.amenities?.includes('wifi') && <span style={row}><Wifi size={20} color={t.ink} /> Wi-Fi</span>}
                {pick.amenities?.includes('air_conditioning') && <span style={row}><Snowflake size={20} color={t.ink} /> A/C</span>}
                {pick.amenities?.includes('kitchen') && <span style={row}><Utensils size={20} color={t.ink} /> Kitchen</span>}
              </div>
            </div>
            {/* booking bar */}
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 150, borderTop: '1.5px solid #EFEEEA', background: '#fff', display: 'flex', alignItems: 'center', padding: '0 26px 26px' }}>
              <div>
                <div style={{ fontSize: 17, color: t.mute }}>From</div>
                <div style={{ fontSize: 30, fontWeight: 700 }}>
                  ${Math.round(pick.price_from_usd ?? 0)}<span style={{ fontSize: 18, fontWeight: 500, color: t.mute }}> / night</span>
                </div>
              </div>
              <div style={{ flex: 1 }} />
              <div style={{ height: 66, padding: '0 34px', borderRadius: 999, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 700, transform: `scale(${1 - 0.06 * press2})`, boxShadow: `0 10px 24px -8px ${t.primary}` }}>
                Book now
              </div>
            </div>
          </div>
        )}

        {/* ── 3. booked ── */}
        {pick && f >= SHEET - 1 && (
          <div style={{ position: 'absolute', inset: 0, background: '#fff', transform: `translateY(${(1 - sheet) * SCR_H}px)`, borderRadius: '36px 36px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 210 }}>
            {/* confetti */}
            {Array.from({ length: 18 }, (_, i) => {
              const k = Math.max(0, f - CHECK) / 30;
              const a = (i / 18) * Math.PI * 2;
              const r = 40 + k * (150 + (i % 3) * 40);
              return (
                <div key={i} style={{ position: 'absolute', left: SCR_W / 2 + Math.cos(a) * r - 5, top: 290 + Math.sin(a) * r * 0.9 + k * k * 60, width: 10, height: i % 2 ? 10 : 16, borderRadius: 3, background: [t.primary, '#F5B83D', '#0E0E10'][i % 3], opacity: f > CHECK ? Math.max(0, 1 - k * 0.9) : 0, transform: `rotate(${a * 57 + k * 200}deg)` }} />
              );
            })}
            <div style={{ width: 160, height: 160, borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`, boxShadow: `0 20px 40px -12px ${t.primary}` }}>
              <Check size={86} color="#fff" strokeWidth={3.2} />
            </div>
            <div style={{ marginTop: 40, fontSize: 52, fontWeight: 800, letterSpacing: -1.2, opacity: reveal(f, CHECK + 4, 14) }}>Booked!</div>
            <div style={{ marginTop: 6, fontSize: 26, color: t.mute, opacity: reveal(f, CHECK + 8, 14) }}>
              See you in <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 32, color: t.ink }}>{city}</span>
            </div>
            <div style={{ marginTop: 44, width: SCR_W - 60, display: 'flex', alignItems: 'center', gap: 16, padding: 14, borderRadius: 24, border: '1.5px solid #EFEEEA', opacity: reveal(f, CHECK + 12, 16), transform: `translateY(${(1 - reveal(f, CHECK + 12, 16)) * 20}px)` }}>
              <Img src={pick.photos[0]?.url} style={{ width: 92, height: 92, borderRadius: 16, objectFit: 'cover' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.2, height: 50, overflow: 'hidden' }}>{niceName(pick.name || pick.title)}</div>
                <div style={{ fontSize: 17, color: t.mute, marginTop: 4 }}>{pick.district || pick.city}</div>
              </div>
            </div>
          </div>
        )}
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
