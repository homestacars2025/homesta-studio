/**
 * P1 · Stay Spotlight  (Instagram carousel, 4:5 1080×1350 PNG) — matches the @homestastay feed style.
 *  Slide 1  cover: district photo with blue sky, "Want to stay in the heart of <City>?!",
 *           3 stay cards + "Explore our listings in <District>" card, site.
 *  Slides 2–4  one stay: its cover photo full-bleed, glass panel with folder tab (stay name),
 *           photo grid (1 + 4, "+N", "Show all photos"), title, property details, facts table.
 * Data: district (+ image) + 3 stays (5 photos each) + brand.
 */
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import {
  Bath, BedDouble, BedSingle, Building2, CookingPot, Heart, Home, Images, Layers, Moon, Ruler, ShoppingBag, Sun, TrainFront, Upload, Users,
} from 'lucide-react';
import type { StudioProps, UnitProps } from '../shared/types';
import { HorizontalLogo, theme } from '../shared/brand';
import { asset } from '../shared/assets';

export const P1_SLIDES = 4;
const W = 1080;
const H = 1350;

const niceName = (s: string) => {
  let t = s === s.toUpperCase() ? s.toLowerCase().replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : s;
  if (t.length >= 50) t = t.replace(/\s+\S*$/, '');
  return t;
};
const short = (u: UnitProps) => {
  const n = niceName(u.name || u.title).split(/\s[–-]\s/)[0];
  return n.length > 20 ? n.split(/\s+/).slice(0, 3).join(' ') : n;
};
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-');
const price = (n?: number | null) => (n ? `$${Math.round(n * 10) / 10}` : '');
const dist = (s?: string | null) => (s ? s.replace(/\s*walk$/i, '') : null);

const Bg: React.FC<{ src?: string; dim?: number }> = ({ src, dim = 0 }) => (
  <AbsoluteFill style={{ background: '#2F6FBF' }}>
    {src ? <Img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
    {dim ? <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})` }} /> : null}
  </AbsoluteFill>
);

const Site: React.FC<{ t: ReturnType<typeof theme>; top?: number }> = ({ t, top = 1262 }) => (
  <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', fontSize: 40, fontWeight: 500, color: '#fff', letterSpacing: -0.5, textShadow: '0 2px 14px rgba(0,0,0,0.35)' }}>
    {t.site}
  </div>
);

const Logo: React.FC<{ p: StudioProps; top: number }> = ({ p, top }) => (
  <div style={{ position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.25))' }}>
    <HorizontalLogo b={p.brand} height={44} logoReady={p.logoReady} light redArch />
  </div>
);

/* ── 1 · cover ── */
const MiniCard: React.FC<{ u: UnitProps; t: ReturnType<typeof theme> }> = ({ u, t }) => (
  <div style={{ width: 380, height: 360, borderRadius: 20, background: '#fff', padding: 14, boxShadow: '0 14px 34px rgba(0,0,0,0.22)' }}>
    <div style={{ position: 'relative', height: 262, borderRadius: 14, overflow: 'hidden', background: '#ddd' }}>
      <Img src={u.photos[0]?.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', top: 10, right: 10, width: 34, height: 34, borderRadius: 99, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Heart size={18} color={t.ink} />
      </div>
    </div>
    <div style={{ marginTop: 10, fontSize: 15, fontWeight: 600, color: t.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{niceName(u.title || u.name)}</div>
    <div style={{ marginTop: 3, fontSize: 11, letterSpacing: 1.5, color: t.mute, fontFamily: 'monospace', textTransform: 'uppercase' }}>
      {[u.district, u.city].filter(Boolean).join(' · ')}
    </div>
    <div style={{ marginTop: 4, fontSize: 15, fontWeight: 700, color: t.primary }}>
      {price(u.price_from_usd)} <span style={{ fontWeight: 400, color: t.mute, fontSize: 12 }}>/ night</span>
    </div>
  </div>
);

const Cover: React.FC<{ p: StudioProps; units: UnitProps[]; bg?: string }> = ({ p, units, bg }) => {
  const t = theme(p.brand);
  const city = p.district?.city ?? p.city?.name ?? 'Istanbul';
  const district = p.district?.name ?? '';
  return (
    <AbsoluteFill style={{ fontFamily: t.sans }}>
      <Bg src={bg} />
      <Logo p={p} top={84} />
      <div style={{ position: 'absolute', top: 182, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 66, fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5, textShadow: '0 3px 18px rgba(0,0,0,0.25)' }}>
        Want to stay in<br />
        the heart of <span style={{ fontFamily: t.display, fontStyle: 'italic', fontWeight: 700, letterSpacing: -1 }}>{city}</span>?!
      </div>
      <div style={{ position: 'absolute', top: 410, left: (W - 380 * 2 - 20) / 2, display: 'grid', gridTemplateColumns: '380px 380px', gap: 20 }}>
        {units.slice(0, 3).map((u) => <MiniCard key={u.id} u={u} t={t} />)}
        <div style={{ width: 380, height: 360, borderRadius: 20, background: '#fff', padding: '40px 34px', boxShadow: '0 14px 34px rgba(0,0,0,0.22)', borderRight: `8px solid ${t.primary}`, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: district.length > 9 ? 50 : 58, fontWeight: 800, lineHeight: 0.98, letterSpacing: -2, color: t.ink }}>
            Explore<br />our<br />listings<br />in<br /><span style={{ color: t.primary }}>{district}</span>
          </div>
        </div>
      </div>
      <Site t={t} />
    </AbsoluteFill>
  );
};

/* ── 2–4 · one stay ── */
const StaySlide: React.FC<{ p: StudioProps; u: UnitProps; i: number; n: number }> = ({ p, u, i, n }) => {
  const t = theme(p.brand);
  const ph = u.photos.map((x) => x.url);
  const s = u.specs ?? {};
  const more = Math.max(0, (u.photo_count ?? ph.length) - 5);
  const rows: [React.FC<any>, string, string | number | null | undefined][] = [
    [Home, 'Type', u.type],
    [Moon, 'Min. stay', u.min_nights ? `${u.min_nights} night${u.min_nights > 1 ? 's' : ''} min` : null],
    [Ruler, 'Area', s.size_sqm ? `${s.size_sqm} m²` : null],
    [Layers, 'Floor', s.floor],
    [Sun, 'Balcony', (s as any).balconies],
    [CookingPot, 'Kitchen', s.kitchens],
    [ShoppingBag, 'Distance to mall', dist(s.to_mall)],
    [TrainFront, 'Nearby transport', dist(s.to_transport)],
  ];
  const facts = rows.filter(([, , v]) => v !== null && v !== undefined && v !== '' && String(v).length < 22);
  const details: [React.FC<any>, number | string | null | undefined, string, string][] = [
    [BedDouble, s.bedrooms, 'bedroom', 'bedrooms'],
    [BedSingle, s.beds, 'bed', 'beds'],
    [Bath, s.baths, 'bathroom', 'bathrooms'],
    [Users, s.guests, 'guest', 'guests'],
  ];
  const PX = 96, PY = 700, PW = W - PX * 2, PH = 540, TAB_W = Math.min(660, Math.max(420, short(u).length * 19 + 80)), TAB_H = 86;
  return (
    <AbsoluteFill style={{ fontFamily: t.sans, color: t.ink }}>
      <Bg src={ph[0]} />
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.28) 100%)' }} />
      <Logo p={p} top={170} />
      <div style={{ position: 'absolute', top: 44, right: 40, height: 64, padding: '0 22px', borderRadius: 999, background: 'rgba(30,30,32,0.55)', color: '#fff', fontSize: 30, fontWeight: 500, display: 'flex', alignItems: 'center' }}>
        {i + 1}/{n + 1}
      </div>

      {/* folder tab */}
      <div style={{
        position: 'absolute', left: PX + PW - TAB_W, top: PY - TAB_H + 2, width: TAB_W, height: TAB_H, borderRadius: '30px 30px 0 0',
        background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: short(u).length > 18 ? 30 : 36, fontWeight: 800, letterSpacing: -1, color: t.primary, whiteSpace: 'nowrap', padding: '0 20px',
      }}>{short(u)}</div>
      {/* glass panel */}
      <div style={{
        position: 'absolute', left: PX, top: PY, width: PW, height: PH, borderRadius: '30px 0 30px 30px', background: 'rgba(255,255,255,0.86)',
        backdropFilter: 'blur(14px)', boxShadow: '0 30px 70px rgba(0,0,0,0.25)', padding: 36, display: 'flex', gap: 26,
      }}>
        {/* photo grid */}
        <div style={{ width: 400, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ position: 'relative', height: 236, borderRadius: 16, overflow: 'hidden', background: '#ddd' }}>
            <Img src={ph[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 5 }}>
              {[Upload, Heart].map((I, k) => <div key={k} style={{ width: 26, height: 26, borderRadius: 99, background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={13} color={t.ink} /></div>)}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, flex: 1, borderRadius: 16, overflow: 'hidden' }}>
            {[1, 2, 3, 4].map((k) => (
              <div key={k} style={{ position: 'relative', background: '#ddd', overflow: 'hidden' }}>
                {ph[k] ?? ph[k % ph.length] ? <Img src={ph[k] ?? ph[k % ph.length]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                {k === 4 && (
                  <>
                    <AbsoluteFill style={{ background: 'rgba(0,0,0,0.38)' }} />
                    {more > 0 && <div style={{ position: 'absolute', top: '36%', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 15 }}>+{more}</div>}
                    <div style={{ position: 'absolute', right: 8, bottom: 10, height: 30, padding: '0 12px', borderRadius: 99, background: '#fff', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600 }}>
                      <Images size={13} /> Show all photos
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={card}>
            <div style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.25, letterSpacing: -0.4 }}>{niceName(u.title || u.name)}</div>
            <div style={{ marginTop: 8, fontSize: 12, letterSpacing: 2, color: t.mute, fontFamily: 'monospace', textTransform: 'uppercase' }}>
              {[u.district, u.city].filter(Boolean).join(' · ')}
            </div>
          </div>
          <div style={card}>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>Property details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12 }}>
              {details.map(([I, v, one, many], k) => (
                <div key={k}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 26, fontWeight: 700 }}><I size={18} color={t.mute} />{v ?? '–'}</div>
                  <div style={{ fontSize: 13, color: t.mute, marginLeft: 26 }}>{Number(v) === 1 ? one : many}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...card, flex: 1, padding: '10px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {facts.slice(0, 8).map(([I, l, v]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                <I size={16} color={t.mute} /><span style={{ color: t.mute }}>{l}</span><div style={{ flex: 1 }} /><span>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Site t={t} />
    </AbsoluteFill>
  );
};
const card: React.CSSProperties = { background: 'rgba(255,255,255,0.92)', borderRadius: 16, padding: '14px 18px', boxShadow: '0 4px 14px rgba(14,14,16,0.05)' };

export const P1_StaySpotlight: React.FC<StudioProps & { slide?: number }> = ({ slide = 1, ...p }) => {
  const units = (p.units ?? []).slice(0, 3);
  const bg = p.district?.image ?? asset(`places/${slug(p.district?.name ?? 'istanbul')}.jpg`);
  if (slide === 1 || !units.length) return <Cover p={p} units={units} bg={bg} />;
  const k = Math.min(units.length, slide - 1);
  return <StaySlide p={p} u={units[k - 1]} i={k} n={units.length} />;
};
// keep Building2 import tree-shaken-safe for future "Hotel" type icon
void Building2;
