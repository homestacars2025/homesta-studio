import React from 'react';

/**
 * Realistic iPhone-style mockup (titanium frame, side buttons, glass glare, dynamic island, status bar).
 * Children are rendered inside the screen (absolute layout, screen-sized box).
 */
export const PHONE_FRAME = 7;   // titanium band
export const PHONE_BEZEL = 12;  // black glass border
export const phoneScreen = (w: number, h: number) => ({
  w: w - (PHONE_FRAME + PHONE_BEZEL) * 2,
  h: h - (PHONE_FRAME + PHONE_BEZEL) * 2,
});

const metal = 'linear-gradient(145deg, #E4E5E9 0%, #9A9DA4 18%, #F1F2F4 40%, #7F828A 62%, #D2D4D8 82%, #8C8F96 100%)';
const btn = (side: 'l' | 'r', top: number, h: number): React.CSSProperties => ({
  position: 'absolute', top, height: h, width: 7, [side === 'l' ? 'left' : 'right']: -5,
  borderRadius: side === 'l' ? '4px 0 0 4px' : '0 4px 4px 0',
  background: 'linear-gradient(90deg, #8E9198, #E9EAED 50%, #8E9198)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
});

export const PhoneMockup: React.FC<{
  w: number; h: number; ink?: string; screenBg?: string; style?: React.CSSProperties; children: React.ReactNode;
}> = ({ w, h, ink = '#0E0E10', screenBg = '#FFFFFF', style, children }) => {
  const R = w * 0.165;                      // outer corner radius (iPhone proportion)
  const s = phoneScreen(w, h);
  return (
    <div style={{ position: 'absolute', width: w, height: h, ...style }}>
      {/* contact + ambient shadow */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: R, boxShadow: '0 70px 120px -20px rgba(14,14,16,0.38), 0 24px 40px -12px rgba(14,14,16,0.28)' }} />
      {/* side buttons */}
      <div style={btn('l', h * 0.17, h * 0.045)} />
      <div style={btn('l', h * 0.25, h * 0.075)} />
      <div style={btn('l', h * 0.34, h * 0.075)} />
      <div style={btn('r', h * 0.27, h * 0.11)} />
      {/* titanium frame */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: R, background: metal, padding: PHONE_FRAME }}>
        {/* black glass bezel */}
        <div style={{ width: '100%', height: '100%', borderRadius: R - PHONE_FRAME, background: '#050506', padding: PHONE_BEZEL, boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.08)' }}>
          {/* screen */}
          <div style={{ position: 'relative', width: s.w, height: s.h, borderRadius: R - PHONE_FRAME - PHONE_BEZEL, overflow: 'hidden', background: screenBg }}>
            {children}
            {/* status bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 78, background: screenBg }} />
            <div style={{ position: 'absolute', top: 27, left: s.w * 0.1, fontSize: 21, fontWeight: 600, color: ink, letterSpacing: -0.2 }}>9:41</div>
            <div style={{ position: 'absolute', top: 18, left: s.w / 2 - 70, width: 140, height: 40, borderRadius: 999, background: '#050506' }} />
            <div style={{ position: 'absolute', top: 30, right: s.w * 0.08, display: 'flex', gap: 7, alignItems: 'center' }}>
              <svg width="20" height="13" viewBox="0 0 20 13">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 5.2} y={9 - i * 3} width="3.6" height={4 + i * 3} rx="1" fill={ink} />)}</svg>
              <svg width="18" height="13" viewBox="0 0 24 17" fill="none" stroke={ink} strokeWidth="2.6" strokeLinecap="round"><path d="M2 6.5a15 15 0 0 1 20 0" /><path d="M5.5 10a10 10 0 0 1 13 0" /><circle cx="12" cy="14" r="1.6" fill={ink} stroke="none" /></svg>
              <div style={{ width: 27, height: 13, borderRadius: 4, border: `1.6px solid ${ink}`, opacity: 0.9, padding: 1.5, position: 'relative' }}>
                <div style={{ width: '82%', height: '100%', background: ink, borderRadius: 1.5 }} />
              </div>
            </div>
            {/* home indicator */}
            <div style={{ position: 'absolute', bottom: 10, left: s.w / 2 - 68, width: 136, height: 5, borderRadius: 9, background: ink, opacity: 0.85 }} />
            {/* glass glare */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 38%)', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Homesta app icon rendered in code (sharp at any size): white squircle with soft depth,
 * glossy red arch with highlight and shadow.
 */
export const AppIcon: React.FC<{ size: number; primary?: string }> = ({ size, primary = '#E52851' }) => {
  const id = `ai${size}`;
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.225, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F6F8 55%, #ECECEF 100%)',
      boxShadow: `0 ${size * 0.02}px ${size * 0.04}px rgba(14,14,16,0.10), 0 ${size * 0.12}px ${size * 0.24}px rgba(14,14,16,0.18), inset 0 0 0 1px rgba(14,14,16,0.06), inset 0 -${size * 0.04}px ${size * 0.08}px rgba(14,14,16,0.05)`,
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mixWhite(primary, 0.18)} />
            <stop offset="0.55" stopColor={primary} />
            <stop offset="1" stopColor={mixBlack(primary, 0.18)} />
          </linearGradient>
          <filter id={`${id}s`} x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="0" dy="2.6" stdDeviation="2.4" floodColor={mixBlack(primary, 0.35)} floodOpacity="0.35" />
          </filter>
        </defs>
        {/* arch */}
        <path d="M29.5 71 V49 A20.5 20.5 0 0 1 70.5 49 V71" fill="none" stroke={`url(#${id}g)`} strokeWidth="10.5" strokeLinecap="round" filter={`url(#${id}s)`} />
        {/* specular highlight on the arch */}
        <path d="M32.4 65 V49.5 A17.6 17.6 0 0 1 50 31.9" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      {/* top gloss */}
      <div style={{ position: 'absolute', left: '-10%', right: '-10%', top: '-38%', height: '70%', borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))' }} />
    </div>
  );
};

function mixWhite(hex: string, k: number) { return mix(hex, 255, k); }
function mixBlack(hex: string, k: number) { return mix(hex, 0, k); }
function mix(hex: string, to: number, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (s: number) => Math.round(((n >> s) & 255) * (1 - k) + to * k);
  return `rgb(${c(16)}, ${c(8)}, ${c(0)})`;
}
