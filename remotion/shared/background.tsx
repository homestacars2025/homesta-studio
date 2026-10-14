import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';

/**
 * Shared Homesta background: static brand-icon pattern under a veil that is
 * thicker in the middle and thinner at the edges (eased radial mask).
 *  tone="light" → white paper, red icons (S3)
 *  tone="brand" → brand-red, white icons + soft gloss (S7)
 */
export const PATTERN_OPACITY = 0.06;
const MASK =
  'radial-gradient(ellipse 78% 62% at 50% 50%, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.10) 22%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.34) 56%, rgba(0,0,0,0.56) 70%, rgba(0,0,0,0.80) 84%, #000 100%)';

export const BrandBackground: React.FC<{
  aspect?: '9x16' | '4x5';
  tone?: 'light' | 'brand';
  primary?: string;
  deep?: string;
  opacity?: number;
}> = ({ aspect = '9x16', tone = 'light', primary = '#E52851', deep = '#B8173D', opacity }) => {
  const brand = tone === 'brand';
  return (
    <AbsoluteFill style={{
      background: brand
        ? `radial-gradient(95% 62% at 50% 50%, ${lighten(primary, 0.22)} 0%, ${lighten(primary, 0.1)} 22%, ${primary} 50%, ${deep} 100%)`
        : '#FFFFFF',
    }}>
      <Img
        src={staticFile(`brand/pattern-${aspect}.png`)}
        style={{
          width: '100%', height: '100%',
          opacity: opacity ?? (brand ? 0.16 : PATTERN_OPACITY),
          filter: brand ? 'brightness(0) invert(1)' : undefined, // red icons → white
          WebkitMaskImage: MASK, maskImage: MASK,
        }}
      />
      {brand && (
        <>
          {/* glow: light rises from the centre and fades out evenly to every edge */}
          <AbsoluteFill style={{ background: 'radial-gradient(55% 34% at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%)' }} />
          <AbsoluteFill style={{ background: 'radial-gradient(120% 75% at 50% 50%, rgba(60,0,15,0) 55%, rgba(60,0,15,0.22) 100%)' }} />
        </>
      )}
    </AbsoluteFill>
  );
};

/** mix a hex colour towards white by 18% */
function lighten(hex: string, k = 0.18) {
  const n = parseInt(hex.slice(1), 16);
  const ch = (s: number) => Math.round(((n >> s) & 255) + (255 - ((n >> s) & 255)) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}
