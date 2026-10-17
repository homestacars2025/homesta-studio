/**
 * Render engine: bundles the Remotion project once, then renders any template by composition id.
 */
import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition, ensureBrowser, makeCancelSignal } from '@remotion/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENTRY = path.resolve(__dirname, '../remotion/index.ts');

let serveUrl: string | null = null;
const browserExecutable = process.env.BROWSER_EXECUTABLE || null;
const CONCURRENCY = Number(process.env.RENDER_CONCURRENCY || 1);
/** a job that runs longer than this is cancelled and reported as failed (never blocks the queue) */
const JOB_TIMEOUT_MS = Number(process.env.RENDER_TIMEOUT_MS || 8 * 60 * 1000);

export async function warmUp() {
  if (!browserExecutable) await ensureBrowser();
  if (!serveUrl) {
    const t0 = Date.now();
    serveUrl = await bundle({ entryPoint: ENTRY, webpackOverride: (c) => c });
    console.log(`[studio] bundle ready in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  return serveUrl;
}

export type RenderedFile = { path: string; type: 'video' | 'image'; width: number; height: number; slide?: number; contentType: string };

/**
 * Render one job.
 * kind = 'video' → MP4 (h264) + PNG poster frame
 * kind = 'image' → one PNG per slide (compositions named `${id}` or `${id}-S1`, `${id}-S2`…)
 */
export async function renderTemplate(opts: {
  compositionId: string;
  output: 'video' | 'image';
  props: Record<string, unknown>;
  slides?: number;
  onProgress?: (p: number) => void;
}): Promise<{ dir: string; files: RenderedFile[]; thumbnail: string }> {
  const url = await warmUp();
  // Remotion ids allow only [a-zA-Z0-9-]; DB stores S3_FindYourStayIn → S3-FindYourStayIn
  const baseId = opts.compositionId.replace(/_/g, '-');
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'studio-'));
  const files: RenderedFile[] = [];
  const { cancelSignal, cancel } = makeCancelSignal();
  const timer = setTimeout(() => cancel(), JOB_TIMEOUT_MS);
  // timeoutInMilliseconds: max wait for images/fonts per frame (delayRender)
  const common = { serveUrl: url, inputProps: opts.props, browserExecutable, timeoutInMilliseconds: 90_000, cancelSignal };
  try {

  if (opts.output === 'video') {
    const comp = await selectComposition({ ...common, id: baseId });
    const out = path.join(dir, 'story.mp4');
    await renderMedia({
      ...common,
      composition: comp,
      // Instagram/TikTok-friendly master: lossless-ish frame capture, BT.709 limited range,
      // high bitrate so the platforms' own re-compression starts from a clean source.
      codec: 'h264',
      jpegQuality: 100,
      colorSpace: 'bt709',
      pixelFormat: 'yuv420p',
      videoBitrate: process.env.VIDEO_BITRATE || '12M',
      x264Preset: 'slow',
      audioCodec: 'aac',
      audioBitrate: '192k',
      outputLocation: out,
      concurrency: CONCURRENCY,
      onProgress: ({ progress }) => opts.onProgress?.(progress),
    });
    files.push({ path: out, type: 'video', width: comp.width, height: comp.height, contentType: 'video/mp4' });
    const thumb = path.join(dir, 'thumb.png');
    await renderStill({ ...common, composition: comp, frame: Math.min(150, comp.durationInFrames - 1), output: thumb });
    return { dir, files, thumbnail: thumb };
  }

  const n = Math.max(1, opts.slides ?? 1);
  for (let i = 1; i <= n; i++) {
    const id = n === 1 ? baseId : `${baseId}-S${i}`;
    const comp = await selectComposition({ ...common, id });
    const out = path.join(dir, `slide-${String(i).padStart(2, '0')}.png`);
    await renderStill({ ...common, composition: comp, output: out });
    files.push({ path: out, type: 'image', width: comp.width, height: comp.height, slide: i, contentType: 'image/png' });
    opts.onProgress?.(i / n);
  }
  return { dir, files, thumbnail: files[0].path };
  } catch (e: any) {
    throw new Error(String(e?.message ?? e).includes('cancel') ? `Render timed out after ${Math.round(JOB_TIMEOUT_MS / 60000)} min` : (e?.message ?? String(e)));
  } finally {
    clearTimeout(timer);
  }
}
