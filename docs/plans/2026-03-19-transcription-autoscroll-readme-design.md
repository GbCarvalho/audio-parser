# Design: Transcription Auto-scroll + README Simplification

## 1. Transcription Auto-scroll

### Goal
As audio plays, the transcription panel scrolls automatically to keep the active paragraph in view. The audio player stays fixed at the top; only the transcript panel scrolls internally.

### Approach
Contain `UTimeline` inside a scrollable `div` with a fixed max-height. Tag each description slot wrapper with `data-paragraph-index`. Watch `activeItem` and call `scrollIntoView` on the matching element.

### Changes — `TranscriptionPanel.vue`
- Wrap `UTimeline` in a `div` with `ref="scrollContainer"`, `overflow-y-auto`, and `max-h-[60vh]`
- Add `data-paragraph-index="N"` to each `#description` slot's root `div` (the index is available from the slot context or via `items.indexOf(item)`)
- Add `watch(activeItem, (idx) => { const el = scrollContainer.value?.querySelector('[data-paragraph-index="${idx}"]'); el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); })`

`block: 'nearest'` — native browser behavior that skips scroll if the element is already fully in view, avoiding jitter.

No changes to `index.vue`.

---

## 2. README Project Structure Simplification

### Goal
The file tree lists every file with inline comments. Any file rename/add/remove breaks it. Replace with a short description of only the folders that are **not** self-evident from Nuxt conventions.

### New structure section
Drop the tree entirely. Replace with a short prose/list describing only non-conventional folders:

- `app/assets/data.ts` — bundled Deepgram sample transcription (replaces a real API call)
- `app/locales/` — EN and pt-BR string catalogs; `pt.ts` is the source of truth for i18n keys
- `app/composables/useI18n.ts` — locale detection and `t()` helper (wraps `useNavigatorLanguage`)
- `app/plugins/temporal.ts` — Temporal API polyfill loaded server-side before any page

Standard Nuxt folders (`pages/`, `components/`, `app.vue`) need no documentation.
