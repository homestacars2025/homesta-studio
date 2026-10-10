# Homesta Studio

Renders Homesta Stay stories (MP4 9:16) and posters (PNG 4:5) from the Stay database, with the
brand identity stored in `media.brand_kits`.

```
Admin "Generate" / n8n planner ──► media.request_render()  ──► media.renders (queued)
                                                                 │
                         this worker (polls every 10s or POST /wake)
                                                                 ▼
   media.claim_renders → media.resolve_props → Remotion render → storage: studio-renders
                                                                 ▼
                       media.complete_render  (status = ready)  → team reviews → media.review_render
```

## Structure
| Path | What |
|---|---|
| `remotion/templates/` | one file per template (S3_FindYourStayIn.tsx …) |
| `remotion/shared/` | brand helpers (logo, colors, fonts, amenities), types |
| `remotion/Root.tsx` | registers every template as a composition (id = `composition_id` with `_`→`-`) |
| `server/worker.ts` | queue worker + `/health` + `/wake` |
| `server/render.ts` | bundle once, render video / stills |
| `test/sample-s3.json` | real props from the DB for local preview |

## Run locally
```bash
npm install
npm run studio          # Remotion Studio preview with test/sample-s3.json
npm run test:s3         # renders out/story.mp4 without the database
cp .env.example .env && npx tsx --env-file=.env server/worker.ts   # real worker
```

## Deploy on EasyPanel
1. Push this repo to GitHub (private).
2. EasyPanel → project `studio` → **+ Service → App** → Source: GitHub repo → Build: **Dockerfile**.
3. Environment: copy `.env.example`, fill `SUPABASE_SERVICE_ROLE_KEY` and `STUDIO_SECRET`.
4. Resources: memory limit **≥ 1.5 GB**. Port 8080 (domain optional – only n8n needs to reach `/wake`).
5. Deploy → logs should show `bundle ready` then `listening on :8080`.

## Add a new template
1. `remotion/templates/<CODE>_<Name>.tsx` reading `StudioProps`.
2. Register it in `remotion/Root.tsx`.
3. In the DB: `update media.templates set composition_id='<CODE>_<Name>', is_active=true where code='<CODE>'`.

## Test a real render
```sql
select media.request_render('S3', (select id from public.geo_districts where name = 'Şişli'));
select status, error, outputs from media.renders order by created_at desc limit 1;
```
