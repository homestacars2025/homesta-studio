/**
 * Homesta Studio worker
 * ─────────────────────
 * Loop: claim queued renders → resolve props from the DB → render → upload to storage → mark ready.
 * Also exposes a tiny HTTP API:
 *   GET  /health            → { ok, busy, queueCheckedAt }
 *   POST /wake              → check the queue now (call from n8n / DB webhook). Header: x-studio-secret
 *
 * Env:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   (required)
 *   STUDIO_SECRET          shared secret for /wake
 *   POLL_SECONDS           default 10
 *   RENDER_CONCURRENCY     Chrome tabs per render (default 1 → fits a 1-core server)
 *   PORT                   default 8080
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import { createClient } from '@supabase/supabase-js';
import { renderTemplate, warmUp } from './render';

const SUPABASE_URL = need('SUPABASE_URL');
const SERVICE_KEY = need('SUPABASE_SERVICE_ROLE_KEY');
const SECRET = process.env.STUDIO_SECRET || '';
const POLL_MS = Number(process.env.POLL_SECONDS || 10) * 1000;
const PORT = Number(process.env.PORT || 8080);
const BUCKET = 'studio-renders';
const WORKER_ID = `${os.hostname()}-${process.pid}`;

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const media = sb.schema('media');

let busy = false;
let lastCheck: string | null = null;
let wakeRequested = false;

function need(k: string) {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env ${k}`);
  return v;
}

async function logoReady(brand: any): Promise<boolean> {
  const url = brand?.logos?.logo_stacked;
  if (!url) return false;
  try {
    const r = await fetch(url, { method: 'HEAD' });
    return r.ok;
  } catch {
    return false;
  }
}

async function processOne(): Promise<boolean> {
  const { data: jobs, error } = await media.rpc('claim_renders', { p_worker: WORKER_ID, p_limit: 1 });
  if (error) throw new Error(`claim_renders: ${error.message}`);
  const job = (jobs as any[])?.[0];
  if (!job) return false;

  const t0 = Date.now();
  console.log(`[studio] ▶ ${job.id} ${job.template_code} (attempt ${job.attempts})`);
  try {
    const { data: tpl, error: tErr } = await media.from('templates').select('*').eq('code', job.template_code).single();
    if (tErr || !tpl) throw new Error(`template ${job.template_code} not found`);

    const { data: props, error: pErr } = await media.rpc('resolve_props', { p_render_id: job.id });
    if (pErr) throw new Error(`resolve_props: ${pErr.message}`);
    if (tpl.target_type !== 'none' && tpl.target_type !== 'city' && !props?.unit && !(props?.units?.length)) {
      throw new Error('No eligible unit with enough photos for this target');
    }
    props.logoReady = await logoReady(props.brand);

    const slides = tpl.output === 'image' ? Number(job.params?.slides ?? tpl.default_params?.slides ?? 1) : 1;
    const { dir, files, thumbnail } = await renderTemplate({
      compositionId: tpl.composition_id,
      output: tpl.output,
      props,
      slides,
    });

    const prefix = `${tpl.code}/${new Date().toISOString().slice(0, 10)}/${job.id}`;
    const outputs: any[] = [];
    for (const f of files) {
      const name = f.path.split('/').pop()!;
      const key = `${prefix}/${name}`;
      const body = await fs.readFile(f.path);
      const { error: upErr } = await sb.storage.from(BUCKET).upload(key, body, { contentType: f.contentType, upsert: true });
      if (upErr) throw new Error(`upload ${name}: ${upErr.message}`);
      outputs.push({ url: sb.storage.from(BUCKET).getPublicUrl(key).data.publicUrl, type: f.type, width: f.width, height: f.height, slide: f.slide ?? null });
    }
    let thumbUrl: string | null = null;
    if (thumbnail) {
      const key = `${prefix}/thumb.png`;
      const { error: thErr } = await sb.storage.from(BUCKET).upload(key, await fs.readFile(thumbnail), { contentType: 'image/png', upsert: true });
      if (!thErr) thumbUrl = sb.storage.from(BUCKET).getPublicUrl(key).data.publicUrl;
    }
    await fs.rm(dir, { recursive: true, force: true });

    const { error: cErr } = await media.rpc('complete_render', {
      p_id: job.id, p_outputs: outputs, p_thumbnail: thumbUrl, p_props: props, p_caption: null,
    });
    if (cErr) throw new Error(`complete_render: ${cErr.message}`);
    console.log(`[studio] ✔ ${job.id} in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  } catch (e: any) {
    console.error(`[studio] ✖ ${job.id}: ${e?.message ?? e}`);
    await media.rpc('fail_render', { p_id: job.id, p_error: String(e?.message ?? e) });
  }
  return true;
}

async function drain() {
  if (busy) { wakeRequested = true; return; }
  busy = true;
  try {
    do {
      wakeRequested = false;
      lastCheck = new Date().toISOString();
      while (await processOne()) { /* keep going while there is work */ }
    } while (wakeRequested);
  } catch (e: any) {
    console.error('[studio] loop error:', e?.message ?? e);
  } finally {
    busy = false;
  }
}

http
  .createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, busy, lastCheck, worker: WORKER_ID }));
    }
    if (req.method === 'POST' && req.url === '/wake') {
      if (SECRET && req.headers['x-studio-secret'] !== SECRET) { res.writeHead(401); return res.end('unauthorized'); }
      drain();
      res.writeHead(202, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ accepted: true }));
    }
    res.writeHead(404); res.end();
  })
  .listen(PORT, () => console.log(`[studio] listening on :${PORT} as ${WORKER_ID}`));

(async () => {
  await warmUp();               // bundle + browser once at boot
  drain();
  setInterval(drain, POLL_MS);  // safety net polling
})();
