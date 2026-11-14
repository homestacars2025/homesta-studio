import React from 'react';
import { Img } from 'remotion';
import { Bath, BedDouble, BedSingle, Ruler, Users, type LucideIcon } from 'lucide-react';
import type { BrandProps } from './types';

/** Lucide fallbacks while a slot in the official set has no file yet. */
const FALLBACK: Record<string, LucideIcon> = { guests: Users, bedrooms: BedDouble, beds: BedSingle, bathrooms: Bath, size: Ruler };

/** Official Homesta icon (media.brand_icons) with a line-icon fallback. */
export const BrandIcon: React.FC<{ b: BrandProps; name: string; size: number; color?: string }> = ({ b, name, size, color = '#0E0E10' }) => {
  const url = b.icons?.[name];
  if (url) return <Img src={url} style={{ width: size, height: size, objectFit: 'contain' }} />;
  const I = FALLBACK[name];
  return I ? <I size={size * 0.72} color={color} strokeWidth={1.8} /> : null;
};
