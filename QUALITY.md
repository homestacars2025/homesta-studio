# Homesta Studio — output quality rules (Meta / Instagram / TikTok)

Every template must follow these. The render engine (`server/render.ts`) enforces the encoding part for ALL templates.

## Encoding (automatic, shared engine)
- Video: H.264 High, `yuv420p`, **BT.709 limited range**, 30 fps, **12 Mbps** (env `VIDEO_BITRATE`), x264 preset `slow`, AAC 192k.
- Frames captured with `jpegQuality: 100` (Remotion default 80 softens every frame).
- Images: lossless **PNG** at the exact platform size (no up/down-scaling on upload).

## Sizes
- Story / Reel: **1080×1920** (9:16). Feed post / carousel: **1080×1350** (4:5).
- Story safe area: keep key content between **y 250 and y 1580** (IG/TikTok UI covers top & bottom).
- Story link sticker: leave the agreed slot empty in every scene.

## Typography (survives platform compression)
- Minimum text size **16 px** on 1080-wide canvases; body ≥ 20 px; labels in mono ≥ 17 px.
- No thin text on busy photos without a solid/glass backing.

## Photos
- Prefer source photos **≥ 1080 px wide**. The photo picker flags < 1000 px. Low-res unit photos cannot be fixed by encoding — replace them in the unit.

## Publishing checklist (team)
- Instagram → Settings → *Data usage and media quality* → **Upload at highest quality** ON.
- Download straight from Studio to the phone. **Never pass files through WhatsApp** (or send as *Document*).
- Upload on Wi-Fi.
