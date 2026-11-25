/**
 * One-off · Homesta app ad (4:5) — brand-red stage, big Arabic hook, frontal iPhone with the
 * real home screen, floating app cards (transfer route, stay), a guest on a sofa in front.
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import '@fontsource/rubik/arabic-400.css';
import '@fontsource/rubik/arabic-500.css';
import '@fontsource/rubik/arabic-700.css';
import { asset } from '../shared/assets';
import type { StudioProps } from '../shared/types';
import { theme } from '../shared/brand';
import { AppIcon } from '../shared/device';
import { Phone3D } from './Phone3D';

const P = (f: string) => `http://localhost:3000/public/_preview/${f}`;
const dots = (op: number): React.CSSProperties => ({
  backgroundImage: `radial-gradient(rgba(229,40,81,${op}) 1.7px, transparent 2px)`, backgroundSize: '15px 15px',
});

export const AppAd: React.FC<StudioProps> = (p) => {
  const t = theme(p.brand);
  const red = t.primary;
  return (
    <AbsoluteFill style={{ fontFamily: '"Rubik", sans-serif', direction: 'rtl', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* soft shapes + halftone */}
      <div style={{ position: 'absolute', left: -320, top: 520, width: 900, height: 900, borderRadius: '50%', background: 'rgba(229,40,81,0.045)' }} />
      <div style={{ position: 'absolute', left: 760, top: -260, width: 700, height: 700, borderRadius: '50%', background: 'rgba(229,40,81,0.05)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 460, height: 420, ...dots(0.22), WebkitMaskImage: 'radial-gradient(ellipse at 0% 0%, #000 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', left: 640, top: 560, width: 440, height: 520, ...dots(0.18), WebkitMaskImage: 'radial-gradient(ellipse at 100% 50%, #000 0%, transparent 70%)' }} />

      {/* corner marks */}
      <div style={{ position: 'absolute', top: 48, right: 52 }}><AppIcon size={74} primary={red} /></div>
      <div style={{ position: 'absolute', top: 70, left: 56, direction: 'ltr', color: '#15151A', fontSize: 24, fontFamily: t.sans, opacity: 0.95 }}>
        <span style={{ fontWeight: 600 }}>homestastay</span><span style={{ fontWeight: 300 }}>.com</span>
      </div>

      {/* hook */}
      <div style={{ position: 'absolute', top: 126, left: 0, right: 0, textAlign: 'center', color: '#15151A' }}>
        <div style={{ display: 'inline-block', transform: 'rotate(-3deg)', background: '#17171C', padding: '8px 30px 14px', borderRadius: 12, fontSize: 46, fontWeight: 500, boxShadow: '0 14px 30px -10px rgba(0,0,0,0.25)', color: '#fff' }}>
          من ليبيا إلى تركيا
        </div>
        <div style={{ marginTop: -6, fontSize: 168, fontWeight: 700, lineHeight: 1.05, color: red }}>بضغطة زر.</div>
        <div style={{ marginTop: 10, fontSize: 46, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          إقامتك، نقلك وسيارتك في
          <span style={{ background: red, color: '#fff', borderRadius: 12, padding: '0 16px 6px', fontWeight: 700 }}>تطبيق واحد</span>
        </div>
      </div>

      {/* phone */}
      <div style={{ position: 'absolute', left: (1080 - 420) / 2, top: 470, filter: 'drop-shadow(0 40px 60px rgba(20,20,30,0.25))', direction: 'ltr' }}>
        <Phone3D w={420} screen={P('app-home-ar.jpg')} ry={0} rx={0} />
      </div>

      {/* card: transfer route */}
      <div style={{ position: 'absolute', left: 52, top: 574, width: 286, transform: 'rotate(-5deg)', background: '#EEF4FB', borderRadius: 30, padding: 12, border: '1.5px solid #E2E9F2', boxShadow: '0 30px 60px -20px rgba(20,20,30,0.28)' }}>
        <div style={{ position: 'relative', height: 200, borderRadius: 22, overflow: 'hidden' }}>
          <Img src={asset('maps/istanbul-app.jpg')} style={{ position: 'absolute', left: -120, top: -260, width: 560 }} />
          <svg width={262} height={200} style={{ position: 'absolute', inset: 0 }}>
            <path d="M 40 170 C 80 120, 70 90, 130 92 S 200 60, 222 34" fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round" />
            <path d="M 40 170 C 80 120, 70 90, 130 92 S 200 60, 222 34" fill="none" stroke="#2F6FE4" strokeWidth={5} strokeLinecap="round" />
            <circle cx={40} cy={170} r={9} fill="#fff" stroke="#2F6FE4" strokeWidth={4} />
            <circle cx={222} cy={34} r={11} fill={red} stroke="#fff" strokeWidth={4} />
          </svg>
        </div>
        <div style={{ padding: '14px 8px 6px', direction: 'rtl' }}>
          <div style={{ fontSize: 23, fontWeight: 700, color: '#15151A' }}>من المطار لباب سكنك</div>
          <div style={{ marginTop: 4, fontSize: 17, color: '#6B6F78' }}>سائق خاص بانتظارك عند الوصول</div>
        </div>
      </div>
      <Img src={asset('brand/3d/app/van-bags.png')} style={{ position: 'absolute', left: 196, top: 492, width: 186, transform: 'rotate(4deg)', filter: 'drop-shadow(0 18px 18px rgba(20,20,30,0.22))' }} />

      {/* card: stay */}
      <div style={{ position: 'absolute', left: 744, top: 540, width: 290, transform: 'rotate(5deg)', background: '#FFF4F6', borderRadius: 30, padding: 12, border: '1.5px solid #F7DDE3', boxShadow: '0 30px 60px -20px rgba(20,20,30,0.28)' }}>
        <Img src={P('duplex.jpg')} style={{ width: '100%', height: 178, objectFit: 'cover', borderRadius: 22 }} />
        <div style={{ padding: '14px 8px 6px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#15151A', lineHeight: 1.3 }}>دوبلكس بإطلالة على البوسفور</div>
          <div style={{ marginTop: 4, fontSize: 17, color: '#6B6F78' }}>بشكتاش، إسطنبول</div>
          <div style={{ marginTop: 10, fontSize: 30, fontWeight: 700, color: '#15151A', direction: 'rtl' }}>
            <span style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>$201</span><span style={{ fontSize: 18, fontWeight: 400, color: '#6B6F78' }}> / الليلة</span>
          </div>
        </div>
      </div>
      <Img src={asset('brand/3d/app/car.png')} style={{ position: 'absolute', left: 880, top: 448, width: 176, transform: 'rotate(-6deg)', filter: 'drop-shadow(0 18px 18px rgba(20,20,30,0.22))' }} />

      {/* guest on the sofa, in front of the phone */}
      <Img src={P('sofa-man.png')} style={{ position: 'absolute', left: -70, bottom: -40, width: 1220 }} />
    </AbsoluteFill>
  );
};
