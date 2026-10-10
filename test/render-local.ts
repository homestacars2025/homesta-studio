/**
 * Local test without the database:  npm run test:s3
 * Renders S3 with test/sample-s3.json (or a path passed as first arg) into ./out
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { renderTemplate } from '../server/render';

const file = process.argv[2] ?? 'test/sample-s3.json';
const props = JSON.parse(await fs.readFile(file, 'utf8'));
const t0 = Date.now();
const r = await renderTemplate({
  compositionId: 'S3_FindYourStayIn',
  output: 'video',
  props,
  onProgress: (p) => process.stdout.write(`\r${Math.round(p * 100)}%`),
});
await fs.mkdir('out', { recursive: true });
for (const f of r.files) await fs.copyFile(f.path, path.join('out', path.basename(f.path)));
await fs.copyFile(r.thumbnail, 'out/thumb.png');
console.log(`\nDone in ${((Date.now() - t0) / 1000).toFixed(1)}s → out/`);
