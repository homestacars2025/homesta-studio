/**
 * One-off · Homesta app teaser ("Coming soon") — story 9:16, 16s @ 30fps.
 * Keynote-style reveal on a dark stage: the arch draws itself → becomes the app icon →
 * a 3D-tilted phone plays real app screens → 3·2·1 countdown → "Coming soon" end card with store badges.
 * Screens come from real app screenshots (public/_preview/app-*.jpg, local only).
 */
import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { asset } from '../shared/assets';
import type { StudioProps } from '../shared/types';
import { Arch, theme } from '../shared/brand';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';
import { AppIcon, PhoneMockup, phoneScreen } from '../shared/device';

export const TEASER_FRAMES = 472;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const cl = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const rv = (f: number, a: number, dur = 18) => interpolate(f, [a, a + dur], [0, 1], { easing: easeOut, ...cl });
const win = (f: number, a: number, b: number, fade = 10) => interpolate(f, [a, a + fade, b - fade, b], [0, 1, 1, 0], cl);

const PH_W = 600;
const FR = 6;
const BZ = 6;
const SCR = phoneScreen(PH_W, 0, FR, BZ);
const SCR_H = Math.round((SCR.w * 2796) / 1290);
const PH_H = SCR_H + (PH_W - SCR.w);

const SCREENS: { src: string; at: number; scroll: number; bar: string }[] = [
  { src: 'app-home.jpg', at: 0, scroll: 120, bar: '#FFFFFF' },
  { src: 'app-list.jpg', at: 40, scroll: 220, bar: '#FFFFFF' },
  { src: 'app-offers.jpg', at: 80, scroll: 100, bar: '#FFFFFF' },
  { src: 'app-carsheet.jpg', at: 120, scroll: 0, bar: '#E0E0E0' },
  { src: 'app-cars.jpg', at: 160, scroll: 260, bar: '#FFFFFF' },
];
const LINES: [number, number, string][] = [
  [140, 170, 'Your whole trip, in one app'],
  [170, 210, 'Find your stay'],
  [210, 250, 'Book now, pay when you arrive'],
  [250, 290, 'Your car, ready on arrival'],
  [290, 336, 'Rent a car, delivered to you'],
];

const ICON_PAIRS: [string, string][] = [
  ['suitcase', 'beach'], ['cabin', 'blueprint'], ['bell', 'gift'], ['van', 'suitcase'], ['train', ''],
];
const END_ICONS: [string, number, number, number, number][] = [
  ['beach', 40, 150, 210, -8], ['suitcase', 850, 120, 170, 10], ['cabin', 20, 1390, 230, -6],
  ['gift', 860, 1360, 180, 8], ['bell', 120, 1660, 170, 4], ['train', 800, 1640, 190, -6],
];

const Words: React.FC<{ text: string; f: number; at: number; size: number; weight?: number; color?: string }> = ({ text, f, at, size, weight = 300, color = '#fff' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: `0 ${size * 0.26}px`, fontSize: size, fontWeight: weight, color, letterSpacing: -size * 0.02 }}>
    {text.split(' ').map((w, i) => {
      const k = rv(f, at + i * 3, 16);
      return <span key={i} style={{ display: 'inline-block', opacity: k, transform: `translateY(${(1 - k) * size * 0.4}px)`, filter: `blur(${(1 - k) * 8}px)` }}>{w}</span>;
    })}
  </div>
);

export const AppTeaser: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = theme(p.brand);
  const site = t.site.replace(/\.com$/, '');

  /* glow + grain stage */
  const pulse = 0.85 + 0.15 * Math.sin(f / 12);
  const glowY = interpolate(f, [0, 130, 150, 332, 352], [960, 860, 1150, 1150, 900], { easing: easeInOut, ...cl });

  /* A · arch draws */
  const draw = interpolate(f, [8, 52], [0, 1], { easing: easeInOut, ...cl });
  const archOut = interpolate(f, [72, 88], [1, 0], cl);
  const archScale = interpolate(f, [52, 88], [1, 0.62], { easing: easeInOut, ...cl });
  /* B · icon */
  const icon = spring({ frame: f - 74, fps, config: { damping: 13, stiffness: 120 } });
  const iconOut = interpolate(f, [124, 140], [1, 0], cl);
  const sweep = interpolate(f, [92, 116], [-1, 2], cl);
  /* C · phone */
  const phone = spring({ frame: f - 128, fps, config: { damping: 20, stiffness: 70 } });
  const phoneOut = interpolate(f, [334, 352], [0, 1], { easing: easeInOut, ...cl });
  const ry = interpolate(f, [128, 332], [-22, -6], cl) + 6 * phoneOut;
  const rx = interpolate(f, [128, 332], [14, 6], cl);
  const local = f - 128;
  /* D · end card */
  const end = spring({ frame: f - 404, fps, config: { damping: 14, stiffness: 110 } });
  const endSweep = interpolate(f, [430, 454], [-1, 2], cl);
  const fadeOut = interpolate(f, [462, 472], [1, 0], cl);

  return (
    <AbsoluteFill style={{ background: '#07070A', fontFamily: t.sans, color: '#fff', overflow: 'hidden', opacity: fadeOut }}>
      <Audio src={asset('sfx/teaser-app.wav')} volume={0.9} />
      {/* red stage light */}
      <div style={{ position: 'absolute', left: 540 - 700, top: glowY - 700, width: 1400, height: 1400, borderRadius: '50%', background: `radial-gradient(circle, ${t.primary}55 0%, ${t.primary}22 30%, rgba(0,0,0,0) 62%)`, opacity: pulse * interpolate(f, [0, 30], [0.3, 1], cl) }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)' }} />

      {/* A · the arch draws itself */}
      {f < 92 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 640, display: 'flex', justifyContent: 'center', opacity: archOut, transform: `scale(${archScale})`, filter: `drop-shadow(0 0 ${30 * draw}px ${t.primary})` }}>
          <Arch b={p.brand} size={360} progress={draw} />
        </div>
      )}
      {f < 92 && (
        <div style={{ position: 'absolute', left: 80, right: 80, top: 1180, opacity: archOut }}>
          <Words text="Something new is coming" f={f} at={30} size={62} />
        </div>
      )}

      {/* B · the app icon */}
      {f >= 70 && f < 142 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: iconOut }}>
          <div style={{ position: 'relative', transform: `scale(${0.4 + 0.6 * icon}) rotate(${(1 - icon) * -12}deg)`, opacity: Math.min(1, icon * 1.5), borderRadius: 72, boxShadow: `0 40px 120px -20px ${t.primary}AA` }}>
            <AppIcon size={320} primary={t.primary} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 72, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, bottom: -60, width: 110, left: sweep * 320, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: 'skewX(-18deg)' }} />
            </div>
          </div>
          <div style={{ marginTop: 70 }}>
            <Words text="The Homesta app" f={f} at={90} size={74} weight={600} />
          </div>
        </div>
      )}

      {/* C · phone with real app screens */}
      {f >= 126 && f < 356 && (
        <>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 250, height: 200 }}>
            {LINES.map(([a, b, l]) => (
              <div key={l} style={{ position: 'absolute', inset: 0, opacity: win(f, a, b, 8) }}>
                <Words text={l} f={f} at={a} size={66} weight={500} />
              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, perspective: 2200 }}>
            <div style={{
              position: 'absolute', left: (1080 - PH_W) / 2, top: 520, width: PH_W, height: PH_H,
              transform: `translateY(${(1 - phone) * 1300 + phoneOut * 1400}px) rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${(1 - phone) * 8}deg)`,
              transformStyle: 'preserve-3d',
            }}>
              <PhoneMockup w={PH_W} h={PH_H} frame={FR} bezel={BZ} barBg={[...SCREENS].reverse().find((x) => local >= x.at + 7)?.bar ?? '#FFFFFF'} style={{ left: 0, top: 0 }}>
                {SCREENS.map((s, i) => {
                  const next = SCREENS[i + 1];
                  const inK = i === 0 ? 1 : rv(local, s.at, 14);
                  const outK = next ? rv(local, next.at, 14) : 0;
                  const zoom = interpolate(local, [s.at, (next?.at ?? 210)], [1, 1.035], cl);
                  return (
                    <div key={s.src} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#fff', transform: `translateX(${(1 - inK) * SCR.w - outK * SCR.w * 0.3}px)`, boxShadow: i ? '-20px 0 40px rgba(0,0,0,0.15)' : undefined }}>
                      <Img src={`http://localhost:3000/public/_preview/${s.src}`} style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR_H, transform: `scale(${zoom})`, transformOrigin: '50% 30%' }} />
                    </div>
                  );
                })}
              </PhoneMockup>
              {/* rim light so the silhouette reads on the dark stage */}
              <div style={{ position: 'absolute', inset: -1, borderRadius: PH_W * 0.165, boxShadow: `0 0 0 1.5px rgba(255,255,255,0.35), 0 0 80px -10px ${t.primary}88, 0 60px 120px -30px rgba(0,0,0,0.9)`, pointerEvents: 'none' }} />
              {/* glass sheen following the tilt */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: PH_W * 0.165, background: `linear-gradient(${110 + ry * 2}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.10) 48%, rgba(255,255,255,0) 60%)`, pointerEvents: 'none' }} />
            </div>
          </div>
          {/* the app's own 3D icons, a pair per message */}
          {LINES.map(([la, lb], i) => {
            const [l, r] = ICON_PAIRS[i];
            const inL = spring({ frame: f - la, fps, config: { damping: 12, stiffness: 140 } });
            const inR = spring({ frame: f - la - 5, fps, config: { damping: 12, stiffness: 140 } });
            const out = interpolate(f, [lb - 6, lb + 2], [1, 0], cl);
            if (f < la - 1 || f > lb + 3) return null;
            const glow = 'drop-shadow(0 24px 30px rgba(0,0,0,0.55)) drop-shadow(0 0 22px rgba(255,255,255,0.10))';
            return (
              <React.Fragment key={i}>
                <Img src={asset(`brand/3d/app/${l}.png`)} style={{ position: 'absolute', left: 30, top: 1130 + Math.sin(f / 15) * 10, width: 250, filter: glow, opacity: out * Math.min(1, inL * 1.4), transform: `translateX(${(1 - inL) * -120}px) scale(${(0.5 + 0.5 * inL) * (0.85 + 0.15 * out)}) rotate(${(1 - inL) * -20 - 6}deg)` }} />
                {r && <Img src={asset(`brand/3d/app/${r}.png`)} style={{ position: 'absolute', left: 790, top: 600 + Math.sin(f / 18 + 1) * 10, width: 250, filter: glow, opacity: out * Math.min(1, inR * 1.4), transform: `translateX(${(1 - inR) * 120}px) scale(${(0.5 + 0.5 * inR) * (0.85 + 0.15 * out)}) rotate(${(1 - inR) * 20 + 6}deg)` }} />}
              </React.Fragment>
            );
          })}
        </>
      )}

      {/* E · countdown to launch */}
      {f >= 346 && f < 410 && (
        <div style={{ position: 'absolute', inset: 0, opacity: interpolate(f, [402, 410], [1, 0], cl) }}>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 470 }}>
            <Words text="The countdown to launch" f={f} at={348} size={64} weight={300} color="rgba(255,255,255,0.8)" />
            <div style={{ height: 10 }} />
            <Words text="has begun" f={f} at={356} size={96} weight={600} />
          </div>
          {[3, 2, 1].map((num, i) => {
            const at = 368 + i * 13;
            const on = f >= at && (i === 2 ? f < 410 : f < at + 13);
            if (!on) return null;
            const k = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 190 } });
            const ring = interpolate(f, [at, at + 13], [1, 0], cl);
            const C = 2 * Math.PI * 190;
            return (
              <div key={num} style={{ position: 'absolute', left: 540 - 210, top: 900, width: 420, height: 420 }}>
                <svg width={420} height={420} style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                  <circle cx={210} cy={210} r={190} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={6} />
                  <circle cx={210} cy={210} r={190} fill="none" stroke={t.primary} strokeWidth={8} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - ring)} style={{ filter: `drop-shadow(0 0 14px ${t.primary})` }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 250, fontWeight: 600, letterSpacing: -6, fontVariantNumeric: 'tabular-nums', transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.5) }}>{num}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* D · icons drift around the end card */}
      {false && END_ICONS.map(([n, x, y, w, r], i) => {
        const k = spring({ frame: f - 404 - i * 3, fps, config: { damping: 13, stiffness: 120 } });
        return (
          <Img key={n} src={asset(`brand/3d/app/${n}.png`)} style={{ position: 'absolute', left: x, top: y + Math.sin(f / (14 + i * 2) + i) * 12, width: w, opacity: Math.min(1, k * 1.4) * 0.95, filter: 'drop-shadow(0 20px 26px rgba(0,0,0,0.6))', transform: `scale(${0.4 + 0.6 * k}) rotate(${r + Math.sin(f / 30 + i) * 3}deg)` }} />
        );
      })}

      {/* D · coming soon */}
      {f >= 400 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', transform: `scale(${0.5 + 0.5 * end}) translateY(${(1 - end) * 120}px)`, opacity: Math.min(1, end * 1.4), borderRadius: 52, boxShadow: `0 40px 110px -16px ${t.primary}AA` }}>
            <AppIcon size={230} primary={t.primary} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 52, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -60, bottom: -60, width: 90, left: endSweep * 230, background: 'linear-gradient(100deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: 'skewX(-18deg)' }} />
            </div>
          </div>
          <div style={{ marginTop: 84, fontSize: 30, fontWeight: 500, letterSpacing: 12, textTransform: 'uppercase', color: t.primary, opacity: rv(f, 410, 14) }}>Stay tuned</div>
          <div style={{ marginTop: 18 }}>
            <Words text="Coming soon" f={f} at={414} size={150} weight={600} />
          </div>
          <div style={{ marginTop: 28, opacity: rv(f, 426, 16) }}>
            <Words text="Your whole trip, right in your pocket" f={f} at={426} size={40} weight={300} color="rgba(255,255,255,0.75)" />
          </div>
          <div style={{ marginTop: 76, display: 'flex', gap: 20, opacity: rv(f, 434, 16), transform: `translateY(${(1 - rv(f, 434, 16)) * 30}px)` }}>
            <AppStoreBadge height={74} caption="Coming soon to the" />
            <GooglePlayBadge height={74} caption="COMING SOON ON" />
          </div>
        </div>
      )}
      {f >= 400 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 300, textAlign: 'center', fontSize: 34, letterSpacing: 0.4, opacity: rv(f, 442, 16) * 0.85 }}>
          <span style={{ fontWeight: 500 }}>{site}</span><span style={{ fontWeight: 300 }}>.com</span>
        </div>
      )}
    </AbsoluteFill>
  );
};
