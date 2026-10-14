/**
 * S2 · City Escape  (story, 9:16 video, 10s @ 30fps)
 * Target: city. Data: city name + city image(s) + 3–6 units (cover, name, type, specs, price) + brand.
 * Idea: "Explore stays in <City>" above a phone showing the Homesta app; the stay cards scroll inside
 * the phone, framed by tilted city photos on the left and right.
 */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Bath, BedDouble, Bookmark, Search, SlidersHorizontal, Users } from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { BrandBackground } from '../shared/background';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';

export const S2_FRAMES = 300; // 10s

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const reveal = (f: number, start: number, dur = 20) =>
  interpolate(f, [start, start + dur], [0, 1], { easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ── phone geometry ── */
const PH_W = 560;
const PH_H = 1080;
const PH_X = (1080 - PH_W) / 2;
const PH_Y = 470;
const BEZEL = 16;
const SCR_W = PH_W - BEZEL * 2;
const SCR_H = PH_H - BEZEL * 2;

/* ── card geometry (inside the screen) ── */
const PAD = 22;
const CARD_W = SCR_W - PAD * 2;
const IMG_H = 280;
const CARD_H = IMG_H + 132;
const CARD_GAP = 22;
const LIST_TOP = 318; // where the first card starts inside the screen

/** ALL-CAPS listing names → Title Case; trim very long names */
const niceName = (s: string) => {
  const t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  return t.length > 44 ? t.slice(0, 43).trimEnd() + '…' : t;
};

const UnitCard: React.FC<{ u: UnitProps; t: ReturnType<typeof theme>; saved: boolean }> = ({ u, t, saved }) => {
  const s = u.specs ?? {};
  return (
    <div style={{ width: CARD_W, height: CARD_H, borderRadius: 30, background: '#FFFFFF', boxShadow: '0 10px 28px rgba(14,14,16,0.08)', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: CARD_W, height: IMG_H }}>
        <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: 14, left: 14, height: 38, padding: '0 16px', borderRadius: 999, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', fontSize: 18, fontWeight: 600, color: t.ink }}>
          {u.type}
        </div>
        <div style={{ position: 'absolute', top: 12, right: 12, width: 46, height: 46, borderRadius: 999, background: saved ? t.primary : 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bookmark size={22} color={saved ? '#fff' : t.ink} fill={saved ? '#fff' : 'none'} strokeWidth={2} />
        </div>
      </div>
      <div style={{ padding: '14px 18px 0' }}>
        <div style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.2, color: t.ink, height: 56, overflow: 'hidden' }}>{niceName(u.name || u.title)}</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, fontSize: 18, color: t.mute }}>
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
/** a 3D brand prop image (transparent PNG) */
const Prop: React.FC<{ src: string; x: number; y: number; w: number; rot: number; style?: React.CSSProperties }> = ({ src, x, y, w, rot, style }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, filter: 'drop-shadow(0 18px 22px rgba(14,14,16,0.22))', ...style }}>
    <Img src={staticFile(src)} style={{ width: '100%', transform: `rotate(${rot}deg)` }} />
  </div>
);
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 5 };

/** Tilted photo with a white frame (left / right of the phone) */
const SidePhoto: React.FC<{ src?: string; x: number; y: number; w: number; h: number; rot: number; p: number; from: number }> = ({ src, x, y, w, h, rot, p, from }) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, padding: 12, background: '#fff', borderRadius: 34,
    boxShadow: '0 30px 60px rgba(14,14,16,0.18)',
    transform: `translateX(${(1 - p) * from}px) rotate(${rot * p + (1 - p) * rot * 2.2}deg) scale(${0.85 + 0.15 * p})`, opacity: p,
  }}>
    <div style={{ width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', background: '#ddd' }}>
      {src ? <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
    </div>
  </div>
);

export const S2_CityEscape: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const city = p.city?.name ?? p.units?.[0]?.city ?? '';
  const units = (p.units ?? []).slice(0, 6);
  const imgs = ((p.city as any)?.images as string[] | undefined) ?? [];
  const leftImg = imgs[0] ?? p.city?.image ?? units[0]?.photos[0]?.url;
  const rightImg = imgs[1] ?? units[1]?.photos[1]?.url ?? units[0]?.photos[1]?.url ?? leftImg;

  /* ── timeline ── */
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
  const ctaIn = spring({ frame: f - 60, fps, config: { damping: 16, stiffness: 120 } });
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });

  // list scroll: glide card by card (slow on each card, smooth between), never stops abruptly
  const SCROLL_START = 84; // show the app header first, then scroll
  const SCROLL_END = durationInFrames - 26;
  const n = units.length;
  const maxStep = Math.max(0, n - 1);
  const u = interpolate(f, [SCROLL_START, SCROLL_END], [0, maxStep], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glide = u - (0.8 * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
  const scroll = glide * (CARD_H + CARD_GAP) + (u > 0 ? 0 : 0);
  const headerHide = interpolate(scroll, [0, 220], [0, 1], { extrapolateRight: 'clamp' });
  const active = Math.min(n - 1, Math.round(glide));
  // a little "save" tap on each card while it is centred
  const savedUpTo = Math.floor(glide + 0.15);

  const titleSize = city.length > 10 ? 132 : city.length > 7 ? 150 : 168;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink, opacity: out }}>
      <BrandBackground opacity={0} />

      {/* dashed travel path behind everything */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path
          d="M 60 1520 C 10 1240, 120 1020, 230 900 M 850 860 C 980 760, 1060 600, 980 470"
          fill="none" stroke={t.primary} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round"
          strokeDasharray="18 22" strokeDashoffset={-f * 1.2}
          style={{ clipPath: `inset(0 0 ${100 - path * 100}% 0)` }}
        />
      </svg>

      {/* headline */}
      <div style={{ position: 'absolute', top: 200, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: t.mute, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 16}px)` }}>
          Explore stays in
        </div>
        <div style={{ overflow: 'hidden', height: 190, paddingTop: 4 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: titleSize, lineHeight: '180px', letterSpacing: -2, transform: `translateY(${(1 - title) * 190}px)` }}>
            {city}
          </div>
        </div>
      </div>

      {/* side photos */}
      <SidePhoto src={leftImg} x={14} y={700} w={330} h={420} rot={-9} p={leftIn} from={-260} />
      <SidePhoto src={rightImg} x={740} y={1000} w={330} h={400} rot={8} p={rightIn} from={260} />

      {/* 3D props (public/brand/3d) */}
      <Prop src="brand/3d/pin.png" x={36} y={560} w={150} rot={-10 + Math.sin(f / 18) * 2}
        style={{ transform: `translateY(${(1 - pinDrop) * -160 + Math.sin(f / 16) * 6}px) scale(${0.6 + 0.4 * pinDrop})`, opacity: Math.min(1, pinDrop * 2) }} />
      <Prop src="brand/3d/plane.png" x={760} y={400} w={250} rot={-4}
        style={{ transform: `translate(${(1 - planeIn) * 420}px, ${(1 - planeIn) * -260 + Math.sin(f / 20) * 8}px) rotate(${(1 - planeIn) * 14}deg)`, opacity: planeIn }} />
      <Prop src="brand/3d/magnifier.png" x={808} y={880} w={230} rot={0}
        style={{ transform: `scale(${0.5 + 0.5 * magIn}) rotate(${(1 - magIn) * 40 + Math.sin(f / 22) * 3}deg)`, opacity: Math.min(1, magIn * 1.6) }} />
      <Prop src="brand/3d/paperclip.png" x={930} y={1280} w={110} rot={18}
        style={{ transform: `rotate(${18 + (1 - clipIn) * 30}deg) scale(${0.6 + 0.4 * clipIn})`, opacity: clipIn }} />

      {/* phone */}
      <div style={{
        position: 'absolute', left: PH_X, top: PH_Y, width: PH_W, height: PH_H, borderRadius: 86, background: '#111214',
        boxShadow: '0 50px 100px rgba(14,14,16,0.35), inset 0 0 0 3px #2a2b2f',
        transform: `translateY(${(1 - phoneIn) * 900}px) rotate(${(1 - phoneIn) * 6}deg)`,
      }}>
        <div style={{ position: 'absolute', left: BEZEL, top: BEZEL, width: SCR_W, height: SCR_H, borderRadius: 72, overflow: 'hidden', background: '#F6F5F2' }}>
          {/* scrolling content */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: SCR_W, transform: `translateY(${-scroll}px)` }}>
            {/* app header */}
            <div style={{ position: 'absolute', top: 96, left: PAD, right: PAD, display: 'flex', alignItems: 'center' }}>
              <HorizontalLogo b={p.brand} height={30} logoReady={p.logoReady} />
              <div style={{ flex: 1 }} />
              <div style={{ width: 52, height: 52, borderRadius: 999, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700 }}>
                {city.slice(0, 1)}
              </div>
            </div>
            {/* search */}
            <div style={{ position: 'absolute', top: 172, left: PAD, right: PAD, height: 64, borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '0 10px 0 22px', boxShadow: '0 6px 18px rgba(14,14,16,0.06)', fontSize: 20, color: t.mute }}>
              <Search size={22} color={t.ink} />
              Stays in <b style={{ color: t.ink, fontWeight: 600 }}>{city}</b>
              <div style={{ flex: 1 }} />
              <div style={{ width: 46, height: 46, borderRadius: 999, background: t.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SlidersHorizontal size={20} color="#fff" />
              </div>
            </div>
            {/* section title */}
            <div style={{ position: 'absolute', top: 262, left: PAD, right: PAD, display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 26, fontWeight: 700 }}>Top stays</span>
              <div style={{ flex: 1 }} />
              <span style={{ fontSize: 18, color: t.mute }}>{n} stays</span>
            </div>
            {/* cards */}
            {units.map((x, i) => {
              const e = spring({ frame: f - 30 - i * 5, fps, config: { damping: 18, stiffness: 120 } });
              const focus = 1 - Math.min(1, Math.abs(i - glide));
              return (
                <div key={x.id} style={{
                  position: 'absolute', left: PAD, top: LIST_TOP + i * (CARD_H + CARD_GAP),
                  transform: `translateY(${(1 - e) * 120}px) scale(${0.97 + 0.03 * focus})`, opacity: e,
                }}>
                  <UnitCard u={x} t={t} saved={i < savedUpTo || (i === active && f > SCROLL_END)} />
                </div>
              );
            })}
          </div>

          {/* status bar + island (fixed) */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 84, background: `rgba(246,245,242,${0.6 + 0.4 * headerHide})` }} />
          <div style={{ position: 'absolute', top: 28, left: 44, fontSize: 22, fontWeight: 600 }}>9:41</div>
          <div style={{ position: 'absolute', top: 20, left: SCR_W / 2 - 74, width: 148, height: 42, borderRadius: 999, background: '#111214' }} />
          <div style={{ position: 'absolute', top: 30, right: 40, display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 26, height: 14, borderRadius: 4, border: `2px solid ${t.ink}`, padding: 1 }}><div style={{ width: '80%', height: '100%', background: t.ink, borderRadius: 2 }} /></div>
          </div>
          {/* home indicator */}
          <div style={{ position: 'absolute', bottom: 14, left: SCR_W / 2 - 70, width: 140, height: 6, borderRadius: 9, background: 'rgba(14,14,16,0.5)' }} />
        </div>
      </div>

      {/* app row under the phone: big app icon + "Download the Homesta app" over the store badges */}
      <div style={{
        position: 'absolute', top: PH_Y + PH_H + 30, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22,
        transform: `translateY(${(1 - ctaIn) * 50}px)`, opacity: Math.min(1, ctaIn * 1.3),
      }}>
        <Img src={staticFile('brand/3d/app-icon.png')} style={{ width: 132, height: 132, filter: 'drop-shadow(0 12px 18px rgba(14,14,16,0.2))' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: t.ink, letterSpacing: -0.3 }}>
            Download the <span style={{ color: t.primary }}>Homesta</span> app
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <AppStoreBadge height={62} />
            <GooglePlayBadge height={62} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
