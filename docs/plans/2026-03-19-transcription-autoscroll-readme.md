# Transcription Auto-scroll + README Simplification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the transcription panel scroll automatically to keep the active paragraph in view as audio plays, and simplify the README project structure section to be resilient to file changes.

**Architecture:** Add a scrollable wrapper div (max-height + overflow-y-auto) around `UTimeline` in `TranscriptionPanel.vue`. Tag each paragraph with `data-paragraph-index` via the description slot. Watch `activeItem` and call `scrollIntoView` on the matching element. README gets its file-tree removed, replaced with brief prose for non-conventional folders only.

**Tech Stack:** Vue 3, Nuxt 4, `@nuxt/ui` (UTimeline), TypeScript

---

### Task 1: Add scrollable container to TranscriptionPanel

**Files:**
- Modify: `app/components/transcripts/TranscriptionPanel.vue`

**Step 1: Add the scrollable wrapper and `ref` in the template**

In `TranscriptionPanel.vue`, wrap the `UTimeline` in a scrollable div. Replace:

```vue
<UTimeline
  :items="items"
  ...
>
```

with:

```vue
<div ref="scrollContainer" class="max-h-[60vh] overflow-y-auto pr-1">
  <UTimeline
    :items="items"
    ...
  >
```

Close the wrapper div after `</UTimeline>`.

Also add `ref="scrollContainer"` to the script setup imports/declarations (next task).

**Step 2: Verify visually**

Run `pnpm dev`, open http://localhost:3000. The transcription panel should now be bounded in height and show a scrollbar when content overflows. Confirm the panel is scrollable by dragging the scrollbar.

**Step 3: Commit**

```bash
git add app/components/transcripts/TranscriptionPanel.vue
git commit -m "feat: constrain transcription panel height for internal scroll"
```

---

### Task 2: Tag paragraphs and wire auto-scroll

**Files:**
- Modify: `app/components/transcripts/TranscriptionPanel.vue`

**Step 1: Add `data-paragraph-index` to the description slot wrapper**

In the `#description` slot template, find the root `<div class="flex flex-wrap gap-y-1">` and add a dynamic `data-paragraph-index` attribute. The slot exposes `{ item, index }` — use `index` if available, otherwise find the index via `items.indexOf(item)`.

Replace:
```vue
<template #description="{ item }">
  <div class="flex flex-wrap gap-y-1">
```

with:
```vue
<template #description="{ item, index }">
  <div class="flex flex-wrap gap-y-1" :data-paragraph-index="index ?? items.indexOf(item)">
```

> Note: Check if `UTimeline`'s `#description` slot exposes `index`. If not, `items.indexOf(item)` is the fallback. Both work.

**Step 2: Add `scrollContainer` ref and `watch` in script setup**

In the `<script setup>` block, add:

```ts
import { watch, ref } from 'vue'

const scrollContainer = ref<HTMLElement | null>(null)

watch(activeItem, (idx) => {
  const el = scrollContainer.value?.querySelector<HTMLElement>(
    `[data-paragraph-index="${idx}"]`
  )
  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})
```

The `block: 'nearest'` option means no scroll occurs if the element is already fully visible — prevents jitter.

**Step 3: Verify auto-scroll behavior**

Run `pnpm dev`. Play the audio. The transcript panel should scroll smoothly to keep the active paragraph in view. Click a sentence mid-file — the player jumps to that time and the scroll follows.

Also verify: click a sentence that is already visible → no scroll jump occurs.

**Step 4: Commit**

```bash
git add app/components/transcripts/TranscriptionPanel.vue
git commit -m "feat: auto-scroll transcription panel to active paragraph"
```

---

### Task 3: Simplify README project structure

**Files:**
- Modify: `README.md`

**Step 1: Replace the `## Project structure` section**

Find and remove the entire fenced code block file tree (lines 37–57). Replace the `## Project structure` section with:

```markdown
## Project structure

Standard [Nuxt 4 `app/` directory](https://nuxt.com/docs/guide/directory-structure/app) layout. Non-conventional folders:

- `app/assets/data.ts` — bundled Deepgram sample transcription (replaces a real API call)
- `app/locales/` — EN and pt-BR string catalogs; `pt.ts` is the source of truth for i18n keys
- `app/composables/useI18n.ts` — locale detection and `t()` helper (wraps `useNavigatorLanguage`)
- `app/plugins/temporal.ts` — Temporal API polyfill registered before any page renders
```

Standard Nuxt folders (`pages/`, `components/`, `app.vue`) are omitted — they follow Nuxt conventions.

**Step 2: Verify README renders correctly**

Open the file and confirm the section reads cleanly. No broken markdown, no stale file references.

**Step 3: Commit**

```bash
git add README.md
git commit -m "docs: simplify project structure section in README"
```
