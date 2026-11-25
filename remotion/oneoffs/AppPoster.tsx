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
import { AppIcon } from '../shared/device';
import { AppStoreBadge, GooglePlayBadge } from '../shared/storeBadges';
import { Phone3D } from './Phone3D';

const TILES: [string, string, string][] = [
  ['apartment', 'الإقامة', 'شقق وفلل وفنادق في كل تركيا'],
  ['van-bags', 'النقل من المطار', 'توصيلة خاصة من الوصول لباب سكنك'],
  ['car', 'إيجار السيارات', 'سيارتك توصلك أينما كنت'],
];

/** Arabic-only launch poster for the Libyan market. */
export const AppPoster: React.FC<StudioProps> = (p) => {
  const t = theme(p.brand);
  const red = t.primary;
  return (
    <AbsoluteFill style={{ fontFamily: '"Rubik", sans-serif', color: '#111114', direction: 'rtl', overflow: 'hidden',
      background: 'radial-gradient(ellipse 70% 55% at 28% 72%, #FFFFFF 0%, #FBFAFB 45%, #F1F0F3 100%)' }}>
      {/* key light + brand bounce behind the phone */}
      <div style={{ position: 'absolute', left: -180, top: 520, width: 900, height: 900, borderRadius: '50%', background: `radial-gradient(circle, ${red}1A 0%, ${red}08 40%, rgba(255,255,255,0) 68%)` }} />
      <div style={{ position: 'absolute', left: -260, top: -200, width: 900, height: 1800, transform: 'rotate(24deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.85) 50%, rgba(255,255,255,0))' }} />

      {/* top bar: wordmark right, app icon left — one line */}
      <div style={{ position: 'absolute', top: 50, left: 60, right: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', direction: 'rtl' }}>
        <div style={{ direction: 'ltr' }}><HorizontalLogo b={p.brand} height={30} logoReady={p.logoReady} /></div>
        <AppIcon size={60} primary={red} />
      </div>

      {/* hook */}
      <div style={{ position: 'absolute', top: 140, left: 50, right: 50, textAlign: 'center' }}>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.18, letterSpacing: 0 }}>
          رحلتك لتركيا…<br />
          <span style={{ color: red }}>ادفعها من ليبيا!</span>
        </div>
        <div style={{ margin: '20px auto 0', maxWidth: 820, fontSize: 27, lineHeight: 1.55, color: '#55555D' }}>
          أول تطبيق سياحي في تركيا يقبل <b style={{ color: '#111114', fontWeight: 600 }}>وسائل الدفع الليبية</b>، إقامتك ونقلك وسيارتك <b style={{ color: '#111114', fontWeight: 600 }}>بأفضل الأسعار</b>
        </div>
      </div>

      {/* Libyan payment methods, right under the hook */}
      <div style={{ position: 'absolute', top: 432, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, direction: 'ltr' }}>
        {['moamalat', 'sadad', 'edfa3li', 'tadawul'].map((k) => (
          <Img key={k} src={asset(`brand/3d/pay/${k}.png`)} style={{ width: 112, height: 112, objectFit: 'contain' }} />
        ))}
      </div>

      {/* cinematic phone, leaning left */}
      <div style={{ position: 'absolute', left: 90, top: 1268, width: 360, height: 56, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(20,20,30,0.30) 0%, rgba(20,20,30,0.10) 45%, rgba(20,20,30,0) 70%)', filter: 'blur(6px)' }} />
      <div style={{ position: 'absolute', left: 60, top: 572, width: 400, height: 760, perspective: 2200, direction: 'ltr' }}>
        <div style={{ position: 'absolute', left: 24, top: 6, filter: 'drop-shadow(30px 40px 40px rgba(20,20,30,0.22))', transformStyle: 'preserve-3d' }}>
          <Phone3D w={336} screen="http://localhost:3000/public/_preview/app-home-ar.jpg" ry={22} rx={3} rz={-5} />
        </div>
      </div>

      {/* services */}
      <div style={{ position: 'absolute', top: 586, left: 492, right: 56 }}>
        {TILES.map(([icon, title, sub], i) => (
          <div key={icon} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '17px 0', borderBottom: i < 2 ? '1.5px solid #E7E5EA' : 'none' }}>
            <div style={{ width: 100, height: 100, borderRadius: 28, background: '#FFFFFF', boxShadow: '0 14px 30px -14px rgba(20,20,30,0.28), inset 0 0 0 1px #EEECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Img src={asset(`brand/3d/app/${icon}.png`)} style={{ width: 78, height: 78, objectFit: 'contain' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{title}</div>
              <div style={{ marginTop: 6, fontSize: 20, color: '#6E6E76', lineHeight: 1.35 }}>{sub}</div>
            </div>
          </div>
        ))}

        {/* FOMO */}
        <div style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 18, background: `${red}0F`, border: `1.5px solid ${red}33`, fontSize: 22, fontWeight: 600, color: red, lineHeight: 1.35 }}>
          <span style={{ width: 12, height: 12, borderRadius: 9, background: red, boxShadow: `0 0 0 6px ${red}26`, flexShrink: 0 }} />
          أحلى الإقامات تنحجز أولاً… احجز قبل غيرك
        </div>

        {/* stores + site */}
        <div style={{ marginTop: 26, fontSize: 21, fontWeight: 500, color: '#3E3E46' }}>حمّل التطبيق الآن</div>
        <div style={{ marginTop: 12, display: 'flex', gap: 12, direction: 'ltr', justifyContent: 'flex-end' }}>
          <AppStoreBadge height={60} />
          <GooglePlayBadge height={60} />
        </div>
        <div style={{ marginTop: 16, fontSize: 25, fontFamily: t.sans, direction: 'ltr', textAlign: 'right' }}>
          <span style={{ fontWeight: 600 }}>homestastay</span><span style={{ fontWeight: 300 }}>.com</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
