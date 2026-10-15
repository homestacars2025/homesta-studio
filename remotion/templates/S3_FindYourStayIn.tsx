/**
 * S3 · Find Your Stay In  (story, 9:16 video, 16s @ 30fps)
 * Target: district. Data: district name + one unit (photos, specs, amenities) + brand.
 */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { asset } from '../shared/assets';
import type { StudioProps } from '../shared/types';
import { StackedLogo, pickAmenities, plural, theme } from '../shared/brand';

export const S3_FRAMES = 300; // 10s

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const reveal = (f: number, start: number, dur = 24) =>
  interpolate(f, [start, start + dur], [0, 1], { easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ── carousel timing ── */
const CARD_W = 540;
const CARD_H = 620;
const START = 32;
const END_HOLD = 24; // frames the last photo stays before the video ends
/**
 * Each photo passes exactly once and the strip never stops or jerks:
 * position = u - A·sin(2πu)/2π  → speed swings smoothly between slow (on a photo) and fast (between photos).
 */
const GLIDE = 0.86; // 0 = constant speed, →1 = longer pause on each photo
const carouselPos = (f: number, n: number, total: number) => {
  if (n <= 1) return 0;
  const step = (total - START - END_HOLD) / (n - 1);
  const u = Math.min(n - 1, Math.max(0, f - START) / step);
  return u - (GLIDE * Math.sin(2 * Math.PI * u)) / (2 * Math.PI);
};

/* ── Background: static brand pattern (public/brand/pattern-9x16.png).
 * The white veil is thicker in the middle and thinner at the edges (eased radial mask),
 * so the icons almost vanish behind the content and show softly around the frame. */
export const PATTERN_OPACITY = 0.06; // strength at the very edges
const PATTERN_MASK =
  'radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.10) 22%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.34) 56%, rgba(0,0,0,0.56) 70%, rgba(0,0,0,0.80) 84%, #000 100%)';
const Background: React.FC = () => (
  <AbsoluteFill style={{ background: '#FFFFFF' }}>
    <Img
      src={asset('brand/pattern-9x16.png')}
      style={{ width: '100%', height: '100%', opacity: PATTERN_OPACITY, WebkitMaskImage: PATTERN_MASK, maskImage: PATTERN_MASK }}
    />
  </AbsoluteFill>
);

const Carousel: React.FC<{ f: number; photos: string[] }> = ({ f, photos }) => {
  const n = photos.length;
  const pos = carouselPos(f, n, S3_FRAMES);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 640, height: CARD_H, perspective: 2200 }}>
      {photos.map((src, i) => {
        const d = i - pos; // no wrap-around → no photo shows twice
        const ad = Math.abs(d);
        if (ad > 2.2) return null;
        const scale = 1 - 0.2 * Math.min(ad, 1.6);
        const op = interpolate(ad, [0, 1.2, 2.1], [1, 0.92, 0], { extrapolateRight: 'clamp' });
        const dim = interpolate(ad, [0, 1], [0, 0.28], { extrapolateRight: 'clamp' });
        const e = spring({ frame: f - 14 - Math.round(ad) * 4, fps: 30, config: { damping: 200, mass: 0.9 } });
        const kb = 1.1 - 0.07 * (f / S3_FRAMES); // one continuous slow zoom, never jumps
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: 540 - CARD_W / 2, top: 0, width: CARD_W, height: CARD_H,
              transform: `translateX(${d * 570}px) translateY(${(1 - e) * 260}px) scale(${scale}) rotateY(${-d * 6}deg)`,
              zIndex: Math.round(100 - ad * 10), opacity: op * e, borderRadius: 56, overflow: 'hidden',
              boxShadow: `0 ${40 - ad * 14}px ${90 - ad * 30}px rgba(14,14,16,${0.22 - ad * 0.07})`, background: '#ddd',
            }}
          >
            <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})` }} />
            <AbsoluteFill style={{ background: `rgba(250,250,247,${dim})` }} />
            <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.25) 100%)' }} />
          </div>
        );
      })}
    </div>
  );
};

export const S3_FindYourStayIn: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const u = p.unit!;
  const districtName = p.district?.name ?? u.district ?? '';
  const photos = u.photos.slice(0, 6).map((x) => x.url);

  const baseCta = (p.cta ?? p.brand.default_cta ?? 'Explore stays').trim();
  const cta = / in /i.test(baseCta) ? baseCta : `${baseCta} in ${districtName}`;
  const amen = pickAmenities(u.amenities, 6);

  const logo = reveal(f, 0, 18);
  const eyebrow = reveal(f, 4, 16);
  const title = reveal(f, 8, 22);
  const pill = spring({ frame: f - 18, fps, config: { damping: 14, stiffness: 140 } });
  const facts = reveal(f, 40, 18);
  const ctaIn = spring({ frame: f - 62, fps, config: { damping: 16, stiffness: 120 } });
  const out = interpolate(f, [durationInFrames - 10, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const shine = ((f - 80) % 70) / 70;
  const arrow = Math.sin(f / 7) * 6;

  // long names shrink to fit
  const titleSize = districtName.length > 11 ? 112 : districtName.length > 8 ? 126 : 140;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink, opacity: out }}>
      <Background />

      {/* logo */}
      <div style={{ position: 'absolute', top: 168, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - logo) * 12}px)` }}>
        <StackedLogo b={p.brand} width={160} logoReady={p.logoReady} progress={logo} />
      </div>

      {/* title */}
      <div style={{ position: 'absolute', top: 318, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: t.mute, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 18}px)` }}>
          Find your stay in
        </div>
        <div style={{ overflow: 'hidden', height: 178, marginTop: 2, paddingTop: 4 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: titleSize, lineHeight: '168px', letterSpacing: -2, transform: `translateY(${(1 - title) * 200}px)` }}>
            {districtName}
          </div>
        </div>
      </div>

      {/* type pill */}
      <div style={{ position: 'absolute', top: 548, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          padding: '12px 34px', borderRadius: 999, background: t.primary, color: '#fff', fontSize: 30, fontWeight: 600,
          letterSpacing: 2, textTransform: 'uppercase', transform: `scale(${0.6 + 0.4 * pill})`, opacity: Math.min(1, pill * 1.4),
          boxShadow: '0 10px 30px rgba(229,40,81,0.28)',
        }}>
          {u.type}
        </div>
      </div>

      <Carousel f={f} photos={photos} />

      {/* facts */}
      <div style={{ position: 'absolute', top: 1290, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, fontSize: 30, fontWeight: 500, opacity: facts, transform: `translateY(${(1 - facts) * 16}px)` }}>
        {u.specs.guests ? <span>{plural(u.specs.guests, 'guest', 'guests')}</span> : null}
        {u.specs.bedrooms ? <><span style={{ color: t.primary }}>•</span><span>{plural(u.specs.bedrooms, 'bedroom', 'bedrooms')}</span></> : null}
        {u.specs.baths ? <><span style={{ color: t.primary }}>•</span><span>{plural(u.specs.baths, 'bath', 'baths')}</span></> : null}
      </div>

      {/* amenities */}
      <div style={{ position: 'absolute', top: 1346, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
        {amen.map((a, i) => {
          const s = spring({ frame: f - 46 - i * 3, fps, config: { damping: 13, stiffness: 160 } });
          const Icon = a.icon;
          return (
            <div key={a.key} style={{
              width: 132, height: 112, borderRadius: 28, background: '#FFFFFF', border: `2px solid ${t.rule}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              transform: `translateY(${(1 - s) * 30}px) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.5),
              boxShadow: '0 8px 22px rgba(14,14,16,0.06)',
            }}>
              <Icon size={44} color={t.primary} strokeWidth={1.8} />
              <div style={{ fontSize: a.label.length > 9 ? 17 : 22, fontWeight: 500 }}>{a.label}</div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', top: 1484, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', height: 100, padding: '0 18px 0 46px', borderRadius: 999, background: t.ink, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 22, fontSize: cta.length > 26 ? 34 : 38, fontWeight: 600,
          transform: `translateY(${(1 - ctaIn) * 60}px) scale(${0.9 + 0.1 * ctaIn})`, opacity: Math.min(1, ctaIn * 1.3),
          boxShadow: '0 18px 40px rgba(14,14,16,0.25)',
        }}>
          {cta}
          <div style={{ width: 64, height: 64, borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${arrow}px)` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
          {f > 80 && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: `${-20 + shine * 140}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))', transform: 'skewX(-20deg)' }} />
          )}
        </div>
      </div>

      {/* site */}
      <div style={{ position: 'absolute', top: 1608, left: 0, right: 0, textAlign: 'center', fontSize: 28, fontWeight: 500, color: t.mute, letterSpacing: 1, opacity: reveal(f, 70, 16) }}>
        <span style={{ color: t.ink, fontWeight: 600 }}>{t.site.replace(/\.com$/, '')}</span>.com
      </div>
    </AbsoluteFill>
  );
};
