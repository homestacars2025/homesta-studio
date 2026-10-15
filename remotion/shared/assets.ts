import { staticFile } from 'remotion';

/**
 * Static brand assets (patterns, 3D props…).
 * - Server render: served from /public via staticFile().
 * - Live preview in the admin/team app (@remotion/player): call setAssetBase(CDN) once, e.g.
 *   setAssetBase('https://cdn.jsdelivr.net/gh/homestacars2025/homesta-studio@main/public')
 */
let BASE: string | null = null;
export const setAssetBase = (base: string | null) => { BASE = base ? base.replace(/\/$/, '') : null; };
export const asset = (p: string) => (BASE ? `${BASE}/${p.replace(/^\//, '')}` : staticFile(p));
