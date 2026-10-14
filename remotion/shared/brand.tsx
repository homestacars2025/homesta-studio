import React from 'react';
import { Img } from 'remotion';
import {
  AirVent, ArrowUpDown, Car, CookingPot, Dumbbell, Flame, KeyRound, Tv, Utensils, WashingMachine, Waves, Wifi,
} from 'lucide-react';
import type { BrandProps } from './types';

/** Resolve brand tokens with safe fallbacks (so a missing field never breaks a render). */
export const theme = (b: BrandProps) => ({
  primary: b.colors.primary ?? '#E52851',
  ink: b.colors.secondary ?? '#0E0E10',
  paper: b.colors.tertiary ?? '#FAFAF7',
  paperWarm: b.colors.paper_warm ?? '#F2EEE6',
  mute: b.colors.mute ?? '#8C8881',
  rule: b.colors.rule ?? '#E2DED4',
  sans: `"${b.fonts?.primary?.family ?? 'Geist Sans'}", "Inter", system-ui, sans-serif`,
  body: `"${b.fonts?.secondary?.family ?? 'Inter'}", system-ui, sans-serif`,
  display: `"${b.fonts?.display?.family ?? 'Playfair Display'}", Georgia, serif`,
  site: b.site ?? 'homestastay.com',
});

/** The arch icon drawn as vector (used for animation and as fallback). */
export const Arch: React.FC<{ b: BrandProps; size: number; progress?: number; color?: string }> = ({
  b, size, progress = 1, color,
}) => {
  const svg = b.icon_svg ?? { path: 'M341.5 752 V525 A198 198 0 0 1 737.5 525 V752', viewbox: '307 292 466 496', stroke: 69.5 };
  const [, , vw, vh] = svg.viewbox.split(' ').map(Number);
  const len = 1100;
  return (
    <svg width={size} height={size * (vh / vw)} viewBox={svg.viewbox}>
      <path
        d={svg.path}
        fill="none"
        stroke={color ?? theme(b).primary}
        strokeWidth={svg.stroke}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};

/**
 * Stacked logo (arch over "homesta").
 * Uses the official PNG from brand-assets when it exists, otherwise a faithful vector fallback.
 */
export const StackedLogo: React.FC<{ b: BrandProps; width: number; logoReady?: boolean; light?: boolean; progress?: number }> = ({
  b, width, logoReady, light, progress = 1,
}) => {
  const t = theme(b);
  const src = light ? b.logos.logo_stacked_light : b.logos.logo_stacked;
  if (logoReady && src) {
    return <Img src={src} style={{ width, opacity: progress }} />;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width }}>
      <Arch b={b} size={width * 0.42} progress={progress} color={light ? '#FFFFFF' : undefined} />
      <div
        style={{
          marginTop: width * 0.06,
          fontFamily: '"Poppins", sans-serif',
          fontWeight: 500,
          fontSize: width * 0.22,
          letterSpacing: -0.5,
          lineHeight: 1,
          color: light ? '#fff' : t.ink,
          opacity: progress,
        }}
      >
        homesta
      </div>
    </div>
  );
};

/* ── Amenities: DB column → icon + label, in display priority ── */
export const AMENITIES: { key: string; label: string; icon: React.FC<any> }[] = [
  { key: 'pool', label: 'Pool', icon: Waves },
  { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { key: 'air_conditioning', label: 'A/C', icon: AirVent },
  { key: 'parking', label: 'Parking', icon: Car },
  { key: 'kitchen', label: 'Kitchen', icon: CookingPot },
  { key: 'self_check_in', label: 'Self check-in', icon: KeyRound },
  { key: 'washing_machine', label: 'Washer', icon: WashingMachine },
  { key: 'elevator', label: 'Elevator', icon: ArrowUpDown },
  { key: 'gym', label: 'Gym', icon: Dumbbell },
  { key: 'tv', label: 'TV', icon: Tv },
  { key: 'heating', label: 'Heating', icon: Flame },
  { key: 'dishwasher', label: 'Dishwasher', icon: Utensils },
];

export const pickAmenities = (keys: string[] = [], max = 6) =>
  AMENITIES.filter((a) => keys.includes(a.key)).slice(0, max);

export const plural = (n: number | string | null | undefined, one: string, many: string) => {
  const v = Number(n ?? 0);
  return `${v} ${v === 1 ? one : many}`;
};

/**
 * Horizontal logo: arch icon + "homesta" side by side, both the same height
 * (arch height = height of the "h" from baseline to top).
 * Uses the official PNG when uploaded (logoReady), else the vector version.
 */
export const HorizontalLogo: React.FC<{ b: BrandProps; height: number; logoReady?: boolean; light?: boolean }> = ({
  b, height, logoReady, light,
}) => {
  const src = light ? b.logos.logo_horizontal_light : b.logos.logo_horizontal;
  if (logoReady && src) return <Img src={src} style={{ height }} />;
  const svg = b.icon_svg ?? { path: 'M341.5 752 V525 A198 198 0 0 1 737.5 525 V752', viewbox: '307 292 466 496', stroke: 69.5 };
  const [, , vw, vh] = svg.viewbox.split(' ').map(Number);
  const fontSize = height / 0.74; // Poppins ascender ≈ 0.74em → "h" is as tall as the arch
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: height * 0.28 }}>
      <svg width={height * (vw / vh)} height={height} viewBox={svg.viewbox} style={{ display: 'block' }}>
        <path d={svg.path} fill="none" stroke={light ? '#FFFFFF' : theme(b).primary} strokeWidth={svg.stroke} strokeLinecap="round" />
      </svg>
      <div style={{
        fontFamily: '"Poppins", sans-serif', fontWeight: 500, fontSize, letterSpacing: -0.5,
        lineHeight: `${height}px`, height, display: 'flex', alignItems: 'flex-end',
        color: light ? '#FFFFFF' : theme(b).ink,
      }}>
        <span style={{ lineHeight: 0.74, display: 'block', transform: `translateY(${fontSize * 0.0}px)` }}>homesta</span>
      </div>
    </div>
  );
};
