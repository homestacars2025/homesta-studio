/**
 * S1 · Just Joined  (story, 9:16 video, 8s @ 30fps)
 * Target: unit. A newly published stay: its cover photo full-bleed (slow zoom), "New on Homesta",
 * "Just joined" headline + location, then the P1 glass panel rises, price pops, site.
 */
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { StudioProps } from '../shared/types';
import { theme } from '../shared/brand';
import { Logo, Site, StayPanel } from './P1_StaySpotlight';

export const S1_FRAMES = 240;
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const rv = (f: number, s: number, d = 18) => interpolate(f, [s, s + d], [0, 1], { easing: ease, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

export const S1_JustJoined: React.FC<StudioProps> = (p) => {
  const f = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = theme(p.brand);
  const u = p.unit!;
  const place = [u.district, u.city].filter(Boolean).join(', ');

  const zoom = interpolate(f, [0, durationInFrames], [1.14, 1.0]);
  const logo = rv(f, 0, 16);
  const pill = spring({ frame: f - 8, fps, config: { damping: 13, stiffness: 160 } });
  const head = rv(f, 14, 22);
  const loc = rv(f, 24, 18);
  const panel = spring({ frame: f - 40, fps, config: { damping: 18, stiffness: 90, mass: 1.1 } });
  const price = spring({ frame: f - 78, fps, config: { damping: 12, stiffness: 150 } });
  const site = rv(f, 92, 16);
  const out = interpolate(f, [durationInFrames - 8, durationInFrames], [1, 0], { extrapolateLeft: 'clamp' });
  const glow = 0.5 + 0.5 * Math.sin(f / 6);

  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: '#fff', opacity: out, background: '#111' }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 32%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 72%, rgba(0,0,0,0.5) 100%)' }} />

      <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * -14}px)` }}>
        <Logo p={p} top={180} />
      </div>

      {/* NEW pill */}
      <div style={{ position: 'absolute', top: 290, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          height: 62, padding: '0 28px', borderRadius: 999, background: t.primary, display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', transform: `scale(${0.6 + 0.4 * pill})`, opacity: Math.min(1, pill * 1.5),
          boxShadow: '0 12px 30px rgba(229,40,81,0.4)',
        }}>
          <span style={{ width: 12, height: 12, borderRadius: 99, background: '#fff', boxShadow: `0 0 0 ${4 + glow * 6}px rgba(255,255,255,${0.35 - glow * 0.2})` }} />
          New on Homesta
        </div>
      </div>

      {/* headline */}
      <div style={{ position: 'absolute', top: 372, left: 0, right: 0, textAlign: 'center', textShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
        <div style={{ overflow: 'hidden', height: 170 }}>
          <div style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, fontSize: 150, lineHeight: '160px', letterSpacing: -2, transform: `translateY(${(1 - head) * 170}px)` }}>
            Just joined
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 500, opacity: loc, transform: `translateY(${(1 - loc) * 14}px)` }}>
          📍 {place}
        </div>
      </div>

      {/* glass panel (same as P1) */}
      <StayPanel u={u} t={t} left={96} top={760}
        style={{ transform: `translateY(${(1 - panel) * 1000}px)`, opacity: Math.min(1, panel * 1.4) }} />

      {/* price */}
      {u.price_from_usd ? (
        <div style={{ position: 'absolute', top: 1340, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{
            height: 92, padding: '0 14px 0 40px', borderRadius: 999, background: '#fff', color: t.ink, display: 'flex', alignItems: 'center', gap: 20,
            transform: `scale(${0.7 + 0.3 * price})`, opacity: Math.min(1, price * 1.4), boxShadow: '0 18px 40px rgba(0,0,0,0.3)',
          }}>
            <span style={{ fontSize: 24, color: t.mute }}>From</span>
            <span style={{ fontSize: 46, fontWeight: 700, marginLeft: -8 }}>${Math.round(u.price_from_usd)}</span>
            <span style={{ fontSize: 24, color: t.mute, marginLeft: -8 }}>/ night</span>
            <div style={{ height: 68, padding: '0 28px', borderRadius: 999, background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 600 }}>
              Book now
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ opacity: site }}>
        <Site t={t} top={1478} />
      </div>
    </AbsoluteFill>
  );
};
