/**
 * S3 · Find Your Stay In  (story, 9:16 video, 16s @ 30fps)
 * Target: district. Data: district name + one unit (photos, specs, amenities) + brand.
 */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { StudioProps } from '../shared/types';
import { Arch, StackedLogo, pickAmenities, plural, theme } from '../shared/brand';

export const S3_FRAMES = 480;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const reveal = (f: number, start: number, dur = 24) =>
  interpolate(f, [start, start + dur], [0, 1], { easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ── carousel timing ── */
const CARD_W = 600;
const CARD_H = 740;
const HOLD = 54;
const MOVE = 24;
const START = 70;
const carouselPos = (f: number, n: number) => {
  const t = Math.max(0, f - START);
  const step = HOLD + MOVE;
  const k = Math.floor(t / step);
  const inStep = t - k * step;
  const frac = inStep < HOLD ? 0 : easeInOut((inStep - HOLD) / MOVE);
  return (k + frac) % n;
};

const Background: React.FC<{ f: number; p: StudioProps }> = ({ f, p }) => {
  const t = theme(p.brand);
  const arches = [
    { x: -140, y: 160, s: 520, r: -8, sp: 0.18 },
    { x: 760, y: 40, s: 420, r: 10, sp: -0.14 },
    { x: 820, y: 1380, s: 560, r: -12, sp: 0.12 },
    { x: -200, y: 1500, s: 460, r: 6, sp: -0.16 },
  ];
  return (
    <AbsoluteFill style={{ background: t.paper }}>
      <AbsoluteFill style={{ background: `radial-gradient(120% 60% at 50% 0%, #FFFFFF 0%, ${t.paper} 55%, ${t.paperWarm} 100%)` }} />
      {arches.map((a, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: a.x, top: a.y + Math.sin((f + i * 40) / 70) * 14,
            transform: `rotate(${a.r + f * a.sp * 0.05}deg)`, opacity: 0.035,
          }}
        >
          <Arch b={p.brand} size={a.s} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Carousel: React.FC<{ f: number; photos: string[] }> = ({ f, photos }) => {
  const n = photos.length;
  const pos = carouselPos(f, n);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 696, height: CARD_H, perspective: 2200 }}>
      {photos.map((src, i) => {
        let d = i - pos;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        const ad = Math.abs(d);
        if (ad > 2.2) return null;
        const scale = 1 - 0.2 * Math.min(ad, 1.6);
        const op = interpolate(ad, [0, 1.2, 2.1], [1, 0.92, 0], { extrapolateRight: 'clamp' });
        const dim = interpolate(ad, [0, 1], [0, 0.28], { extrapolateRight: 'clamp' });
        const e = spring({ frame: f - 34 - Math.round(ad) * 6, fps: 30, config: { damping: 200, mass: 0.9 } });
        const kb = 1.12 - 0.08 * ((f % 240) / 240);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: 540 - CARD_W / 2, top: 0, width: CARD_W, height: CARD_H,
              transform: `translateX(${d * 440}px) translateY(${(1 - e) * 260}px) scale(${scale}) rotateY(${-d * 6}deg)`,
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

  const logo = reveal(f, 2, 30);
  const eyebrow = reveal(f, 12, 26);
  const title = reveal(f, 20, 34);
  const pill = spring({ frame: f - 40, fps, config: { damping: 14, stiffness: 140 } });
  const facts = reveal(f, 92, 26);
  const ctaIn = spring({ frame: f - 120, fps, config: { damping: 16, stiffness: 120 } });
  const out = interpolate(f, [durationInFrames - 14, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const shine = ((f - 140) % 90) / 90;
  const arrow = Math.sin(f / 7) * 6;

  // long names shrink to fit
  const titleSize = districtName.length > 11 ? 124 : districtName.length > 8 ? 140 : 156;

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink, opacity: out }}>
      <Background f={f} p={p} />

      {/* logo */}
      <div style={{ position: 'absolute', top: 104, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `translateY(${(1 - logo) * 12}px)` }}>
        <StackedLogo b={p.brand} width={200} logoReady={p.logoReady} progress={logo} />
      </div>

      {/* title */}
      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 500, letterSpacing: 9, textTransform: 'uppercase', color: t.mute, opacity: eyebrow, transform: `translateY(${(1 - eyebrow) * 18}px)` }}>
          Find your stay in
        </div>
        <div style={{ overflow: 'hidden', height: 210, marginTop: 4, paddingTop: 6 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: titleSize, lineHeight: '190px', letterSpacing: -2, transform: `translateY(${(1 - title) * 200}px)` }}>
            {districtName}
          </div>
        </div>
      </div>

      {/* type pill */}
      <div style={{ position: 'absolute', top: 596, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
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
      <div style={{ position: 'absolute', top: 1474, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, fontSize: 30, fontWeight: 500, opacity: facts, transform: `translateY(${(1 - facts) * 16}px)` }}>
        {u.specs.guests ? <span>{plural(u.specs.guests, 'guest', 'guests')}</span> : null}
        {u.specs.bedrooms ? <><span style={{ color: t.primary }}>•</span><span>{plural(u.specs.bedrooms, 'bedroom', 'bedrooms')}</span></> : null}
        {u.specs.baths ? <><span style={{ color: t.primary }}>•</span><span>{plural(u.specs.baths, 'bath', 'baths')}</span></> : null}
      </div>

      {/* amenities */}
      <div style={{ position: 'absolute', top: 1536, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 18 }}>
        {amen.map((a, i) => {
          const s = spring({ frame: f - 100 - i * 4, fps, config: { damping: 13, stiffness: 160 } });
          const Icon = a.icon;
          return (
            <div key={a.key} style={{
              width: 136, height: 120, borderRadius: 30, background: '#FFFFFF', border: `2px solid ${t.rule}`,
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
      <div style={{ position: 'absolute', top: 1704, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          position: 'relative', overflow: 'hidden', height: 112, padding: '0 22px 0 52px', borderRadius: 999, background: t.ink, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 22, fontSize: cta.length > 26 ? 34 : 38, fontWeight: 600,
          transform: `translateY(${(1 - ctaIn) * 60}px) scale(${0.9 + 0.1 * ctaIn})`, opacity: Math.min(1, ctaIn * 1.3),
          boxShadow: '0 18px 40px rgba(14,14,16,0.25)',
        }}>
          {cta}
          <div style={{ width: 68, height: 68, borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `translateX(${arrow}px)` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </div>
          {f > 140 && (
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: `${-20 + shine * 140}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.22), rgba(255,255,255,0))', transform: 'skewX(-20deg)' }} />
          )}
        </div>
      </div>

      {/* site */}
      <div style={{ position: 'absolute', top: 1850, left: 0, right: 0, textAlign: 'center', fontSize: 28, fontWeight: 500, color: t.mute, letterSpacing: 1, opacity: reveal(f, 130, 20) }}>
        <span style={{ color: t.ink, fontWeight: 600 }}>{t.site.replace(/\.com$/, '')}</span>.com
      </div>
    </AbsoluteFill>
  );
};
