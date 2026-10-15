/**
 * Template registry — the single list of templates, shared by the render server (Root.tsx)
 * and by the admin/team apps for live preview with @remotion/player.
 * Key = media.templates.composition_id.
 */
import type React from 'react';
import './shared/fonts';
import { S2_CityEscape, S2_FRAMES } from './templates/S2_CityEscape';
import { S3_FindYourStayIn, S3_FRAMES } from './templates/S3_FindYourStayIn';
import { S7_StayCard } from './templates/S7_StayCard';
export { setAssetBase } from './shared/assets';
export type { StudioProps } from './shared/types';

export type TemplateDef = {
  component: React.FC<any>;
  kind: 'video' | 'image';
  width: number;
  height: number;
  fps: number;
  durationInFrames: number; // 1 for images
};

export const TEMPLATES: Record<string, TemplateDef> = {
  S2_CityEscape: { component: S2_CityEscape as React.FC<any>, kind: 'video', width: 1080, height: 1920, fps: 30, durationInFrames: S2_FRAMES },
  S3_FindYourStayIn: { component: S3_FindYourStayIn as React.FC<any>, kind: 'video', width: 1080, height: 1920, fps: 30, durationInFrames: S3_FRAMES },
  S7_StayCard: { component: S7_StayCard as React.FC<any>, kind: 'image', width: 1080, height: 1920, fps: 30, durationInFrames: 1 },
};

/** CDN base for assets when previewing outside the render server */
export const ASSET_CDN = 'https://cdn.jsdelivr.net/gh/homestacars2025/homesta-studio@main/public';
