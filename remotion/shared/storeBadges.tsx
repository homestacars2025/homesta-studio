import React from 'react';

/**
 * App Store / Google Play badges drawn as vectors (sharp at any size).
 * Height drives everything; width follows the official proportions (~3:1).
 */
const APPLE = 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701';

const Frame: React.FC<{ h: number; w: number; children: React.ReactNode }> = ({ h, w, children }) => (
  <div style={{
    width: w, height: h, borderRadius: h * 0.18, background: '#000', border: `${Math.max(1.5, h * 0.022)}px solid #A6A6A6`,
    display: 'flex', alignItems: 'center', boxSizing: 'border-box', color: '#fff', fontFamily: '"Geist Sans", "Inter", system-ui, sans-serif',
  }}>{children}</div>
);

export const AppStoreBadge: React.FC<{ height: number }> = ({ height: h }) => (
  <Frame h={h} w={h * 2.98}>
    <svg width={h * 0.5} height={h * 0.5} viewBox="0 0 24 24" style={{ marginLeft: h * 0.24, marginRight: h * 0.16 }}>
      <path d={APPLE} fill="#fff" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: h * 0.2, fontWeight: 500, letterSpacing: 0.2 }}>Available on the</span>
      <span style={{ fontSize: h * 0.4, fontWeight: 600, letterSpacing: -0.5, marginTop: h * 0.04 }}>App Store</span>
    </div>
  </Frame>
);

export const GooglePlayBadge: React.FC<{ height: number }> = ({ height: h }) => (
  <Frame h={h} w={h * 3.36}>
    <svg width={h * 0.5} height={h * 0.54} viewBox="0 0 24 26" style={{ marginLeft: h * 0.24, marginRight: h * 0.18 }}>
      <defs>
        <linearGradient id="gp-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00C3FF" /><stop offset="1" stopColor="#1BE2FA" /></linearGradient>
        <linearGradient id="gp-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#1DE9B6" /><stop offset="1" stopColor="#00F076" /></linearGradient>
        <linearGradient id="gp-y" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFCE00" /><stop offset="1" stopColor="#FFEA00" /></linearGradient>
        <linearGradient id="gp-r" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#E11D48" /><stop offset="1" stopColor="#FF3A44" /></linearGradient>
      </defs>
      <path d="M1.5 1 L12.3 13 L1.5 25 Z" fill="url(#gp-b)" />
      <path d="M1.5 1 L16.6 9.6 L12.3 13 Z" fill="url(#gp-g)" />
      <path d="M16.6 9.6 L22.5 13 L16.6 16.4 L12.3 13 Z" fill="url(#gp-y)" />
      <path d="M1.5 25 L12.3 13 L16.6 16.4 Z" fill="url(#gp-r)" />
    </svg>
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontSize: h * 0.19, fontWeight: 500, letterSpacing: 0.8 }}>GET IT ON</span>
      <span style={{ fontSize: h * 0.4, fontWeight: 500, letterSpacing: -0.4, marginTop: h * 0.04 }}>Google Play</span>
    </div>
  </Frame>
);
