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
import { Phone3D } from './Phone3D';

const COPY = {
  en: {
    eyebrow: 'Stays · Transfers · Car rental',
    sub: 'The first app that brings your stay, your airport transfer and your rental car together — booked in minutes.',
    tiles: [['cabin', 'Stays', 'Apartments, villas & hotels across Türkiye'], ['van', 'Airport transfers', 'A private ride from arrival to your door'], ['car', 'Car rental', 'Delivered wherever you are']],
    pay: 'Pay with Libyan payment methods',
    screen: 'app-home.jpg',
    store: ['Available on the', 'GET IT ON'],
  },
  ar: {
    eyebrow: 'إقامة · نقل · إيجار سيارات',
    sub: 'أول تطبيق يجمع لك الإقامة والنقل من المطار وإيجار السيارات في مكان واحد',
    tiles: [['cabin', 'الإقامة', 'شقق وفلل وفنادق في كل تركيا'], ['van', 'النقل من المطار', 'توصيلة خاصة من الوصول لباب سكنك'], ['car', 'إيجار السيارات', 'سيارتك توصلك أينما كنت']],
    pay: 'ادفع بوسائل الدفع الليبية',
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
  // phone sits on the reading-start side and turns toward the text
  const phoneLeft = ar ? 600 : 80;
  const colLeft = ar ? 70 : 540;

  return (
    <AbsoluteFill style={{ fontFamily: font, color: '#111114', direction: ar ? 'rtl' : 'ltr', overflow: 'hidden',
      background: `radial-gradient(ellipse 70% 55% at ${ar ? 72 : 28}% 66%, #FFFFFF 0%, #FBFAFB 45%, #F1F0F3 100%)` }}>
      {/* key light + brand bounce behind the phone */}
      <div style={{ position: 'absolute', left: phoneLeft - 260, top: 420, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${t.primary}1A 0%, ${t.primary}08 40%, rgba(255,255,255,0) 68%)` }} />
      <div style={{ position: 'absolute', left: ar ? 380 : -200, top: -200, width: 900, height: 1700, transform: `rotate(${ar ? -24 : 24}deg)`, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 50%, rgba(255,255,255,0))' }} />

      {/* header */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', direction: 'ltr' }}>
        <HorizontalLogo b={p.brand} height={40} logoReady={p.logoReady} />
      </div>
      <div style={{ position: 'absolute', top: 138, left: 60, right: 60, textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 44, padding: '0 22px', borderRadius: 999, background: `${t.primary}10`, color: t.primary, fontSize: ar ? 22 : 17, fontWeight: 600, letterSpacing: ar ? 0 : 3.5, textTransform: 'uppercase' }}>
          <span style={{ width: 8, height: 8, borderRadius: 9, background: t.primary }} />{c.eyebrow}
        </div>
        {ar ? (
          <div style={{ marginTop: 22, fontSize: 66, fontWeight: 700, lineHeight: 1.22 }}>
            رحلتك إلى <span style={{ color: t.primary }}>تركيا</span> كاملة<br />في تطبيق واحد
          </div>
        ) : (
          <div style={{ marginTop: 22, fontSize: 68, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2.2 }}>
            Your whole trip to <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, color: t.primary, letterSpacing: -1 }}>Türkiye</span>,<br />in one app
          </div>
        )}
        <div style={{ margin: '18px auto 0', maxWidth: ar ? 900 : 800, fontSize: ar ? 25 : 24, fontWeight: ar ? 400 : 300, lineHeight: 1.5, color: '#5E5E66' }}>{c.sub}</div>
      </div>

      {/* cinematic phone */}
      <div style={{ position: 'absolute', left: phoneLeft + 40, top: 1250, width: 360, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,20,30,0.30) 0%, rgba(20,20,30,0.10) 45%, rgba(20,20,30,0) 70%)', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', left: phoneLeft, top: 448, width: 400, height: 840, perspective: 2200, direction: 'ltr' }}>
        <div style={{ position: 'absolute', left: 20, top: 6, filter: 'drop-shadow(30px 40px 40px rgba(20,20,30,0.22))', transformStyle: 'preserve-3d' }}>
          <Phone3D w={380} screen={`http://localhost:3000/public/_preview/${c.screen}`} ry={ar ? -22 : 22} rx={3} rz={ar ? 2 : -2} />
        </div>
      </div>

      {/* services */}
      <div style={{ position: 'absolute', top: 480, left: colLeft, width: 470 }}>
        {c.tiles.map(([icon, title, sub], i) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: i < 2 ? '1.5px solid #E7E5EA' : 'none' }}>
            <div style={{ width: 104, height: 104, borderRadius: 28, background: '#FFFFFF', boxShadow: '0 14px 30px -14px rgba(20,20,30,0.28), inset 0 0 0 1px #EEECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Img src={asset(`brand/3d/app/${icon}.png`)} style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 30, fontWeight: ar ? 700 : 600, letterSpacing: ar ? 0 : -0.6 }}>{title}</div>
              <div style={{ marginTop: 6, fontSize: ar ? 20 : 19, color: '#6E6E76', lineHeight: 1.35 }}>{sub}</div>
            </div>
          </div>
        ))}

        {/* Libyan payment methods */}
        <div style={{ marginTop: 34, fontSize: ar ? 22 : 18, fontWeight: 600, color: '#3E3E46', letterSpacing: ar ? 0 : 2.2, textTransform: 'uppercase' }}>{c.pay}</div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6, direction: 'ltr', justifyContent: ar ? 'flex-end' : 'flex-start', marginLeft: ar ? 0 : -8, marginRight: ar ? -8 : 0 }}>
          {['moamalat', 'sadad', 'edfa3li', 'tadawul'].map((k) => (
            <Img key={k} src={asset(`brand/3d/pay/${k}.png`)} style={{ width: 112, height: 112, objectFit: 'contain' }} />
          ))}
        </div>

        {/* stores + site */}
        <div style={{ marginTop: 26, display: 'flex', gap: 12, direction: 'ltr', justifyContent: ar ? 'flex-end' : 'flex-start' }}>
          <AppStoreBadge height={62} caption={c.store[0]} />
          <GooglePlayBadge height={62} caption={c.store[1]} />
        </div>
        <div style={{ marginTop: 18, fontSize: 26, letterSpacing: 0.2, fontFamily: t.sans, direction: 'ltr', textAlign: ar ? 'right' : 'left' }}>
          <span style={{ fontWeight: 600 }}>homestastay</span><span style={{ fontWeight: 300 }}>.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
