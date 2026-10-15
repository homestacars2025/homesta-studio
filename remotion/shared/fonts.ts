// Fonts bundled with the renderer (no network needed at render time).
// Families must match media.brand_kits.font_* rows.
import '@fontsource/playfair-display/latin-700-italic.css';
import '@fontsource/playfair-display/latin-ext-700-italic.css';
import '@fontsource/geist-sans/300.css';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/inter/latin-ext-500.css';
import '@fontsource/poppins/latin-500.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-ext-400.css';
import { continueRender, delayRender, getRemotionEnvironment } from 'remotion';

// Only block frames while rendering on the server; in the live @remotion/player preview fonts just swap in.
if (typeof document !== 'undefined' && getRemotionEnvironment().isRendering) {
  const h = delayRender('fonts');
  Promise.all([
    document.fonts.load('italic 700 100px "Playfair Display"', 'Beyoğlu Şişli Kağıthane'),
    document.fonts.load('600 40px "Geist Sans"'),
    document.fonts.load('500 30px "Geist Sans"'),
    document.fonts.load('500 30px "Inter"'),
    document.fonts.load('500 40px "Poppins"'),
    document.fonts.load('400 30px "JetBrains Mono"', 'ŞIŞLI ISTANBUL'),
  ])
    .then(() => document.fonts.ready)
    .then(() => continueRender(h))
    .catch(() => continueRender(h));
}
