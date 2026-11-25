/**
 * One-off · Homesta app launch poster (4:5, 1080×1350), white stage.
 * Phone with the real home screen, the app's 3D icons around it, three service tiles
 * (stays · transfers · car rental), Libyan payment methods, store badges.
 * params.lang: 'en' | 'ar'
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import '@fontsource/rubik/arabic-400.css';
import '@fontsource/rubik/arabic-500.css';
import '@fontsource/rubik/arabic-700.css';
import '@fontsource/rubik/latin-700.css';
import { asset } from '../shared/assets';
import type { StudioProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';
import { PhoneMockup, phoneScreen } from '../shared/device';

const PH_W = 372;
const FR = 6;
const BZ = 8;
const SCR = phoneScreen(PH_W, 0, FR, BZ);
const SCR_H = Math.round((SCR.w * 2796) / 1290);
const PH_H = SCR_H + (FR + BZ) * 2;
const PH_TOP = 476;

const COPY = {
  en: {
    eyebrow: 'Stays · Transfers · Car rental',
    sub: 'The first app that brings your stay, your airport transfer and your rental car together — booked in minutes.',
    tiles: [['cabin', 'Stays', 'Apartments & villas'], ['van', 'Transfers', 'Airport & city rides'], ['car', 'Car rental', 'Delivered to you']],
    pay: 'Pay with the Libyan methods you already use',
    screen: 'app-home.jpg',
    store: ['Available on the', 'GET IT ON'],
  },
  ar: {
    eyebrow: 'إقامة · نقل · إيجار سيارات',
    sub: 'أول تطبيق يجمع لك الإقامة والنقل من المطار وإيجار السيارات في مكان واحد',
    tiles: [['cabin', 'الإقامة', 'شقق وفلل'], ['van', 'النقل', 'من المطار وداخل المدينة'], ['car', 'إيجار السيارات', 'توصلك أينما كنت']],
    pay: 'ادفع بوسائل الدفع الليبية التي تستخدمها',
    screen: 'app-home-ar.jpg',
    store: ['Available on the', 'GET IT ON'],
  },
} as const;

const Float: React.FC<{ src: string; x: number; y: number; w: number; r: number }> = ({ src, x, y, w, r }) => (
  <Img src={asset(src)} style={{ position: 'absolute', left: x, top: y, width: w, transform: `rotate(${r}deg)`, filter: 'drop-shadow(0 22px 24px rgba(20,20,30,0.18))' }} />
);

export const AppPoster: React.FC<StudioProps> = (p) => {
  const t = theme(p.brand);
  const lang = (p.params?.lang as 'en' | 'ar') === 'ar' ? 'ar' : 'en';
  const c = COPY[lang];
  const ar = lang === 'ar';
  const font = ar ? '"Rubik", sans-serif' : t.sans;
  const cx = 540;
  const cy = PH_TOP + 330;

  return (
    <AbsoluteFill style={{ background: '#FFFFFF', fontFamily: font, color: '#111114', direction: ar ? 'rtl' : 'ltr', overflow: 'hidden' }}>
      {/* soft stage: brand glow + radar rings behind the phone */}
      <div style={{ position: 'absolute', left: cx - 560, top: cy - 520, width: 1120, height: 1040, borderRadius: '50%', background: `radial-gradient(circle, ${t.primary}14 0%, ${t.primary}08 38%, rgba(255,255,255,0) 66%)` }} />
      <svg width={1080} height={1350} style={{ position: 'absolute', inset: 0 }}>
        {[260, 360, 460, 560].map((r, i) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#E9E6EA" strokeWidth={1.6} strokeDasharray={i % 2 ? '2 10' : undefined} />
        ))}
      </svg>

      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', direction: 'ltr' }}>
        <HorizontalLogo b={p.brand} height={40} logoReady={p.logoReady} />
      </div>
      <div style={{ position: 'absolute', top: 140, left: 60, right: 60, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 44, padding: '0 22px', borderRadius: 999, background: `${t.primary}10`, color: t.primary, fontSize: ar ? 22 : 17, fontWeight: 600, letterSpacing: ar ? 0 : 3.5, textTransform: 'uppercase' }}>
          <span style={{ width: 8, height: 8, borderRadius: 9, background: t.primary }} />{c.eyebrow}
        </div>
        {ar ? (
          <div style={{ marginTop: 22, fontSize: 64, fontWeight: 700, lineHeight: 1.22, letterSpacing: 0 }}>
            رحلتك إلى <span style={{ color: t.primary }}>تركيا</span> كاملة<br />في تطبيق واحد
          </div>
        ) : (
          <div style={{ marginTop: 22, fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2.2 }}>
            Your whole trip to <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, color: t.primary, letterSpacing: -1 }}>Türkiye</span>,<br />in one app
          </div>
        )}
        <div style={{ margin: '18px auto 0', maxWidth: ar ? 900 : 780, fontSize: ar ? 25 : 24, fontWeight: ar ? 400 : 300, lineHeight: 1.5, color: '#5E5E66' }}>{c.sub}</div>
      </div>

      {/* floating 3D icons */}
      <Float src="brand/3d/app/suitcase.png" x={120} y={500} w={140} r={-8} />
      <Float src="brand/3d/plane.png" x={790} y={470} w={200} r={-6} />
      <Float src="brand/3d/map-pin.png" x={40} y={760} w={160} r={-8} />
      <Float src="brand/3d/app/bell.png" x={832} y={720} w={180} r={6} />

      {/* phone, fading into the tiles */}
      <div style={{ position: 'absolute', left: (1080 - PH_W) / 2, top: PH_TOP, width: PH_W, height: 560, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)', maskImage: 'linear-gradient(180deg, #000 78%, transparent 100%)' }}>
        <PhoneMockup w={PH_W} h={PH_H} frame={FR} bezel={BZ} style={{ left: 0, top: 0 }}>
          <Img src={`http://localhost:3000/public/_preview/${c.screen}`} style={{ position: 'absolute', left: 0, top: 0, width: SCR.w, height: SCR_H }} />
        </PhoneMockup>
      </div>

      {/* service tiles */}
      <div style={{ position: 'absolute', top: 930, left: 60, right: 60, display: 'flex', gap: 18 }}>
        {c.tiles.map(([icon, title, sub]) => (
          <div key={icon} style={{ flex: 1, height: 150, borderRadius: 30, background: '#FFFFFF', border: '1.5px solid #EFEDEF', boxShadow: '0 18px 40px -18px rgba(20,20,30,0.22)', display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px' }}>
            <Img src={asset(`brand/3d/app/${icon}.png`)} style={{ width: 92, height: 92, objectFit: 'contain', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: ar ? 27 : 27, fontWeight: ar ? 700 : 600, letterSpacing: ar ? 0 : -0.5 }}>{title}</div>
              <div style={{ marginTop: 4, fontSize: ar ? 18 : 17, color: '#7A7A82', lineHeight: 1.3 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Libyan payment methods */}
      <div style={{ position: 'absolute', top: 1094, left: 60, right: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
        <div style={{ fontSize: ar ? 22 : 19, fontWeight: 500, color: '#4A4A52', maxWidth: 330, lineHeight: 1.35, textAlign: ar ? 'right' : 'left' }}>{c.pay}</div>
        <div style={{ display: 'flex', gap: 10, direction: 'ltr' }}>
          {['moamalat', 'sadad', 'edfa3li', 'tadawul'].map((k) => (
            <Img key={k} src={asset(`brand/3d/pay/${k}.png`)} style={{ width: 108, height: 108, objectFit: 'contain' }} />
          ))}
        </div>
      </div>

      {/* stores + site */}
      <div style={{ position: 'absolute', top: 1226, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, direction: 'ltr' }}>
        <AppStoreBadge height={64} caption={c.store[0]} />
        <GooglePlayBadge height={64} caption={c.store[1]} />
        <div style={{ width: 1.5, height: 44, background: '#E3E1E5', margin: '0 10px' }} />
        <div style={{ fontSize: 26, letterSpacing: 0.2, fontFamily: t.sans }}>
          <span style={{ fontWeight: 600 }}>homestastay</span><span style={{ fontWeight: 300 }}>.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
